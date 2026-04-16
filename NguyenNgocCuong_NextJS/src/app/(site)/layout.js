// app/(site)/layout.js
"use client";
import Header from "./_components/Header"
import Footer from "./_components/Footer"
import BannerSlider from "./_components/BannerSlider"
import { usePathname } from "next/navigation";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { MenuProvider } from "./context/MenuContext";

export default function SiteLayout({ children }) {
  const pathname = usePathname();

  return (
    <AuthProvider>
      <CartProvider>
        <MenuProvider>
          <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 
                          dark:from-gray-900 dark:via-gray-950 dark:to-black 
                          text-gray-800 dark:text-gray-100 transition-colors duration-500">

            {/* Hiệu ứng background sang trọng */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              {/* Gradient layer */}
              <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-400/20 via-cyan-400/10 to-transparent 
                              dark:from-emerald-600/20 dark:via-cyan-500/10 rounded-full blur-3xl opacity-60 animate-pulse" />
              <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-400/20 via-purple-400/10 to-transparent 
                              dark:from-indigo-600/20 dark:via-purple-500/10 rounded-full blur-3xl opacity-60 animate-pulse delay-1000" />
            </div>

            {/* Header */}
            <Header />

            {/* Banner chỉ hiện ở trang chủ */}
            {pathname === "/" && (
              <div className="relative z-10">
                <BannerSlider />
              </div>
            )}

            {/* Nội dung chính */}
            <main className="flex-1 relative z-10 max-w-[1400px] mx-auto w-full px-4 py-8">
              <div className="backdrop-blur-xl bg-white/40 dark:bg-gray-900/40 shadow-xl rounded-2xl p-4">
                {children}
              </div>
            </main>

            {/* Footer */}
            <Footer />
          </div>
        </MenuProvider>
      </CartProvider>
    </AuthProvider>
  );
}