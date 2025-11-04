import type { Metadata } from "next";
import "./globals.css";
import Navigation from "../components/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "GoMart - Ghana's Premier E-commerce Platform",
  description: "Shop quality products from verified vendors across Ghana. Electronics, Fashion, Home & Garden, and more!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main className="min-h-screen pt-6 pb-14">
          <div className="container mx-auto px-4 space-y-10">
            {children}
          </div>
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
        <footer className="bg-[rgba(7,13,24,0.94)] text-white border-t border-[rgba(255,255,255,0.05)]">
          <div className="ghana-ribbon" />
          <div className="container mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
            <div className="space-y-3">
              <h3 className="text-3xl font-extrabold tracking-tight">GoMart</h3>
              <p className="text-sm text-gray-300">Ghana's trusted online marketplace connecting buyers to verified vendors across all 16 regions.</p>
              <div className="flex items-center gap-3 text-xs text-gray-400 uppercase tracking-[0.25em]">
                <span>SHOP</span>
                <span>SELL</span>
                <span>GROW</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase text-gray-400 mb-3">Quick Links</h4>
              <ul className="space-y-2 text-gray-200 text-sm">
                <li><a href="/ui/products/list" className="hover:text-white">Shop Products</a></li>
                <li><a href="/ui/vendors/list" className="hover:text-white">Browse Vendors</a></li>
                <li><a href="/ui/categories/list" className="hover:text-white">Explore Categories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase text-gray-400 mb-3">Support</h4>
              <ul className="space-y-2 text-gray-200 text-sm">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Delivery & Returns</a></li>
                <li><a href="#" className="hover:text-white">Secure Payments</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm uppercase text-gray-400">Payment Methods</h4>
              <p className="text-gray-200 text-sm leading-relaxed">
                MTN Mobile Money • Vodafone Cash • AirtelTigo Money • Bank Transfer (Coming soon)
              </p>
              <div className="flex gap-2 text-xs text-gray-400 uppercase tracking-[0.22em]">
                <span className="pill">🇬🇭 Mobile Money</span>
              </div>
            </div>
          </div>
          <div className="border-t border-[rgba(255,255,255,0.05)] py-6 text-center text-gray-500 text-sm">
            <p>&copy; 2025 GoMart. Built proudly in Ghana 🇬🇭</p>
          </div>
        </footer>
      </body>
    </html>
  );
}





