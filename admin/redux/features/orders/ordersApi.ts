import { apiSlice } from "../api/apiSlice";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder:any) => ({
    getAllOrders: builder.query({
      query: (type:any) => ({
        url: `get-orders`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getStripePublishablekey: builder.query({
      query: () => ({
        url: `payment/razorpaykey`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    createPaymentIntent: builder.mutation({
      query: (amount:any) => ({
        url: "payment",
        method: "POST",
        body: {
          amount,
        },
        credentials: "include" as const,
      }),
    }),
    createOrder: builder.mutation({
      query: ({ courseId, payment_info}) => ({
        url: "create-order",
        body: {
          courseId,
          payment_info,
        },
        method: "POST",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useGetAllOrdersQuery,useGetStripePublishablekeyQuery, useCreatePaymentIntentMutation ,useCreateOrderMutation} =
  ordersApi;
