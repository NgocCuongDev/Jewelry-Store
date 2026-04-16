"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import posts from "../_components/BlogData";

export default function AllPostsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Lấy danh sách categories duy nhất
  const categories = useMemo(() => {
    const cats = posts.map((p) => p.category);
    return ["Tất cả", ...Array.from(new Set(cats))];
  }, []);

  // Lọc bài viết theo category
  const filteredPosts = useMemo(() => {
    if (selectedCategory === "Tất cả") return posts;
    return posts.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // Phân trang
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          🐾 Tất cả bài viết
        </h1>
        <p className="mt-3 text-gray-600">
          Tổng hợp các bài viết mới nhất về thú cưng
        </p>
      </div>

      {/* FILTER */}
      <div className="flex justify-center gap-3 mb-8 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition
              ${
                selectedCategory === cat
                  ? "bg-pink-600 text-white border-pink-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-pink-50"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {paginatedPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
          >
            {/* IMAGE */}
            <div className="relative w-full h-48">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="text-sm text-pink-600 font-medium">
                {post.category}
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mt-1 line-clamp-2">
                {post.title}
              </h2>
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                {post.excerpt}
              </p>

              {/* META */}
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                <span>✍ {post.author}</span>
                <span>·</span>
                <span>📅 {post.date}</span>
                <span>·</span>
                <span>⏱ {post.readTime}</span>
              </div>

              {/* TAGS */}
              <div className="flex flex-wrap gap-2 mt-3">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-4">
                <Link
                  href={`/bai-viet/${post.slug}`}
                  className="inline-block px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700"
                >
                  Đọc tiếp →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`px-3 py-1 rounded-md border text-sm font-medium transition
                ${
                  currentPage === p
                    ? "bg-pink-600 text-white border-pink-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-pink-50"
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
