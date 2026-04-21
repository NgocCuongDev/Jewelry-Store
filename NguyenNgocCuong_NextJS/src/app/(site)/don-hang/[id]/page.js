// app/(site)/don-hang/[id]/page.js - ĐÃ THÊM CHỨC NĂNG HỦY ĐƠN HÀNG
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrderDetail, cancelOrder } from "../../api/apiOrder";
import { IMAGE_URL } from "../../../config";
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Share2,
  Star,
  MessageCircle,
  Heart,
  XCircle,
  RotateCcw
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  // 🎯 Hàm chuyển đổi trạng thái từ Backend sang Frontend
  const getStatusId = (statusStr) => {
    const map = {
      'PAYMENT_EXPECTED': 1,
      'PROCESSING': 2,
      'SHIPPED': 3,
      'DELIVERED': 4,
      'CANCELLED': 5
    };
    return map[statusStr] || 1;
  };

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Fetching order detail for:", orderId);
      
      const data = await getOrderDetail(orderId);
      console.log("✅ Order data received:", data);
      
      // Chuyển đổi dữ liệu để khớp với frontend
      const rawOrder = data.order || data;
      const mappedOrder = {
        ...rawOrder,
        status: getStatusId(rawOrder.status),
        name: rawOrder.custName,
        phone: rawOrder.custPhone,
        email: rawOrder.custEmail,
        address: rawOrder.shippingAddress,
        details: rawOrder.items?.map(item => ({
          ...item,
          product_name: item.product?.productName,
          image_url: item.product?.imageUrl,
          price: item.product?.price,
          qty: item.quantity,
          amount: item.subTotal
        })) || []
      };
      
      setOrder(mappedOrder);
    } catch (err) {
      console.error("❌ Error in fetchOrderDetail:", err);
      setError(err.message || "Không thể tải chi tiết đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  // 🎯 HÀM HỦY ĐƠN HÀNG
  const handleCancelOrder = async () => {
    if (!order) return;
    
    try {
      setCancelling(true);
      console.log("🗑️ Cancelling order:", orderId);
      
      const result = await cancelOrder(orderId, cancelReason);
      
      toast.success("✅ Hủy đơn hàng thành công!");
      
      // 🎯 CẬP NHẬT LẠI TRẠNG THÁI ĐƠN HÀNG
      setOrder(prev => ({
        ...prev,
        status: 5, // Đã hủy
        cancel_reason: cancelReason,
        cancelled_at: new Date().toISOString()
      }));
      
      setShowCancelModal(false);
      setCancelReason("");
      
    } catch (err) {
      console.error("❌ Error cancelling order:", err);
      toast.error(err.message || "Không thể hủy đơn hàng. Vui lòng thử lại.");
    } finally {
      setCancelling(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      1: { 
        text: "Chờ xác nhận", 
        color: "bg-amber-50 border-amber-200 text-amber-800",
        icon: Clock,
        progress: 25,
        canCancel: true // 🎯 CÓ THỂ HỦY
      },
      2: { 
        text: "Đã xác nhận", 
        color: "bg-blue-50 border-blue-200 text-blue-800",
        icon: CheckCircle,
        progress: 50,
        canCancel: false
      },
      3: { 
        text: "Đang giao hàng", 
        color: "bg-purple-50 border-purple-200 text-purple-800",
        icon: Truck,
        progress: 75,
        canCancel: false
      },
      4: { 
        text: "Hoàn thành", 
        color: "bg-emerald-50 border-emerald-200 text-emerald-800",
        icon: CheckCircle,
        progress: 100,
        canCancel: false
      },
      5: { 
        text: "Đã hủy", 
        color: "bg-rose-50 border-rose-200 text-rose-800",
        icon: XCircle,
        progress: 0,
        canCancel: false
      }
    };
    return configs[status] || configs[1];
  };

  // 🎯 Lấy tổng tiền trực tiếp từ backend
  const calculateTotal = () => {
    return order?.total || 0;
  };

  if (loading) {
    return <OrderDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-rose-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Lỗi tải dữ liệu</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={fetchOrderDetail}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300"
            >
              Thử lại
            </button>
            <Link
              href="/don-hang"
              className="inline-flex items-center px-6 py-3 border border-slate-300 text-slate-700 hover:border-slate-400 rounded-xl font-semibold transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Quay lại
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return <OrderNotFound />;
  }

  const statusConfig = getStatusConfig(order.status);
  const totalAmount = calculateTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/don-hang"
                className="group flex items-center text-slate-300 hover:text-white transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Quay lại danh sách
              </Link>
              <div className="w-px h-6 bg-slate-600"></div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Chi tiết đơn hàng
                </h1>
                <p className="text-slate-300 flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  Mã đơn hàng: <span className="font-mono ml-1">#{order.id}</span>
                </p>
              </div>
            </div>
            
            {/* 🎯 NÚT HÀNH ĐỘNG - HIỆN KHI CÓ THỂ HỦY */}
            {statusConfig.canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="flex items-center px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Hủy đơn hàng
              </button>
            )}
            
            {/* 🎯 HIỂN THỊ KHI ĐÃ HỦY */}
            {order.status === 5 && (
              <div className="flex items-center px-4 py-2 bg-rose-100 border border-rose-200 text-rose-800 rounded-lg">
                <XCircle className="w-5 h-5 mr-2" />
                Đơn hàng đã hủy
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Status Progress */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${statusConfig.color.replace('bg-', 'bg-').replace(' border-', ' ')}`}>
                    {statusConfig.icon && <statusConfig.icon className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {statusConfig.text}
                    </h3>
                    <p className="text-slate-500 text-sm">
                      Cập nhật lúc: {new Date(order.updatedAt || order.orderedDate).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                  {statusConfig.text}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block text-slate-600">
                      Tiến trình đơn hàng
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-slate-600">
                      {statusConfig.progress}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-200">
                  <div
                    style={{ width: `${statusConfig.progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000 ease-out"
                  ></div>
                </div>
              </div>
              
              {/* 🎯 HIỂN THỊ LÝ DO HỦY NẾU CÓ */}
              {order.status === 5 && order.cancel_reason && (
                <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <XCircle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-rose-800 mb-1">Lý do hủy đơn hàng:</h4>
                      <p className="text-rose-700">{order.cancel_reason}</p>
                      {order.cancelled_at && (
                        <p className="text-rose-600 text-sm mt-2">
                          Thời gian hủy: {new Date(order.cancelled_at).toLocaleString('vi-VN')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-xl font-semibold text-slate-900 flex items-center">
                  <Package className="w-6 h-6 mr-3 text-blue-600" />
                  Sản phẩm đã đặt
                  <span className="ml-2 text-slate-500 text-sm font-normal">
                    ({order.details?.length || 0} sản phẩm)
                  </span>
                </h3>
              </div>
              
              <div className="divide-y divide-slate-100">
                {order.details?.length > 0 ? (
                  order.details.map((detail, index) => (
                    <OrderItemCard key={index} detail={detail} />
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>Không có sản phẩm nào trong đơn hàng</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                Tóm tắt đơn hàng
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Tạm tính</span>
                  <span>{totalAmount.toLocaleString('vi-VN')}₫</span>
                </div>
                
                <div className="flex justify-between text-slate-600">
                  <span>Phí vận chuyển</span>
                  <span className="text-emerald-600 font-semibold">Miễn phí</span>
                </div>
                
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-slate-900">Tổng cộng</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {totalAmount.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>
              </div>
              
              {/* 🎯 THÔNG BÁO KHI ĐÃ HỦY */}
              {order.status === 5 && (
                <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-center">
                  <p className="text-rose-700 text-sm font-medium">
                    Đơn hàng đã bị hủy
                  </p>
                </div>
              )}
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-purple-600" />
                Thông tin giao hàng
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-900">{order.name}</div>
                    <div className="text-sm text-slate-500">Người nhận</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-900">{order.phone}</div>
                    <div className="text-sm text-slate-500">Số điện thoại</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-900">{order.email}</div>
                    <div className="text-sm text-slate-500">Email</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-900">{order.address}</div>
                    <div className="text-sm text-slate-500">Địa chỉ nhận hàng</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 MODAL XÁC NHẬN HỦY ĐƠN HÀNG */}
      {showCancelModal && (
        <CancelOrderModal
          isOpen={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
            setCancelReason("");
          }}
          onConfirm={handleCancelOrder}
          loading={cancelling}
          reason={cancelReason}
          onReasonChange={setCancelReason}
          orderId={orderId}
        />
      )}
    </div>
  );
}

// 🎯 MODAL XÁC NHẬN HỦY ĐƠN HÀNG
function CancelOrderModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  loading, 
  reason, 
  onReasonChange, 
  orderId 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Hủy đơn hàng
              </h3>
              <p className="text-slate-500 text-sm">
                Mã đơn hàng: #{orderId}
              </p>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-amber-800 font-medium mb-1">
                  Bạn có chắc chắn muốn hủy đơn hàng này?
                </p>
                <p className="text-amber-700 text-sm">
                  Hành động này không thể hoàn tác. Đơn hàng sẽ được chuyển sang trạng thái "Đã hủy".
                </p>
              </div>
            </div>
          </div>

          {/* Reason Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Lý do hủy đơn hàng (tuỳ chọn)
            </label>
            <textarea
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder="Nhập lý do hủy đơn hàng..."
              rows="3"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none"
            />
            <p className="text-slate-500 text-xs mt-1">
              Giúp chúng tôi cải thiện dịch vụ tốt hơn
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 border border-slate-300 text-slate-700 hover:border-slate-400 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
            >
              Quay lại
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Xác nhận hủy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component cho từng sản phẩm (giữ nguyên)
function OrderItemCard({ detail }) {
  const [imageError, setImageError] = useState(false);
  
  const getProductImage = () => {
    // Ưu tiên lấy từ image_url (dữ liệu đã được map sẵn)
    let path = detail.image_url || detail.image;

    if (!path && detail.product?.thumbnail) {
      path = detail.product.thumbnail;
    }

    if (!path) return null;

    if (path.startsWith('http')) {
      return path;
    }

    // Xử lý đường dẫn tương đối
    // Nếu path bắt đầu bằng 'images/', chúng ta có thể cần xóa nó nếu IMAGE_URL đã bao gồm nó
    // Hoặc nếu nó bắt đầu bằng 'uploads/', chúng ta cộng nối bình thường.
    
    let processedPath = path;
    if (path.startsWith('images/')) {
        // IMAGE_URL của chúng ta là .../api/catalog/images/ nên chúng ta bỏ 'images/' ở path đi
        processedPath = path.replace('images/', '');
    }

    return `${IMAGE_URL}${processedPath}`;
  };

  const productImage = getProductImage();

  const ProductImagePlaceholder = ({ productName }) => {
    const colors = [
      'from-blue-400 to-purple-500',
      'from-green-400 to-blue-500', 
      'from-orange-400 to-pink-500',
      'from-purple-400 to-pink-500',
      'from-teal-400 to-blue-500'
    ];
    
    const colorIndex = (detail.product?.id || detail.id || 0) % colors.length;
    const gradient = colors[colorIndex];
    const firstLetter = productName?.charAt(0)?.toUpperCase() || 'P';
    
    return (
      <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-lg rounded-xl`}>
        {firstLetter}
      </div>
    );
  };

  return (
    <div className="p-6 hover:bg-slate-50/50 transition-all duration-300 group">
      <div className="flex items-start space-x-4">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 group-hover:shadow-lg transition-shadow duration-300">
          {productImage && !imageError ? (
            <img
              src={productImage}
              alt={detail.product_name}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("❌ Image failed to load:", productImage);
                setImageError(true);
              }}
              onLoad={() => console.log("✅ Image loaded successfully:", productImage)}
            />
          ) : (
            <ProductImagePlaceholder productName={detail.product_name} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 text-lg mb-1 group-hover:text-blue-600 transition-colors duration-300">
            {detail.product_name}
          </h4>
          
          {detail.product?.slug && (
            <p className="text-xs text-slate-500 mb-2">
              Mã: {detail.product.slug}
            </p>
          )}
          
          {detail.variant && (
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                {detail.variant}
              </span>
            </div>
          )}

          {detail.product?.description && (
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
              {detail.product.description}
            </p>
          )}

          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-slate-700 font-medium text-lg">
              {Number(detail.price).toLocaleString('vi-VN')}₫
            </span>
            <span className="text-slate-400">×</span>
            <span className="text-slate-700 font-medium bg-slate-100 px-2 py-1 rounded border border-slate-200">
              {detail.qty}
            </span>
            <span className="text-slate-400">=</span>
            <span className="text-xl font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
              {Number(detail.amount).toLocaleString('vi-VN')}₫
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton Loading (giữ nguyên)
function OrderDetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl p-6 h-48 space-y-4">
                <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 space-y-6">
                <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                {[1, 2].map((item) => (
                  <div key={item} className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-slate-200 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                      <div className="h-6 bg-slate-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 h-80 space-y-4">
                <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="h-4 bg-slate-200 rounded"></div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 h-64 space-y-4">
                <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="h-4 bg-slate-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Not Found State (giữ nguyên)
function OrderNotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-12 h-12 text-rose-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Không tìm thấy đơn hàng</h2>
        <p className="text-slate-600 mb-8 max-w-md">
          Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Link
          href="/don-hang"
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    </div>
  );
}