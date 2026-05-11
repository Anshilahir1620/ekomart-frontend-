"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowLeft, Zap, ShoppingCart, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/app/config/api.config";
import { UserProduct } from "@/app/types/Product";
import { addToCart } from "@/app/utils/cart";
import CartToast from "@/app/components/CartToast";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import Footer from "@/app/components/Footer";

const ShopMoreCTA = () => (
    <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[#4C7C3C]/5 -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#4C7C3C]/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center"
            >
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#4C7C3C]/10 text-[#4C7C3C] text-xs font-black uppercase tracking-widest mb-8 border border-[#4C7C3C]/20">
                    <Sparkles className="w-4 h-4 fill-current" />
                    Curated For You
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-[#0f172a] mb-6 tracking-tight">
                    Discover More Essentials
                </h2>
                <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
                    Browse our complete collection of thousands of daily essentials, 
                    fresh arrivals, and trending products.
                </p>
                <Link href="/shope">
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -15px rgba(76, 124, 60, 0.3)" }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative inline-flex items-center gap-4 bg-[#4C7C3C] text-white px-12 py-5 rounded-2xl font-black text-lg shadow-xl shadow-green-900/10 transition-all duration-300"
                    >
                        <ShoppingCart className="w-6 h-6" />
                        <span>Continue Shopping</span>
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-1">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </motion.button>
                </Link>
            </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#4C7C3C]/10 to-transparent" />
    </section>
);

const ProductListingPage = () => {
    const params = useParams();
    const router = useRouter();

    const type = String(params.type);
    const slug = String(params.slug);

    const [showToast, setShowToast] = useState(false);
    const [products, setProducts] = useState<UserProduct[]>([]);
    const [categoryOfferValue, setCategoryOfferValue] = useState<number | null>(null);

    useEffect(() => {
        const createSlug = (value: string) =>
            value
                .toLowerCase()
                .replace(/&/g, '')
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '');

        api.get("/product/")
            .then((res) => {
                let data = res.data as UserProduct[];
                let filtered = data;

                if (type === "category") {
                    filtered = data.filter(
                        (p: UserProduct) => createSlug(p.category) === slug.toLowerCase()
                    );
                }

                if (type === "offers") {
                    if (slug === "all") {
                        filtered = data.filter((p: UserProduct) => p.offer_applied);
                    } else {
                        filtered = data.filter(
                            (p: UserProduct) =>
                                p.offer_applied &&
                                createSlug(p.category) === slug.toLowerCase()
                        );
                    }
                }

                setProducts(filtered);
            })
            .catch((err) => {
                console.error(err);
            });

        if (type === "offers" && slug !== "all") {
            api.get("/offers/today")
                .then((res) => {
                    const activeOffers = res.data || [];
                    const currentOffer = activeOffers.find((o: any) => o.category_slug === slug.toLowerCase());
                    if (currentOffer) {
                        setCategoryOfferValue(currentOffer.offer_value);
                    }
                })
                .catch(err => console.error("Failed to fetch category offer value", err));
        }

    }, [type, slug]);

    const handleAddToCart = (product: UserProduct) => {
        addToCart(product);
        setShowToast(false);
        setTimeout(() => {
            setShowToast(true);
        }, 10);
    };

    return (
        <section className="bg-white min-h-screen flex flex-col font-sans antialiased">
            <div className="flex-1">
            <div className="bg-gradient-to-b from-green-50/50 to-white pt-6 pb-12">
                <div className="max-w-7xl mx-auto px-4">
                    <Breadcrumbs items={[
                        { label: 'Products', href: '/shope' },
                        { label: slug === "all" ? "Offers" : slug.replace(/-/g, ' ') }
                    ]} />

                    <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="max-w-2xl"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-[#4C7C3C]/10 text-[#4C7C3C] text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest border border-[#4C7C3C]/20 flex items-center gap-2">
                                    <Zap className="w-3 h-3 fill-current" />
                                    {type === "offers" ? "Limited Time Deal" : "Curated Category"}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] capitalize tracking-tight leading-tight">
                                {slug === "all"
                                    ? "All Exclusive Offers"
                                    : `${slug.replace(/-/g, ' ')} Collection`}
                            </h1>
                            <p className="text-gray-500 mt-4 text-lg font-medium">
                                {type === "offers" && categoryOfferValue
                                    ? `Unlock a flat ${categoryOfferValue}% discount on every single item in this collection.`
                                    : `Explore our handpicked selection of premium products in the ${slug.replace(/-/g, ' ')} category.`}
                            </p>
                        </motion.div>

                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border-2 border-gray-100 text-[#0f172a] font-bold hover:border-[#4C7C3C] hover:text-[#4C7C3C] transition-all shadow-sm active:scale-95 group"
                        >
                            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            Go Back
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-6">
                    <h2 className="text-xl font-bold text-[#0f172a]">
                        All Products <span className="text-gray-400 font-medium ml-2">({products.length})</span>
                    </h2>
                    <div className="flex gap-2">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 cursor-not-allowed">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                        </div>
                    </div>
                </div>

                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12"
                >
                    <AnimatePresence>
                        {products.map((product, idx) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={product.id}
                                className="group relative flex flex-col h-full"
                            >
                                <div className="relative aspect-[4/5] bg-gray-50 rounded-[40px] overflow-hidden flex items-center justify-center p-10 transition-all duration-500 group-hover:bg-gray-100 group-hover:shadow-2xl group-hover:shadow-gray-200">
                                    <button className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur-md rounded-full p-3 shadow-sm hover:bg-red-50 hover:text-red-500 transition-all duration-300">
                                        <Heart className="w-5 h-5" />
                                    </button>

                                    {product.offer_applied && (
                                        <div className="absolute top-6 left-6 z-10">
                                            <span className="bg-[#4C7C3C] text-white text-[11px] font-black px-4 py-2 rounded-2xl shadow-lg uppercase tracking-wider">
                                                {type === "offers" && categoryOfferValue
                                                    ? `${categoryOfferValue}%`
                                                    : `${product.offer_value ?? product.discount}%`} OFF
                                            </span>
                                        </div>
                                    )}

                                    <img
                                        src={product.image}
                                        alt={product.product_name}
                                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                                    />

                                    <Link
                                        href={`/product/${product.id}`}
                                        className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100"
                                    >
                                        <span className="bg-white text-[#0f172a] px-6 py-2.5 rounded-full font-bold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                            View Details
                                        </span>
                                    </Link>
                                </div>

                                <div className="pt-8 px-2 flex flex-col flex-1">
                                    <Link href={`/product/${product.id}`}>
                                        <h3 className="text-lg font-bold text-[#0f172a] mb-2 line-clamp-2 min-h-[56px] group-hover:text-[#4C7C3C] transition-colors leading-snug cursor-pointer">
                                            {product.product_name}
                                        </h3>
                                    </Link>

                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="text-2xl font-black text-[#0f172a]">
                                            ₹{product.final_price}
                                        </span>
                                        <span className="text-sm text-gray-400 line-through font-bold">
                                            ₹{product.regular_price}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="w-full bg-[#4C7C3C] text-white py-4 rounded-2xl font-bold hover:bg-[#3d6330] transition-all duration-300 transform active:scale-95 shadow-lg shadow-green-900/10 hover:shadow-green-900/20"
                                    >
                                        Add To Cart
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {products.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32 bg-gray-50 rounded-[60px] border-2 border-dashed border-gray-200"
                    >
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                        <h2 className="text-3xl font-black text-[#0f172a]">No items found</h2>
                        <p className="text-gray-500 mt-3 text-lg font-medium">We couldn't find any products in this collection right now.</p>
                        <button
                            onClick={() => router.push('/shope')}
                            className="mt-10 bg-[#4C7C3C] text-white px-10 py-4 rounded-2xl font-black hover:bg-[#3d6330] transition-all shadow-xl shadow-green-900/10"
                        >
                            Browse All Products
                        </button>
                    </motion.div>
                )}
            </div>

            <ShopMoreCTA />
            </div>

            <CartToast
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
            <Footer />
        </section>
    );
};

export default ProductListingPage;