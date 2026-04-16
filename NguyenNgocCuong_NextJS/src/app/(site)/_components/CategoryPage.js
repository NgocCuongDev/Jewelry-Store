"use client";

import { useParams } from "next/navigation";
import categories from "./CategoryData";
import products from "./ProductData";
import ProductCard from "./ProductCard";

export default function CategoryPage() {
  const { slug } = useParams();
  const category = categories.find((c) => c.slug === slug);
  const filteredProducts = products.filter(
    (p) => p.category === category?.id || p.category === category?.name
  );

  if (!category) return <p className="text-center py-10">Danh mục không tồn tại</p>;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">{category.name}</h1>
        <p className="text-gray-500 mt-2">{category.description}</p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Chưa có sản phẩm nào</p>
      )}
    </div>
  );
}
