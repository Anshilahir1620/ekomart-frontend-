"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingCart, User, Globe, ChevronDown } from 'lucide-react';
import { useGlobalLoader } from './GlobalLoaderProvider';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser } from '@/app/services/UserService'
import { logoutUser } from '@/app/services/AuthService';
import { searchEverything, SearchResults } from '@/app/services/SearchService';
import { Loader2 } from 'lucide-react';

type HeaderUser = {
  id: number;
  name: string;
  profile_photo?: string;
};

const Header: React.FC = () => {
  const [user, setUser] = useState<HeaderUser | null>(null);
  const [isSticky, setIsSticky] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState<string>('home');
  const [cartnumber, setCartNumber] = useState(0);
  const [username, setUsername] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { startLoading } = useGlobalLoader();
  const router = useRouter();
  const pathname = usePathname();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults>({ products: [], categories: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);



  useEffect(() => {
    setIsMounted(true);

    const updateCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const total = cart.reduce(
          (acc: number, item: any) => acc + (item.quantity || 0),
          0
        );
        setCartNumber(total);
      } catch (e) {
        console.error("Cart parse error", e);
        setCartNumber(0);
      }
    };

    const loadUser = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) return;

        const parsedUser = JSON.parse(userStr);

        if (!parsedUser?.id) return;

        const data = await getCurrentUser(parsedUser.id);

        setUser({
          id: data.id!,
          name: data.name,
          profile_photo: data.profile_photo,
        });

        setUsername(data.name || "User");

        localStorage.setItem("user", JSON.stringify(data));
      } catch (error) {
        console.error("User load failed", error);
      }
    };

    const updateProfile = () => {
      try {
        const userStr = localStorage.getItem("user");

        if (userStr) {
          const user = JSON.parse(userStr);
          setUsername(user.name || "User");

          setUser({
            id: user.id,
            name: user.name,
            profile_photo: user.profile_photo,
          });
        } else {
          setUsername(null);
          setUser(null);
        }
      } catch (e) {
        console.error("User parse error", e);
      }
    };

    updateCart();
    updateProfile();
    loadUser();

    window.addEventListener("cartUpdated", updateCart);
    window.addEventListener("userUpdated", updateProfile);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
      window.removeEventListener("userUpdated", updateProfile);
    };
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    if (pathname === '/') setActiveMenu('home');
    else if (pathname === '/shope') setActiveMenu('shope');
    else if (pathname === '/offers') setActiveMenu('offers');
    else if (pathname === '/help-center') setActiveMenu('help-center');

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchEverything(searchTerm);
          setSearchResults(results);
          setShowResults(true);
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults({ products: [], categories: [] });
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchBar = document.getElementById('search-bar-container');
      if (searchBar && !searchBar.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="border-b border-gray-200">
        <div className="px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">
                <span className="text-[#4C7C3C]">fresh</span>
                <span className="text-[#FF8424]">mart</span>
              </h1>
            </div>

            <div id="search-bar-container" className="flex-1 max-w-2xl mx-8 relative">
              <div className="relative">
                {isSearching ? (
                  <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4C7C3C] w-5 h-5 animate-spin" />
                ) : (
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                )}
                <input
                  type="text"
                  placeholder="Search products, categories or brands..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4C7C3C] focus:border-transparent text-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
                />
              </div>

              {showResults && (searchTerm.length >= 2) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-[100] max-h-[480px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4">
                    {searchResults.products.length === 0 && searchResults.categories.length === 0 && !isSearching && (
                      <div className="text-center py-8 text-gray-500">
                        <p className="font-medium">No results found for "{searchTerm}"</p>
                        <p className="text-sm">Try checking your spelling or use more general terms.</p>
                      </div>
                    )}

                    {searchResults.categories.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Categories</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {searchResults.categories.map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/shope?category=${cat.id}`}
                              onClick={() => { setShowResults(false); startLoading(); }}
                              className="flex items-center gap-3 p-2 hover:bg-green-50 rounded-lg transition-colors group"
                            >
                              <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                {cat.image ? (
                                  <img src={`https://ekomart-backend-production.up.railway.app/public/categories/${cat.image}`} alt={cat.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[#4C7C3C]">
                                    <Globe className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                              <span className="text-sm font-bold text-gray-700 group-hover:text-[#4C7C3C]">{cat.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.products.length > 0 && (
                      <div>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Products</h3>
                        <div className="space-y-1">
                          {searchResults.products.map((prod) => (
                            <Link
                              key={prod.id}
                              href={`/product/${prod.id}`}
                              onClick={() => { setShowResults(false); startLoading(); }}
                              className="flex items-center justify-between p-2 hover:bg-green-50 rounded-lg transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                  {prod.image ? (
                                    <img 
                                      src={prod.image} 
                                      alt={prod.name} 
                                      className="w-full h-full object-cover" 
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=No+Image';
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                      <Search className="w-6 h-6" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-gray-800 group-hover:text-[#4C7C3C] line-clamp-1">{prod.name}</span>
                                  <span className="text-xs text-gray-500">{prod.category}</span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  { (searchResults.products.length > 0 || searchResults.categories.length > 0) && (
                    <div className="border-t border-gray-100 p-3 bg-gray-50 rounded-b-xl">
                      <button 
                        onClick={() => { setShowResults(false); router.push(`/shope?q=${searchTerm}`); }}
                        className="w-full py-2 text-sm font-black text-center text-[#4C7C3C] hover:underline"
                      >
                        View all results for "{searchTerm}"
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-6">
              <button className="flex items-center space-x-1 text-gray-700 transition-colors hover:[&>*]:text-[#4C7C3C]">
                <Globe className="w-5 h-5 transition-colors" />
                <span className="text-sm font-medium transition-colors">EN</span>
                <ChevronDown className="w-4 h-4 transition-colors" />
              </button>

              <button className="relative text-gray-700 hover:text-[#4C7C3C] transition-colors">
                <Heart className="w-6 h-6" />
              </button>

              <button
                onClick={() => { startLoading(); router.push('/cart'); }}
                className="relative text-gray-700 hover:text-[#4C7C3C] transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {isMounted && cartnumber > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#4C7C3C] text-white text-[10px] rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center font-bold shadow-sm border border-white">
                    {cartnumber}
                  </span>
                )}
              </button>

              {!isMounted ? (
                <div className="flex items-center space-x-2 text-gray-700 opacity-50">
                  <User className="w-6 h-6" />
                  <span className="text-sm font-medium">Loading...</span>
                </div>
              ) : username ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/orders"
                    onClick={() => startLoading()}
                    className="hidden md:block text-[11px] font-black text-[#4C7C3C] border border-[#4C7C3C] px-3 py-1.5 rounded-lg hover:bg-[#4C7C3C] hover:text-white transition-all uppercase tracking-tight"
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => startLoading()}
                    className="flex items-center space-x-4 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center group-hover:bg-green-50 transition-colors">

                      {user?.profile_photo ? (
                        <img
                          src={
                            user.profile_photo.startsWith("http")
                              ? user.profile_photo
                              : `https://ekomart-backend-production.up.railway.app/public/profile/${user.profile_photo}`
                          }
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-700 group-hover:text-[#4C7C3C] transition-colors" />
                      )}

                    </div>
                    <span className="text-sm font-bold text-gray-900 transition-colors group-hover:text-[#4C7C3C] capitalize">
                      {username}
                    </span>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    href={`/login?callbackUrl=${pathname}`} 
                    className="flex items-center space-x-2 text-gray-700 transition-colors hover:text-[#4C7C3C] font-bold text-sm"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="bg-[#4C7C3C] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#3d6330] transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>



      <nav className={`bg-white border-b border-gray-200 transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-lg' : ''
        }`}>
        <div className="px-4">
          <ul className="flex items-center justify-center space-x-8 py-4">
            <li>
              <Link
                href="/"
                onClick={(e) => { setActiveMenu('home'); startLoading(); }}
                className={`${activeMenu === 'home' ? 'text-[#4C7C3C] font-semibold border-b-2 border-[#4C7C3C] pb-1' : 'text-gray-700 hover:text-[#4C7C3C] font-medium'} transition-colors`}
              >
                Home
              </Link>
            </li>
            <li className="relative group">
              <Link
                href="/shope"
                onClick={() => { setActiveMenu('shope'); startLoading(); }}
                className={`${activeMenu === 'shope'
                  ? 'text-[#4C7C3C] font-semibold border-b-2 border-[#4C7C3C] pb-1'
                  : 'text-gray-700 hover:text-[#4C7C3C] font-medium'
                  } transition-colors`}
              >
                Shope
              </Link>

              <div className={`absolute left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg z-50`}>
                <ul className="py-2 min-w-55">
                  <li><a href="/shop/fruits" className="block px-4 py-2 text-gray-700 hover:bg-neutral-light hover:text-[#4C7C3C]">Fruits</a></li>
                  <li><a href="/shop/vegetables" className="block px-4 py-2 text-gray-700 hover:bg-neutral-light hover:text-[#4C7C3C]">Vegetables</a></li>
                  <li><a href="/shop/beverages" className="block px-4 py-2 text-gray-700 hover:bg-neutral-light hover:text-[#4C7C3C]">Beverages</a></li>
                </ul>
              </div>
            </li>
            <li className="relative group">
              <Link
                href="/offers"
                onClick={(e) => {
                  setActiveMenu(activeMenu === 'offers' ? 'home' : 'offers');
                  startLoading();
                }}
                className={`${activeMenu === 'offers' ? 'text-[#4C7C3C] font-semibold border-b-2 border-[#4C7C3C] pb-1' : 'text-gray-700 hover:text-[#4C7C3C] font-medium'} transition-colors`}
              >
                Offers
              </Link>
              <div className={`absolute left-1/2 -translate-x-1/2 mt-2 ${activeMenu === 'offers' ? 'block' : 'hidden group-hover:block'} bg-white border border-gray-200 rounded-lg shadow-lg z-50`}>
                <ul className="py-2 min-w-55">
                  <li><Link href="/offers" onClick={() => startLoading()} className="block px-4 py-2 text-gray-700 hover:bg-neutral-light hover:text-[#4C7C3C]">Daily Deals</Link></li>
                </ul>
              </div>
            </li>
            <li>
              <Link
                href="/help-center"
                onClick={() => { setActiveMenu('help-center'); startLoading(); }}
                className={`${activeMenu === 'help-center' ? 'text-[#4C7C3C] font-semibold border-b-2 border-[#4C7C3C] pb-1' : 'text-gray-700 hover:text-[#4C7C3C] font-medium'} transition-colors`}
              >
                Help Center
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {isSticky && <div className="h-15"></div>}
    </header>
  );
};

export default Header;