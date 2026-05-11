import api from "../config/api.config";
import { clearAuthSession } from "../utils/authCleanup";

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface LoginData {
    username: string; // The backend expects 'username', which is the user's name
    password: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    user: {
        id: number;
        name: string;
        email: string;
        profile_photo?: string;
    };
}

export const registerUser = async (data: RegisterData) => {
    // POST /users/register
    // Note: Register response doesn't return tokens
    const response = await api.post("/users/register", data);
    return response.data;
};

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
    // The backend expects x-www-form-urlencoded for login
    const formData = new URLSearchParams();
    formData.append("username", data.username);
    formData.append("password", data.password);

    const response = await api.post("/auth/login", formData, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    return response.data;
};

export const logoutUser = () => {
    clearAuthSession();
};
