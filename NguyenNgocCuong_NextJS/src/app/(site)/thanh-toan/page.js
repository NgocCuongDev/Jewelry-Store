// app/(site)/thanh-toan/page.js - ĐÃ SẮP XẾP LẠI LAYOUT
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
  Lock,
  CheckCircle,
  AlertCircle,
  Edit
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createOrder } from "../api/apiOrder";

export default function CheckoutPage() {
  const { cart, addToCart, removeFromCart, decreaseQty, clearCart, syncCartAfterOrder, cartInitialized } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    note: ""
  });
  const [formErrors, setFormErrors] = useState({});

  const router = useRouter();
  const subtotal = cart.reduce((sum, p) => sum + p.price * p.qty, 0);
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  // 🎯 KIỂM TRA VÀ CHUYỂN HƯỚNG NẾU GIỎ HÀNG TRỐNG
  useEffect(() => {
    if (cartInitialized && cart.length === 0) {
      toast.error("Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi thanh toán.");
      router.push("/gio-hang");
    }
  }, [cart, cartInitialized, router]);

  // 🎯 ĐIỀN THÔNG TIN TỪ USER
  useEffect(() => {
    if (!cartInitialized) return;

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

  // 🎯 VALIDATE FORM
  const validateForm = () => {
    const errors = {};

    if (!form.name.trim()) errors.name = "Vui lòng nhập họ và tên";
    if (!form.email.trim()) errors.email = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Email không hợp lệ";
    if (!form.phone.trim()) errors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(form.phone)) errors.phone = "Số điện thoại không hợp lệ";
    if (!form.address.trim()) errors.address = "Vui lòng nhập địa chỉ";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // 🎯 XỬ LÝ THANH TOÁN
  const handlePayment = async () => {
    if (!cartInitialized) {
      toast.error("⏳ Hệ thống đang khởi tạo, vui lòng thử lại sau");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thanh toán!");
      router.push("/dang-nhap?redirect=thanh-toan");
      return;
    }

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    if (cart.length === 0) {
      toast.error("Giỏ hàng trống!");
      return;
    }

    setLoading(true);
    try {
      const orderItems = cart.map(item => ({
        product_id: Number(item.id),
        product_name: item.name,
        product_price: Number(item.price),
        quantity: Number(item.qty),
        variant: item.variant || null,
        attributes_full: item.attributes_full || [],
        product_attributes: item.product_attributes || [],
        image: item.image
      }));

      const orderData = {
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        customer_address: form.address,
        note: form.note,
        user_id: user?.id,
        order_items: orderItems,
        payment_method: paymentMethod
      };

      console.log("💳 Processing payment with data:", orderData);

      const response = await createOrder(orderData);

      syncCartAfterOrder([]);
      toast.success("🎉 Đặt hàng thành công! Đơn hàng đang được xử lý.");
      router.push(`/cam-on?orderId=${response.order?.id || response.id}`);

    } catch (error) {
      console.error("❌ Payment error:", error);

      if (error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach(msg => toast.error(`Lỗi ${field}: ${msg}`));
          } else {
            toast.error(`Lỗi ${field}: ${messages}`);
          }
        });
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Thanh toán thất bại. Vui lòng thử lại.");
      }
    }
    setLoading(false);
  };

  // 🎯 HIỂN THỊ LOADING TRONG KHI CHƯA INITIALIZED
  if (!cartInitialized) {
    return <CheckoutLoading />;
  }

  // 🎯 CHUYỂN HƯỚNG NẾU GIỎ HÀNG TRỐNG
  if (cart.length === 0) {
    return <EmptyCartRedirect />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <CheckoutHeader user={user} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">
          
          {/* Left Column - SẢN PHẨM & THÔNG TIN GIAO HÀNG */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* 🎯 SẢN PHẨM ĐƯỢC ĐƯA LÊN ĐẦU */}
            <CartItemsSection 
              cart={cart}
              onIncrease={addToCart}
              onDecrease={decreaseQty}
              onRemove={removeFromCart}
            />

            {/* Thông tin giao hàng */}
            <DeliveryInfo 
              form={form} 
              formErrors={formErrors}
              onChange={handleChange}
              user={user}
            />

            {/* Phương thức thanh toán */}
            <PaymentMethod 
              paymentMethod={paymentMethod}
              onChange={setPaymentMethod}
            />

          </div>

          {/* Right Column - Tóm tắt đơn hàng */}
          <div className="space-y-6">
            <OrderSummary 
              subtotal={subtotal}
              shippingFee={shippingFee}
              total={total}
              cartLength={cart.length}
              paymentMethod={paymentMethod}
              loading={loading}
              onPayment={handlePayment}
              isAuthenticated={isAuthenticated}
            />

            {/* Bảo mật & Ưu đãi */}
            <TrustBadges />
          </div>
        </div>
      </div>
    </div>
  );
}

// ================== COMPONENTS ==================

// 🎯 Component Loading
function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải trang thanh toán...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🎯 Component chuyển hướng khi giỏ hàng trống
function EmptyCartRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/gio-hang");
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="max-w-md mx-auto">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h3>
            <p className="text-gray-500 mb-8">
              Bạn đang được chuyển hướng về giỏ hàng...
            </p>
            <Link
              href="/gio-hang"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <ShoppingBag className="w-5 h-5 mr-3" />
              Quay lại giỏ hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🎯 Component Header
function CheckoutHeader({ user }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link
          href="/gio-hang"
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Quay lại giỏ hàng
        </Link>
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Thanh Toán
        </h1>
        <p className="text-gray-500 mt-2">Hoàn tất đơn hàng của bạn</p>
      </div>

      {user && (
        <div className="text-right">
          <p className="text-sm text-gray-600">Xin chào</p>
          <p className="font-semibold text-green-600">{user.name}</p>
        </div>
      )}
    </div>
  );
}

// 🎯 Component Sản phẩm trong giỏ hàng - ĐƯỢC ĐƯA LÊN ĐẦU
function CartItemsSection({ cart, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Sản phẩm đã chọn ({cart.length})
            </h2>
          </div>
          <Link
            href="/gio-hang"
            className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            <Edit className="w-4 h-4 mr-1" />
            Chỉnh sửa
          </Link>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {cart.map((item, idx) => (
          <CheckoutCartItem
            key={`${item.id}-${item.variant || "default"}-${idx}`}
            item={item}
            onIncrease={() => onIncrease({
              ...item,
              qty: 1
            })}
            onDecrease={() => onDecrease(item.id, item.variant)}
            onRemove={() => onRemove(item.id, item.variant)}
          />
        ))}
      </div>

      {/* Thông tin tổng quan nhanh */}
      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Tổng số sản phẩm:</span>
          <span className="font-semibold">{cart.reduce((sum, item) => sum + item.qty, 0)} sản phẩm</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-2">
          <span className="text-gray-600">Tạm tính:</span>
          <span className="font-semibold text-green-600">
            {cart.reduce((sum, item) => sum + (item.price * item.qty), 0).toLocaleString("vi-VN")}₫
          </span>
        </div>
      </div>
    </div>
  );
}

// 🎯 Component Item trong thanh toán - CẢI TIẾN
function CheckoutCartItem({ item, onIncrease, onDecrease, onRemove }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getFallbackImage = () => {
    return "/images/placeholder.png";
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors group">
      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <ShoppingBag className="w-6 h-6 text-gray-400" />
            </div>
          ) : (
            <img
              src={item.image || getFallbackImage()}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
              loading="lazy"
            />
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
            {item.name}
          </h3>
          
          {/* Biến thể và thuộc tính */}
          <div className="space-y-1 mb-2">
            {item.variant && (
              <p className="text-sm text-gray-500">Biến thể: {item.variant}</p>
            )}
            {item.attributes_full && item.attributes_full.length > 0 && (
              <div className="text-xs text-gray-500">
                {item.attributes_full.map((attr, index) => (
                  <span key={index} className="mr-2">
                    {attr.attribute_name}: {attr.value}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Giá và số lượng */}
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-green-600">
              {item.price.toLocaleString("vi-VN")}₫
            </p>
            
            {/* Quantity Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={onDecrease}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-all group-hover:opacity-100 opacity-70"
                title="Giảm số lượng"
              >
                <Minus className="w-3 h-3 text-gray-600" />
              </button>

              <span className="w-8 text-center font-semibold text-gray-900 text-sm">
                {item.qty}
              </span>

              <button
                onClick={onIncrease}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-all group-hover:opacity-100 opacity-70"
                title="Tăng số lượng"
              >
                <Plus className="w-3 h-3 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Remove Button và Thành tiền */}
        <div className="flex flex-col items-end space-y-2">
          <button
            onClick={onRemove}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all group-hover:opacity-100 opacity-70"
            title="Xóa sản phẩm"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">Thành tiền:</p>
            <p className="font-semibold text-green-600 text-lg">
              {(item.price * item.qty).toLocaleString("vi-VN")}₫
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🎯 Component Thông tin giao hàng
function DeliveryInfo({ form, formErrors, onChange, user }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Truck className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900">
            Thông tin giao hàng
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
              onChange={onChange}
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                formErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Nhập họ và tên"
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formErrors.name}
              </p>
            )}
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
              onChange={onChange}
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Nhập email"
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formErrors.email}
              </p>
            )}
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
            onChange={onChange}
            className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              formErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Nhập số điện thoại"
          />
          {formErrors.phone && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {formErrors.phone}
            </p>
          )}
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Home className="w-4 h-4 mr-2" />
            Địa chỉ nhận hàng *
          </label>
          <textarea
            name="address"
            value={form.address}
            onChange={onChange}
            className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
              formErrors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Nhập địa chỉ chi tiết (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)"
            rows="3"
          />
          {formErrors.address && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {formErrors.address}
            </p>
          )}
          {user?.address && (
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" />
              Đã tự động điền địa chỉ từ tài khoản của bạn
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
            onChange={onChange}
            rows="3"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            placeholder="Ghi chú cho đơn hàng..."
          />
        </div>
      </div>
    </div>
  );
}

// 🎯 Component Phương thức thanh toán
function PaymentMethod({ paymentMethod, onChange }) {
  const methods = [
    {
      id: "cod",
      name: "Thanh toán khi nhận hàng (COD)",
      description: "Bạn chỉ phải thanh toán khi nhận được hàng",
      icon: "💰"
    },
    {
      id: "bank",
      name: "Chuyển khoản ngân hàng",
      description: "Chuyển khoản qua ngân hàng",
      icon: "🏦"
    },
    {
      id: "momo",
      name: "Ví MoMo",
      description: "Thanh toán qua ví điện tử MoMo",
      icon: "📱"
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <CreditCard className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-semibold text-gray-900">
            Phương thức thanh toán
          </h2>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {methods.map((method) => (
          <label
            key={method.id}
            className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${
              paymentMethod === method.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={paymentMethod === method.id}
              onChange={(e) => onChange(e.target.value)}
              className="mt-1 text-green-500 focus:ring-green-500"
            />
            <div className="ml-3 flex-1">
              <div className="flex items-center">
                <span className="text-xl mr-3">{method.icon}</span>
                <span className="font-semibold text-gray-900">{method.name}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{method.description}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

// 🎯 Component Tóm tắt đơn hàng
function OrderSummary({ subtotal, shippingFee, total, cartLength, paymentMethod, loading, onPayment, isAuthenticated }) {
  const getPaymentMethodText = () => {
    switch (paymentMethod) {
      case "cod": return "Thanh toán khi nhận hàng";
      case "bank": return "Chuyển khoản ngân hàng";
      case "momo": return "Ví MoMo";
      default: return "Thanh toán khi nhận hàng";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Tạm tính ({cartLength} sản phẩm)</span>
          <span>{subtotal.toLocaleString("vi-VN")}₫</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Phí vận chuyển</span>
          <span className="text-green-600 font-semibold">Miễn phí</span>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-gray-900">Tổng cộng</span>
            <span className="text-2xl font-bold text-green-600">
              {total.toLocaleString("vi-VN")}₫
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Phương thức: {getPaymentMethodText()}
          </p>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-yellow-700 text-sm text-center">
            🔐 Vui lòng đăng nhập để thanh toán
          </p>
        </div>
      )}

      <button
        onClick={onPayment}
        disabled={loading || !isAuthenticated}
        className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-200 ${
          !isAuthenticated
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
            <Lock className="w-5 h-5 mr-3" />
            Hoàn tất đơn hàng
          </div>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        Bằng cách đặt hàng, bạn đồng ý với Điều khoản dịch vụ của chúng tôi
      </p>
    </div>
  );
}

// 🎯 Component Bảo mật
function TrustBadges() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Shield className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium text-gray-700">Bảo mật giao dịch</span>
        </div>
        <div className="flex items-center space-x-3">
          <Truck className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium text-gray-700">Giao hàng miễn phí</span>
        </div>
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-purple-500" />
          <span className="text-sm font-medium text-gray-700">Đảm bảo chất lượng</span>
        </div>
        <div className="flex items-center space-x-3">
          <CreditCard className="w-5 h-5 text-orange-500" />
          <span className="text-sm font-medium text-gray-700">Thanh toán an toàn</span>
        </div>
      </div>
    </div>
  );
}