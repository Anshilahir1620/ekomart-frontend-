"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import EmptyOffersState from "./EmptyOffersState";

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

const DealsSection: React.FC = () => {

  const [offers, setOffers] = useState<Offer[]>([]);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://ekomart-backend-production.up.railway.app";

  useEffect(() => {

    fetch(`${API_BASE_URL}/offers/today`)
      .then((res) => res.json())
      .then((data) => {
        setOffers(data || []);
      })
      .catch(console.error);

  }, []);

  const normalizeCategoryImage = (image: string) => {

    if (!image) {
      return "https://placehold.co/1200x800";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${API_BASE_URL}/public/categories/${image}`;

  };

  const maxOffer =
    offers.length > 0
      ? Math.max(...offers.map((o) => o.offer_value))
      : 0;

  return (
    <section className="w-full py-8 bg-[#f8f8f8]">

      <div className="w-full">

        {offers.length > 0 && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-7">

            <div className="max-w-[760px]">

              <div className="mb-4">

                <span className="inline-flex items-center bg-white border border-gray-200 shadow-sm rounded-full px-4 py-1.5 text-[13px] font-semibold text-[#4C7C3C]">
                  Fresh Daily Offers
                </span>

              </div>

              <h2 className="text-[36px] md:text-[42px] font-extrabold leading-[1.05] tracking-[-1px] text-[#0f172a]">
                Today's best deals for you!
              </h2>

              <p className="mt-3 text-[16px] leading-7 text-gray-500 max-w-[680px]">
                Discover today’s top grocery offers with premium discounts,
                fresh products, and exclusive daily savings across all categories.
              </p>

            </div>

            <div className="flex items-center gap-4">

              <div className="min-w-[160px] bg-white border border-gray-200 rounded-[22px] px-5 py-4 shadow-sm">

                <p className="text-[12px] font-semibold uppercase tracking-wide text-gray-500 mb-2">
                  Active Offers
                </p>

                <h4 className="text-[34px] font-black leading-none text-[#0f172a]">
                  {offers.length}+
                </h4>

              </div>

              <div className="min-w-[190px] bg-[#6a9b4d] rounded-[22px] px-5 py-4 shadow-lg">

                <p className="text-[12px] font-semibold uppercase tracking-wide text-white/80 mb-2">
                  Maximum Discount
                </p>

                <h4 className="text-[34px] font-black leading-none text-white">
                  {maxOffer}% OFF
                </h4>

              </div>

            </div>

          </div>
        )}

        <div className="mt-8">
          {offers.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {offers.map((offer) => (
                <Link
                  href={`/products/offers/${offer.category_slug}`}
                  key={offer.category_id}
                  className="group relative h-[340px] rounded-[28px] overflow-hidden block"
                >
                  <div className="absolute inset-0">
                    <img
                      src={normalizeCategoryImage(offer.category_image)}
                      alt={offer.category_name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/20" />
                  </div>
                  <div className="relative z-10 h-full flex flex-col justify-between p-7 md:p-8">
                    <div>
                      <div className="mb-6">
                        <span className="inline-flex items-center bg-red-500 text-white text-[11px] font-semibold px-4 py-2 rounded-full shadow-lg">
                          Get {offer.offer_value}% OFF
                        </span>
                      </div>
                      <p className="text-[17px] text-white/90 font-medium mb-3">
                        {offer.category_name}
                      </p>
                      <h3 className="text-[36px] md:text-[35px] leading-[1.1] tracking-[-1px] font-extrabold text-white max-w-[420px] mb-4 drop-shadow-lg">
                        {offer.products.length} Products Available
                      </h3>
                      <p className="text-[16px] leading-7 text-white/85 max-w-[470px]">
                        Fresh grocery products with premium discounts and exclusive daily savings for your shopping needs.
                      </p>
                    </div>
                    <div className="pt-5">
                      <button className="inline-flex items-center justify-center gap-3 h-[52px] px-7 rounded-full bg-white text-[#4C7C3C] text-[15px] font-semibold shadow-xl transition-all duration-300 hover:bg-[#4C7C3C] hover:text-white hover:gap-5">
                        Shop Now
                        <ArrowRight className="w-4 h-4 flex-shrink-0" />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyOffersState />
            </div>
          )}
        </div>

      </div>

    </section>
  );
};

export default DealsSection;