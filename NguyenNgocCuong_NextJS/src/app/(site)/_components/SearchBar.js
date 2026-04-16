"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, X, Diamond, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { searchProducts } from "../api/apiProduct";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        setError(null);
        const data = await searchProducts(query.trim());
        setResults(data || []);
        setIsOpen(true);
      } catch (err) {
        console.error(err);
        setError("Không thể kết nối đến máy chủ API (404 hoặc Network). Vui lòng Restart Backend.");
        setResults([]);
        setIsOpen(true);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchResults, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/san-pham?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto group" ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm tuyệt tác trang sức..."
          className="w-full rounded-2xl pl-6 pr-14 py-4 text-neutral-800 bg-white/80 backdrop-blur-md border border-neutral-200 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-300 shadow-sm group-hover:shadow-md font-light italic"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {query && (
            <button 
              type="button"
              onClick={() => setQuery("")}
              className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <X size={18} />
            </button>
          )}
          <button 
            type="submit"
            className="bg-neutral-900 text-amber-500 p-2.5 rounded-xl hover:bg-amber-600 hover:text-white transition-all duration-300 shadow-lg shadow-amber-500/10"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
          </button>
        </div>
      </form>

      {/* Results Dropdown */}
      {isOpen && query && (
        <div className="absolute top-full mt-3 w-full bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border border-amber-50 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-4 bg-amber-50/50 border-b border-amber-100 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-widest flex items-center gap-2">
              <Diamond size={12} className="text-amber-500" />
              Kết quả tìm kiếm
            </span>
            <span className="text-[10px] text-amber-700 bg-amber-100/50 px-2 py-0.5 rounded-full">
              {results.length} sản phẩm
            </span>
          </div>

          <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
            {error ? (
              <div className="p-10 text-center">
                <X size={40} className="mx-auto text-rose-200 mb-3" />
                <p className="text-rose-600 font-bold mb-2">Lỗi kết nối</p>
                <p className="text-neutral-500 text-xs italic">{error}</p>
              </div>
            ) : results.length === 0 ? (
              <div className="p-10 text-center">
                <Search size={40} className="mx-auto text-neutral-200 mb-3" />
                <p className="text-neutral-500 font-serif italic text-sm">Không tìm thấy " {query.trim()} "</p>
              </div>
            ) : (
              <div className="divide-y divide-amber-50">
                {results.slice(0, 6).map((product) => (
                  <Link
                    key={product.id}
                    href={`/chi-tiet-san-pham/${product.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-amber-50/80 transition-all duration-200 group/item"
                  >
                    <div className="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden border border-amber-100 bg-white">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-neutral-900 truncate group-hover/item:text-amber-700 transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-amber-600 font-black text-sm">
                          {product.price.toLocaleString("vi-VN")}₫
                        </span>
                        {product.oldPrice > product.price && (
                          <span className="text-[10px] text-neutral-400 line-through">
                            {product.oldPrice.toLocaleString("vi-VN")}₫
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-neutral-300 group-hover/item:text-amber-500 group-hover/item:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {results.length > 0 && (
            <Link
              href={`/san-pham?search=${encodeURIComponent(query)}`}
              onClick={() => setIsOpen(false)}
              className="block p-4 bg-neutral-900 text-amber-500 text-center font-bold text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
            >
              Xem tất cả kết quả cho " {query} "
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
