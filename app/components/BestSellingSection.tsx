'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Heart, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGlobalLoader } from './GlobalLoaderProvider';

import { addToCart } from '@/app/utils/cart';
import CartToast from '@/app/components/CartToast';

interface Category {
    id: number;
    name: string;
    slug: string;
    image: string;
}

interface Product {
    id: number;
    product_name: string;
    regular_price: number;
    sale_price: number;
    final_price: number;
    discount: number;
    offer_applied: boolean;
    offer_type: string;
    offer_value: number;
    size: string;
    weight: number;
    rating: number | null;
    life: string | null;
    stock: number;
    type: string;
    brand: string;
    category: string;
    subcategory_id: number;
    tag: string | null;
    description: string;
    image: string;
    created_at: string;
    updated_at: string;
    liked?: boolean;
}

const BestSellingSection: React.FC = () => {
    const { startLoading } = useGlobalLoader();
    const router = useRouter();

    // REFS
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

    // STATES
    const [activeFilter, setActiveFilter] = useState('All');
    const [showToast, setShowToast] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    // API
    const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        'https://ekomart-backend-production.up.railway.app';

    // =========================
    // FETCH DATA
    // =========================
    useEffect(() => {

        // CATEGORIES
        fetch(`${API_BASE_URL}/category/`)
            .then((res) => res.json())
            .then((data) => {
                setCategories(data || []);
            })
            .catch(console.error);

        // PRODUCTS
        fetch(`${API_BASE_URL}/product/`)
            .then((res) => res.json())
            .then((data) => {

                const updated = (data || []).map((p: Product) => ({
                    ...p,
                    liked: false,
                }));

                setProducts(updated);

            })
            .catch(console.error);

    }, []);

    // =========================
    // FILTERS
    // =========================
    const filters = ['All', ...categories.map((c) => c.name)];

    // =========================
    // FILTER PRODUCTS
    // =========================
    const filteredProducts =
        activeFilter === 'All'
            ? products
            : products.filter(
                (p) =>
                    p.category.toLowerCase() ===
                    activeFilter.toLowerCase()
            );

    // =========================
    // TOGGLE LIKE
    // =========================
    const toggleLike = (id: number) => {

        setProducts((prev) =>
            prev.map((p) =>
                p.id === id
                    ? { ...p, liked: !p.liked }
                    : p
            )
        );

    };

    // =========================
    // ADD TO CART
    // =========================
    const handleAddToCart = (product: Product) => {

        addToCart(product as any);

        setShowToast(false);

        setTimeout(() => {
            setShowToast(true);
        }, 10);

    };

    // =========================
    // SCROLL
    // =========================
    const scroll = (direction: 'left' | 'right') => {

        const el = scrollContainerRef.current;

        if (!el) return;

        const cardWidth = 300;
        const gap = 24;

        const scrollAmount = cardWidth + gap;

        const maxScroll =
            el.scrollWidth - el.clientWidth;

        if (direction === 'right') {

            if (el.scrollLeft >= maxScroll - 10) {

                el.scrollTo({
                    left: 0,
                    behavior: 'smooth',
                });

            } else {

                el.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth',
                });

            }

        } else {

            if (el.scrollLeft <= 10) {

                el.scrollTo({
                    left: maxScroll,
                    behavior: 'smooth',
                });

            } else {

                el.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth',
                });

            }
        }
    };

    // =========================
    // AUTO SCROLL
    // =========================
    const startAutoScroll = () => {

        stopAutoScroll();

        autoScrollRef.current = setInterval(() => {
            scroll('right');
        }, 2500);

    };

    const stopAutoScroll = () => {

        if (autoScrollRef.current) {

            clearInterval(autoScrollRef.current);
            autoScrollRef.current = null;

        }
    };

    useEffect(() => {

        startAutoScroll();

        const el = scrollContainerRef.current;

        const handleMouseEnter = () => stopAutoScroll();
        const handleMouseLeave = () => startAutoScroll();

        if (el) {

            el.addEventListener(
                'mouseenter',
                handleMouseEnter
            );

            el.addEventListener(
                'mouseleave',
                handleMouseLeave
            );
        }

        return () => {

            stopAutoScroll();

            if (el) {

                el.removeEventListener(
                    'mouseenter',
                    handleMouseEnter
                );

                el.removeEventListener(
                    'mouseleave',
                    handleMouseLeave
                );
            }
        };
    }, []);

    return (
        <>
            <section className="w-full py-16 bg-[#f5f5f5]">

                <div className="w-full">
                    {/* MAIN CONTAINER */}
                    <div className="w-full bg-white rounded-[20px] border border-gray-200 shadow-sm p-5 md:p-8">

                        {/* HEADER */}
                        <div className="flex items-center justify-between mb-8">

                            <h2 className="text-3xl font-bold text-[#0f172a]">
                                Best selling products
                            </h2>

                        </div>

                        {/* FILTERS */}
                        <div className="mb-8 overflow-x-auto scrollbar-hide">

                            <div className="flex gap-3 min-w-max">

                                {filters.map((filter) => (

                                    <button
                                        key={filter}
                                        onClick={() =>
                                            setActiveFilter(filter)
                                        }
                                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeFilter === filter
                                                ? 'bg-[#4C7C3C] text-white shadow-md'
                                                : 'bg-white border border-gray-300 text-gray-700 hover:border-[#4C7C3C] hover:text-[#4C7C3C]'
                                            }`}
                                    >
                                        {filter}
                                    </button>

                                ))}

                            </div>

                        </div>

                        {/* PRODUCTS */}
                        <div className="relative">

                            {/* LEFT BUTTON */}
                            <button
                                onClick={() => scroll('left')}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-20 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all"
                            >
                                <ChevronLeft className="w-5 h-5 text-[#4C7C3C]" />
                            </button>

                            {/* RIGHT BUTTON */}
                            <button
                                onClick={() => scroll('right')}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-20 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all"
                            >
                                <ChevronRight className="w-5 h-5 text-[#4C7C3C]" />
                            </button>

                            {/* SLIDER */}
                            <div
                                ref={scrollContainerRef}
                                className="overflow-x-auto no-scrollbar py-2"
                                style={{
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none',
                                    scrollBehavior: 'smooth',
                                }}
                            >

                                <div className="flex gap-6 items-stretch">

                                    {filteredProducts.map((product) => (

                                        <div
                                            key={product.id}
                                            className="w-[290px] min-w-[290px] bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group"
                                        >

                                            {/* IMAGE SECTION */}
                                            <div className="relative h-[250px] bg-[#f8f8f8] border-b border-gray-100 flex items-center justify-center p-5">

                                                {/* OFFER */}
                                                {product.offer_applied && (product.offer_value ?? 0) > 0 && (
                                                    <div className="absolute top-3 left-3 z-10">
                                                        <span className="bg-red-500 text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm">
                                                            {product.offer_value}% OFF
                                                        </span>
                                                    </div>
                                                )}

                                                {/* WISHLIST */}
                                                <button
                                                    onClick={() =>
                                                        toggleLike(product.id)
                                                    }
                                                    className="absolute top-3 right-3 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-md transition-all hover:scale-110"
                                                >
                                                    <Heart
                                                        className={`w-5 h-5 ${product.liked
                                                                ? 'fill-red-500 text-red-500'
                                                                : 'text-gray-400'
                                                            }`}
                                                        strokeWidth={1.8}
                                                    />
                                                </button>

                                                {/* PRODUCT IMAGE */}
                                                <Link 
                                                    href={`/product/${product.id}`}
                                                    onClick={() => startLoading()}
                                                    className="w-full h-full block"
                                                >
                                                    <img
                                                        src={product.image}
                                                        alt={product.product_name}
                                                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=No+Image';
                                                        }}
                                                    />
                                                </Link>

                                            </div>

                                            {/* CONTENT */}
                                            <div className="flex flex-col flex-1 p-5">

                                                {/* PRODUCT NAME */}
                                                <Link 
                                                    href={`/product/${product.id}`}
                                                    onClick={() => startLoading()}
                                                >
                                                    <h3 className="text-[16px] font-semibold text-center text-gray-800 leading-6 min-h-[55px] line-clamp-2 hover:text-[#4C7C3C] transition-colors">
                                                        {product.product_name}
                                                    </h3>
                                                </Link>

                                                {/* PRICE */}
                                                <div className="mt-4 flex items-center justify-center gap-2">

                                                    {product.sale_price > 0 ? (
                                                        <>
                                                            <span className="text-[26px] font-bold text-[#4C7C3C]">
                                                                ₹{product.final_price}
                                                            </span>

                                                            <span className="text-sm text-gray-400 line-through">
                                                                ₹{product.regular_price}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-[26px] font-bold text-[#4C7C3C]">
                                                            ₹{product.regular_price}
                                                        </span>
                                                    )}

                                                </div>

                                                {/* BUTTON */}
                                                <button
                                                    onClick={() =>
                                                        handleAddToCart(product)
                                                    }
                                                    className="mt-5 w-full h-[50px] rounded-xl border border-[#4C7C3C] text-[#4C7C3C] font-semibold text-[16px] transition-all duration-300 hover:bg-[#4C7C3C] hover:text-white"
                                                >
                                                    Add To Cart
                                                </button>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            </div>

                            <style jsx>{`
                                .no-scrollbar::-webkit-scrollbar {
                                    display: none;
                                }

                                .no-scrollbar {
                                    -ms-overflow-style: none;
                                    scrollbar-width: none;
                                }

                                .scrollbar-hide::-webkit-scrollbar {
                                    display: none;
                                }
                            `}</style>

                        </div>

                    </div>

                </div>

            </section>

            <CartToast
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </>
    );
};

export default BestSellingSection;