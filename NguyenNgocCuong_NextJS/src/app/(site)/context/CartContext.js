// app/(site)/context/CartContext.js - PHIÊN BẢN HOÀN CHỈNH
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
import { getCartFromDB, addItemToDBCart, removeItemFromDBCart } from "../api/apiCart";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { user, initialized } = useAuth();
  const [cartLoaded, setCartLoaded] = useState(false);
  const router = useRouter();

  // 🎯 HÀM VALIDATE VÀ CHUẨN HÓA ẢNH
  const validateAndNormalizeImage = (image) => {
    if (!image) return "/images/placeholder.png";
    if (image.startsWith('http')) return image;
    if (image.startsWith('/')) return `${process.env.NEXT_PUBLIC_IMAGE_URL || ''}${image}`;
    return "/images/placeholder.png";
  };

  // 🎯 LẤY CART ID CHO SECURE SYNC
  const getCartId = () => {
    if (user?.id) return `user-${user.id}`;
    if (typeof window !== 'undefined') {
      let sessionId = localStorage.getItem('cart_session_id');
      if (!sessionId) {
        sessionId = `guest-${Date.now()}`;
        localStorage.setItem('cart_session_id', sessionId);
      }
      return sessionId;
    }
    return 'default-cart';
  };

  // 🎯 LOAD CART TỪ DATABASE (BỎ QUA LOCALSTORAGE)
  useEffect(() => {
    if (!initialized) return;

    console.log("🔄 CartContext - Fetching cart from DB for:", user?.email || "Guest");

    getCartFromDB(getCartId())
      .then((backendCart) => {
        console.log("📦 Loaded cart from backend DB:", backendCart.length, "items");
        const parsedCart = backendCart.map(item => ({
          id: item.product.catalogId || item.product.id,
          name: item.product.productName || item.product.name,
          price: item.product.price,
          qty: item.quantity,
          image: validateAndNormalizeImage(item.product.imageUrl),
          variant: null
        }));
        setCart(parsedCart);
      })
      .catch((error) => {
        console.error("❌ Error loading cart from DB:", error);
        setCart([]);
      })
      .finally(() => {
        setCartLoaded(true);
      });
  }, [user, initialized]);

  // 🎯 HÀM TÌM SẢN PHẨM CHÍNH XÁC
  const findProduct = (id, variant = null) => {
    const normalizedId = String(id);
    return cart.findIndex(item =>
      String(item.id) === normalizedId &&
      ((!item.variant && !variant) || item.variant === variant)
    );
  };

  // 🎯 HÀM ADD TO CART
  const addToCart = (product) => {
    if (!initialized) {
      toast.error("⏳ Hệ thống đang khởi tạo, vui lòng thử lại sau");
      return;
    }

    if (!product.id) {
      console.error("❌ Product missing id:", product);
      toast.error("Lỗi: Sản phẩm không có ID");
      return;
    }

    console.log("🛒 Adding to cart - User:", user?.email || "Guest", "Product:", product.name);

    const validatedImage = validateAndNormalizeImage(product.image);

    let productIndex = -1;
    let message = "";

    setCart((prev) => {
      productIndex = findProduct(product.id, product.variant);

      if (productIndex !== -1) {
        const newCart = [...prev];
        newCart[productIndex] = {
          ...newCart[productIndex],
          qty: newCart[productIndex].qty + (product.qty || 1),
          image: validatedImage
        };
        message = `📈 Đã tăng số lượng "${product.name}${product.variant ? ` - ${product.variant}` : ''}"`;
        
        // 🔄 ĐỒNG BỘ BACKEND BACKGROUND
        addItemToDBCart(getCartId(), product.id, newCart[productIndex].qty).catch(console.error);
        
        return newCart;
      } else {
        const newItem = {
          ...product,
          qty: product.qty || 1,
          id: product.id,
          variant: product.variant || null,
          image: validatedImage
        };
        message = `✅ Đã thêm "${product.name}${product.variant ? ` - ${product.variant}` : ''}" vào giỏ hàng!`;
        
        // 🔄 ĐỒNG BỘ BACKEND BACKGROUND
        addItemToDBCart(getCartId(), product.id, newItem.qty).catch(console.error);

        return [...prev, newItem];
      }
    });

    setTimeout(() => {
      if (message) toast.success(message);
    }, 0);
  };

  // ➖ GIẢM SỐ LƯỢNG
  const decreaseQty = (id, variant = null) => {
    if (!initialized) return;

    setCart((prev) => {
      const productIndex = findProduct(id, variant);
      if (productIndex === -1) {
        toast.error("Không tìm thấy sản phẩm để giảm số lượng");
        return prev;
      }

      const currentItem = prev[productIndex];
      let newCart;
      let message = "";

      if (currentItem.qty <= 1) {
        newCart = prev.filter((_, index) => index !== productIndex);
        message = `❌ Đã xóa "${currentItem.name}${currentItem.variant ? ` - ${currentItem.variant}` : ''}" khỏi giỏ!`;
        
        // 🔄 XÓA KHỎI BACKEND
        removeItemFromDBCart(getCartId(), id).catch(console.error);
      } else {
        newCart = [...prev];
        newCart[productIndex] = { ...currentItem, qty: currentItem.qty - 1 };
        message = `➖ Đã giảm số lượng "${currentItem.name}${currentItem.variant ? ` - ${currentItem.variant}` : ''}"`;
        
        // 🔄 CẬP NHẬT LÊN BACKEND
        addItemToDBCart(getCartId(), id, newCart[productIndex].qty).catch(console.error);
      }

      setTimeout(() => {
        if (message) message.includes('❌') ? toast.error(message) : toast.success(message);
      }, 0);

      return newCart;
    });
  };

  // ❌ XÓA SẢN PHẨM
  const removeFromCart = (id, variant = null) => {
    if (!initialized) return;

    setCart((prev) => {
      const productIndex = findProduct(id, variant);
      if (productIndex === -1) {
        toast.error("Không tìm thấy sản phẩm để xóa");
        return prev;
      }

      const removedItem = prev[productIndex];
      const newCart = prev.filter((_, index) => index !== productIndex);

      // 🔄 XÓA KHỎI BACKEND
      removeItemFromDBCart(getCartId(), id).catch(console.error);

      setTimeout(() => {
        toast.error(`❌ Đã xóa "${removedItem.name}${removedItem.variant ? ` - ${removedItem.variant}` : ''}" khỏi giỏ!`);
      }, 0);

      return newCart;
    });
  };

  // 🗑️ XÓA TOÀN BỘ GIỎ HÀNG
  const clearCart = () => {
    if (!initialized) return;

    console.log("🧹 Clearing entire cart");
    setCart([]);
    setTimeout(() => {
      toast.success("🧹 Đã xóa toàn bộ giỏ hàng");
    }, 0);
  };

  // 🔍 LẤY TỔNG SỐ LƯỢNG SẢN PHẨM
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.qty, 0);
  };

  // 🔍 LẤY TỔNG TIỀN
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.qty), 0);
  };

  // 🎯 HÀM ĐỒNG BỘ CART SAU KHI TẠO ĐƠN HÀNG THÀNH CÔNG
  const syncCartAfterOrder = (newCart = []) => {
    if (!initialized) return;
    
    console.log("🔄 Syncing cart after order creation");
    setCart(newCart);
  };

  // 🎯 HÀM MỚI ĐỂ CHUYỂN ĐẾN TRANG THANH TOÁN
  const navigateToCheckout = () => {
    if (!initialized || !cartLoaded) {
      toast.error("⏳ Hệ thống đang khởi tạo, vui lòng thử lại sau");
      return false;
    }

    if (cart.length === 0) {
      toast.error("Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi thanh toán.");
      return false;
    }

    if (!user) {
      toast.error("🔐 Vui lòng đăng nhập để thanh toán");
      router.push("/dang-nhap?redirect=thanh-toan");
      return false;
    }

    // 🎯 CHUYỂN HƯỚNG ĐẾN TRANG THANH TOÁN
    router.push("/thanh-toan");
    return true;
  };

  // 🎯 HÀM KIỂM TRA CÓ THỂ THANH TOÁN KHÔNG
  const canCheckout = () => {
    return initialized && cartLoaded && cart.length > 0 && !!user;
  };

  const value = {
    cart,
    addToCart,
    decreaseQty,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
    syncCartAfterOrder,
    navigateToCheckout,
    canCheckout,
    getCartId,
    cartInitialized: initialized && cartLoaded
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};