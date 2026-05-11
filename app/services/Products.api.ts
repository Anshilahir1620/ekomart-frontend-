import api from "@/app/config/api.config"
import { UserProduct } from "@/app/types/Product";

export const getProducts = async (): Promise<UserProduct[]> => {
  const res = await api.get("/product/");
  return res.data;
};

export const getProductById = async (id: number): Promise<UserProduct> => {
  const res = await api.get(`/product/${id}`);
  return res.data;
};
