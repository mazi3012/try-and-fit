import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/top-nav";
import { BottomNav } from "@/components/bottom-nav";
import { CartProvider } from "@/lib/cart-context";
import { Footer } from "@/components/footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TryAndFit — Try Before You Buy",
  description: "AI-powered virtual fashion try-on. See how any outfit looks on you before purchasing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F7F7F7]">
        <CartProvider>
          <div className="page-shell flex flex-col min-h-screen">
            <TopNav />
            {/* Full-width main — pages control their own inner width */}
            <main className="flex-1 w-full pb-20 md:pb-6">
              {children}
            </main>
            <Footer />
            <BottomNav />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
