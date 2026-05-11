"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ShoppingCart, 
  Zap, 
  ShieldCheck, 
  Truck, 
  RefreshCcw, 
  Star, 
  ChevronRight,
  Heart,
  Share2,
  Info
} from "lucide-react";
import { getProductById } from "@/app/services/Products.api";
import { addToCart } from "@/app/utils/cart";
import { useGlobalLoader } from "@/app/components/GlobalLoaderProvider";
import CartToast from "@/app/components/CartToast";

const ProductDetail = ({ id }: { id: string }) => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const router = useRouter();
  const { startLoading, stopLoading } = useGlobalLoader();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(parseInt(id));
        if (data) {
          setProduct(data);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Failed to fetch product", err);
        setError("Something went wrong while loading the product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    // Add to cart multiple times if quantity > 1
    for (let i = 0; i < quantity; i++) {
        addToCart(product);
    }
    
    setShowToast(true);
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    // Store in a separate key for Buy Now flow to isolate it from the main cart
    const buyNowItem = { 
      ...product, 
      quantity: quantity,
      final_price: product.final_price ?? product.sale_price 
    };
    localStorage.setItem("buy_now_item", JSON.stringify(buyNowItem));
    
    startLoading();
    router.push("/Chekout?mode=buy_now");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#4C7C3C] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Oops!</h2>
          <p className="text-gray-500 font-medium mb-8">{error || "Product not found"}</p>
          <button 
            onClick={() => router.push("/")}
            className="w-full py-4 bg-[#4C7C3C] text-white rounded-2xl font-bold hover:bg-[#3d6330] transition-all shadow-lg shadow-green-900/20"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const discountPercentage = product.offer_value || 0;
  const hasDiscount = product.offer_applied && discountPercentage > 0;

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-20">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400">
          <button onClick={() => router.push("/")} className="hover:text-[#4C7C3C] transition-colors">Home</button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => router.push(`/shope?category=${product.category}`)} className="hover:text-[#4C7C3C] transition-colors line-clamp-1">{product.category}</button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#4C7C3C] line-clamp-1">{product.product_name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* LEFT: IMAGE SECTION */}
          <div className="space-y-6">
            <div className="relative aspect-square bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-2xl shadow-gray-200/50 group">
              {hasDiscount && (
                <div className="absolute top-6 left-6 z-10 bg-red-500 text-white font-black text-sm px-4 py-2 rounded-2xl shadow-lg shadow-red-500/30 uppercase tracking-widest animate-bounce">
                  {discountPercentage}% OFF
                </div>
              )}
              
              <button className="absolute top-6 right-6 z-10 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-red-50 hover:text-red-500 transition-all text-gray-400 group/heart">
                <Heart className="w-6 h-6 transition-transform group-hover/heart:scale-110" />
              </button>

              <img 
                src={product.image} 
                alt={product.product_name}
                className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            {/* Thumbnail Placeholder (if more images were available) */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {[1,2,3].map((i) => (
                    <div key={i} className={`w-24 h-24 rounded-3xl border-2 flex-shrink-0 cursor-pointer transition-all ${i === 1 ? 'border-[#4C7C3C] bg-white' : 'border-transparent bg-gray-100 hover:bg-white'}`}>
                        <img src={product.image} className="w-full h-full object-contain p-2 opacity-60" />
                    </div>
                ))}
            </div>
          </div>

          {/* RIGHT: DETAILS SECTION */}
          <div className="flex flex-col">
            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-4 py-1.5 bg-green-50 text-[#4C7C3C] text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-green-100">
                {product.type}
              </span>
              <span className="px-4 py-1.5 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-orange-100">
                {product.brand}
              </span>
              {product.is_coupon_eligible && (
                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-blue-100 flex items-center gap-1.5">
                    <Zap className="w-3 h-3" />
                    Coupon Eligible
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] mb-4 uppercase tracking-tighter">
              {product.product_name}
            </h1>

            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-1 bg-yellow-400 text-white px-3 py-1 rounded-xl shadow-md shadow-yellow-400/20">
                <Star className="w-4 h-4 fill-white" />
                <span className="font-black text-sm">{product.rating || "4.5"}</span>
              </div>
              <span className="text-gray-400 font-bold text-sm uppercase tracking-widest underline decoration-[#4C7C3C]/30 underline-offset-4 cursor-pointer hover:text-[#4C7C3C] transition-colors">
                128 Reviews
              </span>
            </div>

            {/* Price Section */}
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 mb-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-green-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
               
               <div className="relative z-10">
                    <div className="flex items-baseline gap-4 mb-2">
                        <span className="text-5xl font-black text-[#4C7C3C] tracking-tighter">
                            ₹{product.final_price}
                        </span>
                        {hasDiscount && (
                            <span className="text-xl text-gray-300 font-bold line-through">
                                ₹{product.original_price || product.regular_price}
                            </span>
                        )}
                    </div>
                    
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest">
                        Inclusive of all taxes
                    </p>
               </div>
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 group hover:bg-white hover:shadow-lg transition-all">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Weight</p>
                    <p className="text-gray-900 font-black">{product.weight}g</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 group hover:bg-white hover:shadow-lg transition-all">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Size</p>
                    <p className="text-gray-900 font-black">{product.size}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 group hover:bg-white hover:shadow-lg transition-all">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Life</p>
                    <p className="text-gray-900 font-black">{product.life || "12 Months"}</p>
                </div>
            </div>

            {/* Description */}
            <div className="mb-10">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#4C7C3C]" />
                    Product Description
                </h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                    {product.description}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
                {/* Quantity Selector */}
                <div className="flex items-center justify-between bg-white border-2 border-gray-100 rounded-2xl p-2 min-w-[140px]">
                    <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center font-black text-gray-400 hover:text-[#4C7C3C] transition-colors"
                    >
                        -
                    </button>
                    <span className="font-black text-gray-900">{quantity}</span>
                    <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center font-black text-gray-400 hover:text-[#4C7C3C] transition-colors"
                    >
                        +
                    </button>
                </div>

                <button 
                    onClick={handleAddToCart}
                    className="flex-1 py-5 bg-white border-2 border-[#4C7C3C] text-[#4C7C3C] rounded-2xl font-black uppercase tracking-wider hover:bg-green-50 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                    <ShoppingCart className="w-5 h-5" />
                    Add To Cart
                </button>

                <button 
                    onClick={handleBuyNow}
                    className="flex-1 py-5 bg-[#4C7C3C] text-white rounded-2xl font-black uppercase tracking-wider hover:bg-[#3d6330] shadow-xl shadow-green-900/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                    <Zap className="w-5 h-5 fill-white" />
                    Buy Now
                </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-gray-100">
                <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-[#4C7C3C] group-hover:bg-[#4C7C3C] group-hover:text-white transition-all">
                        <Truck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-900 uppercase tracking-tighter">Fast Shipping</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Within 24 Hours</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                        <RefreshCcw className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-900 uppercase tracking-tighter">Free Returns</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Within 30 Days</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-900 uppercase tracking-tighter">Secure Payments</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">100% Encrypted</p>
                    </div>
                </div>
            </div>
          </div>

        </div>
      </div>

      <CartToast isVisible={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default ProductDetail;
