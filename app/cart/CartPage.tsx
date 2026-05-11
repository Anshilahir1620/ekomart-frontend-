'use client';

import React, { useState, useEffect, } from "react";
import { useRouter } from "next/navigation";
import { useGlobalLoader } from "@/app/components/GlobalLoaderProvider";
import { Minus, Plus, Check, ShoppingCart, X } from "lucide-react";
import { getcart, updateQuantity, removeCart } from "@/app/utils/cart";
import { CartItem } from "@/app/types/Cart";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/app/config/api.config";

const CartPage = () => {

  const router = useRouter();
  const { startLoading } = useGlobalLoader();
  const [hasHydrated, setHasHydrated] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [apiDiscount, setApiDiscount] = useState<number | null>(null);
  const [apiFinal, setApiFinal] = useState<number | null>(null);
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [error, setError] = useState("");
  const isFirstRender = React.useRef(true);

  useEffect(() => {
    setHasHydrated(true);
    setCart(getcart());

    const handleUpdate = () => {
      setCart(getcart());
    };

    window.addEventListener("cartUpdated", handleUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleUpdate);
    };
  }, []);


  const handleCheckout = () => {
    startLoading();


    const token = localStorage.getItem("token");

    setTimeout(() => {
      if (!token) {
        router.replace("/login");
      } else {
        router.replace("/Chekout");
      }
    }, 800);
  };


  const handleIncrease = (id: number, qty: number) => {
    updateQuantity(id, qty + 1);
  };

  const handleDecrease = (id: number, qty: number) => {
    if (qty > 1) {
      updateQuantity(id, qty - 1);
    } else {
      removeCart(id);
    }
  };

  const handleRemove = (id: number) => {
    removeCart(id);
  };


  const subtotal = cart.reduce((acc, item) => acc + (item.final_price ?? item.sale_price) * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  // Check if any item has an offer (making it ineligible for coupon)
  const hasIneligibleItems = cart.some(item => !item.is_coupon_eligible);

  const finalDiscount = apiDiscount || 0;
  const finalTotal = apiFinal || subtotal;

  // Check if any item is coupon eligible
  const isAnyItemEligible = cart.some(item => item.is_coupon_eligible);

  useEffect(() => {
    if (isFirstRender.current) {
        const savedCoupon = localStorage.getItem("applied_coupon");
        if (savedCoupon) {
            setCouponCode(savedCoupon);
        }
        isFirstRender.current = false;
        return;
    }

    setApiDiscount(null);
    setApiFinal(null);
    setCouponSuccess(false);
    setError("");
    localStorage.removeItem("applied_coupon");
  }, [cart]);

  const handleApplyCoupon = async () => {
    try {
      if (!couponCode.trim()) {
        setError("Please enter a coupon code");
        return;
      }

      setCouponLoading(true);
      setError("");
      setCouponSuccess(false);

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!user?.id) {
        setError("User not found. Please login again.");
        return;
      }

      const res = await api.post(
        "/coupon/apply",
        {
          code: couponCode.trim(),
          user_id: user.id,
          items: cart.map(item => ({
             product_id: item.id,
             quantity: item.quantity
          }))
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = res.data;

      if (data?.discount === undefined || data?.final_amount === undefined) {
        throw new Error("Invalid response from server");
      }

      setApiDiscount(data.discount);
      setApiFinal(data.final_amount);
      setCouponSuccess(true);
      
      localStorage.setItem("applied_coupon", couponCode.trim());

    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
        err?.message ||
        "Invalid coupon"
      );
    } finally {
      setCouponLoading(false);
    }
  };

  if (!hasHydrated) return null;

  if (cart.length === 0) {

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
            <ShoppingCart size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="text-gray-600 max-w-xs mx-auto">
            Looks like you haven't added anything to your cart yet.
          </p>
          <button
            onClick={() => { startLoading(); router.push("/shope"); }}
            className="px-8 py-3 bg-[#4C7C3C] text-white font-bold rounded-xl hover:bg-[#3d6430] transition-all"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <span className="cursor-pointer hover:text-green-600" onClick={() => { startLoading(); router.push("/"); }}>Home</span>
            <span>›</span>
            <span className="text-gray-900">Cart</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT SIDE CART ITEMS */}
            <div className="lg:col-span-2 space-y-4 text-gray-700">

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-sm border border-gray-100 relative hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  >
                    <X size={20} />
                  </button>

                  <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-100">
                    <img
                      src={item.image}
                      alt={item.product_name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  <div className="flex-1 min-w-0 pr-8">
                    <h3 className="text-gray-900 font-bold text-lg mb-1 line-clamp-2">
                      {item.product_name}
                    </h3>
                    <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <p className="text-[#4C7C3C] font-bold text-xl">
                        ₹{item.final_price ?? item.sale_price}
                      </p>
                      {!item.is_coupon_eligible && (
                        <span className="text-[10px] text-orange-500 font-medium">
                          Coupon not applicable on this item
                        </span>
                      )}
                    </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1 border border-gray-200">
                    <button onClick={() => handleDecrease(item.id, item.quantity)}>
                      <Minus size={16} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleIncrease(item.id, item.quantity)}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}

            </div>

            {/* RIGHT SIDE SUMMARY */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-8">

                <h2 className="text-xl font-extrabold text-gray-900 mb-6">
                  Order summary
                </h2>

                {/* Coupon */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      type="text"
                      placeholder="PROMO CODE"
                      className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4C7C3C] focus:ring-1 focus:ring-[#4C7C3C]"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !isAnyItemEligible}
                      className={`px-5 py-2 text-white font-bold rounded-xl transition-all ${
                        couponLoading || !isAnyItemEligible 
                          ? "bg-gray-400 cursor-not-allowed" 
                          : "bg-[#4C7C3C] hover:bg-[#3d6430]"
                      }`}
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                  
                  {!isAnyItemEligible && (
                    <p className="text-red-500 text-[11px] font-medium mb-2">
                      Coupon not applicable on discounted products.
                    </p>
                  )}

                  <AnimatePresence>
                    {couponSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-sm text-green-600 animate-in fade-in slide-in-from-top-1"
                      >
                        <Check size={16} strokeWidth={3} />
                        <span className="font-medium">Coupon applied successfully!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                  
                  {hasIneligibleItems && !couponSuccess && (
                    <p className="text-orange-500 text-[11px] mt-2 leading-tight">
                      * Some items in your cart have existing offers and are not eligible for additional coupons.
                    </p>
                  )}
                </div>

                {/* Price Details */}
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">
                      Subtotal ({totalItems} items)
                    </span>
                    <span className="text-gray-900 font-bold">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>

                  {finalDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">
                        Discount
                      </span>
                      <span className="text-red-500 font-bold">
                        - ₹{finalDiscount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Shipping Fee</span>
                    <span className="text-green-600 font-bold">FREE</span>
                  </div>
                </div>

                {finalDiscount > 0 && (
                  <div className="mb-6 p-4 bg-green-50 rounded-xl border border-dashed border-green-200 flex items-start gap-3">
                    <div className="bg-white p-1.5 rounded-lg shadow-sm">
                      <ShoppingCart size={18} className="text-green-600" />
                    </div>
                    <p className="text-xs text-green-800 leading-relaxed">
                      <strong>Extra Savings!</strong> You qualify for a discount on this order. Happy shopping!
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center mb-8">
                  <div>
                    <span className="text-gray-500 text-sm font-medium block">
                      Total (incl. VAT)
                    </span>
                    <span className="text-xs text-gray-400">Taxes applied at checkout</span>
                  </div>

                  <span className="text-3xl font-black text-gray-900">
                    ₹{finalTotal.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#4C7C3C] hover:bg-[#325228] text-white font-black py-4 px-6 rounded-2xl transition-all shadow-lg shadow-green-100 active:scale-[0.98]">
                  Proceed To Checkout
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;