"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  Search,
  Sparkles,
  Zap,
  Clock,
  TrendingUp,
  Crown,
  Flame,
  Star,
  ArrowRight,
  ShoppingBag,
  Tag,
  Gem,
  Award,
  Diamond,
  X
} from "lucide-react";
import ProductCard from "../_components/ProductCard";
import { getSaleProducts } from "../api/apiProduct";
import { getCategories } from "../api/apiCategory";

export default function PremiumSaleProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    loadData();
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [saleProducts, catsData] = await Promise.all([
        getSaleProducts(50),
        getCategories()
      ]);
      setProducts(saleProducts || []);
      setCategories(catsData.data || catsData || []);
    } catch (error) {
      console.error("❌ Lỗi tải dữ liệu khuyến mãi:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm) {
      result = result.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (selectedCategory !== "all") {
      result = result.filter(p => String(p.category_id) === String(selectedCategory) || (p.category?.id && String(p.category.id) === String(selectedCategory)));
    }

    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "discount":
        result.sort((a, b) => {
          const dA = a.oldPrice ? (a.oldPrice - a.price) / a.oldPrice : 0;
          const dB = b.oldPrice ? (b.oldPrice - b.price) / b.oldPrice : 0;
          return dB - dA;
        });
        break;
      default: result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [products, searchTerm, sortBy, selectedCategory]);

  const stats = useMemo(() => {
    const superSale = products.filter(p => p.oldPrice && ((p.oldPrice - p.price) / p.oldPrice) > 0.3).length;
    const maxDiscount = products.length > 0 ? Math.max(...products.map(p => p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0)) : 0;

    return [
      { icon: Diamond, value: superSale, label: "Bộ Sưu Tập Siêu Sale", color: "from-amber-400 to-amber-600" },
      { icon: Tag, value: products.length, label: "Tuyệt Tác Giảm Giá", color: "from-neutral-700 to-neutral-900" },
      { icon: Clock, value: "24h", label: "Deal Sốc Giới Hạn", color: "from-rose-500 to-rose-700" },
      { icon: TrendingUp, value: `${maxDiscount}%`, label: "Ưu Đãi Lớn Nhất", color: "from-amber-600 to-amber-800" }
    ];
  }, [products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-amber-800 italic font-serif">Đang tuyển chọn những ưu đãi tinh xảo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* LUXURY STICKY NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2 rounded-lg"><Gem className="text-white w-5 h-5" /></div>
            <span className="font-serif text-xl font-bold tracking-tighter text-neutral-900">NNC JEWELS</span>
          </div>
          <div className="relative hidden md:block w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm tuyệt tác..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/50 border border-amber-100 rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
        </div>
      </nav>

      {/* HERO SECTION - GOLD DARK THEME */}
      <section className="relative bg-neutral-900 pt-32 pb-48 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 px-6 py-2 rounded-full mb-8 border border-amber-500/20">
            <Award size={18} />
            <span className="text-sm font-bold uppercase tracking-[0.3em]">Exclusive Offers</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-6xl md:text-8xl font-serif text-white mb-8 leading-tight">
            Chương Trình <br />
            <span className="text-amber-500 italic">Ưu Đãi Đặc Quyền</span>
          </motion.h1>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed mb-12">
            Cơ hội cuối cùng để sở hữu những bộ sưu tập trang sức tinh xảo nhất với mức chiết khấu
            lên đến <span className="text-amber-500 font-bold">70%</span>. Đẳng cấp vĩnh cửu trong tầm tay.
          </p>

          <div className="flex justify-center gap-6">
            <button onClick={() => document.getElementById('deals')?.scrollIntoView({ behavior: 'smooth' })} className="bg-amber-500 text-neutral-900 px-10 py-4 rounded-full font-bold hover:bg-amber-400 transition transform hover:scale-105">
              Khám Phá Deal Ngay
            </button>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-2xl border border-amber-100/50 text-center hover:bg-amber-50 transition-colors"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                <stat.icon className="text-white w-7 h-7" />
              </div>
              <div className="text-3xl font-black text-neutral-900 mb-2">{stat.value}</div>
              <div className="text-xs uppercase font-bold tracking-widest text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FILTER & PRODUCTS */}
      <section id="deals" className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between mb-12">
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setSelectedCategory('all')} className={`px-6 py-3 rounded-full text-sm font-bold transition ${selectedCategory === 'all' ? 'bg-neutral-900 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'}`}>Tất cả ưu đãi</button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-6 py-3 rounded-full text-sm font-bold transition ${String(selectedCategory) === String(cat.id) ? 'bg-amber-500 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'}`}>{cat.name}</button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-100 rounded-full px-8 py-3 text-sm font-bold text-neutral-900 focus:ring-2 focus:ring-amber-500 outline-none shadow-sm"
          >
            <option value="newest">Mới Nhất</option>
            <option value="price-low">Giá Thấp → Cao</option>
            <option value="price-high">Giá Cao → Thấp</option>
            <option value="discount">Ưu Đãi Lớn Nhất</option>
          </select>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {filteredProducts.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard
                    id={p.id}
                    name={p.name}
                    price={p.price}
                    oldPrice={p.oldPrice}
                    images={p.images}
                    slug={p.slug}
                    category={p.category}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-40 bg-white rounded-3xl border border-dashed border-amber-200">
            <Sparkles className="w-16 h-16 text-amber-200 mx-auto mb-4" />
            <h3 className="text-2xl font-serif text-neutral-900 mb-2">Không tìm thấy sản phẩm phù hợp</h3>
            <p className="text-gray-500">Hãy thử đổi bộ lọc hoặc quay lại vào ngày mai nhé!</p>
          </div>
        )}
      </section>

      {/* LUXURY CTA */}
      <section className="bg-neutral-900 py-32 overflow-hidden border-t border-amber-900/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Crown className="w-12 h-12 text-amber-500 mx-auto mb-8" />
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-8 leading-tight">Số Lượng Có Hạn <br /> <span className="text-amber-500 italic">Cho Những Tâm Hồn Quý Phái</span></h2>
          <p className="text-gray-400 text-lg mb-12 font-light">Mỗi sản phẩm là một câu chuyện độc bản. Đừng để lỡ cơ hội sở hữu tuyệt tác với mức giá tốt nhất trong năm.</p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-transparent border-2 border-amber-500 text-amber-500 px-12 py-5 rounded-full font-bold hover:bg-amber-500 hover:text-neutral-900 transition-all text-lg">Mua Sắm Ngay</button>
        </div>
      </section>
    </div>
  );
}
