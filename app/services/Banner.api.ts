
import {API_BASE_URL} from "@/app/config/api.config"
import { Banner } from "@/app/types/Banner";

export const getBanners = async (): Promise<Banner[]> => {
  const res = await fetch(`${API_BASE_URL}/banner/`);

  if (!res.ok) {
    throw new Error("Failed to fetch banners");
  }

  const data = await res.json();

  console.log("API Banner Response:", data); 

  return data;
};
