// FILE PATH: wickwell/app/layout.tsx  (replace/create this file in your project)
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, Caveat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: { default: "WickWell — Scents that feel like you", template: "%s · WickWell" },
  description:
    "Hand-poured, non-toxic candles for every mood. Take the scent quiz and find your match.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // lets env(safe-area-inset-*) work on notched phones
  themeColor: "#3a0f14",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${caveat.variable}`}>
      <body className="min-h-screen antialiased">
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
          <BottomNav />
        </CartProvider>
      </body>
    </html>
  );
}