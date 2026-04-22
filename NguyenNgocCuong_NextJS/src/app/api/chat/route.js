import { NextResponse } from "next/server";

const API_BASE = "http://localhost:8900/api/";

export async function POST(req) {
  try {
    const { message } = await req.json();
    const msg = message.toLowerCase();

    // 1. Xử lý điều hướng
    if (msg.includes("giỏ hàng") || msg.includes("gio-hang")) {
      return NextResponse.json({
        success: true,
        reply: "Đang chuyển bạn đến **Giỏ hàng** của bạn... 🛒✨",
        command: { destination: "cart" }
      });
    }

    if (msg.includes("trang cá nhân") || msg.includes("profile") || msg.includes("tài khoản")) {
      return NextResponse.json({
        success: true,
        reply: "Đang mở **Trang cá nhân** của bạn... 👤🐾",
        command: { destination: "profile" }
      });
    }

    if (msg.includes("đơn hàng") || msg.includes("order")) {
      return NextResponse.json({
        success: true,
        reply: "Đang kiểm tra **Danh sách đơn hàng** của bạn... 📦✨",
        command: { destination: "orders" }
      });
    }

    if (msg.includes("trang chủ") || msg.includes("home")) {
      return NextResponse.json({
        success: true,
        reply: "Đang đưa bạn về **Trang chủ**... 🏠✨",
        command: { destination: "home" }
      });
    }

    // 2. Xử lý tìm kiếm sản phẩm
    if (msg.includes("tìm") || msg.includes("search") || msg.includes("có") || msg.includes("mua")) {
      let query = msg.replace(/tìm|search|có|mua|không|giúp|tôi/g, "").trim();

      if (query.length < 2) {
        return NextResponse.json({
          success: true,
          reply: "Bạn muốn tìm sản phẩm gì ạ? Hãy nhập tên sản phẩm nhé! 🐶"
        });
      }

      try {
        const res = await fetch(`${API_BASE}catalog/products/search?name=${encodeURIComponent(query)}`);
        const products = await res.json();

        if (products && products.length > 0) {
          return NextResponse.json({ 
            success: true, 
            reply: `Tôi đã tìm thấy **${products.length} sản phẩm** phù hợp với yêu cầu của bạn. Bạn xem thử nhé! 🐾`,
            products: products.slice(0, 5) // Trả về tối đa 5 sản phẩm để hiển thị card
          });
        } else {
          return NextResponse.json({
            success: true,
            reply: `Rất tiếc, tôi chưa tìm thấy sản phẩm nào tên là "${query}". Bạn thử tìm từ khóa khác nhé! 🐱`
          });
        }
      } catch (error) {
        return NextResponse.json({
          success: true,
          reply: "Hệ thống tìm kiếm đang bận, bạn vui lòng thử lại sau nhé! 😅"
        });
      }
    }

    // 3. Thông tin liên hệ
    if (msg.includes("khuyến mãi") || msg.includes("sale") || msg.includes("giảm giá")) {
      return NextResponse.json({
        success: true,
        reply: "Đang mở danh sách **Khuyến mãi hấp dẫn**... 🔥🐾",
        command: { destination: "promotions" }
      });
    }

    if (msg.includes("giới thiệu") || msg.includes("cửa hàng")) {
      return NextResponse.json({
        success: true,
        reply: "Đang đưa bạn đến trang **Giới thiệu** về NNC PET SHOP... ✨🐾",
        command: { destination: "about" }
      });
    }

    if (msg.includes("sản phẩm") || msg.includes("tất cả")) {
      return NextResponse.json({
        success: true,
        reply: "Đang mở danh sách **Tất cả sản phẩm**... 📦✨",
        command: { destination: "all-products" }
      });
    }

    if (msg.includes("liên hệ") || msg.includes("hotline") || msg.includes("số điện thoại") || msg.includes("giúp")) {
      return NextResponse.json({
        success: true,
        reply: "Đang chuyển bạn đến trang **Liên hệ**... 📞🐾",
        command: { destination: "contact" }
      });
    }

    // 4. Phản hồi mặc định
    return NextResponse.json({
      success: true,
      reply: "Chào bạn! Tôi là trợ lý ảo của **NNC PET SHOP**. Tôi có thể giúp bạn:\n- **Tìm kiếm sản phẩm** (ví dụ: 'tìm thức ăn')\n- **Đi đến các trang** (Giỏ hàng, Khuyến mãi, Sản phẩm...)\n- **Thông tin liên hệ & Giới thiệu**\n\nBạn cần hỗ trợ gì không ạ? 🐶🐾"
    });

  } catch (error) {
    console.error("❌ Custom Bot Error:", error);
    return NextResponse.json({
      success: false,
      reply: "Xin lỗi, tôi gặp chút trục trặc. Bạn thử lại nhé!"
    });
  }
}
