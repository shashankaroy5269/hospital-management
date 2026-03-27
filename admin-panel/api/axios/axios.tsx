import axios from "axios";
import { Cookies } from "react-cookie";

export const BaseURL = "http://localhost:4000";

const cookies = new Cookies();

// ✅ MAIN INSTANCE
export const AxiosInstance = axios.create({
  baseURL: BaseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 🔹 REQUEST INTERCEPTOR
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = cookies.get("token");

    if (token) {
      config.headers["x-access-token"] = token;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 RESPONSE INTERCEPTOR (FIXED)
AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔴 token expired
    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        console.log("🔄 Refreshing token...");

        // ✅ IMPORTANT: use NORMAL axios (NOT AxiosInstance)
        const res = await axios.post(
          BaseURL + "/admin/refresh-token",
          {},
          { withCredentials: true }
        );

        const newToken = res.data.token;

        console.log("✅ New Token:", newToken);

        // ✅ save new token
        cookies.set("token", newToken, { path: "/" });

        // 🔥 update header
        originalRequest.headers["x-access-token"] = newToken;

        // 🔁 retry request
        return AxiosInstance(originalRequest);
      } catch (err) {
        console.log("❌ Refresh failed → logout");

        cookies.remove("token");

        if (typeof window !== "undefined") {
          window.location.href = "/signin";
        }
      }
    }

    return Promise.reject(error);
  }
);