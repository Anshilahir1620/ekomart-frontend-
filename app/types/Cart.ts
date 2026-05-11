export interface CartItem {
  id: number;
  product_name: string;
  regular_price: number;
  sale_price: number;
  final_price: number;
  offer_applied: boolean;
  is_coupon_eligible: boolean;
  image: string;
  quantity: number;
}

export interface OrderSummary {
  subtotal: number;
  discount_amount: number;
  final_amount: number;
  coupon_code?: string;
}