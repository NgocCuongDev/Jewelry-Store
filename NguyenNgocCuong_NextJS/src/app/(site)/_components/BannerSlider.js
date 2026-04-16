"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBanners } from "../api/apiBanner";
import { IMAGE_URL } from "../../config";

export default function BannerSlider() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBanners();
        // Lọc banner chỉ lấy loại slideshow + status=1 + sort_order
        const filtered = data
          .filter((b) => b.position === "slideshow" && b.status === 1)
          .sort((a, b) => a.sort_order - b.sort_order);
        setBanners(filtered);
      } catch (error) {
        console.error("Lỗi khi load banner:", error);
      }
    };
    fetchData();
  }, []);

  if (!banners.length) return null;

  return (
    <div className="w-full mt-2 relative z-0">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        className="rounded-2xl overflow-hidden shadow-2xl"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={banner.id}>
            <div className="relative w-full h-[380px] md:h-[500px] lg:h-[500px]">
              {/* Hình banner */}
              <Image
                src={banner.image}
                alt={banner.name}
                fill
                priority={index === 0}
                className="object-cover transition-transform duration-700 hover:scale-105"
              />

              {/* Overlay mờ */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent flex items-center">
                <div className="max-w-2xl px-6 md:px-12 text-white space-y-4">
                  <h2 className="text-2xl md:text-4xl font-bold drop-shadow-lg">
                    {banner.name}
                  </h2>
                  {banner.description && (
                    <p className="text-sm md:text-lg opacity-90">
                      {banner.description}
                    </p>
                  )}
                  {banner.link && (
                    <Link
                      href={banner.link}
                      className="inline-block bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 px-6 py-3 rounded-full font-semibold text-white shadow-lg hover:shadow-2xl hover:scale-105 transition duration-300"
                    >
                      Khám phá ngay
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
