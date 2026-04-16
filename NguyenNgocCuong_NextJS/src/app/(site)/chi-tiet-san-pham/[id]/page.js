"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getProductById, getProductsByCategory } from "../../api/apiProduct";
import { IMAGE_URL } from "../../../config";
import ProductDetailClient from "../../_components/ProductDetailClient";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Gem,
  Crown,
  Diamond,
  Star,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProductPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        
        if (!data) {
          console.warn("⚠️ Không tìm thấy dữ liệu sản phẩm");
          return;
        }

        setProduct(data);
        setMainImage(data.thumbnail);

        // Lấy sản phẩm liên quan theo category_id
        if (data.category_id) {
          const related = await getProductsByCategory(data.category_id, 4);
          setRelatedProducts(related.filter(p => String(p.id) !== String(id)));
        }
      } catch (error) {
        console.error("❌ Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-amber-800 font-serif italic">Đang chuẩn bị tuyệt tác...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <Gem className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-serif text-gray-800 mb-4">Tuyệt tác không tồn tại</h2>
        <button 
          onClick={() => router.push('/san-pham')}
          className="bg-neutral-900 text-amber-500 px-8 py-3 rounded-full font-bold border border-amber-500/20"
        >
          Quay lại cửa hàng
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa] pb-20">
      {/* BREADCRUMB & BACK NAVIGATION */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6 flex items-center justify-between">
         <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-neutral-500 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Trở về</span>
        </button>
        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium uppercase tracking-widest">
           <Link href="/" className="hover:text-amber-600">Trang chủ</Link>
           <span>/</span>
           <Link href="/san-pham" className="hover:text-amber-600">Bộ phối</Link>
           <span>/</span>
           <span className="text-amber-600">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* LEFT COLUMN: IMAGE GALLERY */}
            <div className="p-8 lg:p-12 bg-[#fcfcfc] border-r border-gray-50 flex flex-col items-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-inner group"
              >
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6">
                    <div className="bg-neutral-900/80 backdrop-blur-md text-amber-500 p-3 rounded-2xl border border-amber-500/20">
                        <Crown size={20} />
                    </div>
                </div>
              </motion.div>

              {/* THUMBNAILS (Mở rộng cho jewelry) */}
              <div className="flex gap-4 mt-8 pb-2 overflow-x-auto w-full no-scrollbar justify-center">
                <button
                  onClick={() => setMainImage(product.thumbnail)}
                  className={`relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all 
                    ${mainImage === product.thumbnail ? "border-amber-500 ring-4 ring-amber-500/10 shadow-lg" : "border-gray-100 hover:border-amber-200"}`}
                >
                  <img src={product.thumbnail} className="w-full h-full object-cover" />
                </button>
                {product.images?.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img.image)}
                    className={`relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all 
                      ${mainImage === img.image ? "border-amber-500 ring-4 ring-amber-500/10 shadow-lg" : "border-gray-100 hover:border-amber-200"}`}
                  >
                    <img src={img.image} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: PRODUCT INFO */}
            <div className="p-8 lg:p-16 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                 <div className="flex gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                 </div>
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">(128 Đánh giá)</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-serif font-black text-neutral-900 mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-8">
                 <span className="text-sm font-bold text-gray-400 uppercase tracking-widest border-r border-gray-200 pr-4">Mã: {id}</span>
                 <span className="text-sm font-bold text-emerald-500 uppercase tracking-widest">Còn hàng</span>
              </div>

              {/* PRICING BLOCK */}
              <div className="bg-amber-50 rounded-3xl p-8 mb-8 border border-amber-100 flex items-center justify-between">
                <div>
                  <div className="text-4xl font-serif font-bold text-amber-600 mb-1">
                    {Number(product.price).toLocaleString("vi-VN")}₫
                  </div>
                  {product.oldPrice > product.price && (
                    <div className="text-lg text-gray-400 line-through">
                      {Number(product.oldPrice).toLocaleString("vi-VN")}₫
                    </div>
                  )}
                </div>
                {product.oldPrice > product.price && (
                    <div className="bg-rose-500 text-white text-xs font-black px-4 py-2 rounded-full shadow-lg">
                        -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                    </div>
                )}
              </div>

              {/* SHORT DESCRIPTION */}
              <p className="text-gray-600 leading-relaxed font-light mb-10 text-lg">
                {product.description || "Một tuyệt tác trang sức được chế tác thủ công bởi các nghệ nhân hàng đầu, cam kết mang lại vẻ đẹp vĩnh cửu và sự quý phái cho chủ sở hữu."}
              </p>

              {/* PRODUCT CLIENT COMPONENT (CART/ATTRS) */}
              <div className="border-t border-gray-100 pt-10">
                 <ProductDetailClient 
                    product={product} 
                    selectedImage={mainImage} 
                 />
              </div>

              {/* LUXURY TRUST BADGES */}
              <div className="grid grid-cols-3 gap-4 mt-12 border-t border-gray-50 pt-12">
                 <div className="flex flex-col items-center text-center group">
                    <div className="bg-gray-50 p-4 rounded-2xl mb-3 group-hover:bg-amber-50 transition-colors">
                        <ShieldCheck className="text-amber-500 w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter">Bảo hành 2 năm</span>
                 </div>
                 <div className="flex flex-col items-center text-center group">
                    <div className="bg-gray-50 p-4 rounded-2xl mb-3 group-hover:bg-amber-50 transition-colors">
                        <RotateCcw className="text-amber-500 w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter">Dễ dàng đổi trả</span>
                 </div>
                 <div className="flex flex-col items-center text-center group">
                    <div className="bg-gray-50 p-4 rounded-2xl mb-3 group-hover:bg-amber-50 transition-colors">
                        <Truck className="text-amber-500 w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter">Vận chuyển 2h</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-24">
          <div className="flex items-center justify-between mb-12">
             <div className="flex items-center gap-3">
                <Sparkles className="text-amber-500" />
                <h2 className="text-3xl font-serif font-black text-neutral-900">
                    Cùng <span className="text-amber-500 italic">Bộ Sưu Tập</span>
                </h2>
             </div>
             <Link href="/san-pham" className="text-amber-600 font-bold hover:underline flex items-center gap-1">
                Xem tất cả <Diamond size={16} />
             </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
                <div key={p.id} className="h-full">
                    <Link href={`/chi-tiet-san-pham/${p.id}`} className="block group">
                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-xl mb-4 border border-gray-100">
                             <img src={p.thumbnail} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                             <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-xl p-2 shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Sparkles size={16} className="text-amber-500" />
                             </div>
                        </div>
                        <h3 className="font-serif font-bold text-neutral-800 line-clamp-1 mb-2 group-hover:text-amber-600 transition-colors">{p.name}</h3>
                        <div className="text-amber-600 font-black">{Number(p.price).toLocaleString("vi-VN")}₫</div>
                    </Link>
                </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}