import api from "@/app/config/api.config";

export interface OrderItem {
  product_id: number;
  product_name: string;
  image: string;
  quantity: number;
  price: number;
}

export interface Payment {
  id: number;
  payment_method: string;
  payment_status: string;
  amount: number;
  razorpay_payment_id?: string;
  created_at: string;
}
export interface Order {
  id: number;
  user_id: number;

  // 💰 Pricing
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  coupon_code?: string;

  // 📦 Status
  status: string;
  created_at: string;

  // 🚚 Shipping
  shipping_name?: string;
  shipping_phone?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_pincode?: string;

  // 🛒 Items
  items: OrderItem[];

  // 💳 Payments
  payments: Payment[];
}

export const getOrders = async (): Promise<Order[]> => {
  const res = await api.get("/orders/my");
  return res.data;
};

export const getOrderById = async (orderId: string | number): Promise<Order> => {
  const res = await api.get(`/orders/${orderId}`);
  return res.data;
};
