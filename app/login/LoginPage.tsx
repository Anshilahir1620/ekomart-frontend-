"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, User, Lock, Eye, EyeOff, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { loginUser } from "../services/AuthService";
import { useGlobalLoader } from "../components/GlobalLoaderProvider";

const LoginPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { startLoading, stopLoading } = useGlobalLoader();
    
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Get the redirect path from query params or localStorage, fallback to home
    const [callbackUrl, setCallbackUrl] = useState("/");

    useEffect(() => {
        const url = searchParams.get("callbackUrl") || localStorage.getItem("redirectAfterLogin") || "/";
        setCallbackUrl(url);
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        startLoading();

        try {
            const response = await loginUser(formData);
            
            // Store tokens and user data
            localStorage.setItem("token", response.access_token);
            localStorage.setItem("refresh_token", response.refresh_token);
            localStorage.setItem("user", JSON.stringify(response.user));
            
            // Clear redirect path
            localStorage.removeItem("redirectAfterLogin");
            
            // Trigger header update
            window.dispatchEvent(new Event("userUpdated"));
            
            // Success!
            router.replace(callbackUrl);
            setTimeout(() => router.refresh(), 100);
        } catch (err: any) {
            console.error("Login failed:", err);
            setError(err.response?.data?.message || err.response?.data?.detail || "Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
            stopLoading();
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-4 py-20 font-sans">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Back to Site */}
                <button 
                    onClick={() => router.push("/")}
                    className="mb-8 flex items-center gap-2 text-gray-500 hover:text-[#4C7C3C] transition-colors font-bold group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Store
                </button>

                <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/60 border border-gray-100 overflow-hidden relative">
                    {/* Decorative Top Bar */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#4C7C3C] to-[#86b46d]" />

                    <div className="p-8 md:p-12">
                        {/* Header */}
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-green-50 mb-6 shadow-inner">
                                <ShieldCheck className="w-10 h-10 text-[#4C7C3C]" />
                            </div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3 uppercase">Welcome Back</h1>
                            <p className="text-gray-500 font-medium">Log in to your account to continue shopping</p>
                        </div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl text-center shadow-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username Field */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 ml-1 uppercase tracking-widest">Username / Name</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4C7C3C] transition-colors">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input 
                                        type="text"
                                        required
                                        placeholder="Enter your name"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:bg-white focus:border-[#4C7C3C] outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                                        value={formData.username}
                                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Password</label>
                                    <Link href="#" className="text-xs font-black text-[#4C7C3C] hover:underline uppercase tracking-widest">Forgot?</Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4C7C3C] transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:bg-white focus:border-[#4C7C3C] outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center gap-2 ml-1">
                                <input type="checkbox" id="remember" className="w-4 h-4 rounded-md accent-[#4C7C3C] border-gray-300 cursor-pointer" />
                                <label htmlFor="remember" className="text-sm font-bold text-gray-600 cursor-pointer select-none">Remember my login</label>
                            </div>

                            {/* Submit Button */}
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-5 bg-[#4C7C3C] text-white rounded-2xl font-black text-lg hover:bg-[#3d6330] transition-all shadow-xl shadow-green-900/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wider"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Authenticating...
                                    </>
                                ) : "Sign In Now"}
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-gray-500 font-bold">
                                New to Freshmart?{" "}
                                <Link href="/register" className="text-[#4C7C3C] font-black hover:underline">Create an Account</Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Badges */}
                <div className="mt-12 flex flex-col items-center gap-6 opacity-30">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Secure 256-bit SSL Encrypted Connection</p>
                    <div className="flex items-center justify-center gap-8 grayscale">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;