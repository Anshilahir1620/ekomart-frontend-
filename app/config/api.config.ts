import axios from "axios";
import { clearAuthSession } from "../utils/authCleanup";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

const api = axios.create({
  baseURL: API_BASE_URL,
});

let startLoading: any;
let stopLoading: any;

export const injectLoader = (_start: any, _stop: any) => {
  startLoading = _start;
  stopLoading = _stop;
};

// 🔒 Refresh control
let isRefreshing = false;
let refreshSubscribers: any[] = [];

const subscribeTokenRefresh = (cb: any) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

api.interceptors.request.use(
  (config) => {
    if (startLoading) startLoading();

    const token = localStorage.getItem("token");

    if (token) {
      if (config.headers) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return config;
  },
  (error) => {
    if (stopLoading) stopLoading();
    return Promise.reject(error);
  }
);

// ✅ RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    if (stopLoading) stopLoading();
    return response;
  },

  async (error) => {
    if (stopLoading) stopLoading();

    const originalRequest = error.config;

    // ❌ Not 401 → just reject
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // ❌ Already retried → logout
    if (originalRequest._retry) {
      clearAuthSession();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // 🚧 If refresh already in progress → queue request
    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        throw new Error("No refresh token");
      }

      // 🚨 IMPORTANT: use plain axios (NOT api instance)
      const res = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        {
          refresh_token: refreshToken,
        }
      );

      const newAccessToken = res.data.access_token;

      // ✅ Save new token
      localStorage.setItem("token", newAccessToken);

      // ✅ Notify queued requests
      onRefreshed(newAccessToken);

      // ✅ Retry original request
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);

    } catch (err) {
      console.error("❌ Refresh failed:", err);

      // 🚨 Hard logout
      clearAuthSession();
      window.location.href = "/login";

      return Promise.reject(err);

    } finally {
      isRefreshing = false;
    }
  }
);

export default api;