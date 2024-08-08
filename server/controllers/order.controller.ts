import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { IOrder } from "../models/order.Model";
import userModel from "../models/user.model";
import CourseModel, { ICourse } from "../models/course.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.Model";
import { getAllOrdersService, newOrder } from "../services/order.service";
import { redis } from "../utils/redis";
import Razorpay from 'razorpay';
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});
// create order
export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;

      const payment = await razorpay.payments.fetch(payment_info.payment_id as any);

            // Check if the payment status is captured
            if (payment.status !== "captured") {
              return next(new ErrorHandler("Payment not authorized", 400));
            }

      const user = await userModel.findById(req.user?._id);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      const courseExistInUser = user.courses.some(
        (course: any) => course.courseId.toString() === courseId
      );

      if (courseExistInUser) {
        return next(new ErrorHandler("You have already purchased this course", 400));
      }

      const course: ICourse | null = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const data: any = {
        courseId: course._id.toString(),
        userId: user._id.toString(),
        payment_info,
      };

      const mailData = {
        order: {
          _id: course._id.toString().slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData }
      );

      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "Order Confirmation",
            template: "order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }

      user.courses.push({ courseId: course._id.toString() });

      await user.save();

      await redis.set(req.user?.id, JSON.stringify(user));
      const userId = req.user?._id?.toString();
      if (userId) {
        await redis.set(userId, JSON.stringify(user));
      } else {
        return next(new ErrorHandler("User ID is missing", 400));
      }

      await NotificationModel.create({
        user: user._id,
        title: "New Order",
        message: `You have a new order for ${course.name}`,
      });

      course.purchased += 1;
      await course.save();

      newOrder(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get All orders --- only for admin
export const getAllOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);


// send Razorpay key ID
export const sendRazorpayKeyId = CatchAsyncError(
  async (req: Request, res: Response) => {
    res.status(200).json({
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  }
);

export const newPayment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount } = req.body;

      // Validate the amount
      if (!amount || amount <= 0) {
        return next(new ErrorHandler("Invalid amount", 400));
      }

      const receipt = `order_rcptid_${Date.now()}`; // Generate a unique receipt ID

      const order = await razorpay.orders.create({
        amount: amount * 100, // Razorpay amount is in paise
        currency: "INR",
        receipt,
        payment_capture: 1,
      });

      res.status(201).json({
        success: true,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: process.env.RAZORPAY_KEY_ID,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
