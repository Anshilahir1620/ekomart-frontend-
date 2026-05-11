"use client";

import { motion } from "framer-motion";

export default function FullScreenLoader({ text = "Loading..." }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
    >
      <div className="flex flex-col items-center gap-4">

        {/* Spinner */}
        <div className="h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>

        {/* Text */}
        <p className="text-white font-semibold">{text}</p>
      </div>
    </motion.div>
  );
}