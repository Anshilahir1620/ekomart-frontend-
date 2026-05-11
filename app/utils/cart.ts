import { Product } from '@/app/types/Product';
import { CartItem } from '@/app/types/Cart';


const roundPrice = (price: number): number =>
    Math.round((price + Number.EPSILON) * 100) / 100;

export const addToCart = (product: Product): CartItem[] => {
    try {
        const existingCart: CartItem[] = JSON.parse(
            localStorage.getItem("cart") || "[]"
        );

        const existingItem = existingCart.find(
            (item) => item.id === product.id
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            const resolvedPrice = product.final_price ?? product.sale_price ?? product.regular_price;

            const cartItem: CartItem = {
                id: product.id,
                product_name: product.product_name,
                regular_price: product.regular_price,
                sale_price: product.sale_price,
                final_price: roundPrice(resolvedPrice),
                offer_applied: product.offer_applied ?? false,
                is_coupon_eligible: product.is_coupon_eligible ?? true,
                image: product.image,
                quantity: 1,
            };

            existingCart.push(cartItem);
        }

        localStorage.setItem("cart", JSON.stringify(existingCart));

        window.dispatchEvent(new Event("cartUpdated"));

        return existingCart;
    } catch (err) {
        console.log("Cart Error:", err);
        return [];
    }
};

export const getcart = (): CartItem[] => {
    try {
        return JSON.parse(localStorage.getItem("cart") || "[]")

    }
    catch {
        return []
    }
};

export const updateQuantity = (id: number, qty: number): CartItem[] => {

    let cart = getcart();

    cart = cart.map(item =>

        item.id === id ? { ...item, quantity: qty } : item
    );

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    return cart;
}

export const removeCart = (id: number): CartItem[] => {

    let cart = getcart();

    cart = cart.filter(item => item.id !== id)
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));


    return cart;
}

export const clearCart = (): void => {
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated"));
}



const getUserId = () => {
  if (typeof window === "undefined") return null;
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user?.id || null;
  } catch {
    return null;
  }
};

export const getAddresses = () => {
  const userId = getUserId();
  if (!userId) return [];

  try {
    const globalAddr = localStorage.getItem("addresses");
    if (globalAddr) {
      const parsed = JSON.parse(globalAddr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        localStorage.setItem(`addresses_${userId}`, globalAddr);
      }
      localStorage.removeItem("addresses");
    }
    return JSON.parse(localStorage.getItem(`addresses_${userId}`) || "[]");
  } catch {
    return [];
  }
};

export const saveAddress = (address: any) => {
  const userId = getUserId();
  if (!userId) return;

  const existing = getAddresses();
  existing.push(address);
  localStorage.setItem(`addresses_${userId}`, JSON.stringify(existing));
};