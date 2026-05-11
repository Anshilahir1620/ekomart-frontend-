import api from "@/app/config/api.config"

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  mobile: string;
  city: string;
  state: string;
  pincode: string;
  address: string;
  profile_photo?: string;
  role_id?: number;
  status?: number;
}


export const getCurrentUser = async (user_id:number): Promise<UserProfile> => {
  const res = await api.get(`/users/${user_id}`);
  console.log("USer data ::" , res.data)
  return res.data;
};

export const updateUserProfile = async (userId: number, data: UserProfile): Promise<UserProfile> => {
  const res = await api.put(`/users/update/${userId}`, data);
  return res.data;
};





