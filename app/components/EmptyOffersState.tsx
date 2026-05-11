"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Apple, 
  Milk, 
  Coffee, 
  Zap 
} from "lucide-react";
import Link from "next/link";

const EmptyOffersState = () => {
  const teasers = [
    { icon: <Apple className="w-6 h-6 text-green-500" />, label: "Fresh Fruits", bg: "bg-green-50" },
    { icon: <Milk className="w-6 h-6 text-blue-500" />, label: "Dairy & Eggs", bg: "bg-blue-50" },
    { icon: <Coffee className="w-6 h-6 text-amber-600" />, label: "Pantry Essentials", bg: "bg-amber-50" },
    { icon: <Zap className="w-6 h-6 text-purple-500" />, label: "Quick Snacks", bg: "bg-purple-50" },
  ];

  return (
    <div className="w-full max-w-full mx-auto">
      {/* Main Content Card */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 md:p-16 text-center"
      >
        {/* Decorative Background Elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60" />
        
        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Animated Icon Container */}
          <div className="relative inline-block mb-8">
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-24 h-24 bg-gradient-to-br from-[#4C7C3C] to-[#3d6330] rounded-3xl flex items-center justify-center shadow-lg shadow-green-200 rotate-3"
            >
              <ShoppingBag className="w-12 h-12 text-white" />
            </motion.div>
            <motion.div 
              animate={{ 
                y: [-5, 5, -5],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-amber-400 p-2 rounded-xl shadow-md"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
            FRESH DEALS ARE <br />
            <span className="text-[#4C7C3C]">BEING PREPARED</span>
          </h2>
          
          <p className="text-gray-500 text-lg md:text-xl font-medium mb-10 leading-relaxed">
            Our team is currently hand-picking the best discounts for you. 
            New savings usually arrive within hours!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#4C7C3C] text-white px-10 py-5 rounded-2xl font-bold transition-all duration-300 hover:bg-[#3d6330] hover:scale-105 shadow-xl shadow-green-100"
            >
              Return Home
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2 px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-bold text-gray-500">Updates coming soon</span>
            </div>
          </div>
        </div>

        {/* Category Teaser Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 relative z-10">
          {teasers.map((teaser, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + (idx * 0.1) }}
              whileHover={{ y: -5 }}
              className={`${teaser.bg} p-6 rounded-[28px] border border-white shadow-sm flex flex-col items-center justify-center transition-all duration-300`}
            >
              <div className="mb-3 bg-white p-3 rounded-2xl shadow-sm">
                {teaser.icon}
              </div>
              <span className="text-sm font-bold text-gray-700">{teaser.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default EmptyOffersState;
