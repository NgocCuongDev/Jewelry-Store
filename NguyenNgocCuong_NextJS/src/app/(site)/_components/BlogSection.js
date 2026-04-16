"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getPosts } from "../api/apiPost";
import { IMAGE_URL } from "../../config";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function BlogSection() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPosts();
      const mapped = data.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        image: p.thumbnail,
        excerpt: p.content ? p.content.substring(0, 120) + "..." : "",
        date: p.createdAt ? new Date(p.createdAt).toLocaleDateString("vi-VN") : "N/A",
        author: "NNC Pet Shop",
      }));
      setBlogs(mapped);
    };
    fetchData();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      {/* Tiêu đề phong cách Jewelry */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 
                       bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 
                       bg-clip-text text-transparent">
          💎 Góc Cảm Hứng & Xu Hướng
        </h2>
        <p className="text-gray-500 italic text-lg">Khám phá thế giới trang sức tinh xảo và đẳng cấp</p>
        <div className="mt-4 h-1 w-24 mx-auto bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"></div>
      </motion.div>

      {/* Grid bài viết */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.2 }}
        className="grid gap-10 md:grid-cols-2 lg:grid-cols-3"
      >
        {blogs.map((post) => (
          <motion.div
            key={post.id}
            variants={item}
            className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl 
                       transition-all duration-500 border border-gray-100 flex flex-col"
            whileHover={{ y: -10 }}
          >
            {/* Overlay Gradient khi hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

            {/* Ảnh */}
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-amber-600 shadow-sm">
                  NEW TREND
                </span>
              </div>
            </div>

            {/* Nội dung */}
            <div className="p-7 flex flex-col flex-1 relative z-10">
              <div className="text-xs font-semibold text-amber-500 tracking-widest uppercase mb-3 flex items-center gap-2">
                <span>{post.date}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>By {post.author}</span>
              </div>

              <Link href={`/bai-viet/${post.slug}`}>
                <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-amber-600 transition-colors leading-tight">
                  {post.title}
                </h3>
              </Link>

              <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
                {post.excerpt}
              </p>

              <div className="mt-auto">
                <Link
                  href={`/bai-viet/${post.slug}`}
                  className="inline-flex items-center text-sm font-bold text-gray-900 group-hover:text-amber-500 transition-all gap-2"
                >
                  Đọc Blog <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Nút xem thêm */}
      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Link
          href="/bai-viet"
          className="inline-block px-10 py-4 bg-gray-900 text-white font-bold rounded-full 
                     hover:bg-amber-600 transition-colors shadow-xl hover:shadow-amber-200"
        >
          Khám phá tất cả bài viết
        </Link>
      </motion.div>
    </section>
  );
}
