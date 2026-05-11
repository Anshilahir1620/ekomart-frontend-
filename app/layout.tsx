import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalHeader from "./components/ConditionalHeader";
import { GlobalLoaderProvider } from "./components/GlobalLoaderProvider";
import AxiosLoaderBridge from "./components/AxiosLoaderBridge"; 
import SessionManager from "./components/SessionManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ekomart | Secure Shopping",
  description: "Next Generation eCommerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalLoaderProvider>
          <AxiosLoaderBridge />
          <SessionManager />
          <ConditionalHeader />
          {children}
        </GlobalLoaderProvider>
      </body>
    </html>
  );
}