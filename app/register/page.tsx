"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, User, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { registerUser, loginUser } from "../services/AuthService";
import { useGlobalLoader } from "../components/GlobalLoaderProvider";

const RegisterPage = () => {
    const router = useRouter();
    const { startLoading, stopLoading } = useGlobalLoader();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    ``
    // Validation States
    const validations = {
        minLength: formData.password.length >= 8,
        hasUpper: /[A-Z]/.test(formData.password),
        hasLower: /[a-z]/.test(formData.password),
        hasNumber: /[0-9]/.test(formData.password),
    };

    const isFormValid =
        formData.name.length >= 2 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
        Object.values(validations).every(v => v);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        setError(null);
        setIsLoading(true);
        startLoading();

        try {
            // 1. Register
            await registerUser(formData);

            // 2. Auto-login
            const loginResponse = await loginUser({
                username: formData.name,
                password: formData.password
            });

            // 3. Store tokens and user
            localStorage.setItem("token", loginResponse.access_token);
            localStorage.setItem("refresh_token", loginResponse.refresh_token);
            localStorage.setItem("user", JSON.stringify(loginResponse.user));

            // Trigger header update
            window.dispatchEvent(new Event("userUpdated"));

            // 4. Redirect to home
            router.replace("/");
            setTimeout(() => router.refresh(), 100);

        } catch (err: any) {
            console.error("Registration/Login failed:", err);
            setError(err.response?.data?.detail || err.response?.data?.message || "Registration failed. This email or name might already be taken.");
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
                className="w-full max-w-lg"
            >
                {/* Back Link */}
                <button
                    onClick={() => router.push("/")}
                    className="mb-8 flex items-center gap-2 text-gray-500 hover:text-[#4C7C3C] transition-colors font-bold group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Store
                </button>

                <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/60 border border-gray-100 overflow-hidden relative">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#4C7C3C] to-[#86b46d]" />

                    <div className="p-8 md:p-12">
                        {/* Header */}
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-green-50 mb-6 shadow-inner">
                                <UserPlus className="w-10 h-10 text-[#4C7C3C]" />
                            </div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3 uppercase">Join Freshmart</h1>
                            <p className="text-gray-500 font-medium">Create your account to start shopping fresh</p>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name Field */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 ml-1 uppercase tracking-widest">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4C7C3C] transition-colors">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Your Name"
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:bg-white focus:border-[#4C7C3C] outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 ml-1 uppercase tracking-widest">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4C7C3C] transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            placeholder="you@email.com"
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:bg-white focus:border-[#4C7C3C] outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 ml-1 uppercase tracking-widest">Create Password</label>
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
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                {/* Password Requirements */}
                                <div className="grid grid-cols-2 gap-2 mt-4 px-1">
                                    <ValidationItem label="8+ Characters" active={validations.minLength} />
                                    <ValidationItem label="Uppercase (A-Z)" active={validations.hasUpper} />
                                    <ValidationItem label="Lowercase (a-z)" active={validations.hasLower} />
                                    <ValidationItem label="Number (0-9)" active={validations.hasNumber} />
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="flex items-start gap-2 ml-1">
                                <input type="checkbox" id="terms" required className="mt-1 w-4 h-4 rounded-md accent-[#4C7C3C] border-gray-300 cursor-pointer" />
                                <label htmlFor="terms" className="text-xs font-bold text-gray-500 leading-relaxed cursor-pointer select-none">
                                    By signing up, you agree to our <Link href="#" className="text-[#4C7C3C] hover:underline">Terms of Service</Link> and <Link href="#" className="text-[#4C7C3C] hover:underline">Privacy Policy</Link>.
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading || !isFormValid}
                                className="w-full py-5 bg-[#4C7C3C] text-white rounded-2xl font-black text-lg hover:bg-[#3d6330] transition-all shadow-xl shadow-green-900/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wider mt-4"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5 fill-current" />
                                        Register Now
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-gray-500 font-bold">
                                Already have an account?{" "}
                                <Link href="/login" className="text-[#4C7C3C] font-black hover:underline">Sign In Instead</Link>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center gap-6 opacity-30">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-gray-500" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Your data is secure and encrypted</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const ValidationItem = ({ label, active }: { label: string, active: boolean }) => (
    <div className={`flex items-center gap-2 transition-colors duration-300 ${active ? "text-[#4C7C3C]" : "text-gray-300"}`}>
        <CheckCircle2 className={`w-4 h-4 ${active ? "opacity-100" : "opacity-30"}`} />
        <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
    </div>
);

export default RegisterPage;
