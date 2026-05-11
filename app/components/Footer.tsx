import React from 'react';
import { Twitter, Facebook, Instagram, Send } from 'lucide-react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-1 mb-4">
              <span className="text-2xl font-bold text-[#4C7C3C]">fresh</span>
              <span className="text-2xl font-bold text-[#FF8424]">mart</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Fresh Mart brings you fresh and healthy groceries, making it easier to eat clean and live better every day.
            </p>
          </div>

          {/* Fresh Mart Links */}
          <div className="md:col-span-1">
            <h3 className="text-base font-bold text-gray-900 mb-4">Fresh Mart</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-[#4C7C3C] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shope" className="text-sm text-gray-600 hover:text-[#4C7C3C] transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/offers" className="text-sm text-gray-600 hover:text-[#4C7C3C] transition-colors">
                  Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Center Links */}
          <div className="md:col-span-1">
            <h3 className="text-base font-bold text-gray-900 mb-4">Help Center</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help-center#contact-form" className="text-sm text-gray-600 hover:text-[#4C7C3C] transition-colors">
                  Contact us
                </Link>
              </li>
              <li>
                <Link href="/help-center" className="text-sm text-gray-600 hover:text-[#4C7C3C] transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/help-center#contact-form" className="text-sm text-gray-600 hover:text-[#4C7C3C] transition-colors">
                  Report issue
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="md:col-span-1">
            <h3 className="text-base font-bold text-gray-900 mb-4">Social Media</h3>
            <div className="flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-[#4C7C3C] transition-all text-gray-600 hover:text-white"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-[#4C7C3C] transition-all text-gray-600 hover:text-white"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-[#4C7C3C] transition-all text-gray-600 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-[#4C7C3C] transition-all text-gray-600 hover:text-white"
                aria-label="Telegram"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-600">
              ©2025-Fresh Mart | All Rights Reserved
            </p>

            {/* Footer Links */}
            <div className="flex items-center gap-4">
              <Link href="/return-policy" className="text-sm text-gray-600 hover:text-[#4C7C3C] transition-colors">
                Return policy
              </Link>
              <span className="text-gray-400">|</span>
              <Link href="/privacy-policy" className="text-sm text-gray-600 hover:text-[#4C7C3C] transition-colors">
                Privacy policy
              </Link>
              <span className="text-gray-400">|</span>
              <Link href="/terms" className="text-sm text-gray-600 hover:text-[#4C7C3C] transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;