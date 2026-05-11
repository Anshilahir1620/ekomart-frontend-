"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getOrderById, Order } from "@/app/services/orderService";
import { ChevronLeft, MapPin, Package, Phone, User, Clock, Activity } from "lucide-react";

const OrderDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await getOrderById(orderId);
                setOrder(data);
            } catch (err: any) {
                console.error("Fetch order error:", err);
                setError("Order not found or you don't have permission to view it.");
            } finally {
                setLoading(false);
            }
        };

        if (orderId) fetchOrder();
    }, [orderId]);

    if (loading && !order) {
        return null;
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error || "Order not found"}</p>
                    <button 
                        onClick={() => router.push("/orders")}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    const payment = order.payments[0] || {};
    const subtotal = order.items.reduce(
        (sum, item) => sum + (item.price * item.quantity), 
        0
    );

    return (
        <div className="min-h-screen bg-gray-50 py-4 px-4 text-gray-900">
            <div className="max-w-4xl mx-auto">

                <button 
                    onClick={() => router.push("/orders")}
                    className="flex items-center gap-2 text-gray-600 hover:text-green-600 font-bold mb-4 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back to History
                </button>

                <motion.div className="space-y-6">

                    {/* Header */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-50 p-3 rounded-xl">
                                <Package className="text-green-600 w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Order #{order.id}</h2>
                                <div className="text-sm font-medium text-gray-500">
                                    <span className="text-gray-400 font-normal">{new Date(order.created_at).toLocaleDateString()}</span>
                                    <span className="mx-2 text-gray-300">•</span>
                                    <span className="uppercase text-green-600 font-bold text-[11px] tracking-wider bg-green-50 px-2 py-0.5 rounded">
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* LEFT */}
                        <div className="md:col-span-2 space-y-6">

                            {/* Items */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
                                    <span className="bg-amber-50 p-1.5 rounded-lg text-amber-600">📦</span> Items Order
                                </h3>
                                
                                <div className="space-y-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                            <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center p-2 border border-gray-100">
                                                <img src={item.image} className="max-w-full max-h-full object-contain" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-900 text-base mb-1 truncate">{item.product_name}</h4>
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="text-gray-500 font-medium">
                                                        Qty: <span className="text-gray-800 font-bold">{item.quantity}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xs text-gray-400">₹{item.price}</div>
                                                        <div className="text-gray-900 font-bold text-base">₹{item.price * item.quantity}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* PRICE SECTION */}
                                <div className="mt-6 border-t border-gray-100 pt-5 space-y-3">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="text-gray-900 font-bold">₹{subtotal.toLocaleString()}</span>
                                    </div>

                                    {order.coupon_code && (
                                        <div className="flex justify-between text-sm font-medium">
                                            <span className="text-gray-500">Coupon Code</span>
                                            <span className="text-[#4C7C3C] font-bold bg-green-50 px-2 py-0.5 rounded uppercase tracking-wider text-xs">{order.coupon_code}</span>
                                        </div>
                                    )}

                                    {order.discount_amount > 0 && (
                                        <div className="flex justify-between text-sm font-medium text-red-500">
                                            <span className="font-medium text-gray-500">Discount Applied</span>
                                            <span className="font-bold">- ₹{order.discount_amount.toLocaleString()}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-gray-500">Shipping</span>
                                        <span className="text-green-600 font-bold">FREE</span>
                                    </div>

                                    <div className="flex justify-between font-black text-xl pt-3 border-t border-dashed border-gray-100 mt-2">
                                        <span className="text-gray-900">Grand Total</span>
                                        <span className="text-[#4C7C3C]">
                                            ₹{order.final_amount.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="space-y-6">

                            {/* Payment */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
                                    <span className="bg-orange-50 p-1.5 rounded-lg text-orange-600">⚡</span> Payment
                                </h3>

                                <div className="space-y-4 text-sm font-medium">
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                        <span className="text-gray-500">Method</span>
                                        <span className="text-gray-900 font-bold bg-gray-50 px-2 py-0.5 rounded uppercase text-[11px]">{payment.payment_method || "COD"}</span>
                                    </div>

                                    <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                        <span className="text-gray-500">Status</span>
                                        <span className={`font-bold uppercase text-[11px] tracking-wider ${payment.payment_status?.toLowerCase() === 'paid' ? 'text-green-600 bg-green-50 px-2 py-0.5 rounded' : 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded'}`}>{payment.payment_status}</span>
                                    </div>

                                    <div className="flex justify-between items-center pt-1">
                                        <span className="text-gray-500">Amount Paid</span>
                                        <span className="text-[#4C7C3C] font-black text-lg">₹{payment.amount?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
                                    <span className="bg-blue-50 p-1.5 rounded-lg text-blue-600">🏡</span> Shipping
                                </h3>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm font-bold text-gray-900">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <span>{order.shipping_name}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span>{order.shipping_phone}</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-sm font-medium text-gray-500 pl-7 leading-relaxed">
                                        <span>{order.shipping_address}, {order.shipping_city}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OrderDetailPage;