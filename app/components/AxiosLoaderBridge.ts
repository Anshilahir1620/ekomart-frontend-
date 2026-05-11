"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useGlobalLoader } from "./GlobalLoaderProvider";
import { injectLoader } from "@/app/config/api.config";

const AxiosLoaderBridge = () => {
  const { startLoading, stopLoading } = useGlobalLoader();
  const pathname = usePathname();

  useEffect(() => {
    injectLoader(startLoading, stopLoading);
  }, [startLoading, stopLoading]);

  useEffect(() => {
    // Reset loader when pathname changes to close any manual navigation loaders
    stopLoading();
  }, [pathname]);

  return null;
};

export default AxiosLoaderBridge;