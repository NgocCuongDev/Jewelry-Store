"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
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

// 💎 Sub-component cho vật thể bay - Phiên bản tối ưu Liquid Fluid
const FloatingItem = ({ icon: Icon, delay = 0, size = 20, top = "50%", left = "50%", springX, springY, factor = 1 }) => {
  const x = useTransform(springX, [0, 1], [-40 * factor, 40 * factor]);
  const y = useTransform(springY, [0, 1], [-40 * factor, 40 * factor]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 0.7, 0.4, 0.7, 0], // Shimmer effect
        scale: [0.8, 1.2, 0.8],
        rotate: [0, 90, 0]
      }}
      style={{ top, left, x, y }}
      transition={{ 
        duration: 8 + Math.random() * 5, 
        repeat: Infinity, 
        delay,
        ease: "easeInOut" 
      }}
      className="absolute pointer-events-none"
    >
      <Icon size={size} className="text-amber-400/50 drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]" />
    </motion.div>
  );
};

export default function PremiumSaleProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  // 🎯 QUÁN TÍNH CHUỘT (MOUSE INERTIA)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springConfig = { damping: 30, stiffness: 100, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    loadData();
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
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


      {/* HERO SECTION - COMPACT LUXURY GOLD SPOTLIGHT - Đã tinh gọn */}
      <section className="relative bg-neutral-950 pt-28 pb-32 overflow-hidden">
        {/* Glow Effects - Đã tăng cường độ */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-amber-500/20 rounded-full blur-[140px] opacity-60"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(245,158,11,0.25),_transparent_60%)]"></div>
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]"></div>
        </div>

        {/* Floating Luxury Elements - Parallax Mượt mà */}
        <FloatingItem icon={Diamond} size={40} top="15%" left="12%" delay={0} springX={springX} springY={springY} factor={1.2} />
        <FloatingItem icon={Gem} size={30} top="65%" left="10%" delay={2} springX={springX} springY={springY} factor={0.8} />
        <FloatingItem icon={Crown} size={50} top="10%" left="82%" delay={4} springX={springX} springY={springY} factor={1.5} />
        <FloatingItem icon={Sparkles} size={25} top="60%" left="85%" delay={1} springX={springX} springY={springY} factor={0.6} />
        <FloatingItem icon={Diamond} size={22} top="35%" left="92%" delay={3} springX={springX} springY={springY} factor={1} />

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-900/40 to-neutral-800/40 text-amber-400 px-6 py-2 rounded-full mb-8 border border-amber-500/30 backdrop-blur-sm shadow-[0_0_20px_rgba(245,158,11,0.1)]"
          >
            <Award size={18} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">The Exclusive Sale</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif text-white mb-6 leading-[1.1] drop-shadow-2xl"
          >
            Chương Trình <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-400 to-amber-700 italic drop-shadow-[0_4px_10px_rgba(245,158,11,0.3)]">Ưu Đãi Đặc Biệt</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-base text-gray-400 max-w-2xl mx-auto font-light leading-relaxed mb-8 border-l-2 border-amber-500/30 pl-8"
          >
            Nơi thời gian ngưng đọng trên những tuyệt tác. Cơ hội duy nhất để sở hữu sự vĩnh cửu
            với đặc quyền ưu đãi lên đến <span className="text-amber-500 font-black">70%</span>.
          </motion.p>

          <div className="flex justify-center gap-8">
            <button
              onClick={() => document.getElementById('deals')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative bg-amber-500 text-neutral-950 px-12 py-4 rounded-full font-black text-lg hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] transition-all overflow-hidden"
            >
              <span className="relative z-10">BẮT ĐẦU TRẢI NGHIỆM</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </button>
          </div>

          <div className="flex justify-center mt-8">
             <div className="w-px h-12 bg-gradient-to-b from-amber-500/0 via-amber-500/50 to-amber-500/0"></div>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#fafafa] to-transparent"></div>
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
