"use client";

import { createContext, useContext, useState } from "react";

const LoaderContext = createContext<any>(null);

export const GlobalLoaderProvider = ({ children }: any) => {
  const [loadingCount, setLoadingCount] = useState(0);

  const startLoading = () => {
    setLoadingCount((prev) => {
      return prev + 1;
    });
  };

  const stopLoading = () => {
    setLoadingCount((prev) => {
      const next = Math.max(prev - 1, 0);
      return next;
    });
  };

  const isLoading = loadingCount > 0;

  return (
    <LoaderContext.Provider value={{ startLoading, stopLoading, isLoading }}>
      {children}

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </LoaderContext.Provider>
  );
};

export const useGlobalLoader = () => useContext(LoaderContext);