"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/Breadcrumbs";
import EmptyOffersState from "../components/EmptyOffersState";

interface Product {
  id: number;
  product_name: string;
  image: string;
  regular_price: number;
  sale_price: number;
  final_price: number;
  discount: number;
}

interface Offer {
  category_id: number;
  category_name: string;
  category_slug: string;
  category_image: string;
  offer_type: string;
  offer_value: number;
  products: Product[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://ekomart-backend-production.up.railway.app";

const normalizeCategoryImage = (image: string) => {
  if (!image) return "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200";
  if (image.startsWith("http")) return image;
  return `${API_BASE_URL}/public/categories/${image}`;
};

const OffersPage = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  // We remove the local 'loading' state that shows a spinner to avoid "Double Loader"
  // The GlobalLoader via AxiosLoaderBridge will handle the full-screen loading state

  useEffect(() => {
    // Using axios instead of fetch to benefit from AxiosLoaderBridge (Global Loader)
    axios.get(`${API_BASE_URL}/offers/today`)
      .then((res) => {
        setOffers(res.data || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs items={[{ label: 'Deals & Offers' }]} />
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative h-[300px] md:h-[350px] flex items-center justify-center overflow-hidden rounded-b-[40px] md:rounded-b-[60px] mx-4">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover"
            alt="Offers Background"
          />
          <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-2xl"
          >
            EXCLUSIVE <span className="text-[#4C7C3C]">OFFERS</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Savor the savings with our curated selection of fresh deals. 
            Quality groceries, premium discounts, delivered to your door.
          </motion.p>
        </div>
      </section>

      {/* 2. DYNAMIC OFFERS GRID SECTION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {offers.length > 0 && (
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight uppercase">Today's Big Savings</h2>
              <p className="text-gray-500 mt-2">Handpicked offers across all your favorite categories.</p>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-100 self-start">
              <span className="text-sm font-bold text-[#4C7C3C]">{offers.length} Offers Active Today</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {offers.map((offer, idx) => (
            <motion.div
              key={offer.category_id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative h-[450px] md:h-[500px] rounded-[40px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 bg-white border border-gray-100"
            >
              {/* Image & Overlay */}
              <div className="absolute inset-0">
                <img
                  src={normalizeCategoryImage(offer.category_image)}
                  alt={offer.category_name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-12">
                <div className="flex justify-between items-start">
                  <div className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
                    {offer.category_name}
                  </div>
                  <div className="w-16 h-16 rounded-full bg-[#4C7C3C] flex flex-col items-center justify-center shadow-lg border-2 border-white/20 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <span className="text-lg font-black text-white leading-none">{offer.offer_value}%</span>
                    <span className="text-[10px] font-bold text-white/80 uppercase">Off</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tighter uppercase drop-shadow-lg">
                    YOUR FAVORITES <br />
                    <span className="text-[#4C7C3C]">FOR LESS</span>
                  </h3>
                  <p className="text-white/80 text-base md:text-lg mb-8 max-w-md font-medium leading-relaxed">
                    From farm-fresh produce to must-have kitchen picks, we’ve slashed prices just for you on {offer.products.length} products.
                  </p>

                  <Link 
                    href={`/products/offers/${offer.category_slug}`}
                    className="inline-flex items-center gap-3 bg-[#4C7C3C] text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:bg-[#3d6330] hover:gap-5 shadow-lg group-hover:shadow-[#4C7C3C]/20"
                  >
                    Shop Now
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] border border-white/5 rounded-[30px] pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {offers.length === 0 && <EmptyOffersState />}
      </section>

      <Footer />
    </div>
  );
};

export default OffersPage;
