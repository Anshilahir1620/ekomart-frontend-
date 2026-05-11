"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  User, Mail, Phone, MapPin, Building, Hash, Home,
  Camera, Save, LogOut, CheckCircle, Loader2, Settings, Shield, ShoppingBag
} from "lucide-react";
import { useRouter } from "next/navigation";
import PageHeader from "../components/PageHeader";
import { getCurrentUser, updateUserProfile, UserProfile } from "../services/UserService";
import axios from "axios";
import { logoutUser } from "../services/AuthService";
// Using UserProfile from ../services/UserService


const ProfilePage = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null); // ✅ added
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = localStorage.getItem("user");
        const parsedUser = data ? JSON.parse(data) : null;

        if (!parsedUser?.id) {
          router.push("/login");
          return;
        }

        const user = await getCurrentUser(parsedUser.id);

        setProfile(user);
        setOriginalProfile(user); // ✅ IMPORTANT

        localStorage.setItem("user", JSON.stringify(user));
      } catch (e) {
        console.error("Error loading user data", e);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleSave = async () => {
    if (!profile?.id || !originalProfile) return;

    const userId = profile.id;
    setIsSaving(true);

    try {
      const payload: any = {};

      Object.keys(profile).forEach((key) => {
        const k = key as keyof UserProfile;

        // ❗ skip image field
        if (k === "profile_photo") return;

        if (
          profile[k] !== originalProfile[k] &&
          profile[k] !== "" &&
          profile[k] !== null
        ) {
          payload[k] = profile[k];
        }
      });

      let updatedUser = profile;

      // ✅ update only changed fields
      if (Object.keys(payload).length > 0) {
        updatedUser = await updateUserProfile(userId, payload);
      }

      // ✅ upload image
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const token = localStorage.getItem("token");

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/users/upload-profile/${userId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // ❗ avoid mutation
        updatedUser = {
          ...updatedUser,
          profile_photo: res.data.image_url,
        };
      }

      setProfile(updatedUser);
      setOriginalProfile(updatedUser); // ✅ reset baseline

      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("userUpdated"));

      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);

    } catch (err: any) {
      console.error("Update failed", err);
      alert(err.response?.data?.detail || "Update failed. Please check your connection.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);

      const preview = URL.createObjectURL(file);

      setProfile(prev =>
        prev ? { ...prev, profile_photo: preview } : null
      );

      // optional cleanup
      setTimeout(() => URL.revokeObjectURL(preview), 1000);
    }
  };

  const handleLogout = () => {
    logoutUser();
    router.push("/");
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <Loader2 className="w-8 h-8 animate-spin text-[#4C7C3C]" />
      </div>
    );
  }

const imageUrl =
  profile.profile_photo?.startsWith("http")
    ? profile.profile_photo
    : profile.profile_photo
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/public/profile/${profile.profile_photo}`
      : undefined;

  console.log("PROFILE:", profile.profile_photo);
  console.log("FINAL:", imageUrl);
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A]">
      <PageHeader title="Profile Settings" />

      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="lg:col-span-4"
          >
            <div className="sticky top-32 space-y-12">

              <div className="flex flex-col items-center lg:items-start">
                <div className="relative group mb-8">
                  <div className="w-48 h-48 rounded-[40px] bg-white border border-gray-100 shadow-sm p-2 rotate-3 group-hover:rotate-0 transition-all duration-500">
                    <div className="w-full h-full rounded-[32px] overflow-hidden bg-gray-50 flex items-center justify-center">
                      {profile.profile_photo ? (
                        <img src={imageUrl} className="w-full h-full object-cover" alt="Profile" />
                      ) : (
                        <div className="text-4xl font-black text-[#4C7C3C]">
                          {profile.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                      )}
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-4 -right-4 w-14 h-14 bg-[#4C7C3C] text-white rounded-2xl shadow-xl border-4 border-[#FDFDFD] flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                  >
                    <Camera className="w-6 h-6" />
                  </button>
                </div>

                <div className="text-center lg:text-left space-y-2">
                  <h2 className="text-4xl font-bold tracking-tight">{profile?.name}</h2>
                  <p className="text-gray-400 font-medium">{profile?.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { icon: Settings, label: "Edit Profile", active: true },
                  { icon: ShoppingBag, label: "Order History", link: "/orders" },
                  { icon: Shield, label: "Security & Privacy" },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => item.link && router.push(item.link)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${item.active ? 'bg-[#4C7C3C] text-white shadow-lg shadow-green-900/10' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-bold text-sm tracking-wide">{item.label}</span>
                  </button>
                ))}
              </nav>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-6 py-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-2xl transition-all"
              >
                <LogOut className="w-5 h-5" />
                Sign Out Account
              </button>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, x: 20 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.2 } }
            }}
            className="lg:col-span-8"
          >
            <div className="bg-white rounded-[48px] p-12 lg:p-16 border border-gray-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-16">
                <div>
                  <h3 className="text-3xl font-bold tracking-tight mb-2">Account Details</h3>
                  <p className="text-gray-400 text-sm">Update your information to receive personalized offers.</p>
                </div>

                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`relative overflow-hidden group px-10 py-4 rounded-2xl text-white font-bold tracking-wide transition-all active:scale-95 ${isSaving ? 'bg-gray-300' : 'bg-[#4C7C3C] hover:shadow-2xl hover:shadow-green-900/20'}`}
                >
                  <AnimatePresence mode="wait">
                    {isSaving ? (
                      <motion.div key="saving" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Applying...</span>
                      </motion.div>
                    ) : (
                      <motion.div key="save" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="flex items-center gap-3">
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <div className="space-y-4">
                  <label className="flex items-center gap-3 text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">
                    <User className="w-4 h-4 text-[#4C7C3C]" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name || ""}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, name: e.target.value } : null)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-[24px] px-8 py-6 focus:ring-4 focus:ring-[#4C7C3C]/5 outline-none transition-all font-semibold text-lg"
                    placeholder="Full Name"
                  />
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-3 text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">
                    <Mail className="w-4 h-4 text-[#4C7C3C]" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email || ""}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, email: e.target.value } : null)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-[24px] px-8 py-6 focus:ring-4 focus:ring-[#4C7C3C]/5 outline-none transition-all font-semibold text-lg"
                  />
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-3 text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">
                    <Phone className="w-4 h-4 text-[#4C7C3C]" /> Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={profile.mobile || ""}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, mobile: e.target.value } : null)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-[24px] px-8 py-6 focus:ring-4 focus:ring-[#4C7C3C]/5 outline-none transition-all font-semibold text-lg"
                    placeholder="10-digit number"
                  />
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-3 text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">
                    <Building className="w-4 h-4 text-[#4C7C3C]" /> City
                  </label>
                  <input
                    type="text"
                    value={profile.city || ""}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, city: e.target.value } : null)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-[24px] px-8 py-6 focus:ring-4 focus:ring-[#4C7C3C]/5 outline-none transition-all font-semibold text-lg"
                  />
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-3 text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">
                    <MapPin className="w-4 h-4 text-[#4C7C3C]" /> State
                  </label>
                  <input
                    type="text"
                    value={profile.state || ""}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, state: e.target.value } : null)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-[24px] px-8 py-6 focus:ring-4 focus:ring-[#4C7C3C]/5 outline-none transition-all font-semibold text-lg"
                  />
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-3 text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">
                    <Hash className="w-4 h-4 text-[#4C7C3C]" /> Pincode
                  </label>
                  <input
                    type="text"
                    value={profile.pincode || ""}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, pincode: e.target.value } : null)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-[24px] px-8 py-6 focus:ring-4 focus:ring-[#4C7C3C]/5 outline-none transition-all font-semibold text-lg"
                  />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <label className="flex items-center gap-3 text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">
                    <Home className="w-4 h-4 text-[#4C7C3C]" /> Full Address
                  </label>
                  <textarea
                    rows={4}
                    value={profile.address || ""}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, address: e.target.value } : null)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-[32px] px-8 py-6 focus:ring-4 focus:ring-[#4C7C3C]/5 outline-none transition-all font-semibold text-lg resize-none"
                    placeholder="Enter your complete street address"
                  />
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-12 right-12 z-[100] bg-white text-[#1A1A1A] pr-10 pl-6 py-6 rounded-[32px] shadow-[0_48px_80px_-16px_rgba(0,0,0,0.15)] flex items-center gap-6 border border-gray-50"
          >
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-[#4C7C3C]">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <p className="font-bold text-xl tracking-tight">Changes Saved</p>
              <p className="text-sm text-gray-400 font-medium">Your profile is up to date.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;