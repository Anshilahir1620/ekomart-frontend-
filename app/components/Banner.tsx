"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { Banner as BannerType } from "@/app/types/Banner";
import { getBanners } from "../services/Banner.api";

const Banner: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [banners, setBanners] = useState<BannerType[]>([]);

  // Backend Base URL
  const IMAGE_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://ekomart-backend-production.up.railway.app";

  useEffect(() => {
    getBanners()
      .then(setBanners)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (paused || isTransitioning || banners.length === 0) return;

    const id = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setIndex((i) => (i + 1) % banners.length);
      }, 500);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 700);
    }, 5000);

    return () => clearInterval(id);
  }, [paused, isTransitioning, banners]);

  const nextSlide = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    setTimeout(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 500);

    setTimeout(() => setIsTransitioning(false), 700);
  };

  const prevSlide = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    setTimeout(() => {
      setIndex((i) => (i - 1 + banners.length) % banners.length);
    }, 500);

    setTimeout(() => setIsTransitioning(false), 700);
  };

  if (banners.length === 0) {
    return <div className="h-[500px]" />;
  }

  const current = banners[index];

const normalizeImagePath = (p: string) => {
  if (!p) return "";

  // Already full URL
  if (p.startsWith("http")) return p;

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
    "https://ekomart-backend-production.up.railway.app/docs";

  let path = p.replace(/\\/g, "/");

  if (!path.startsWith("/public/")) {
    path = `/public/banners/${path.replace(/^\//, "")}`;
  }

  return `${baseUrl}${path}`;
};

const imageUrl = normalizeImagePath(current.image);
  return (
    <section className="bg-gray-50 py-8">
      <div
        className="px-4"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative rounded-2xl overflow-hidden shadow-lg h-[500px]">

          {/* Background Image */}
          <div
            className={`absolute inset-0 bg-center bg-cover transition-all duration-700 ease-in-out
              ${isTransitioning ? "opacity-0 scale-105" : "opacity-100 scale-100"}
            `}
            style={{
              backgroundImage: `url(${imageUrl})`,
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className="absolute z-20 left-4 top-1/2 -translate-y-1/2 
                       bg-white/90 p-4 rounded-full shadow-lg 
                       hover:bg-[#E9F5EC] transition-all duration-300"
          >
            <ChevronLeft className="text-[#4C7C3C]" size={28} />
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="absolute z-20 right-4 top-1/2 -translate-y-1/2 
                       bg-white/90 p-4 rounded-full shadow-lg 
                       hover:bg-[#E9F5EC] transition-all duration-300"
          >
            <ChevronRight className="text-[#4C7C3C]" size={28} />
          </button>

          {/* Content */}
          <div
            className={`relative z-10 flex items-center h-full p-12 pl-20
              transition-all duration-700 ease-out
              ${isTransitioning ? "opacity-0 translate-x-10" : "opacity-100 translate-x-0"}
            `}
          >
            <div className="text-white max-w-2xl">

              {/* Badge */}
              <div className="inline-flex items-center bg-white/20 px-4 py-2 rounded-full mb-6">
                <Tag className="w-4 h-4 mr-2" />
                {current.badge}
              </div>

              {/* Title */}
              <h2 className="text-5xl font-bold">
                {current.title1}{" "}
                <span className="text-[#FF8424]">
                  {current.highlight}
                </span>
              </h2>

              <h3 className="text-5xl font-bold mb-6">
                {current.title2}
              </h3>

              {/* Description */}
              <p className="mb-2">{current.desc1}</p>
              <p className="mb-8">{current.desc2}</p>

              {/* Button */}
              <button className="bg-white text-[#4C7C3C] px-8 py-3 rounded-lg flex items-center gap-2 hover:bg-[#4C7C3C] hover:text-white transition">
                Shop Now <ArrowRight />
              </button>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;