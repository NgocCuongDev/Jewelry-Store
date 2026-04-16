// import { useState, useMemo } from "react";
// import { useSearchParams } from "next/navigation";
import {
  List,
  Grid,
  Filter,
  SlidersHorizontal,
  Sparkles,
  Heart,
  ShoppingCart,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star,
  Zap,
  Crown,
  Gem,
  Palette,
  MoreHorizontal,
  Diamond,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "../_components/ProductCard";
import { getAllProducts, searchProducts } from "../api/apiProduct";
import { getCategories } from "../api/apiCategory";

export default function ProductListPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");

  const [viewMode, setViewMode] = useState("grid");
  const [filters, setFilters] = useState({
    category: "all",
    price: "all",
    status: "all",
    rating: "all",
  });
  const [sort, setSort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const itemsPerPage = 8;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ----- FETCH DATA -----
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catsRes, productsRes] = await Promise.all([
          getCategories(),
          searchQuery ? searchProducts(searchQuery) : getAllProducts(100)
        ]);

        setCategories(catsRes.data || []);

        // Map products với thông tin thêm để trông Premium hơn
        const mappedProducts = (productsRes || []).map((p) => ({
          ...p,
          rating: 4.5 + Math.random() * 0.5,
          reviewCount: Math.floor(Math.random() * 50) + 5,
          isFeatured: p.price > 20000000,
          isNew: true,
          isPremium: p.price > 10000000,
          tags: ['Quý phái', 'Tinh xảo', 'Đẳng cấp'].slice(0, Math.floor(Math.random() * 3) + 1),
        }));

        setProducts(mappedProducts);
      } catch (err) {
        console.error("❌ Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchQuery]);

  // ----- FILTER & SORT CLIENT SIDE -----
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      // Filter theo Category ID
      if (filters.category !== "all" && String(p.category_id) !== String(filters.category)) {
        // Hỗ trợ cả trường hợp p.category là object
        if (p.category?.id && String(p.category.id) !== String(filters.category)) return false;
        if (!p.category?.id && String(p.category_id) !== String(filters.category)) return false;
      }

      // Filter theo Giá trang sức
      if (filters.price === "lt10m" && p.price >= 10000000) return false;
      if (filters.price === "10m-50m" && (p.price < 10000000 || p.price > 50000000)) return false;
      if (filters.price === "gt50m" && p.price <= 50000000) return false;

      if (filters.status === "sale" && (!p.oldPrice || p.oldPrice <= p.price)) return false;
      if (filters.rating !== "all" && p.rating < Number(filters.rating)) return false;
      return true;
    });

    // Sort
    result.sort((a, b) => {
      switch (sort) {
        case "newest": return b.id - a.id;
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "rating": return b.rating - a.rating;
        default: return 0;
      }
    });

    return result;
  }, [products, filters, sort]);

  // Pagination logic
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // ----- LOADING STATE -----
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-amber-800 font-medium italic">Đang mở kho báu trang sức...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* FLOATING NAVIGATION */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="bg-white/90 backdrop-blur-md border-b border-amber-200/30">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <span className="text-sm font-bold text-amber-900">
              💎 {filteredProducts.length} tuyệt tác trang sức
            </span>
            <div className="flex gap-4">
              <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-amber-100 text-amber-700" : "text-gray-400"}`}><Grid size={20} /></button>
              <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg ${viewMode === "list" ? "bg-amber-100 text-amber-700" : "text-gray-400"}`}><List size={20} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* HERO SECTION - LUXURY DESIGN */}
      <div className="relative bg-neutral-900 pt-24 pb-40 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 px-4 py-2 rounded-full mb-8 border border-amber-500/20">
            <Crown size={16} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Authentic Luxury Collection</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">
            Thế Giới <span className="text-amber-500 italic">Ánh Kim</span> Tinh Xảo
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Nơi tôn vinh vẻ đẹp vĩnh cửu qua những thiết kế trang sức thủ công tinh xảo,
            mang đậm dấu ấn cá nhân và sự đẳng cấp thượng lưu.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-12 -mt-24 relative z-10">
        {/* CONTROL BAR */}
        <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-6 mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 bg-neutral-900 text-amber-500 px-6 py-3 rounded-xl hover:bg-neutral-800 transition-all font-bold"
              >
                <SlidersHorizontal size={18} />
                Bộ Lọc Tìm Kiếm
              </button>
              <div className="h-8 w-px bg-gray-200 hidden md:block"></div>
              <span className="text-sm font-medium text-gray-500 hidden md:block">
                Hiển thị <span className="text-gray-900 font-bold">{filteredProducts.length}</span> kết quả
              </span>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-amber-500"
              >
                <option value="newest">✨ Mới nhất</option>
                <option value="price-asc">💰 Giá: Thấp đến Cao</option>
                <option value="price-desc">💎 Giá: Cao đến Thấp</option>
                <option value="rating">⭐️ Đánh giá tốt nhất</option>
              </select>
            </div>
          </div>

          {/* FILTER PANEL */}
          {isFilterOpen && (
            <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-6 animate-fadeIn">
              <div>
                <label className="text-xs font-black uppercase text-amber-600 mb-2 block tracking-widest">Loại Trang Sức</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm"
                >
                  <option value="all">Tất cả sản phẩm</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-black uppercase text-amber-600 mb-2 block tracking-widest">Khoảng Giá</label>
                <select
                  value={filters.price}
                  onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm"
                >
                  <option value="all">Mọi mức giá</option>
                  <option value="lt10m">Dưới 10 triệu</option>
                  <option value="10m-50m">10 - 50 triệu</option>
                  <option value="gt50m">Trên 50 triệu</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black uppercase text-amber-600 mb-2 block tracking-widest">Ưu Đãi</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm"
                >
                  <option value="all">Tất cả</option>
                  <option value="sale">Đang giảm giá</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setFilters({ category: "all", price: "all", status: "all", rating: "all" })}
                  className="w-full py-3 text-sm font-bold text-gray-500 hover:text-amber-600 transition"
                >
                  Xóa tất cả lọc
                </button>
              </div>
            </div>
          )}
        </div>

        {/* PRODUCTS LIST */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-amber-200">
            <Diamond size={48} className="mx-auto text-amber-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">Không tìm thấy sản phẩm nào</h3>
            <p className="text-gray-500">Thử thay đổi bộ lọc để tìm thấy món đồ ưng ý của bạn</p>
          </div>
        ) : (
          <div className={viewMode === "grid"
            ? "grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "flex flex-col gap-6"
          }>
            {paginatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                images={p.images}
                name={p.name}
                price={p.price}
                oldPrice={p.oldPrice}
                description={p.description}
                availability={p.availability}
                badge={p.badge}
                attributes={p.attributes}
                hasAttributes={p.hasAttributes}
              />
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(c => Math.max(1, c - 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-xl border border-gray-200 disabled:opacity-30 bg-white"
            >
              <ChevronLeft size={20} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-12 h-12 rounded-xl font-bold transition-all ${currentPage === i + 1
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-200"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-amber-300"
                  }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-xl border border-gray-200 disabled:opacity-30 bg-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
