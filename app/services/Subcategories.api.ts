import api from "@/app/config/api.config"
import {Subcategorie} from "@/app/types/Subcategorie"

export const GetSubcategories = async () : Promise<Subcategorie[]> => {
    const res = await api.get("/subcategory/");
    return res.data;
}