import axios from "axios";

export function isTokenExpired(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export async function initializeAuth() {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refresh_token");

  if (!token) return false;

  if (!isTokenExpired(token)) return true;

  if (refreshToken) {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
        {
          refresh_token: refreshToken,
        }
      );

      localStorage.setItem("token", res.data.access_token);
      return true;

    } catch {
      localStorage.clear();
      return false;
    }
  }

  localStorage.clear();
  return false;
}