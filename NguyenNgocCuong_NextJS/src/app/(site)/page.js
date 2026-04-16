// app/(site)/page.js
"use client";

import { useState, useEffect } from "react";
import ProductNew from "./_components/ProductNew";
import ProductSale from "./_components/ProductSale";
import CategoryWithProducts from "./_components/CategoryWithProducts";
import BlogSection from "./_components/BlogSection";
import blog from "./_components/BlogData";
import ScrollToTop from "./_components/ScrollToTop";
import { getNewProducts, getSaleProducts } from "../(site)/api/apiProduct";

export default function Home() {
  const [newProducts, setNewProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const [newProds, saleProds] = await Promise.all([
          getNewProducts(8),
          getSaleProducts(8),
        ]);
        setNewProducts(newProds);
        setSaleProducts(saleProds);
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div
      className="min-h-screen max-w-8xl mx-auto p-4"
      style={{
        background: `linear-gradient(to bottom,
      #ecfdf5,  /* xanh ngọc siêu nhạt */
      #f0f9ff,  /* xanh da trời siêu nhạt */
      #eff6ff,  /* xanh dương siêu nhạt */
      #fefce8,  /* vàng siêu nhạt */
      #fff7ed,  /* cam siêu nhạt */
      #fff1f2,  /* hồng siêu nhạt */
      #fee2e2   /* đỏ siêu nhạt */
    )`
      }}
    >
      {/* Nút scroll to top */}
      <ScrollToTop />

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-400"></div>
        </div>
      ) : (
        <>
          {/* Sản phẩm mới */}
          <ProductNew products={newProducts} />

          {/* Sản phẩm khuyến mãi */}
          <ProductSale products={saleProducts} />

          {/* Danh mục + sản phẩm */}
          <CategoryWithProducts />

          {/* Blog */}
          <BlogSection blog={blog} />
        </>
      )}
    </div>
  );
}
