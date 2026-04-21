// app/(site)/_components/Header.js
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useMenu } from "../context/MenuContext";
import {
  Search, Heart, User, ShoppingCart, DoubleChevronDown,
  Menu, X, LogOut, ChevronRight, Diamond, Crown, MapPin, Phone, Sparkles
} from "lucide-react";
import DynamicMenu from "./DynamicMenu";
import SearchBar from "./SearchBar";

import { CATALOG_IMAGE_URL, USER_IMAGE_URL } from "../../config";

export default function Header() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { menus } = useMenu();
  const { user, logout, isAuthenticated } = useAuth();
  const cartCount = cart.reduce((sum, p) => sum + p.qty, 0);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🎯 Hàm lấy avatar URL
  const getAvatarUrl = (avatar) => {
    if (!avatar) return "/images/default-avatar.png";
    if (avatar.startsWith('http')) return avatar;
    // Remove "images/" prefix if exists to match API serving from /images/**
    const cleanAvatar = avatar.replace(/^images\//, '').replace(/^\/+/, '');
    return `${USER_IMAGE_URL}${cleanAvatar}`;
  };

  const handleLogout = async () => {
    try {
      await logout();
      clearCart();
      toast.success("Hẹn gặp lại bạn!");
      setUserDropdownOpen(false);
      setMobileMenuOpen(false);
      router.push("/");
    } catch (error) {
      toast.error("Đăng xuất thất bại!");
    }
  };

  const handleAccountClick = () => {
    if (isAuthenticated) setUserDropdownOpen(!userDropdownOpen);
    else router.push("/dang-nhap");
  };

  return (
    <header className="w-full sticky top-0 z-[100]">
      {/* Top Utility Bar - Tự động ẩn khi cuộn */}
      <div className={`bg-green-900 text-green-100 border-b border-white/10 hidden md:block transition-all duration-300 overflow-hidden ${isScrolled ? "max-h-0 py-0 opacity-0 border-none" : "max-h-10 py-2 opacity-100"
        }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-medium">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
              <MapPin size={12} /> Cửa hàng: 123 Luxury St, VN
            </span>
            <span className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
              <Phone size={12} /> Hotline: 1900 8888
            </span>
          </div>
          <div className="flex items-center gap-6 italic">
            <span>Giao hàng miễn phí cho đơn hàng trên 50Tr₫</span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className={`transition-all duration-300 border-b ${isScrolled
        ? "bg-green-950/95 backdrop-blur-2xl py-3 border-white/5 shadow-2xl"
        : "bg-green-800 py-6 border-white/10"
        }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 gap-8">

          {/* Logo Area */}
          <Link href="/" className="flex items-center gap-4 group shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700"></div>
              <Image
                src="/images/logo.png"
                alt="NNC Luxury Logo"
                width={70}
                height={70}
                className="relative object-contain rounded-full border border-white/20 group-hover:border-white transition-colors duration-500 shadow-xl"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-serif font-black tracking-tighter text-white">
                <span className="text-yellow-400">NNC</span> JEWELRY
              </span>
              <span className="text-[9px] uppercase tracking-[0.4em] text-green-100 font-bold mt-1">
                The Essence of Luxury
              </span>
            </div>
          </Link>

          {/* Search bar - Integrated Component (Desktop) */}
          <div className="flex-1 max-w-2xl hidden lg:block">
            <SearchBar />
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-4 md:gap-7">

            {/* Wishlist */}
            <button className="hidden sm:flex flex-col items-center gap-1.5 text-green-100 hover:text-white transition-all group">
              <div className="relative">
                <Heart size={22} strokeWidth={1.5} className="group-hover:fill-white" />
                <span className="absolute -top-1.5 -right-2 bg-yellow-400 text-green-900 text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-green-800">
                  3
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest hidden xl:block">Yêu thích</span>
            </button>

            {/* Profile / Account */}
            <div className="relative">
              <button
                onClick={handleAccountClick}
                className="flex flex-col items-center gap-1.5 text-green-100 hover:text-white transition-all group"
              >
                {isAuthenticated && user ? (
                  <img
                    src={getAvatarUrl(user.image)}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white/50 group-hover:border-yellow-400 transition-all shadow-lg ring-2 ring-green-900/10"
                  />
                ) : (
                  <div className="p-1 px-3 bg-white/10 rounded-full border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2">
                    <User size={18} strokeWidth={2} />
                    <span className="text-[10px] uppercase font-black tracking-widest hidden xl:block">Đăng nhập</span>
                  </div>
                )}
                {isAuthenticated && (
                  <span className="text-[10px] uppercase font-black tracking-widest hidden xl:block ml-2 text-yellow-400">
                    {user.username}
                  </span>
                )}
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && isAuthenticated && (
                <div className="absolute top-full right-0 mt-4 w-72 bg-white shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 border border-green-100">
                  <div className="p-6 bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-center relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl"></div>

                    <img
                      src={getAvatarUrl(user.image)}
                      alt={user.username}
                      className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-yellow-400/50 shadow-2xl ring-4 ring-green-950/20"
                    />
                    <h3 className="font-sans font-black text-white text-2xl tracking-tighter mb-1 flex items-center justify-center gap-2 drop-shadow-xl">
                      <Sparkles size={16} className="text-yellow-400 animate-pulse" />
                      {user.username.toUpperCase()}
                    </h3>
                    <p className="text-[10px] text-green-200 uppercase font-black tracking-[0.2em] opacity-80 mb-4">{user.email || 'Hội viên NNC'}</p>
                    <div className="inline-flex items-center gap-2 bg-yellow-400 text-green-950 text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest shadow-lg">
                      <Crown size={12} fill="currentColor" /> Premium Member
                    </div>
                  </div>
                  <div className="p-3 grid gap-1">
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 rounded-xl transition-all" onClick={() => setUserDropdownOpen(false)}>
                      <User size={18} className="text-green-600" /> Hồ sơ cá nhân
                    </Link>
                    <Link href="/don-hang" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 rounded-xl transition-all" onClick={() => setUserDropdownOpen(false)}>
                      <ShoppingCart size={18} className="text-green-600" /> Lịch sử mua hàng
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-all mt-1">
                      <LogOut size={18} /> Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart */}
            <Link href="/gio-hang" className="flex flex-col items-center gap-1.5 text-green-100 hover:text-white transition-all group">
              <div className="relative">
                <ShoppingCart size={22} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-yellow-400 text-green-900 text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-green-800 animate-bounce">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest hidden xl:block">Giỏ hàng</span>
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden bg-white/10 text-white p-2.5 rounded-xl hover:bg-yellow-400 hover:text-green-900 transition-all ring-1 ring-white/20"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation (Desktop) - Brighten it up */}
      <nav className="hidden lg:block bg-green-50/90 backdrop-blur-md border-b border-green-100">
        <div className="max-w-7xl mx-auto">
          <DynamicMenu variant="desktop" />
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[110px] bg-green-950/98 backdrop-blur-2xl z-[90] lg:hidden animate-in fade-in duration-300 overflow-y-auto">
          <div className="p-6 pb-24 space-y-8">

            {/* Mobile Search */}
            <div className="py-4 border-b border-white/10">
              <p className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.3em] mb-4">Bạn đang tìm gì?</p>
              <SearchBar />
            </div>

            {/* Combined Mobile Menu */}
            <div className="space-y-2">
              <DynamicMenu
                variant="mobile"
                onItemClick={() => setMobileMenuOpen(false)}
              />
            </div>

            {/* Mobile Footer / Auth */}
            {!isAuthenticated && (
              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/10">
                <Link
                  href="/dang-nhap"
                  className="py-4 text-center text-white font-bold bg-white/10 rounded-2xl hover:bg-white/20 transition-all border border-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/dang-ky"
                  className="py-4 text-center text-green-900 font-bold bg-yellow-400 rounded-2xl hover:bg-yellow-500 transition-all shadow-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tham gia Hội viên
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}