"use client";

import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  Truck, 
  CreditCard, 
  Box, 
  User, 
  Tag, 
  Mail, 
  Phone, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  ShieldCheck,
  RefreshCcw,
  Leaf,
  Headphones,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';

const faqs = [
  {
    question: "How can I track my order?",
    answer: "You can track your order by going to the 'My Orders' section in your profile. Once your order is dispatched, you will also receive a tracking link via SMS and email."
  },
  {
    question: "How long do refunds take?",
    answer: "Refunds are typically processed within 24-48 hours after the return is picked up and verified. The amount may take 5-7 business days to reflect in your original payment method."
  },
  {
    question: "Can I cancel my order?",
    answer: "Yes, you can cancel your order as long as it hasn't been dispatched yet. Go to 'My Orders', select the order, and click on 'Cancel Order'."
  },
  {
    question: "What if product is damaged?",
    answer: "If you receive a damaged or incorrect product, please report it within 24 hours of delivery. You can use the 'Report Issue' option in your order details or contact our support."
  },
  {
    question: "How do I apply coupons?",
    answer: "You can apply coupons during the checkout process. Enter your coupon code in the 'Have a coupon?' field and click 'Apply' to see the discounted price."
  },
  {
    question: "How do I contact support?",
    answer: "You can reach us through the 'Contact Support' section below, email us at ekomart67@gmail.com, or call us at our support number during business hours."
  }
];

const supportCards = [
  {
    title: "Order Support",
    description: "Track, manage, or cancel your orders effortlessly.",
    icon: <Package className="w-8 h-8 text-[#4C7C3C]" />,
  },
  {
    title: "Delivery Help",
    description: "Get updates on your delivery status and timings.",
    icon: <Truck className="w-8 h-8 text-[#4C7C3C]" />,
  },
  {
    title: "Payments & Refunds",
    description: "Help with refunds, failed payments, and invoices.",
    icon: <CreditCard className="w-8 h-8 text-[#4C7C3C]" />,
  },
  {
    title: "Product Issues",
    description: "Report damaged items or quality concerns.",
    icon: <Box className="w-8 h-8 text-[#4C7C3C]" />,
  },
  {
    title: "Account Support",
    description: "Manage your profile, addresses, and security.",
    icon: <User className="w-8 h-8 text-[#4C7C3C]" />,
  },
  {
    title: "Offers & Coupons",
    description: "Learn about active deals and how to use coupons.",
    icon: <Tag className="w-8 h-8 text-[#4C7C3C]" />,
  }
];

const trustItems = [
  { icon: <Truck className="w-5 h-5" />, label: "Fast Delivery" },
  { icon: <ShieldCheck className="w-5 h-5" />, label: "Secure Payments" },
  { icon: <RefreshCcw className="w-5 h-5" />, label: "Easy Refunds" },
  { icon: <Leaf className="w-5 h-5" />, label: "Fresh Products" },
  { icon: <Headphones className="w-5 h-5" />, label: "Customer Support" },
];

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left focus:outline-none group"
      >
        <span className={`text-base font-medium transition-colors ${isOpen ? 'text-[#4C7C3C]' : 'text-gray-900 group-hover:text-[#4C7C3C]'}`}>
          {question}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-[#4C7C3C]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-[#4C7C3C]" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-gray-600 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function HelpCenterPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    orderId: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await axios.post('/api/contact', formState);
      if (response.data.success) {
        setStatus('success');
        setFormState({ name: '', email: '', orderId: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs items={[{ label: 'Help Center' }]} />
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-transparent -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight"
          >
            How can we <span className="text-[#4C7C3C]">help you</span> today?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10"
          >
            We’re here to help with orders, delivery, refunds, payments, and account support.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a 
              href="#contact-form" 
              className="px-8 py-3 bg-[#4C7C3C] text-white font-semibold rounded-full hover:bg-[#3d6330] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Contact Support
            </a>
            <a 
              href="mailto:ekomart67@gmail.com" 
              className="px-8 py-3 bg-white text-[#4C7C3C] border-2 border-[#4C7C3C]/20 font-semibold rounded-full hover:bg-green-50 transition-all"
            >
              Email Us
            </a>
          </motion.div>
        </div>
      </section>

      {/* 2. QUICK SUPPORT CARDS */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {supportCards.map((card, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="mb-5 p-4 rounded-2xl bg-green-50 w-fit group-hover:bg-[#4C7C3C]/10 transition-colors">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CONTACT SUPPORT SECTION */}
      <section className="py-16 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white shadow-sm border border-gray-100 text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <Mail className="w-6 h-6 text-[#4C7C3C]" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Email Support</h4>
              <p className="text-gray-600 mb-4">ekomart67@gmail.com</p>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Response within 24 hours</p>
            </div>
            <div className="p-8 rounded-3xl bg-white shadow-sm border border-gray-100 text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <Phone className="w-6 h-6 text-[#4C7C3C]" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Phone Support</h4>
              <p className="text-gray-600 mb-4">+91 98765 43210</p>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Mon - Sun, 9 AM – 9 PM</p>
            </div>
            <div className="p-8 rounded-3xl bg-white shadow-sm border border-gray-100 text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#4C7C3C]" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Support Timings</h4>
              <p className="text-gray-600 mb-4">9:00 AM to 9:00 PM</p>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Available 7 days a week</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SEND PROBLEM FORM */}
      <section id="contact-form" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Send us a message</h2>
            <p className="text-gray-600">Have a specific issue? Fill out the form below and we'll get back to you.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#4C7C3C] focus:ring-4 focus:ring-[#4C7C3C]/5 outline-none transition-all"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#4C7C3C] focus:ring-4 focus:ring-[#4C7C3C]/5 outline-none transition-all"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Order ID (Optional)</label>
                <input
                  type="text"
                  placeholder="#EKM12345"
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#4C7C3C] focus:ring-4 focus:ring-[#4C7C3C]/5 outline-none transition-all"
                  value={formState.orderId}
                  onChange={(e) => setFormState({ ...formState, orderId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Subject</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Refund Status"
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#4C7C3C] focus:ring-4 focus:ring-[#4C7C3C]/5 outline-none transition-all"
                  value={formState.subject}
                  onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Message</label>
              <textarea
                required
                rows={5}
                placeholder="How can we help you today?"
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#4C7C3C] focus:ring-4 focus:ring-[#4C7C3C]/5 outline-none transition-all resize-none"
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
              />
            </div>

            <button
              disabled={status === 'loading'}
              type="submit"
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg ${
                status === 'loading' 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                : 'bg-[#4C7C3C] text-white hover:bg-[#3d6330] hover:shadow-xl active:scale-[0.98]'
              }`}
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Support Request'
              )}
            </button>

            <AnimatePresence>
              {status === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 rounded-xl bg-green-50 border border-green-100 flex items-center gap-3 text-green-800"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <p className="font-medium">Your support request has been sent successfully.</p>
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-800"
                >
                  <AlertCircle className="w-5 h-5" />
                  <p className="font-medium">Something went wrong. Please try again later.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="py-20 bg-gray-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Quick answers to common questions about our services.</p>
          </div>
          <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. TRUST SECTION */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {trustItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[#4C7C3C] group-hover:bg-[#4C7C3C] group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <span className="text-sm font-bold text-gray-700 uppercase tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FOOTER CTA SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[40px] bg-gradient-to-r from-[#4C7C3C] to-[#3d6330] p-10 md:p-16 text-center overflow-hidden">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Still need help?</h2>
              <p className="text-green-50 text-lg mb-10 max-w-xl mx-auto">
                Our support team is always ready to assist you. Get in touch with us for any queries or concerns.
              </p>
              <button 
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-4 bg-white text-[#4C7C3C] font-bold rounded-2xl hover:bg-green-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Contact Support Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
