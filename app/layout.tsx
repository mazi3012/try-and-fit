import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/top-nav";
import { BottomNav } from "@/components/bottom-nav";
import { CartProvider } from "@/lib/cart-context";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TryAndFit",
  description: "AI-powered virtual try-on frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased`}
    >
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <div className="page-shell">
            <TopNav />
            <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 md:pb-10">
              {children}
            </main>
            <BottomNav />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
