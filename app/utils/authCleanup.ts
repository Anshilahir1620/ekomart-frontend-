

export const clearAuthSession = () => {
  if (typeof window === "undefined") return;

  const keysToClear = [
    "token",
    "refresh_token",
    "user",
    "addresses",
    "applied_coupon",
    "redirectAfterLogin",
    "buy_now_item",
    "checkout_data"
  ];

  keysToClear.forEach(key => localStorage.removeItem(key));

  sessionStorage.clear();

  localStorage.removeItem("cart");
  localStorage.removeItem("wishlist");

  window.dispatchEvent(new Event("userUpdated"));
  window.dispatchEvent(new Event("cartUpdated"));
  window.dispatchEvent(new Event("wishlistUpdated"));
  
  console.log("🔒 Auth session cleared and UI synced.");
  
  console.log("🔒 Auth session cleared and UI synced.");
};

export const isTokenExpired = (): boolean => {
  if (typeof window === "undefined") return true;
  
  const token = localStorage.getItem("token");
  if (!token) return true;

  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return true;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const { exp } = JSON.parse(jsonPayload);
    
    return (Date.now() / 1000) > (exp - 10);
  } catch (e) {
    return true;
  }
};
