"use client";

import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Categorie } from "@/app/types/Categorie";
import { getCategories } from "@/app/services/Categories.api";

import Link from "next/link";
const CategoriesSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const [categories, setCategories] = useState<Categorie[]>([]);

  // Backend Base URL
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://ekomart-backend-production.up.railway.app";

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(console.error);
  }, []);

  // Manual Scroll
  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 300;

    scrollContainerRef.current.scrollTo({
      left:
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  // Auto Scroll
  const startAutoScroll = () => {
    const el = scrollContainerRef.current;

    if (!el) return;

    const step = () => {
      if (!scrollContainerRef.current) return;

      scrollContainerRef.current.scrollLeft += 0.6;

      if (
        scrollContainerRef.current.scrollLeft +
        scrollContainerRef.current.clientWidth >=
        scrollContainerRef.current.scrollWidth - 1
      ) {
        scrollContainerRef.current.scrollLeft = 0;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    startAutoScroll();

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Normalize Image URL
  const normalizeCategoryImage = (image: string) => {
    if (!image) {
      return "https://placehold.co/300x200?text=No+Image";
    }

    // Already Full URL
    if (image.startsWith("http")) {
      return image;
    }

    return `${API_BASE_URL}/public/categories/${image}`;
  };

  return (
    <section className="py-10 bg-white">
      <div className="px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Shop by categories
          </h2>
        </div>

        <div className="relative">

          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
          >
            <ChevronLeft className="w-6 h-6 text-[#4C7C3C]" />
          </button>

          {/* Categories Slider */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div className="flex gap-6 pb-4 min-w-max">

              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products/category/${category.slug}`}
                  className="group flex-shrink-0 cursor-pointer"
                  style={{ width: "220px" }}
                >

                  {/* Category Card */}
                  <div
                    className="relative overflow-hidden rounded-3xl h-[190px] w-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >

                    {/* Background Image */}
                    <img
                      src={normalizeCategoryImage(category.image)}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;

                        target.onerror = null;

                        target.src =
                          "https://placehold.co/300x200?text=No+Image";
                      }}
                    />

                    {/* Dark Blur Overlay */}
                    <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px]" />

                    {/* Category Name */}
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <h3 className="text-white text-xl font-bold text-center drop-shadow-lg">
                        {category.name}
                      </h3>
                    </div>

                  </div>
                </Link>
              ))}

            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
          >
            <ChevronRight className="w-6 h-6 text-[#4C7C3C]" />
          </button>

        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;