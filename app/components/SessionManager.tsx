"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isTokenExpired, clearAuthSession } from "../utils/authCleanup";

/**
 * SessionManager Component
 * Monitors auth token status on app mount and route changes.
 */
const SessionManager = () => {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Check if token is expired
    if (isTokenExpired()) {
      // If we have a token but it's expired, clear it
      const token = localStorage.getItem("token");
      if (token) {
        console.warn("🔐 Session expired. Cleaning up storage...");
        clearAuthSession();
      }
    }
  }, [pathname]); // Re-run on route changes

  return null; // This component doesn't render anything
};

export default SessionManager;
