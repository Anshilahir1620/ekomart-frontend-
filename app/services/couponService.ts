

import axios from "axios";

import API_BASE_URL from "@/app/config/api.config"


export const applyCouponAPI = async (data: {
  code: string;
  cart_total: number;
  user_id: number;
}) => {
  const res = await API_BASE_URL.post("/coupon/apply", data);
  return res.data;
};