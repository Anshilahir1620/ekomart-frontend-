"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartToastProps {
  isVisible: boolean;
  onClose: () => void;
}

const CartToast: React.FC<CartToastProps> = ({ isVisible, onClose }) => {
  const router = useRouter();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 100, x: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-6 right-6 z-[9999] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-center gap-4 min-w-[320px]"
        >
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 flex-shrink-0">
            <ShoppingCart className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-green-700 font-bold text-sm mb-0.5">
              <Check className="w-4 h-4" strokeWidth={3} />
              <span>Added to Cart</span>
            </div>
            <p className="text-gray-500 text-xs font-medium">Item successfully added to your shopping cart</p>
          </div>

          <button
            onClick={() => {
              onClose();
              router.push("/cart");
            }}
            className="px-4 py-2 bg-[#4C7C3C] text-white text-xs font-black rounded-lg hover:bg-[#3d6430] transition-all shadow-md active:scale-95"
          >
            Go to Cart
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartToast;
