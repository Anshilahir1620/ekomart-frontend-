"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getOrders, Order } from "@/app/services/orderService";
import { useRouter } from "next/navigation";
import { Calendar, Package, ChevronRight, CreditCard } from "lucide-react";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        
        const data = await getOrders();
        setOrders(data);
      } catch (err: any) {
        console.error("Fetch orders error:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  if (loading && !orders) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-8">You haven't placed any orders yet. Start shopping to fill your history!</p>
          <button 
            onClick={() => router.push("/")}
            className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-100"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-extrabold text-gray-900">Your Orders</h1>
          <p className="text-gray-500 mt-2">Track and manage your recent purchases</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => router.push(`/orders/${order.id}`)}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      Order #{order.id}
                    </span>
                    <StatusBadge status={order.payments[0]?.payment_status || "pending"} />
                  </div>
                  <div className="flex items-center text-gray-400 text-xs gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                <div className="text-right tracking-tight">
                  <div className="text-lg font-bold text-gray-900">₹{parseFloat(order.total_amount.toString()).toLocaleString()}</div>
                  <div className="text-[10px] text-gray-400 font-medium uppercase">{order.payments[0]?.payment_method || "COD"}</div>
                </div>
              </div>

              {/* Product Preview */}
              <div className="flex items-center justify-between">
                <div className="flex -space-x-4 overflow-hidden py-1">
                  {order.items.slice(0, 3).map((item, i) => (
                    <div 
                      key={i} 
                      className="w-12 h-12 rounded-xl border-2 border-white bg-gray-50 overflow-hidden shadow-sm"
                    >
                      <img 
                        src={item.image || "/placeholder.png"} 
                        alt={item.product_name}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-12 h-12 rounded-xl border-2 border-white bg-green-50 flex items-center justify-center text-[10px] font-bold text-green-700 shadow-sm">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>

                <div className="flex items-center text-green-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const s = status.toLowerCase();
  if (s === "paid" || s === "success" || s === "completed") {
    return <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
      <span className="w-1 h-1 bg-green-600 rounded-full animate-pulse"></span> Paid ✅
    </span>;
  }
  if (s === "failed" || s === "cancelled") {
    return <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Failed ❌</span>;
  }
  return <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Pending ⏳</span>;
};

export default OrdersPage;
