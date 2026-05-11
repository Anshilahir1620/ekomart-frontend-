import axios from "@/app/config/api.config";

export const createOrder = async (payload: any) => {
  const res = await axios.post("/orders/", payload);
  return res.data;
};

export const createRazorpayOrder = async (payload: { order_id: number }) => {
  const res = await axios.post("/payments/razorpay/create", payload);
  return res.data;
};

export const verifyPayment = async (payload: any) => {
  const res = await axios.post("/payments/razorpay/verify", payload);
  return res.data;
};