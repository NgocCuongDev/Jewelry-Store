"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Khi pathname đổi → scroll top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  useEffect(() => {
    // Xử lý khi click lại chính link hiện tại (ví dụ: đang ở "/" mà click "/")
    const handleClick = (e) => {
      const anchor = e.target.closest("a[href]");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const currentPath = window.location.pathname;

      // Nếu bấm đúng link đang ở (ví dụ "/" → "/")
      if (href === currentPath || href === currentPath + "/") {
        e.preventDefault(); // Ngăn reload
        // Cuộn về đầu thủ công
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
