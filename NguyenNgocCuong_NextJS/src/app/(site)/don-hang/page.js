// app/(site)/don-hang/page.js - ĐÃ CẬP NHẬT
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getOrders, cancelOrder } from "../api/apiOrder";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { IMAGE_URL } from "../../config";

export default function OrdersPage() {
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // 🎯 Thêm state phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  // Hàm làm mới với cuộn về đầu
  const handleRefresh = async () => {
    setRefreshing(true);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    await fetchOrders();
    setRefreshing(false);
  };

  // 🎯 HÀM HỦY ĐƠN HÀNG TRỰC TIẾP TỪ DANH SÁCH
  const handleCancelOrder = async (orderId, orderStatus) => {
    // 🎯 CHỈ CHO PHÉP HỦY KHI ĐƠN HÀNG Ở TRẠNG THÁI CHỜ XÁC NHẬN (1)
    if (orderStatus !== 1) {
      toast.error("Chỉ có thể hủy đơn hàng đang chờ xác nhận");
      return;
    }

    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      return;
    }

    try {
      setCancellingOrderId(orderId);
      console.log("🗑️ Cancelling order from list:", orderId);
      
      const result = await cancelOrder(orderId, "Người dùng hủy từ danh sách đơn hàng");
      
      toast.success("✅ Hủy đơn hàng thành công!");
      
      // 🎯 CẬP NHẬT NGAY LẬP TỨC TRONG DANH SÁCH
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { 
                ...order, 
                status: 5, // Đã hủy
                cancel_reason: "Người dùng hủy từ danh sách đơn hàng",
                cancelled_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            : order
        )
      );
      
    } catch (err) {
      console.error("❌ Error cancelling order:", err);
      toast.error(err.message || "Không thể hủy đơn hàng. Vui lòng thử lại.");
    } finally {
      setCancellingOrderId(null);
    }
  };

  // Hàm getImageUrl sửa lại để ưu tiên ảnh từ orderdetail
  const getImageUrl = (path) => {
    if (!path) return null;

    // Nếu path đã là URL đầy đủ
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    // 🎯 SỬA: Giữ nguyên uploads/ trong đường dẫn
    const fullUrl = `${IMAGE_URL}${path}`;
    return fullUrl;
  };

  // 🎯 Hàm lấy ảnh ưu tiên từ orderdetail, fallback từ product
  const getProductImage = (item) => {
    // Ưu tiên 1: Ảnh từ orderdetail (image_url)
    if (item.image_url) {
      return item.image_url;
    }

    // Ưu tiên 2: Ảnh từ orderdetail (image)
    if (item.image) {
      const imageUrl = getImageUrl(item.image);
      return imageUrl;
    }

    // Fallback: Ảnh từ product
    if (item.product?.thumbnail) {
      const imageUrl = getImageUrl(item.product.thumbnail);
      return imageUrl;
    }

    return null;
  };

  useEffect(() => {
    if (isAuthenticated && user && user.id) {
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Backend yêu cầu userId để lọc đơn hàng của riêng user đó
      const response = await getOrders({ userId: user.id });
      console.log("API Response:", response);

      const ordersData = response.orders || [];
      setOrders(ordersData);

      // 🎯 Tính toán tổng số trang
      const totalPages = Math.ceil(ordersData.length / itemsPerPage);
      setTotalPages(totalPages);
      setCurrentPage(1); // Reset về trang đầu khi fetch mới
    } catch (error) {
      toast.error("Không thể tải danh sách đơn hàng");
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Map status string from Backend to UI short status
  const getStatusText = (status) => {
    const statusMap = {
      'PAYMENT_EXPECTED': 'pending',
      'PROCESSING': 'processing', 
      'SHIPPING': 'shipping',
      'COMPLETED': 'completed',
      'CANCELLED': 'cancelled'
    };
    return statusMap[status] || status || 'pending';
  };

  const getStatusInfo = (status) => {
    const statusText = typeof status === 'number' ? getStatusText(status) : status;

    const statusMap = {
      'completed': { 
        text: 'Thành công', 
        color: 'bg-green-500', 
        bgColor: 'bg-green-50', 
        textColor: 'text-green-700',
        canCancel: false
      },
      'pending': { 
        text: 'Chờ xác nhận', 
        color: 'bg-yellow-500', 
        bgColor: 'bg-yellow-50', 
        textColor: 'text-yellow-700',
        canCancel: true // 🎯 CÓ THỂ HỦY
      },
      'processing': { 
        text: 'Đang xử lý', 
        color: 'bg-blue-500', 
        bgColor: 'bg-blue-50', 
        textColor: 'text-blue-700',
        canCancel: false
      },
      'shipping': { 
        text: 'Đang giao', 
        color: 'bg-purple-500', 
        bgColor: 'bg-purple-50', 
        textColor: 'text-purple-700',
        canCancel: false
      },
      'cancelled': { 
        text: 'Đã hủy', 
        color: 'bg-red-500', 
        bgColor: 'bg-red-50', 
        textColor: 'text-red-700',
        canCancel: false
      }
    };

    return statusMap[statusText] || { 
      text: 'Đang xử lý', 
      color: 'bg-gray-500', 
      bgColor: 'bg-gray-50', 
      textColor: 'text-gray-700',
      canCancel: false
    };
  };

  // Format order date
  const formatOrderDate = (dateString) => {
    if (!dateString) return 'Chưa có ngày';
    // Spring Boot trả về dạng array [2024, 4, 15, 10, 30] hoặc string ISO
    let date;
    if (Array.isArray(dateString)) {
      date = new Date(dateString[0], dateString[1] - 1, dateString[2], dateString[3], dateString[4]);
    } else {
      date = new Date(dateString);
    }
    
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "0₫";
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
  };

  // Get total items count
  const getTotalItems = (order) => {
    if (!order.items || !Array.isArray(order.items)) return 0;
    return order.items.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  // Get product preview with images
  const getProductPreview = (order) => {
    if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
      return [{ name: "Đang cập nhật", initial: "?", image: null }];
    }

    return order.items.slice(0, 4).map(item => ({
      name: item.product?.productName || "Sản phẩm",
      initial: (item.product?.productName || "S").charAt(0).toUpperCase(),
      price: item.product?.price,
      quantity: item.quantity,
      image: item.product?.imageUrl
    }));
  };

  // Component để hiển thị ảnh đơn giản
  const ProductImage = ({ src, alt, className, fallback = null }) => {
    const [imageError, setImageError] = useState(false);

    if (imageError || !src) {
      return fallback || (
        <div className={`bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center ${className}`}>
          <span className="text-gray-400 text-sm">📦</span>
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={() => setImageError(true)}
      />
    );
  };

  // 🎯 Lọc đơn hàng theo filter
  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true;
    const statusText = typeof order.status === 'number' ? getStatusText(order.status) : order.status;
    return statusText === filter;
  });

  // 🎯 Tính toán đơn hàng cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  // 🎯 Hàm chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 🎯 Hàm chuyển đến trang trước/sau
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 🎯 Component phân trang
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
        {/* Thông tin trang hiện tại */}
        <div className="text-sm text-gray-600">
          Hiển thị <span className="font-semibold">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredOrders.length)}</span>
          trong tổng số <span className="font-semibold">{filteredOrders.length}</span> đơn hàng
        </div>

        {/* Điều hướng phân trang */}
        <div className="flex items-center gap-2">
          {/* Nút trang trước */}
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-green-600 border border-gray-200 hover:border-green-200'
              }`}
          >
            <span>←</span>
            Trước
          </button>

          {/* Các số trang */}
          <div className="flex items-center gap-1">
            {startPage > 1 && (
              <>
                <button
                  onClick={() => paginate(1)}
                  className="w-10 h-10 rounded-xl font-medium text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all duration-300"
                >
                  1
                </button>
                {startPage > 2 && (
                  <span className="px-2 text-gray-400">...</span>
                )}
              </>
            )}

            {pageNumbers.map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 ${currentPage === number
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                  }`}
              >
                {number}
              </button>
            ))}

            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && (
                  <span className="px-2 text-gray-400">...</span>
                )}
                <button
                  onClick={() => paginate(totalPages)}
                  className="w-10 h-10 rounded-xl font-medium text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all duration-300"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          {/* Nút trang sau */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-green-600 border border-gray-200 hover:border-green-200'
              }`}
          >
            Sau
            <span>→</span>
          </button>
        </div>

        {/* Chọn số lượng items per page */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Hiển thị:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>đơn hàng/trang</span>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20 px-6">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-xl p-12 transform hover:scale-105 transition-transform duration-300">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">🔐</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Đăng nhập để tiếp tục
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Đăng nhập để xem lịch sử mua hàng và theo dõi đơn hàng của bạn
            </p>
            <Link
              href="/dang-nhap"
              className="inline-block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">📦</span>
          </div>
          <h1 className="text-4xl font-bold  mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Đơn Hàng Của Tôi
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Theo dõi và quản lý tất cả đơn hàng của bạn tại một nơi
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {[
            { key: "all", label: "Tất cả", count: orders.length },
            { key: "pending", label: "Chờ xác nhận", count: orders.filter(o => getStatusText(o.status) === 'pending').length },
            { key: "processing", label: "Đang xử lý", count: orders.filter(o => getStatusText(o.status) === 'processing').length },
            { key: "shipping", label: "Đang giao", count: orders.filter(o => getStatusText(o.status) === 'shipping').length },
            { key: "completed", label: "Hoàn thành", count: orders.filter(o => getStatusText(o.status) === 'completed').length },
            { key: "cancelled", label: "Đã hủy", count: orders.filter(o => getStatusText(o.status) === 'cancelled').length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setFilter(tab.key);
                setCurrentPage(1);
              }}
              className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 ${filter === tab.key
                ? 'bg-white text-green-600 shadow-lg border-2 border-green-200'
                : 'bg-white/80 text-gray-600 hover:text-green-600 shadow-md hover:shadow-lg'
                }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${filter === tab.key ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-500"></div>
            </div>
            <p className="text-gray-600 mt-6 text-lg font-medium">Đang tải đơn hàng...</p>
            <p className="text-gray-500 mt-2">Vui lòng chờ trong giây lát</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-3xl shadow-xl max-w-2xl mx-auto transform hover:scale-105 transition-transform duration-300">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <span className="text-3xl">📭</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {filter === 'all' ? 'Chưa có đơn hàng nào' : `Không có đơn hàng ${filter}`}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              {filter === 'all'
                ? 'Hãy bắt đầu mua sắm và khám phá những sản phẩm tuyệt vời đầu tiên của bạn!'
                : 'Không tìm thấy đơn hàng nào trong trạng thái này.'}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <span>🛒</span>
              {filter === 'all' ? 'Mua sắm ngay' : 'Khám phá sản phẩm'}
            </Link>
          </div>
        ) : (
          /* Orders List với phân trang */
          <>
            <div className="grid gap-6">
              {currentOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const totalItems = getTotalItems(order);
                const productPreview = getProductPreview(order);
                const hasValidItems = order.items && order.items.length > 0;

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
                  >
                    <div className="p-8">
                      {/* Order Header */}
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3 flex-wrap">
                            <h3 className="text-xl font-bold text-gray-900">
                              Đơn hàng #{order.id}
                            </h3>
                            <span className={`px-4 py-2 rounded-2xl text-sm font-semibold ${statusInfo.bgColor} ${statusInfo.textColor} border`}>
                              {statusInfo.text}
                            </span>
                            {/* 🎯 HIỂN THỊ THÔNG BÁO HỦY ĐƠN NẾU ĐANG XỬ LÝ */}
                            {cancellingOrderId === order.id && (
                              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium animate-pulse">
                                Đang hủy...
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-2">
                              <span>📅</span>
                              {formatOrderDate(order.orderedDate)}
                            </span>
                            <span className="flex items-center gap-2">
                              <span>📦</span>
                              {totalItems} sản phẩm
                            </span>
                            <span className="flex items-center gap-2">
                              <span>📞</span>
                              {order.custPhone || 'Chưa có SĐT'}
                            </span>
                          </div>
                          {order.shippingAddress && (
                            <div className="mt-2 text-sm text-gray-600">
                              <span className="flex items-start gap-2">
                                <span>🏠</span>
                                <span className="flex-1">{order.shippingAddress}</span>
                              </span>
                            </div>
                          )}
                          {/* 🎯 HIỂN THỊ LÝ DO HỦY NẾU CÓ */}
                          {order.status === 'CANCELLED' && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">🗑️</span>
                                <div>
                                  <p className="text-red-700 text-sm font-medium">Đã hủy</p>
                                  <p className="text-red-600 text-xs">{order.customerNote || "Người dùng yêu cầu hủy"}</p>
                                  {order.updatedAt && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {formatOrderDate(order.updatedAt)}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900 mb-1">
                            {formatCurrency(order.total)}
                          </p>
                          <p className="text-sm text-gray-500">Tổng giá trị</p>
                        </div>
                      </div>

                      {/* Order Items Preview with Images */}
                      <div className="mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-sm font-medium text-gray-700">Sản phẩm:</span>
                          <div className="flex -space-x-2">
                            {productPreview.map((product, index) => (
                              <div
                                key={index}
                                className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl border-2 border-white shadow-sm flex items-center justify-center relative overflow-hidden"
                                title={product.name}
                              >
                                <ProductImage
                                  src={product.image}
                                  alt={product.name}
                                  className="object-cover w-full h-full"
                                  fallback={
                                    <span className="text-sm font-medium text-gray-700">
                                      {product.initial}
                                    </span>
                                  }
                                />
                              </div>
                            ))}
                            {totalItems > 4 && (
                              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border-2 border-white shadow-sm flex items-center justify-center text-xs font-medium text-gray-600">
                                +{totalItems - 4}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="space-y-3">
                          {hasValidItems ? (
                            order.items.slice(0, 3).map((item, index) => (
                              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                {/* Product Image */}
                                <div className="flex-shrink-0 w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                                  <ProductImage
                                    src={item.product?.imageUrl}
                                    alt={item.product?.productName}
                                    className="object-cover w-full h-full"
                                    fallback={
                                      <span className="text-lg font-medium text-gray-400">
                                        {(item.product?.productName || "S").charAt(0).toUpperCase()}
                                      </span>
                                    }
                                  />
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 truncate">
                                    {item.product?.productName}
                                  </p>
                                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                    <span>Số lượng: {item.quantity}</span>
                                    {item.product?.price > 0 && (
                                      <span className="font-medium">
                                        {formatCurrency(item.product?.price)}/sản phẩm
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Item Total */}
                                {item.subTotal > 0 && (
                                  <div className="text-right">
                                    <p className="font-bold text-gray-900 text-lg">
                                      {formatCurrency(item.subTotal)}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-center text-gray-500 py-6 bg-gray-50 rounded-xl">
                              <span className="text-2xl mb-2 block">📦</span>
                              Thông tin sản phẩm đang được cập nhật
                            </div>
                          )}

                          {/* Show more products indicator */}
                          {order.items.length > 3 && (
                            <div className="text-center text-gray-500 bg-gray-100 py-3 rounded-lg">
                              <span className="flex items-center justify-center gap-2">
                                <span>📋</span>
                                Và {order.items.length - 3} sản phẩm khác
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center pt-6 border-t border-gray-100 gap-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <span>🔍</span>
                          <span className="text-sm">Xem chi tiết đơn hàng</span>
                        </div>

                        <div className="flex items-center gap-4 flex-wrap">
                          {/* Order Status Badge */}
                          <div className={`px-4 py-2 rounded-2xl text-sm font-semibold ${statusInfo.bgColor} ${statusInfo.textColor} border`}>
                            {statusInfo.text}
                          </div>

                          {/* 🎯 NÚT HỦY ĐƠN HÀNG - CHỈ HIỆN KHI CÓ THỂ HỦY */}
                          {statusInfo.canCancel && (
                            <button
                              onClick={() => handleCancelOrder(order.id, order.status)}
                              disabled={cancellingOrderId === order.id}
                              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-semibold transition-all duration-300 ${cancellingOrderId === order.id
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                                }`}
                            >
                              {cancellingOrderId === order.id ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  Đang hủy...
                                </>
                              ) : (
                                <>
                                  <span>🗑️</span>
                                  Hủy đơn
                                </>
                              )}
                            </button>
                          )}

                          {/* Detail Button */}
                          <Link
                            href={`/don-hang/${order.id}`}
                            className="group inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                          >
                            Chi tiết
                            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 🎯 Phân trang */}
            <Pagination />
          </>
        )}

        {/* Refresh Button */}
        {!loading && orders.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold shadow-md transition-all duration-300 transform ${refreshing
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed scale-95'
                  : 'bg-white hover:bg-gray-50 text-gray-700 hover:scale-105 hover:border-green-200 hover:text-green-600 border border-gray-200'
                }`}
            >
              {refreshing ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  Đang làm mới...
                </>
              ) : (
                <>
                  <span className="transition-transform duration-300 group-hover:rotate-180">🔄</span>
                  Làm mới danh sách
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}