"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, RefreshCw, Diamond, Gem, Grid, Sparkles } from "lucide-react";
import ProductCard from "./ProductCard";
import { getCategories } from "../api/apiCategory";
import { getProductsByCategory } from "../api/apiProduct";

export default function CategoryWithProducts() {
  const [categories, setCategories] = useState([]);
  const [productsByCat, setProductsByCat] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCat, setActiveCat] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: cats = [] } = await getCategories();
        if (!mounted) return;

        const active = cats.filter((c) => Number(c.status) === 1);
        setCategories(active);

        let all = [];
        await Promise.all(
          active.map(async (cat) => {
            try {
              const ps = await getProductsByCategory(cat.id, 8);
              if (!mounted) return;
              
              setProductsByCat((prev) => ({ 
                ...prev, 
                [cat.id]: ps 
              }));
              all = [...all, ...ps];
            } catch (err) {
              console.error(`❌ Lỗi tải sản phẩm cho danh mục ${cat.name}:`, err);
            }
          })
        );

        setAllProducts(all);
      } catch (err) {
        console.error("❌ Lỗi tải danh mục:", err);
        setError("Không thể tải danh mục và sản phẩm. Vui lòng thử lại.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center py-20 bg-white rounded-[40px] shadow-sm border border-gray-50">
          <RefreshCw className="w-10 h-10 animate-spin mx-auto text-amber-500 mb-4" />
          <p className="text-amber-800 font-serif italic">Đang sắp xếp các bộ sưu tập quý giá...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <Diamond className="w-6 h-6 text-amber-500" />
          <h2 className="text-4xl md:text-5xl font-serif font-black text-neutral-900 tracking-tight text-center">
             Bộ Sưu Tập <span className="text-amber-500 italic">Trang Sức</span>
          </h2>
          <Diamond className="w-6 h-6 text-amber-500" />
        </div>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light">
          Mỗi danh mục là một câu chuyện về vẻ đẹp vĩnh cửu và sự chế tác thủ công bậc thầy.
        </p>
        <div className="mt-6 h-1 w-32 mx-auto bg-amber-500/20 rounded-full"></div>
      </motion.div>

      <motion.div
        className="flex flex-wrap justify-center gap-4 mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <button
          onClick={() => setActiveCat(null)}
          className={`px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 border-2 flex items-center gap-2
            ${activeCat === null
                ? "bg-neutral-900 text-amber-500 border-neutral-900 shadow-xl scale-105"
                : "bg-white text-gray-500 border-gray-100 hover:border-amber-200 hover:text-amber-600"
            }`}
        >
          <Grid className="w-4 h-4" />
          Tất cả
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={`px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 border-2
              ${activeCat === cat.id
                  ? "bg-neutral-900 text-amber-500 border-neutral-900 shadow-xl scale-105"
                  : "bg-white text-gray-400 border-gray-100 hover:border-amber-200 hover:text-amber-600"
              }`}
          >
            {cat.name}
          </button>
        ))}
      </motion.div>

      <div className="space-y-12">
        {activeCat === null ? (
           <div className="space-y-12">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Sparkles className="text-amber-500" />
                    <h3 className="text-2xl font-serif font-bold text-neutral-800 italic">Toàn bộ tác phẩm</h3>
                 </div>
                 <Link href="/san-pham" className="text-amber-600 font-bold hover:underline flex items-center gap-1">
                    Xem tất cả <Diamond size={16} />
                 </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {allProducts.slice(0, 8).map((p) => (
                  <ProductCard 
                    key={p.id} 
                    {...p} 
                  />
                ))}
              </div>
           </div>
        ) : (
          categories.filter((c) => c.id === activeCat).map((cat) => {
            const products = productsByCat[cat.id] || [];
            return (
              <div key={cat.id} className="space-y-12">
                <div className="flex items-center justify-between border-b border-gray-50 pb-8">
                   <div className="flex items-center gap-3">
                      <Gem className="text-amber-500 w-8 h-8" />
                      <h3 className="text-3xl font-serif font-bold text-neutral-900">{cat.name}</h3>
                   </div>
                   <Link href={`/san-pham?category=${cat.id}`} className="bg-amber-50 text-amber-600 px-6 py-3 rounded-2xl font-bold hover:bg-amber-100 transition-colors flex items-center gap-2">
                      Xem bộ sưu tập <ArrowRight size={18} />
                   </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {products.map((p) => (
                    <ProductCard key={p.id} {...p} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}