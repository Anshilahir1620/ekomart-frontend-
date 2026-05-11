'use client';

import React from 'react';
import Link from 'next/link';

const OrderConfirmedPage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce duration-1000">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for shopping with Ekomart. Your order has been successfully placed and is being processed.
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-4">
            You will receive a confirmation email shortly with your order details.
          </p>
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-green-100"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        <p className="text-gray-400 text-sm">
          Need help? <Link href="/contact" className="text-green-600 font-medium">Contact our support</Link>
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmedPage;
