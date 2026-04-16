"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { useDragScroll } from "../hooks/useDragScroll";
import { getNewProducts } from "../api/apiProduct";
import { Sparkles, RefreshCw, Diamond, Gem, ArrowRight } from "lucide-react";

export default function ProductNew({ products: propProducts }) {
  const dragScroll = useDragScroll();
  const [products, setProducts] = useState(propProducts || []);
  const [loading, setLoading] = useState(!propProducts);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (propProducts && propProducts.length > 0) {
      setProducts(propProducts);
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getNewProducts(12);
        setProducts(data);
      } catch (err) {
        console.error("❌ Lỗi tải sản phẩm:", err);
        setError("Không thể tải sản phẩm. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [propProducts]);

  if (loading) {
    return (
      <section className="mb-16 px-4 md:px-8">
        <div className="text-center py-20 bg-white rounded-[40px] shadow-sm border border-gray-50">
          <RefreshCw className="w-10 h-10 animate-spin mx-auto text-amber-500 mb-4" />
          <p className="text-amber-800 font-serif italic">Đang tuyển chọn những tuyệt tác mới...</p>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      className="mb-24 px-4 md:px-8 overflow-hidden"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center mb-16 relative">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Diamond className="w-6 h-6 text-amber-500" />
          <h3 className="text-4xl md:text-5xl font-serif font-black text-neutral-900 tracking-tight">
             Tuyệt Tác <span className="text-amber-500 italic">Mới Nhất</span>
          </h3>
          <Diamond className="w-6 h-6 text-amber-500" />
        </div>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light leading-relaxed">
          Nơi hội tụ những thiết kế tinh xảo, định nghĩa lại khái niệm về sự sang trọng và phong cách cá nhân.
        </p>
        <div className="mt-6 h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full opacity-30"></div>
      </div>

      {products.length > 0 && (
        <motion.div
          ref={dragScroll.ref}
          onMouseDown={dragScroll.onMouseDown}
          onMouseLeave={dragScroll.onMouseLeave}
          onMouseUp={dragScroll.onMouseUp}
          onMouseMove={dragScroll.onMouseMove}
          className="flex gap-8 overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory touch-pan-x cursor-grab active:cursor-grabbing pb-12 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {products.map((product, index) => (
            <div key={product.id || index} className="snap-center shrink-0 w-80">
              <ProductCard
                id={product.id}
                images={product.images}
                name={product.name}
                price={product.price}
                oldPrice={product.oldPrice}
                description={product.description}
                availability={product.availability}
                badge="Mới về"
                attributes={product.attributes}
                hasAttributes={product.hasAttributes}
              />
            </div>
          ))}
        </motion.div>
      )}

      <div className="text-center mt-4">
        <Link
          href="/san-pham"
          className="group inline-flex items-center gap-3 bg-neutral-900 text-amber-500 font-bold px-10 py-4 rounded-full transition-all duration-300 shadow-xl hover:shadow-amber-500/20 hover:scale-105 active:scale-95 border border-amber-500/20"
        >
          KHÁM PHÁ TOÀN BỘ BỘ SƯU TẬP
          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>
    </motion.section>
  );
}