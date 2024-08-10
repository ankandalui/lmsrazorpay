
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Loader from "@/components/loader/loader";
import useUser from "@/hooks/auth/useUser";
import { SERVER_URI } from "@/utils/uri";
import RazorpayCheckout from 'react-native-razorpay';
import { Redirect, router } from "expo-router";

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<CoursesType[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const { user, loading } = useUser();

  useEffect(() => {
    const fetchCartItems = async () => {
      const cart: any = await AsyncStorage.getItem("cart");
      setCartItems(JSON.parse(cart));
    };
    fetchCartItems();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    const cart: any = await AsyncStorage.getItem("cart");
    setCartItems(JSON.parse(cart));
    setRefreshing(false);
  };

  const calculateTotalPrice = () => {
    const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);
    return totalPrice.toFixed(2);
  };

  const handleCourseDetails = (courseDetails: any) => {
    router.push({
      pathname: "/(routes)/course-details",
      params: { item: JSON.stringify(courseDetails) },
    });
  };

  const handleRemoveItem = async (item: any) => {
    const existingCartData = await AsyncStorage.getItem("cart");
    const cartData = existingCartData ? JSON.parse(existingCartData) : [];
    const updatedCartData = cartData.filter((i: any) => i._id !== item._id);
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCartData));
    setCartItems(updatedCartData);
  };

  const handlePayment = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("access_token");
      const refreshToken = await AsyncStorage.getItem("refresh_token");
      const amount = Math.round(
        cartItems.reduce((total, item) => total + item.price, 0) * 100
      );

      const paymentOrderResponse = await axios.post(
        `${SERVER_URI}/payment`,
        { amount },
        {
          headers: {
            "access-token": accessToken,
            "refresh-token": refreshToken,
          },
        }
      );

      const { order_id, amount: orderAmount } = paymentOrderResponse.data;

      const options = {
        description: 'Order Payment',
        image: 'https://your_logo_url', // Optional: You can provide a logo URL
        currency: 'INR',
        key: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID, // Use Razorpay key ID
        amount: orderAmount,
        order_id: order_id,
        prefill: {
          email: user?.email,
          contact: user?.phone,
          name: user?.name,
        },
        theme: { color: '#F37254' },
      };

      if (RazorpayCheckout) {
        RazorpayCheckout.open(options as any).then(async (data: any) => {
          // Handle success
          await createOrder(data);
        }).catch((error: any) => {
          // Handle failure
          console.error(error);
        });
      } else {
        console.error("RazorpayCheckout is not initialized.");
      }
    } catch (error) {
      console.error(error);
    }
  };


  const createOrder = async (paymentResponse: any) => {
    try {
      const accessToken = await AsyncStorage.getItem("access_token");
      const refreshToken = await AsyncStorage.getItem("refresh_token");

      await axios.post(
        `${SERVER_URI}/create-order`,
        {
          courseId: cartItems[0]._id,
          payment_info: paymentResponse,
        },
        {
          headers: {
            "access-token": accessToken,
            "refresh-token": refreshToken,
          },
        }
      );
      setOrderSuccess(true);
      AsyncStorage.removeItem("cart");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <LinearGradient
          colors={["#E5ECF9", "#F6F7F9"]}
          style={{ flex: 1, backgroundColor: "white" }}
        >
          {orderSuccess ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("@/assets/images/account_confirmation.png")}
                style={{
                  width: 200,
                  height: 200,
                  resizeMode: "contain",
                  marginBottom: 20,
                }}
              />
              <View style={{ alignItems: "center", marginBottom: 20 }}>
                <Text style={{ fontSize: 22, fontFamily: "Raleway_700Bold" }}>
                  Payment Successful!
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    marginTop: 5,
                    color: "#575757",
                    fontFamily: "Nunito_400Regular",
                  }}
                >
                  Thank you for your purchase!
                </Text>
              </View>
              <View style={{ alignItems: "center", marginBottom: 20 }}>
                <Text style={{ fontSize: 16, color: "575757" }}>
                  You will receive one email shortly!
                </Text>
              </View>
            </View>
          ) : (
            <>
              <FlatList
                data={cartItems}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      marginVertical: 8,
                      marginHorizontal: 8,
                      borderRadius: 8,
                      padding: 10,
                      backgroundColor: "white",
                    }}
                  >
                    <TouchableOpacity onPress={() => handleCourseDetails(item)}>
                      <Image
                        source={{ uri: item.thumbnail?.url! }}
                        style={{
                          width: 100,
                          height: 100,
                          marginRight: 16,
                          borderRadius: 8,
                        }}
                      />
                    </TouchableOpacity>
                    <View style={{ flex: 1, justifyContent: "space-between" }}>
                      <TouchableOpacity
                        onPress={() => handleCourseDetails(item)}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "600",
                            fontFamily: "Nunito_700Bold",
                          }}
                        >
                          {item?.name}
                        </Text>
                      </TouchableOpacity>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginRight: 16,
                            }}
                          >
                            <Entypo
                              name="dot-single"
                              size={24}
                              color={"gray"}
                            />
                            <Text
                              style={{
                                fontSize: 16,
                                color: "#808080",
                                fontFamily: "Nunito_400Regular",
                              }}
                            >
                              {item.level}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginRight: 16,
                            }}
                          >
                            <FontAwesome
                              name="dollar"
                              size={14}
                              color={"#808080"}
                            />
                            <Text
                              style={{
                                marginLeft: 3,
                                fontSize: 16,
                                color: "#808080",
                              }}
                            >
                              {item.price}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#FF6347",
                          borderRadius: 50,
                          padding: 5,
                          marginTop: 10,
                          width: 100,
                          alignSelf: "flex-start",
                        }}
                        onPress={() => handleRemoveItem(item)}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                            textAlign: "center",
                            fontFamily: "Nunito_600SemiBold",
                          }}
                        >
                          Remove
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 20,
                    }}
                  >
                    <Image
                      source={require("@/assets/empty_cart.png")}
                      style={{ width: 200, height: 200, resizeMode: "contain" }}
                    />
                    <Text
                      style={{
                        fontSize: 24,
                        marginTop: 20,
                        color: "#333",
                        fontFamily: "Raleway_600SemiBold",
                      }}
                    >
                      Your Cart is Empty!
                    </Text>
                  </View>
                )}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
              <View style={{ marginBottom: 25 }}>
                {cartItems?.length === 0 ||
                  (cartItems?.length > 0 && (
                    <Text
                      style={{
                        fontSize: 18,
                        textAlign: "center",
                        marginTop: 20,
                        fontFamily: "Nunito_700Bold",
                      }}
                    >
                      Total Price: ₹{calculateTotalPrice()}
                    </Text>
                  ))}
                {cartItems?.length === 0 ||
                  (cartItems?.length > 0 && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#007BFF",
                        borderRadius: 50,
                        padding: 10,
                        marginTop: 20,
                        width: "80%",
                        alignSelf: "center",
                      }}
                        onPress={() => router.push("/(routes)/course-access")}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 18,
                          textAlign: "center",
                          fontFamily: "Nunito_600SemiBold",
                        }}
                      >
                        Go for payment
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </>
          )}
        </LinearGradient>
      )}
    </>
  );
}