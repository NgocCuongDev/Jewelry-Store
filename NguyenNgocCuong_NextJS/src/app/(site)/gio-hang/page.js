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
  Home
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    decreaseQty, 
    clearCart, 
    cartInitialized,
    navigateToCheckout 
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

  // 🎯 SỬA LẠI: Sử dụng navigateToCheckout để chuyển đến trang thanh toán
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Tiếp tục mua sắm
            </Link>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Giỏ Hàng
            </h1>
            <p className="text-gray-500 mt-2">Quản lý sản phẩm và thanh toán</p>
          </div>

          {isAuthenticated && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Xin chào</p>
              <p className="font-semibold text-green-600">{user?.name}</p>
            </div>
          )}
        </div>

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

              {/* Customer Information */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <User className="w-6 h-6 text-blue-500" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Thông tin nhận hàng
                    </h2>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 mr-2" />
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 mr-2" />
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Nhập email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 mr-2" />
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Home className="w-4 h-4 mr-2" />
                      Địa chỉ nhận hàng *
                    </label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Nhập địa chỉ chi tiết (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                      rows="3"
                      required
                    />
                    {user?.address && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ Đã tự động điền địa chỉ từ tài khoản của bạn
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      Ghi chú đơn hàng (tuỳ chọn)
                    </label>
                    <textarea
                      name="note"
                      value={form.note}
                      onChange={handleChange}
                      rows="3"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Ghi chú cho đơn hàng..."
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

// Component CartItem
function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const getFallbackImage = () => {
    return "/images/placeholder.png";
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
          {imageError ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200">
              <ShoppingBag className="w-6 h-6 text-gray-400 mb-1" />
              <span className="text-xs text-gray-500">No image</span>
            </div>
          ) : (
            <>
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={item.image || getFallbackImage()}
                alt={item.name}
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                onError={handleImageError}
                onLoad={handleImageLoad}
                loading="lazy"
              />
            </>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
            {item.name}
          </h3>
          {item.variant && (
            <p className="text-sm text-gray-500 mb-2">Biến thể: {item.variant}</p>
          )}

          {item.attributes_full && item.attributes_full.length > 0 && (
            <div className="text-xs text-gray-500 mb-2">
              {item.attributes_full.map((attr, index) => (
                <span key={index} className="mr-2">
                  {attr.attribute_name}: {attr.value}
                </span>
              ))}
            </div>
          )}

          <p className="text-lg font-bold text-green-600">
            {item.price.toLocaleString("vi-VN")}₫
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onDecrease}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 active:scale-95"
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>

          <span className="w-12 text-center font-semibold text-gray-900 text-lg">
            {item.qty}
          </span>

          <button
            onClick={onIncrease}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 active:scale-95"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Remove Button */}
        <button
          onClick={onRemove}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Subtotal */}
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
        <span className="text-sm text-gray-500">Thành tiền:</span>
        <span className="font-semibold text-green-600">
          {(item.price * item.qty).toLocaleString("vi-VN")}₫
        </span>
      </div>
    </div>
  );
}

// Component OrderSummary (Giữ nguyên như bạn đã có)
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
  compact = false,
  paymentMethod = "cod"
}) {
  const { navigateToCheckout, canCheckout } = useCart();
  const router = useRouter();

  const handleNavigateToCheckout = () => {
    navigateToCheckout();
  };

  const getPaymentMethodText = () => {
    switch (paymentMethod) {
      case "cod": return "Thanh toán khi nhận hàng";
      case "bank": return "Chuyển khoản ngân hàng";
      case "momo": return "Ví MoMo";
      default: return "Thanh toán khi nhận hàng";
    }
  };

  const discount = 0;
  const finalTotal = total - discount;

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${!compact ? 'sticky top-6' : ''}`}>
      <h2 className={`font-semibold text-gray-900 mb-6 ${compact ? 'text-lg' : 'text-xl'}`}>
        {compact ? 'Tổng đơn hàng' : 'Tóm tắt đơn hàng'}
      </h2>

      <div className={`space-y-3 ${compact ? 'mb-4' : 'mb-6'}`}>
        <div className="flex justify-between text-gray-600">
          <span>Tạm tính ({cartLength} sản phẩm)</span>
          <span className="font-medium">{subtotal.toLocaleString("vi-VN")}₫</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Phí vận chuyển</span>
          <span className="text-green-600 font-semibold">
            {shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString("vi-VN")}₫`}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-red-600">
            <span>Giảm giá</span>
            <span className="font-semibold">-{discount.toLocaleString("vi-VN")}₫</span>
          </div>
        )}

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between items-center mb-2">
            <span className={`font-semibold text-gray-900 ${compact ? 'text-lg' : 'text-xl'}`}>
              {compact ? 'Thành tiền' : 'Tổng cộng'}
            </span>
            <span className={`font-bold text-green-600 ${compact ? 'text-xl' : 'text-2xl'}`}>
              {finalTotal.toLocaleString("vi-VN")}₫
            </span>
          </div>

          {paymentMethod && !compact && (
            <p className="text-sm text-gray-500">
              Phương thức: {getPaymentMethodText()}
            </p>
          )}
        </div>
      </div>

      {!isAuthenticated && showLoginButton && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-yellow-700 text-sm text-center">
            🔐 Vui lòng{" "}
            <Link 
              href="/dang-nhap" 
              className="font-semibold underline hover:text-yellow-800 transition-colors"
            >
              đăng nhập
            </Link>{" "}
            để thanh toán
          </p>
        </div>
      )}

      {showCheckoutButton && (
        <>
          <button
            onClick={onCheckout || handleNavigateToCheckout}
            disabled={loading || !isAuthenticated || !canCheckout()}
            className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-200 ${
              !isAuthenticated || !canCheckout()
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-green-200 hover:shadow-xl transform hover:-translate-y-0.5"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                Đang xử lý...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <CreditCard className="w-5 h-5 mr-3" />
                {compact ? 'Thanh toán' : 'Thanh toán an toàn'}
              </div>
            )}
          </button>

          {!isAuthenticated && showLoginButton && (
            <Link
              href="/dang-nhap"
              className="block w-full mt-3 py-4 text-center bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Đăng nhập để thanh toán
            </Link>
          )}
        </>
      )}

      {compact && (
        <Link
          href="/gio-hang"
          className="block w-full mt-3 py-3 text-center border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 rounded-xl font-semibold transition-all duration-200"
        >
          Xem giỏ hàng
        </Link>
      )}

      {!compact && (
        <p className="text-xs text-gray-500 text-center mt-4">
          🔒 Bằng cách đặt hàng, bạn đồng ý với{" "}
          <Link href="/dieu-khoan" className="underline hover:text-gray-700">
            Điều khoản dịch vụ
          </Link>{" "}
          của chúng tôi
        </p>
      )}

      {!compact && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center space-x-2 text-gray-500">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Bảo mật</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Truck className="w-4 h-4 text-blue-500" />
              <span>Miễn phí ship</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <CreditCard className="w-4 h-4 text-purple-500" />
              <span>Đa dạng TT</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              <span>Hỗ trợ 24/7</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}