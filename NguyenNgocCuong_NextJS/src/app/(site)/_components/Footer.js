// components/Footer.jsx
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  // Dữ liệu cho các link chính sách
  const policyLinks = [
    { name: "Tìm kiếm", href: "/search" },
    { name: "Giới thiệu", href: "/about" },
    { name: "Chính sách đổi trả", href: "/return-policy" },
    { name: "Chính sách bảo mật", href: "/privacy-policy" },
    { name: "Điều khoản dịch vụ", href: "/terms-of-service" },
    { name: "Liên hệ", href: "/lien-he" },
  ];

  // Dữ liệu cho các link hỗ trợ khách hàng
  const customerSupportLinks = [
    { name: "Sản phẩm khuyến mãi", href: "/khuyen-mai" },
    { name: "Sản phẩm nổi bật", href: "/products?filter=featured" },
    { name: "Tất cả sản phẩm", href: "/san-pham" },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Về chúng tôi */}
        <div>
          <h3 className="text-xl font-extrabold mb-4 text-gray-800 flex items-center gap-2 relative">
            <span className="text-2xl">🐾</span> NNC PET SHOP
            <span className="absolute left-0 -bottom-1 w-52 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></span>
          </h3>
          <p className="text-sm mb-4 leading-relaxed">
            Cung cấp sản phẩm chất lượng từ các thương hiệu hàng đầu, cam kết
            mang đến trải nghiệm mua sắm tuyệt vời nhất cho bạn.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2" suppressHydrationWarning>
              <span>📍</span> 150 Đình Phong Phú, Thủ Đức, Tp.HCM
            </li>
            <li className="flex items-center gap-2">
              <span>📞</span> 0999999999
            </li>
            <li className="flex items-center gap-2">
              <span>📧</span> nncpetshopsupport@gmail.com
            </li>
          </ul>
          <div className="flex items-center gap-6 mt-5">
            {[
              { src: "/images/facebook-icon.png", label: "Facebook", href: "https://facebook.com/nncpetshop" },
              { src: "/images/zalo-icon.png", label: "Zalo", href: "https://zalo.me/0999999999" },
              { src: "/images/instagram-icon.png", label: "Instagram", href: "https://instagram.com/nncpetshop" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-xs text-gray-600 hover:scale-110 transition-transform"
              >
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                  <Image src={item.src} alt={item.label} width={28} height={28} />
                </a>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chính sách */}
        <div>
          <h4 className="text-lg font-semibold mb-3 relative">
            Chính sách
            <span className="absolute left-0 -bottom-1 w-24 h-0.5 bg-pink-500 rounded-full"></span>
          </h4>
          <ul className="space-y-2 text-sm">
            {policyLinks.map((item, idx) => (
              <li key={idx}>
                <Link 
                  href={item.href} 
                  className="hover:text-pink-600 transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Hỗ trợ khách hàng */}
        <div>
          <h4 className="text-lg font-semibold mb-3 relative">
            Hỗ trợ khách hàng
            <span className="absolute left-0 -bottom-1 w-40 h-0.5 bg-pink-500 rounded-full"></span>
          </h4>
          <ul className="space-y-2 text-sm">
            {customerSupportLinks.map((item, idx) => (
              <li key={idx}>
                <Link 
                  href={item.href} 
                  className="hover:text-pink-600 transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Đăng ký nhận tin */}
        <div>
          <h4 className="text-lg font-semibold mb-3 relative">
            Đăng ký nhận tin
            <span className="absolute left-0 -bottom-1 w-37 h-0.5 bg-pink-500 rounded-full"></span>
          </h4>
          <form className="flex mb-5">
            <input
              type="email"
              placeholder="Nhập địa chỉ email"
              className="flex-1 px-3 py-2 text-sm rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-yellow-400 text-white text-sm px-5 py-2 rounded-r-full hover:opacity-90 transition"
            >
              Đăng ký
            </button>
          </form>
          <h4 className="text-lg font-semibold mb-3">Phương thức thanh toán</h4>
          <div className="flex items-center gap-6 flex-wrap">
            {[
              { src: "/images/applepay-icon.png", label: "Apple Pay" },
              { src: "/images/viettelpay-icon.png", label: "ViettelPay" },
              { src: "/images/momo-icon.png", label: "Momo" },
              { src: "/images/zalopay-icon.png", label: "ZaloPay" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-xs text-gray-600 hover:scale-105 transition-transform"
              >
                <Image src={item.src} alt={item.label} width={40} height={24} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hàng cuối */}
      <div className="bg-gray-100 text-center py-4 text-xs text-gray-600">
        © 2025 <span className="font-semibold">NNC Shop</span>. All rights reserved.
      </div>
    </footer>
  );
}