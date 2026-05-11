"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-[14px] text-gray-500 py-4 px-4 md:px-0">
      <Link 
        href="/" 
        className="flex items-center gap-1 hover:text-[#4C7C3C] transition-colors"
      >
        <Home className="w-4 h-4" />
        Home
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
          {item.href ? (
            <Link 
              href={item.href} 
              className="hover:text-[#4C7C3C] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-semibold truncate">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
