import api from "@/app/config/api.config";

export interface SearchProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  category: string;
}

export interface SearchCategory {
  id: number;
  name: string;
  image: string;
  slug: string;
}

export interface SearchResults {
  products: SearchProduct[];
  categories: SearchCategory[];
}

export const searchEverything = async (query: string): Promise<SearchResults> => {
  if (!query || query.trim().length < 2) {
    return { products: [], categories: [] };
  }
  
  const res = await api.get(`/search/?q=${encodeURIComponent(query)}`);
  return res.data;
};
