export interface Product {
  id: number;
  product_name: string;
  regular_price: number;
  sale_price: number;
  size?: string;
  weight?: number;
  life?: number | string | null;
  rating?: number | null;
  stock?: number;
  type: string;
  brand?: string;
  category: string;
  subcategory_id: number;
  tag?: string | null;
  description?: string;
  image: string;
  created_at: string;
  updated_at: string;

  // Pricing & Offers (from backend pricing_helper)
  original_price?: number;
  offer_price?: number | null;
  coupon_discount?: number;
  final_price?: number;
  offer_applied?: boolean;
  is_coupon_eligible?: boolean;
  discount?: number;
  offer_type?: string | null;
  offer_value?: number | null;
}

// UserProduct is now just an alias for Product to maintain backward compatibility
// while transitioning to the single 'Product' interface.
export type UserProduct = Product;
