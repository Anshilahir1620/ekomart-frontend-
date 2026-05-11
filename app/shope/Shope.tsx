'use client';

import React, { useEffect, useState } from 'react';
import { Heart, ChevronDown, ChevronUp, Grid, List, ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/app/types/Product';
import { Categorie } from '@/app/types/Categorie';
import { Subcategorie } from '@/app/types/Subcategorie';
import { getProducts } from '@/app/services/Products.api';
import { getCategories } from '@/app/services/Categories.api';
import { GetSubcategories } from '@/app/services/Subcategories.api';
import {addToCart} from '../utils/cart'
import CartToast from '../components/CartToast';
import Breadcrumbs from '../components/Breadcrumbs';
import Link from 'next/link';
import { useGlobalLoader } from '../components/GlobalLoaderProvider';
import Footer from '../components/Footer';

export default function ShopPage() {
  const router = useRouter();
  const { startLoading } = useGlobalLoader();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [subcategories, setSubCategories] = useState<Subcategorie[]>([]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);

  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [currentPage, setCurrentPage] = useState(1);
  const searchParams = useSearchParams();
  const [showToast, setShowToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  const itemsPerPage = 8;

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
    getCategories().then((cats) => {
      setCategories(cats);
      const catId = searchParams.get('category');
      const q = searchParams.get('q');
      
      if (catId) {
        const cat = cats.find(c => String(c.id) === catId);
        if (cat) setSelectedCategories([cat.name]);
      }
      if (q) setSearchQuery(q.toLowerCase());
    }).catch(console.error);
    GetSubcategories().then(setSubCategories).catch(console.error);
  }, [searchParams]);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(prev => (prev === name ? null : name));
  };

  const toggleFilter = (
    type: 'category' | 'subcategory',
    value: string
  ) => {
    if (type === 'category') {
        setSelectedCategories(prev =>
        prev.includes(value)
          ? prev.filter(v => v !== value)
          : [...prev, value]
      );
    }

    if (type === 'subcategory') {
      setSelectedSubCategories(prev =>
        prev.includes(value)
          ? prev.filter(v => v !== value)
          : [...prev, value]
      );
    }
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setPriceRange({ min: 0, max: 1000 });
    setCurrentPage(1);
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredProducts = products.filter(p => {
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(p.category);

    const subCategoryMatch =
      selectedSubCategories.length === 0 ||
      selectedSubCategories.includes(p.type);

    const priceMatch =
      p.sale_price >= priceRange.min &&
      p.sale_price <= priceRange.max;

    const searchMatch = 
      !searchQuery || 
      p.product_name.toLowerCase().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery);

    return categoryMatch && subCategoryMatch && priceMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setShowToast(false);
    setTimeout(() => setShowToast(true), 10);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1">
      <div className="max-w-7xl mx-auto px-4">
        <Breadcrumbs items={[{ label: 'Shop' }]} />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 uppercase">
            {selectedCategories[0] || 'Shop'}
          </h1>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-50 text-gray-700 font-bold hover:bg-gray-100 hover:text-[#4C7C3C] transition-all active:scale-95 group border border-gray-100"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back
          </button>
        </div>

        <div className="flex justify-between flex-wrap gap-4 mb-8">
          <div className="flex gap-3 flex-wrap text-sm text-gray-700">
            {[
              { key: 'category', label: 'Categories' },
              { key: 'subcategory', label: 'Product type' },
              { key: 'price', label: 'Price range' }
            ].map(({ key, label }) => (
              <div key={key} className="relative">
                <button
                  onClick={() => toggleDropdown(key)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {label}
                  {openDropdown === key ? (
                    <ChevronUp className="w-4 h-4 text-[#4C7C3C]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#4C7C3C]" />
                  )}
                </button>

                {openDropdown === key && (
                  <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-56 z-50 p-2">
                    {key === 'category' &&
                      categories.map(c => (
                        <label
                          key={c.id}
                          className="flex gap-2 px-3 py-2 hover:bg-gray-50 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(c.name)}
                            onChange={() =>
                              toggleFilter('category', c.name)
                            }
                            className="accent-[#4C7C3C]"
                          />
                          <span className="text-sm text-gray-700">
                            {c.name}
                          </span>
                        </label>
                      ))}

                    {key === 'subcategory' &&
                      subcategories.map(sc => (
                        <label
                          key={sc.id}
                          className="flex gap-2 px-3 py-2 hover:bg-gray-50 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSubCategories.includes(sc.name)}
                            onChange={() =>
                              toggleFilter('subcategory', sc.name)
                            }
                            className="accent-[#4C7C3C]"
                          />
                          <span className="text-sm text-gray-700">
                            {sc.name}
                          </span>
                        </label>
                      ))}

                    {key === 'price' && (
                      <div className="space-y-3">
                        <input
                          type="range"
                          min="0"
                          max="500"
                          value={priceRange.min}
                          onChange={e =>
                            setPriceRange({
                              ...priceRange,
                              min: +e.target.value
                            })
                          }
                          className="w-full accent-[#4C7C3C]"
                        />
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          value={priceRange.max}
                          onChange={e =>
                            setPriceRange({
                              ...priceRange,
                              max: +e.target.value
                            })
                          }
                          className="w-full accent-[#4C7C3C]"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid'
                  ? 'bg-[#4C7C3C] text-white'
                  : 'hover:bg-gray-100'
                  }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list'
                  ? 'bg-[#4C7C3C] text-white'
                  : 'hover:bg-gray-100'
                  }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={resetFilters}
              className="text-gray-700 hover:text-[#4C7C3C]"
            >
              🔄 Reset
            </button>
          </div>
        </div>

        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          {paginatedProducts.map(product => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
            >
              <div className="relative bg-gray-50 h-56 flex items-center justify-center">
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:bg-gray-100"
                >
                  <Heart
                    className={`w-4 h-4 ${favorites.has(product.id)
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-400'
                      }`}
                  />
                </button>

                {product.offer_applied && (product.offer_value ?? 0) > 0 && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
                      {product.offer_value}% OFF
                    </span>
                  </div>
                )}

                <Link 
                  href={`/product/${product.id}`}
                  onClick={() => startLoading()}
                  className="w-full h-full flex items-center justify-center p-4"
                >
                  <img
                    src={product.image}
                    alt={product.product_name}
                    className="max-h-44 object-contain transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=No+Image';
                    }}
                  />
                </Link>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <Link 
                  href={`/product/${product.id}`}
                  onClick={() => startLoading()}
                >
                  <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[40px] hover:text-[#4C7C3C] transition-colors cursor-pointer">
                    {product.product_name}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{product.final_price ?? product.sale_price}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.regular_price}
                  </span>
                </div>

                <button onClick={() => handleAddToCart(product)}
                  className="mt-auto w-full py-2 rounded-lg border border-[#4C7C3C] text-[#4C7C3C] font-medium hover:bg-[#4C7C3C] hover:text-white transition-colors"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg border transition
                ${currentPage === i + 1
                  ? 'bg-[#4C7C3C] text-white border-[#4C7C3C]'
                  : 'text-[#4C7C3C] border-[#4C7C3C] hover:bg-[#4C7C3C] hover:text-white'
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      </div>
      <CartToast isVisible={showToast} onClose={() => setShowToast(false)} />
      <Footer />
    </div>
  );
}
