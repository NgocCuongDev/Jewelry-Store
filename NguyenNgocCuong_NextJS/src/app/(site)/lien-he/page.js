// app/(site)/lien-he/page.js
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle,
  AlertCircle,
  User,
  LogIn,
  Navigation,
  Locate,
  LocateOff
} from "lucide-react";
import contactAPI from "../api/apiContact";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 10.7769, lng: 106.7009 }); // Mặc định TP.HCM
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm();

  // 🎯 LẤY VỊ TRÍ HIỆN TẠI CỦA NGƯỜI DÙNG
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Trình duyệt của bạn không hỗ trợ lấy vị trí");
      return;
    }

    setGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setMapCenter({ lat: latitude, lng: longitude });
        
        console.log("📍 Vị trí người dùng:", { latitude, longitude });
        toast.success("Đã lấy được vị trí của bạn!");
        setGettingLocation(false);
      },
      (error) => {
        console.error("❌ Lỗi lấy vị trí:", error);
        let errorMessage = "Không thể lấy vị trí";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Bạn đã từ chối chia sẻ vị trí";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Thông tin vị trí không khả dụng";
            break;
          case error.TIMEOUT:
            errorMessage = "Yêu cầu lấy vị trí đã hết thời gian";
            break;
        }
        
        toast.error(errorMessage);
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // 🎯 TỰ ĐỘNG LẤY VỊ TRÍ KHI TRANG LOAD (TUỲ CHỌN)
  useEffect(() => {
    setMounted(true);
    // Có thể bật tự động lấy vị trí ở đây nếu muốn
    // getUserLocation();
  }, []);

  // 🎯 TỰ ĐỘNG ĐIỀN THÔNG TIN NẾU USER ĐÃ ĐĂNG NHẬP
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("🎯 Auto-filling form with user data:", user);
      setValue("name", user.name || "");
      setValue("email", user.email || "");
      setValue("phone", user.phone || "");
    }
  }, [isAuthenticated, user, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      // 🎯 THÊM THÔNG TIN VỊ TRÍ VÀO DỮ LIỆU GỬI LÊN
      const contactData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        content: data.content,
        user_id: user?.id || null,
        location: userLocation ? {
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          timestamp: new Date().toISOString()
        } : null
      };

      console.log("📨 Sending contact data to backend:", contactData);

      const response = await contactAPI.createContact(contactData);
      
      if (response.status === 201) {
        toast.success("Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.");
        setSubmitted(true);
        
        // 🎯 TỰ ĐỘNG LOAD LẠI TRANG SAU 3 GIÂY
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error("❌ Lỗi khi gửi liên hệ:", error);
      
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach(messages => {
          messages.forEach(message => toast.error(message));
        });
      } else {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra khi gửi liên hệ");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🎯 TẠO URL GOOGLE MAPS VỚI VỊ TRÍ HIỆN TẠI
  const getMapUrl = () => {
    if (userLocation) {
      return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d500!2d${userLocation.lng}!3d${userLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1620000000000`;
    }
    return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.395377376771!2d106.70062341533436!3d10.786008661739734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f38b0dcee2f%3A0x6c3319ff17d554d6!2sHo%20Chi%20Minh%20City%2C%20Vietnam!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-4">
            Liên Hệ Với Chúng Tôi
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại thông tin, 
            chúng tôi sẽ phản hồi trong thời gian sớm nhất.
          </p>

          {/* {isAuthenticated && user && (
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-green-100 border border-green-200 text-green-700 rounded-full">
              <User className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">
                Đang đăng nhập với: {user.name} (ID: {user.id})
              </span>
            </div>
          )} */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Thông tin liên hệ */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông Tin Liên Hệ</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Địa Chỉ</h3>
                    <p className="text-gray-600 mt-1">
                      123 Đường Đình Phong Phú, Tăng Nhơn Phú B, Thủ Đức<br />
                      TP. Hồ Chí Minh, Việt Nam
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Điện Thoại</h3>
                    <p className="text-gray-600 mt-1">
                      +84 123 456 789<br />
                      +84 987 654 321
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-xl">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600 mt-1">
                      nnccontact@example.com<br />
                      nncsupport@example.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-xl">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Thời Gian Làm Việc</h3>
                    <p className="text-gray-600 mt-1">
                      Thứ 2 - Thứ 6: 8:00 - 17:00<br />
                      Thứ 7: 8:00 - 12:00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {!isAuthenticated && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                  <LogIn className="w-6 h-6 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-2">Đăng nhập để được hỗ trợ tốt hơn</h3>
                    <p className="text-yellow-700 text-sm mb-3">
                      Khi đăng nhập, thông tin của bạn sẽ được tự động điền và chúng tôi có thể hỗ trợ bạn nhanh hơn.
                    </p>
                    <Link
                      href="/dang-nhap"
                      className="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Đăng nhập ngay
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* 🎯 BẢN ĐỒ VỚI VỊ TRÍ HIỆN TẠI */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Navigation className="w-5 h-5 mr-2 text-red-500" />
                  {userLocation ? "Vị Trí Của Bạn" : "Vị Trí Của Chúng Tôi"}
                </h3>
                <button
                  onClick={getUserLocation}
                  disabled={gettingLocation}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    gettingLocation
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  {gettingLocation ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Đang lấy vị trí...
                    </>
                  ) : userLocation ? (
                    <>
                      <LocateOff className="w-4 h-4 mr-2" />
                      Lấy lại vị trí
                    </>
                  ) : (
                    <>
                      <Locate className="w-4 h-4 mr-2" />
                      Lấy vị trí của tôi
                    </>
                  )}
                </button>
              </div>

              {/* Hiển thị thông tin vị trí */}
              {userLocation && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 flex items-center">
                    <Locate className="w-4 h-4 mr-2" />
                    <strong>Vị trí hiện tại của bạn:</strong>
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Kinh độ: {userLocation.lng.toFixed(6)}, Vĩ độ: {userLocation.lat.toFixed(6)}
                  </p>
                </div>
              )}

              <div className="bg-gray-100 rounded-xl overflow-hidden h-64">
                {mounted ? (
                  <iframe
                    src={getMapUrl()}
                    width="100%"
                    height="100%"
                    style={{ border: 0, borderRadius: '12px' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={userLocation ? "Vị trí của bạn" : "Vị trí cửa hàng"}
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    suppressHydrationWarning
                  ></iframe>
                ) : (
                  <div className="w-100 h-100 flex items-center justify-center bg-gray-200">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-red-500" />
                  <span>
                    {userLocation 
                      ? "Vị trí hiện tại của bạn" 
                      : "123 Đường Đình Phong Phú, Tăng Nhơn Phú B, Thủ Đức"
                    }
                  </span>
                </div>
                <a
                  href={userLocation 
                    ? `https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`
                    : "https://maps.google.com/?q=123+Đường+Đình+Phong+Phú,+Tăng+Nhơn+Phú+B,+Thủ+Đức,+TP.HCM"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Navigation className="w-4 h-4 mr-1" />
                  {userLocation ? "Xem vị trí" : "Chỉ đường"}
                </a>
              </div>
            </div>
          </div>

          {/* Form liên hệ */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              {submitted ? (
                <SuccessMessage />
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">Gửi Tin Nhắn</h2>
                    {/* {isAuthenticated && (
                      <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        <User className="w-3 h-3 mr-1" />
                        Đã đăng nhập
                      </span>
                    )} */}
                  </div>
                  
                  <p className="text-gray-600 mb-8">
                    Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại với bạn trong vòng 24h.
                    {userLocation && (
                      <span className="block mt-2 text-green-600 text-sm">
                        ✅ Vị trí của bạn đã được xác định và sẽ gửi kèm tin nhắn
                      </span>
                    )}
                  </p>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Họ tên */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Họ và tên *
                        </label>
                        <input
                          type="text"
                          {...register("name", {
                            required: "Vui lòng nhập họ và tên",
                            minLength: {
                              value: 2,
                              message: "Họ tên phải có ít nhất 2 ký tự"
                            }
                          })}
                          className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                            errors.name 
                              ? "border-red-300 focus:ring-red-500" 
                              : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                          }`}
                          placeholder="Nhập họ và tên của bạn"
                        />
                        {errors.name && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          {...register("email", {
                            required: "Vui lòng nhập email",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Email không hợp lệ"
                            }
                          })}
                          className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                            errors.email 
                              ? "border-red-300 focus:ring-red-500" 
                              : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                          }`}
                          placeholder="your@email.com"
                        />
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Số điện thoại */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        {...register("phone", {
                          required: "Vui lòng nhập số điện thoại",
                          pattern: {
                            value: /^(0|\+84)[3|5|7|8|9][0-9]{8}$/,
                            message: "Số điện thoại không hợp lệ"
                          }
                        })}
                        className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                          errors.phone 
                            ? "border-red-300 focus:ring-red-500" 
                            : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                        }`}
                        placeholder="Nhập số điện thoại của bạn"
                      />
                      {errors.phone && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* Nội dung */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nội dung tin nhắn *
                      </label>
                      <textarea
                        rows={6}
                        {...register("content", {
                          required: "Vui lòng nhập nội dung tin nhắn",
                          minLength: {
                            value: 10,
                            message: "Nội dung phải có ít nhất 10 ký tự"
                          }
                        })}
                        className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all resize-none ${
                          errors.content 
                            ? "border-red-300 focus:ring-red-500" 
                            : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                        }`}
                        placeholder="Mô tả chi tiết vấn đề bạn cần hỗ trợ..."
                      />
                      {errors.content && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.content.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-4 px-6 rounded-xl font-semibold text-lg shadow-lg transition-all duration-200 flex items-center justify-center ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed text-gray-600"
                          : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-blue-200 hover:shadow-xl transform hover:-translate-y-0.5"
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-3" />
                          Gửi Tin Nhắn {userLocation && "& Vị Trí"}
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🎯 Component thông báo thành công - ĐÃ SỬA ĐỂ TỰ ĐỘNG LOAD LẠI
function SuccessMessage() {
  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Gửi Liên Hệ Thành Công!
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi đã nhận được tin nhắn của bạn 
        và sẽ phản hồi trong thời gian sớm nhất.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-700 text-sm">
          ⏳ Trang sẽ tự động load lại sau <span className="font-bold">3 giây</span>...
        </p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
      >
        Tải Lại Trang Ngay
      </button>
    </div>
  );
}