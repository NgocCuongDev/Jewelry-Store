"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import blog from "../../_components/BlogData";

export default function BlogDetailPage({ params }) {
  // Lấy slug từ dynamic route
  const { slug } = use(params);

  // Tìm post theo slug trong BlogData
  const post = blog.find((p) => p.slug === slug);
  if (!post) return <div className="p-6">❌ Bài viết không tồn tại</div>;

  // Bài viết liên quan
  const related = blog.filter((p) => p.id !== post.id).slice(0, 3);

  // Dynamic import framer-motion
  const [Motion, setMotion] = useState(null);
  useEffect(() => {
    let mounted = true;
    import("framer-motion")
      .then((mod) => mounted && setMotion(() => mod.motion))
      .catch(() => { });
    return () => {
      mounted = false;
    };
  }, []);

  // State cho current URL
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    // Chỉ set URL khi chạy trên client
    setCurrentUrl(window.location.href);
  }, []);

  // Wrapper để tránh warning khi Motion chưa load
  const Wrapper = ({ children, motionProps = {}, ...rest }) => {
    if (Motion) {
      return (
        <Motion.div {...motionProps} {...rest}>
          {children}
        </Motion.div>
      );
    }
    // bỏ whileInView khi Motion chưa load
    const { whileInView, viewport, ...safeProps } = motionProps;
    return (
      <div {...safeProps} {...rest}>
        {children}
      </div>
    );
  };

  return (
    <article className="max-w-7xl mx-auto">
      {/* HERO */}
      <div className="relative h-80 md:h-[420px] w-full">
        <Image
          src={post.image || "/images/placeholder.webp"}
          alt={post.title}
          fill
          priority
          className="object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="absolute bottom-8 left-6 md:left-12 text-white max-w-3xl">
          <Wrapper
            motionProps={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6 },
            }}
          >
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
              {post.title}
            </h1>
            <p className="mt-3 text-sm text-gray-200">
              ✍ {post.author} · 📅 {post.date} · ⏱ {post.readTime}
            </p>
          </Wrapper>
        </div>
      </div>

      {/* LAYOUT */}
      <div className="px-4 md:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* CONTENT */}
        <main className="lg:col-span-8">
          <Wrapper
            motionProps={{
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: false, amount: 0.15 },
              transition: { duration: 0.6 },
            }}
            className="prose prose-lg max-w-none prose-p:text-gray-700 prose-headings:text-gray-900 prose-img:rounded-xl"
          >
            {post.content.map((block, i) => {
              if (block.type === "p") return <p key={i}>{block.text}</p>;
              if (block.type === "h2") return <h2 key={i}>{block.text}</h2>;
              if (block.type === "blockquote")
                return (
                  <blockquote
                    key={i}
                    className="border-l-4 border-pink-500 pl-4 italic text-gray-600"
                  >
                    {block.text}
                  </blockquote>
                );
              if (block.type === "ul")
                return (
                  <ul key={i} className="list-disc pl-6">
                    {block.text.map((li, j) => (
                      <li key={j}>{li}</li>
                    ))}
                  </ul>
                );
              return null;
            })}

            {/* Inline gallery */}
            <div className="grid grid-cols-2 gap-3 my-6">
              <figure className="relative h-44 rounded-xl overflow-hidden">
                <Image
                  src="/images/blog/blog-2.webp"
                  alt="inline-1"
                  fill
                  className="object-cover"
                  draggable={false}
                />
              </figure>
              <figure className="relative h-44 rounded-xl overflow-hidden">
                <Image
                  src="/images/blog/blog-3.webp"
                  alt="inline-2"
                  fill
                  className="object-cover"
                  draggable={false}
                />
              </figure>
            </div>
          </Wrapper>

          {/* TAGS + SHARE */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-8">
            <div className="flex items-center gap-3 flex-wrap">
              {post.tags.map((t) => (
                <Link
                  key={t}
                  href={`/bai-viet/tag/${t}`}
                  className="text-sm px-3 py-1 rounded-full border border-gray-200 text-gray-700 hover:bg-pink-50"
                >
                  #{t}
                </Link>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-3">
              <span className="text-sm text-gray-500">Chia sẻ:</span>
              <div className="flex gap-2">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    currentUrl
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm"
                >
                  Facebook
                </a>
                <button
                  onClick={() =>
                    navigator.clipboard?.writeText(currentUrl)
                  }
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm"
                >
                  Sao chép link
                </button>
              </div>
            </div>
          </div>

          {/* AUTHOR BOX */}
          <div className="mt-10 bg-white border rounded-xl p-5 flex gap-4 items-center">
            <div className="relative w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
              <Image
                src="/images/avatar-placeholder.png"
                alt="author"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-semibold">Admin</p>
              <p className="text-sm text-gray-600">Chuyên gia chăm sóc thú cưng</p>
              <p className="text-sm text-gray-500 mt-2">
                Theo dõi để nhận bài viết mới
              </p>
            </div>
            <div className="ml-auto">
              <Link href="/author/admin" className="text-sm text-pink-600 font-medium">
                Xem trang tác giả →
              </Link>
            </div>
          </div>

          {/* COMMENTS */}
          <div className="mt-12">
            <h4 className="text-lg font-semibold mb-4">Bình luận</h4>
            <form className="space-y-3">
              <textarea
                className="w-full border rounded-md p-3 resize-y min-h-[80px]"
                placeholder="Viết bình luận..."
              />
              <div className="flex gap-3">
                <input
                  className="border rounded-md px-3 py-2 flex-1"
                  placeholder="Tên"
                />
                <input
                  className="border rounded-md px-3 py-2 w-48"
                  placeholder="Email"
                />
                <button className="px-4 py-2 bg-pink-500 text-white rounded-md">
                  Gửi
                </button>
              </div>
            </form>
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div>
                    <div className="text-sm font-semibold">Lan</div>
                    <div className="text-xs text-gray-500">2 giờ trước</div>
                    <div className="mt-2 text-sm text-gray-700">
                      Cảm ơn bài viết, rất hữu ích cho mèo con nhà mình!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* SIDEBAR */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            {/* Search */}
            <div className="bg-white p-4 rounded-xl shadow">
              <input
                placeholder="Tìm bài viết..."
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            {/* Related posts */}
            <div className="bg-white p-4 rounded-xl shadow">
              <h5 className="font-semibold mb-3">Bài viết liên quan</h5>
              <div className="grid gap-3">
                {related.map((r) => (
                  <Link
                    key={r.slug} // Sử dụng slug thay vì id
                    href={`/bai-viet/${r.slug}`}
                    className="flex gap-3 items-center"
                  >

                    <div className="relative w-16 h-12 rounded-md overflow-hidden bg-gray-100">
                      <Image
                        src={r.image || "/images/placeholder.webp"}
                        alt={r.title}
                        fill
                        className="object-cover"
                        draggable={false}
                      />
                    </div>
                    <div className="text-sm text-gray-800 line-clamp-2">
                      {r.title}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-4 rounded-xl shadow">
              <h6 className="font-semibold">Theo dõi tin tức</h6>
              <p className="text-sm mt-2">
                Đăng ký nhận bài viết mới nhất qua email.
              </p>
              <div className="mt-3 flex gap-2">
                <input
                  placeholder="Email của bạn"
                  className="rounded-md px-3 py-2 text-black flex-1"
                />
                <button className="px-3 py-2 bg-white/20 rounded-md">
                  Đăng ký
                </button>
              </div>
            </div>

            {/* Tag cloud */}
            <div className="bg-white p-4 rounded-xl shadow">
              <h5 className="font-semibold mb-3">Thẻ</h5>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/bai-viet/tag/${t}`}
                    className="text-xs px-2 py-1 border rounded-full text-gray-700"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}