"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="bg-white border-b border-gray-100 py-4 px-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <button 
          onClick={handleBack}
          className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-700 hover:text-[#4C7C3C]"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 capitalize tracking-tight">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default PageHeader;
