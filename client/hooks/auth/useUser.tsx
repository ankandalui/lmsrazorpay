import { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useUser() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();
  const [error, setError] = useState("");
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const subscription = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("access_token");
        const refreshToken = await AsyncStorage.getItem("refresh_token");

        // Check if tokens are available
        if (!accessToken || !refreshToken) {
          setError("Tokens are missing");
          setLoading(false);
          return;
        }

        console.log("Access Token:", accessToken);
        console.log("Refresh Token:", refreshToken);

        const response = await axios.get(`${SERVER_URI}/me`, {
          headers: {
            "access-token": accessToken,
            "refresh-token": refreshToken,
          },
        });

        setUser(response.data.user);
      } catch (error: any) {
        console.error("Request error:", error);
        setError(error?.response?.data?.message || error?.message);
      } finally {
        setLoading(false);
      }
    };

    subscription();
  }, [refetch]);

  return { loading, user, error, setRefetch, refetch };
}
