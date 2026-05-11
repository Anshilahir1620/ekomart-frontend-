import api from "@/app/config/api.config"
import { Categorie } from "@/app/types/Categorie";

export const getCategories = async (): Promise<Categorie[]> => {
  const res = await api.get("/category/");
  return res.data;
}