"use client";

import React, { useState, useEffect } from "react";
import { getcart, saveAddress, getAddresses, clearCart } from "@/app/utils/cart";
import { CartItem } from "@/app/types/Cart";

import axios from "@/app/config/api.config";
import { useRouter, useSearchParams } from "next/navigation";
import { useGlobalLoader } from "@/app/components/GlobalLoaderProvider";
import { createOrder, verifyPayment, createRazorpayOrder } from "@/app/services/payment.api";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [loading, setLoading] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const { startLoading } = useGlobalLoader();

  const [orderSummary, setOrderSummary] = useState<{
    subtotal: number;
    discount: number;
    final: number;
  } | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  // ✅ FIX 1: Safe localStorage usage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
    }
  }, []);

  // ✅ FIX 2: Do NOT decode JWT manually
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    setHasHydrated(true);

    // Determine Source Items (Cart vs Buy Now)
    let items: CartItem[] = [];
    if (mode === "buy_now") {
      const buyNowItem = localStorage.getItem("buy_now_item");
      if (buyNowItem) {
        items = [JSON.parse(buyNowItem)];
      }
    } else {
      items = getcart();
    }
    
    setCartItems(items);

    const addr = getAddresses();
    setAddresses(addr);

    if (addr.length > 0) setSelectedAddressId(addr[0].id);

    const checkCoupon = async () => {
      const code = localStorage.getItem("applied_coupon");
      if (!code) return;

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user?.id) return;

      const items_subtotal = items.reduce(
        (sum, item) => sum + (item.final_price ?? item.sale_price) * item.quantity,
        0
      );

      try {
        const res = await axios.post("/coupon/apply", {
          code: code,
          user_id: user.id,
          items: items.map(item => ({
            product_id: item.id,
            quantity: item.quantity
          }))
        });

        const data = res.data;

        if (data?.discount !== undefined && data?.final_amount !== undefined) {
          setOrderSummary({
            subtotal: items_subtotal,
            discount: data.discount,
            final: data.final_amount
          });
        }
      } catch (err) {
        console.error("Invalid stored coupon:", err);
        localStorage.removeItem("applied_coupon");
      }
    };

    checkCoupon();
  }, [mode]);

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.address) {
      alert("Fill all fields");
      return;
    }

    const newAddr = { id: Date.now(), ...newAddress };
    saveAddress(newAddr);

    const updated = getAddresses();
    setAddresses(updated);
    setSelectedAddressId(newAddr.id);

    setShowForm(false);
    setNewAddress({ name: "", phone: "", address: "", city: "", state: "", pincode: "" });
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.final_price ?? item.sale_price) * item.quantity,
    0
  );

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const coupon_code =
    typeof window !== "undefined"
      ? localStorage.getItem("applied_coupon") || ""
      : "";

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return alert("Please select a delivery address.");
    if (cartItems.length === 0) return alert("Your cart is empty.");
    if (loading) return;

    setLoading(true);

    try {
      const backendPaymentMethod =
        paymentMethod === "card" ? "CARD" : "COD";

      const selectedAddress = addresses.find(
        (a) => a.id === selectedAddressId
      );

      if (!selectedAddress) return alert("Address error.");

      const orderRes = await createOrder({
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        payment_method: backendPaymentMethod,
        coupon_code,
        shipping_name: selectedAddress.name,
        shipping_phone: selectedAddress.phone,
        shipping_address: selectedAddress.address,
        shipping_city: selectedAddress.city,
        shipping_state: selectedAddress.state || "",
        shipping_pincode: selectedAddress.pincode || "",
      });

      // ✅ FIX 4: Validate response
      if (!orderRes?.id) {
        throw new Error("Invalid order response");
      }

      const orderId = orderRes.id;

      setOrderSummary({
        subtotal: orderRes.total_amount,
        discount: orderRes.discount_amount,
        final: orderRes.final_amount,
      });

      if (backendPaymentMethod === "COD") {
        if (mode === "buy_now") {
          localStorage.removeItem("buy_now_item");
        } else {
          clearCart();
        }
        
        startLoading();
        router.push("/order-confirmed");
        setLoading(false);
        return;
      }

      const razorpayKey =
        process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_SZqzxPLwu3SpoT";

      // ✅ FIX 5: Don't block production
      if (
        process.env.NODE_ENV !== "development" &&
        razorpayKey.startsWith("rzp_test_")
      ) {
        console.warn("Using test key in production");
      }

      const data = await createRazorpayOrder({ order_id: orderId });

      if (!data?.razorpay_order_id) {
        setLoading(false);
        return alert("Razorpay order failed.");
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setLoading(false);
        return alert("Razorpay SDK failed.");
      }

      const rzp = new (window as any).Razorpay({
        key: razorpayKey,
        amount: data.amount,
        currency: data.currency,
        order_id: data.razorpay_order_id,
        name: "Ekomart",
        description: "Secure Checkout",

        // ✅ FIX 6: Safe verification
        handler: async (response: any) => {
          try {
            await verifyPayment({
              order_id: orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (mode === "buy_now") {
              localStorage.removeItem("buy_now_item");
            } else {
              clearCart();
            }
            startLoading();
            router.push("/order-confirmed");
          } catch (e) {
            console.error("Verification failed", e);
            alert("Payment received but verification pending. Contact support.");
          } finally {
            setLoading(false);
          }
        },

        prefill: {
          name: selectedAddress.name,
          contact: selectedAddress.phone,
        },
        theme: { color: "#16a34a" },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.open();

      rzp.on("payment.failed", function (response: any) {
        setLoading(false);
        alert("Payment Failed ❌ " + response.error.description);
      });

    } catch (err: any) {
      alert(err.response?.data?.detail || "Order failed");
      setLoading(false);
    }
  };

  if (!hasHydrated) return null;
return (

    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* ADDRESS */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                Delivery address
              </h2>

              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`rounded-lg border p-4 cursor-pointer transition-all ${selectedAddressId === addr.id
                      ? "border-green-600 bg-green-50 ring-1 ring-green-600"
                      : "border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{addr.name}</p>
                        <p className="text-sm text-gray-600">{addr.phone}</p>
                        <p className="text-sm text-gray-600">
                          {addr.address}, {addr.city}
                        </p>
                      </div>
                      {selectedAddressId === addr.id && (
                        <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div
                onClick={() => setShowForm(!showForm)}
                className="mt-3 border border-dashed border-gray-300 p-4 rounded-lg cursor-pointer text-center text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors"
              >
                + Add New Address
              </div>

              {showForm && (
                <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      placeholder="Full Name"
                      className="p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                      value={newAddress.name}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, name: e.target.value })
                      }
                    />
                    <input
                      placeholder="Phone Number"
                      className="p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                      value={newAddress.phone}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, phone: e.target.value })
                      }
                    />
                  </div>
                  <input
                    placeholder="Complete Address"
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    value={newAddress.address}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, address: e.target.value })
                    }
                  />
                  <input
                    placeholder="City"
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    value={newAddress.city}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, city: e.target.value })
                    }
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="State"
                      className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, state: e.target.value })
                      }
                    />
                    <input
                      placeholder="Pincode"
                      className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                      value={newAddress.pincode}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, pincode: e.target.value })
                      }
                    />
                  </div>



                  <div className="flex gap-2">
                    <button
                      onClick={handleAddAddress}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
                    >
                      Save Address
                    </button>
                    <button
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* PAYMENT */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <h2 className="text-lg font-bold mb-4">Payment method</h2>

              <div className="space-y-3">
                {[
                  { id: "cash_on_delivery", name: "Cash on Delivery", icon: "💵" },
                  { id: "card", name: "Credit / Debit Card", icon: "💳" }
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === method.id
                      ? "border-green-600 bg-green-50 ring-1 ring-green-600"
                      : "border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{method.icon}</span>
                      <span className="font-medium">{method.name}</span>
                    </div>
                    <input
                      type="radio"
                      className="w-4 h-4 text-green-600 ring-offset-white focus:ring-green-500"
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 sticky top-8">
              <h2 className="text-lg font-bold mb-6">Order summary</h2>

              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="text-gray-900 font-medium">₹{(orderSummary?.subtotal ?? subtotal).toLocaleString()}</span>
                </div>

                {(orderSummary?.discount ?? 0) > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>Discount</span>
                    <span>-₹{(orderSummary?.discount ?? 0).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between mt-1 items-baseline">
                  <span className="text-lg font-bold text-gray-900">Grand Total</span>
                  <span className="text-2xl font-bold text-green-600">₹{(orderSummary?.final ?? subtotal).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className={`w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-200 transition-all active:scale-95 ${loading
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:bg-green-700 hover:shadow-green-300"
                  }`}
              >
                {loading ? (
                  "Processing..."
                ) : (
                  paymentMethod === "cash_on_delivery" ? "Confirm Order" : "Securely Pay Now"
                )}
              </button>

              <button
                onClick={() => {
                  startLoading();
                  router.push("/");
                }}
                disabled={loading}
                className="w-full mt-3 bg-white text-gray-500 py-3 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 hover:text-red-500 hover:border-red-200 transition-all text-sm uppercase tracking-wide"
              >
                Cancel & Return to Shop
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                🔒 Security encrypted payment process
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;