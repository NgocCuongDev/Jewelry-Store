// app/(site)/gio-hang/page.js - ĐÃ SỬA LỖI
"use client";

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  MapPin,
  CreditCard,
  Shield,
  Truck,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Home,
  Diamond,
  Gem,
  Sparkles,
  Award,
  Crown
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
// import { createOrder } from "../api/apiOrder"; // Đã dời sang trang /thanh-toan

// 💎 FloatingItem Luxury cho Giỏ hàng
const FloatingItem = ({ icon: Icon, delay = 0, size = 20, top = "50%", left = "50%", springX, springY, factor = 1 }) => {
  const x = useTransform(springX, [0, 1], [-30 * factor, 30 * factor]);
  const y = useTransform(springY, [0, 1], [-30 * factor, 30 * factor]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 0.4, 0.2, 0.4, 0],
        scale: [0.8, 1.1, 0.8],
        rotate: [0, 180, 0]
      }}
      style={{ top, left, x, y }}
      transition={{ duration: 10, repeat: Infinity, delay, ease: "easeInOut" }}
      className="absolute pointer-events-none"
    >
      <Icon size={size} className="text-amber-500/20" />
    </motion.div>
  );
};

export default function CartPage() {
  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    decreaseQty, 
    clearCart, 
    cartInitialized,
    navigateToCheckout,
    getCartId
  } = useCart();
  
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    note: ""
  });

  const router = useRouter();
  const subtotal = cart.reduce((sum, p) => sum + p.price * p.qty, 0);
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  // 🎯 QUÁN TÍNH CHUỘT
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { damping: 30, stiffness: 100 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 100 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 🎯 THÊM KIỂM TRA CART INITIALIZED
  useEffect(() => {
    if (!cartInitialized) {
      console.log("⏳ Cart chưa được khởi tạo, đang chờ...");
      return;
    }

    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      }));
    }
  }, [user, cartInitialized]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🎯 SỬA LẠI: Thực hiện tạo đơn hàng ngay tại đây để không làm đứt gãy luồng
  // 🎯 CHUYỂN HƯỚNG SANG TRANG THANH TOÁN CHUYÊN BIỆT
  const handleCheckout = () => {
    navigateToCheckout();
  };

  // 🎯 HIỂN THỊ LOADING TRONG KHI CHƯA INITIALIZED
  if (!cartInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải giỏ hàng...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50">
      {/* LUXURY HERO SECTION */}
      <section className="relative bg-neutral-950 pt-24 pb-20 overflow-hidden border-b border-amber-500/10 mb-12">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[120px]"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(245,158,11,0.1),_transparent_70%)]"></div>
        </div>

        {/* Floating Gems */}
        <FloatingItem icon={Diamond} size={30} top="20%" left="15%" springX={springX} springY={springY} factor={1.2} />
        <FloatingItem icon={Gem} size={25} top="60%" left="10%" springX={springX} springY={springY} factor={0.8} />
        <FloatingItem icon={Sparkles} size={20} top="15%" left="80%" springX={springX} springY={springY} factor={1.5} />
        <FloatingItem icon={Diamond} size={22} top="65%" left="85%" springX={springX} springY={springY} factor={0.6} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div 
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 px-4 py-1 rounded-full mb-6 border border-amber-500/20"
            >
              <ShoppingBag size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Premium Shopping Cart</span>
            </motion.div>

            <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-5xl md:text-6xl font-serif text-white mb-6"
            >
              Giỏ Hàng <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600 italic">Của Bạn</span>
            </motion.h1>

            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.3 }}
               className="flex items-center gap-6 text-neutral-400 text-sm font-light"
            >
              <Link href="/" className="hover:text-amber-500 transition-colors flex items-center gap-2">
                <ArrowLeft size={16} /> Tiếp tục mua sắm
              </Link>
              {isAuthenticated && (
                <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                  <User size={16} className="text-amber-500" />
                  Xin chào, <span className="text-white font-medium">{user?.name}</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {cart.length === 0 ? (
          <EmptyCartState />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Cart Items & Customer Info */}
            <div className="xl:col-span-2 space-y-8">
              {/* Cart Items */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <ShoppingBag className="w-6 h-6 text-green-500" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Sản phẩm đã chọn ({cart.length})
                    </h2>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {cart.map((item, idx) => (
                    <CartItem
                      key={`${item.id}-${item.variant || "default"}-${idx}`}
                      item={item}
                      onIncrease={() => addToCart({
                        ...item,
                        qty: 1
                      })}
                      onDecrease={() => decreaseQty(item.id, item.variant)}
                      onRemove={() => removeFromCart(item.id, item.variant)}
                    />
                  ))}
                </div>

                {/* NÚT XÓA TOÀN BỘ GIỎ HÀNG */}
                <div className="p-6 border-t border-gray-100">
                  <button
                    onClick={() => {
                      if (window.confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
                        clearCart();
                      }
                    }}
                    className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa toàn bộ giỏ hàng
                  </button>
                </div>
              </div>

               {/* Customer Information - LUXURY FORM STYLE */}
              <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden">
                <div className="p-8 border-b border-neutral-100 bg-neutral-50/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-neutral-900">Thông tin nhận hàng</h2>
                      <p className="text-sm text-neutral-500">Mọi thông tin sẽ được bảo mật tuyệt đối</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center text-xs font-black text-neutral-500 uppercase tracking-widest mb-3">
                        Họ và tên *
                      </label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-amber-500 transition-colors" />
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                          placeholder="Nhập họ và tên"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center text-xs font-black text-neutral-500 uppercase tracking-widest mb-3">
                        Email *
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-amber-500 transition-colors" />
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                          placeholder="Nhập email"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-xs font-black text-neutral-500 uppercase tracking-widest mb-3">
                      Số điện thoại *
                    </label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-amber-500 transition-colors" />
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                        placeholder="Nhập số điện thoại"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-xs font-black text-neutral-500 uppercase tracking-widest mb-3">
                      Địa chỉ nhận hàng *
                    </label>
                    <div className="relative group">
                      <Home className="absolute left-4 top-5 w-4 h-4 text-neutral-400 group-focus-within:text-amber-500 transition-colors" />
                      <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium resize-none"
                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                        rows="3"
                        required
                      />
                    </div>
                    {user?.address && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-amber-600 mt-2 flex items-center gap-1 font-bold">
                        <Shield size={12} /> HỆ THỐNG ĐÃ TỰ ĐỘNG ĐIỀN ĐỊA CHỈ ĐỊNH DANH CỦA BẠN
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center text-xs font-black text-neutral-500 uppercase tracking-widest mb-3">
                      Ghi chú đơn hàng (tuỳ chọn)
                    </label>
                    <textarea
                      name="note"
                      value={form.note}
                      onChange={handleChange}
                      rows="3"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium resize-none shadow-inner"
                      placeholder="Gợi ý: Chỉ dẫn giao hàng, quà biếu..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <OrderSummary
                subtotal={subtotal}
                shippingFee={shippingFee}
                total={total}
                cartLength={cart.length}
                isAuthenticated={isAuthenticated}
                loading={loading}
                onCheckout={handleCheckout} // 🎯 SỬ DỤNG navigateToCheckout
                showCheckoutButton={true}
                showLoginButton={true}
                compact={false}
              />

              {/* Trust Badges */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">Bảo mật giao dịch</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Truck className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Miễn phí vận chuyển</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-medium text-gray-700">Thanh toán an toàn</span>
                  </div>
                </div>
              </div>

              {/* Mobile Checkout Button */}
              <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tổng cộng</p>
                    <p className="text-lg font-bold text-green-600">{total.toLocaleString("vi-VN")}₫</p>
                  </div>
                  <button
                    onClick={handleCheckout} // 🎯 SỬ DỤNG navigateToCheckout
                    disabled={loading || !isAuthenticated}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${!isAuthenticated
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl"
                      }`}
                  >
                    {loading ? 'Đang xử lý...' : 'Thanh toán'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Component cho giỏ hàng trống
function EmptyCartState() {
  return (
    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h3>
        <p className="text-gray-500 mb-8">
          Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá cửa hàng và tìm những sản phẩm tuyệt vời!
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <ShoppingBag className="w-5 h-5 mr-3" />
          Khám phá sản phẩm
        </Link>
      </div>
    </div>
  );
}

// Component CartItem Luxury Style
function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-8 hover:bg-neutral-50/80 transition-all border-b border-neutral-100 last:border-0 group"
    >
      <div className="flex items-center space-x-6">
        {/* Product Image - Jewelry Frame */}
        <div className="relative w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-neutral-100 border border-neutral-200 group-hover:border-amber-500/30 transition-colors shadow-inner">
          <img
            src={item.image || "/images/placeholder.png"}
            alt={item.name}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/10 to-transparent"></div>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0 py-2">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-serif text-lg text-neutral-900 line-clamp-1 group-hover:text-amber-600 transition-colors uppercase tracking-tight">
              {item.name}
            </h3>
            <button
              onClick={onRemove}
              className="p-2 text-neutral-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {item.variant && (
              <span className="text-[10px] bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded font-black uppercase tracking-widest">{item.variant}</span>
            )}
            {item.attributes_full?.map((attr, idx) => (
              <span key={idx} className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded font-black uppercase tracking-widest">
                {attr.attribute_name}: {attr.value}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 bg-neutral-100/50 p-1 rounded-full border border-neutral-200">
              <button
                onClick={onDecrease}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:text-amber-600 shadow-sm active:scale-90 transition-all border border-neutral-100"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center font-black text-neutral-700 text-sm">{item.qty}</span>
              <button
                onClick={onIncrease}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:text-amber-600 shadow-sm active:scale-90 transition-all border border-neutral-100"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            
            <div className="text-right">
              <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest mb-1">Thành tiền</p>
              <p className="text-xl font-serif font-bold text-neutral-900">
                {(item.price * item.qty).toLocaleString("vi-VN")}₫
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Component OrderSummary Luxury Upgrade
function OrderSummary({ 
  subtotal, 
  shippingFee, 
  total, 
  cartLength, 
  isAuthenticated, 
  loading, 
  onCheckout,
  showCheckoutButton = true,
  showLoginButton = true,
  compact = false
}) {
  const { navigateToCheckout, canCheckout } = useCart();

  return (
    <div className={`bg-neutral-900 rounded-3xl shadow-2xl p-8 border border-white/10 text-white ${!compact ? 'sticky top-6' : ''}`}>
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
        <Award className="text-amber-500 w-6 h-6" />
        <h2 className="font-serif text-2xl">Đại Lộ Thanh Toán</h2>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between text-neutral-400 font-light">
          <span>Tạm tính ({cartLength} sản phẩm)</span>
          <span className="font-medium text-white">{subtotal.toLocaleString("vi-VN")}₫</span>
        </div>

        <div className="flex justify-between text-neutral-400 font-light">
          <span>Phí bảo hiểm vận chuyển</span>
          <span className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">
            {shippingFee === 0 ? 'Đặc quyền Miễn phí' : `${shippingFee.toLocaleString("vi-VN")}₫`}
          </span>
        </div>

        <div className="pt-6 border-t border-white/5">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.3em] mb-1">Tổng giá trị</p>
              <p className="text-3xl font-serif font-bold text-amber-500">
                {total.toLocaleString("vi-VN")}₫
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.3em] mb-1">Thuế VAT</p>
              <p className="text-sm text-neutral-300 italic">Đã bao gồm</p>
            </div>
          </div>
        </div>
      </div>

      {!isAuthenticated && showLoginButton && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
          <p className="text-amber-200 text-[11px] text-center font-medium leading-relaxed">
            Mở khóa đặc quyền thanh toán bằng cách{" "}
            <Link href="/dang-nhap" className="text-amber-500 font-black underline underline-offset-4">Đăng nhập</Link>
          </p>
        </div>
      )}

      {showCheckoutButton && (
        <div className="space-y-4">
          <button
            onClick={onCheckout || navigateToCheckout}
            disabled={loading || !isAuthenticated || !canCheckout()}
            className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all duration-500 relative overflow-hidden group ${
              !isAuthenticated || !canCheckout()
                ? "bg-neutral-800 text-neutral-600 grayscale cursor-not-allowed"
                : "bg-amber-500 text-neutral-950 hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:-translate-y-1"
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
              <CreditCard size={16} />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </button>
          
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="flex flex-col items-center gap-1">
                <Shield size={14} className="text-amber-500" />
                <span className="text-[8px] uppercase font-black">Secure</span>
             </div>
             <div className="flex flex-col items-center gap-1 border-x border-white/5">
                <Truck size={14} className="text-amber-500" />
                <span className="text-[8px] uppercase font-black">Luxury Ship</span>
             </div>
             <div className="flex flex-col items-center gap-1">
                <Crown size={14} className="text-amber-500" />
                <span className="text-[8px] uppercase font-black">Premium</span>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}