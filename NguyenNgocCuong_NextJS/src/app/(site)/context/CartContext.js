// app/(site)/context/CartContext.js - PHIÊN BẢN HOÀN CHỈNH
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

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

  // 🎯 LOAD CART TỪ LOCALSTORAGE - CHỈ KHI KHỞI TẠO
  useEffect(() => {
    if (!initialized) return;

    const savedCart = localStorage.getItem('cart');
    const savedUser = localStorage.getItem('user');

    console.log("🔄 CartContext - Loading cart:", {
      initialized,
      hasUser: !!user,
      hasSavedCart: !!savedCart,
      hasSavedUser: !!savedUser
    });

    // 🎯 CHỈ LOAD CART NẾU CÓ USER VÀ CART TRONG LOCALSTORAGE
    if (savedCart && savedUser) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log("📦 Loaded cart from localStorage:", parsedCart.length, "items");

        const validatedCart = parsedCart.map(item => ({
          ...item,
          image: validateAndNormalizeImage(item.image)
        }));

        setCart(validatedCart);
      } catch (error) {
        console.error("❌ Error loading cart:", error);
        setCart([]);
      }
    } else {
      // 🎯 NẾU KHÔNG CÓ USER HOẶC KHÔNG CÓ CART TRONG LOCALSTORAGE, RESET CART
      setCart([]);
    }

    setCartLoaded(true);
  }, [initialized]);

  // 🎯 LƯU CART VÀO LOCALSTORAGE - KHI CART HOẶC USER THAY ĐỔI
  useEffect(() => {
    if (!initialized || !cartLoaded) return;

    console.log("💾 Saving cart to localStorage - User:", user?.email);

    if (user && cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
      console.log("💾 Saved cart to localStorage:", cart.length, "items");
    } else if (!user) {
      localStorage.removeItem('cart');
      console.log("🧹 Removed cart from localStorage - No user");
    }
  }, [cart, user, initialized, cartLoaded]);

  // 🎯 XỬ LÝ ĐĂNG XUẤT - XÓA CART KHI USER CHUYỂN TỪ CÓ -> KHÔNG
  useEffect(() => {
    if (!initialized || !cartLoaded) return;

    const savedUser = localStorage.getItem('user');
    
    if (savedUser && !user) {
      console.log("🚪 User logged out - Clearing cart");
      setCart([]);
      localStorage.removeItem('cart');
      toast.success("Đã đăng xuất và xóa giỏ hàng");
    }
  }, [user, initialized, cartLoaded]);

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
      } else {
        newCart = [...prev];
        newCart[productIndex] = { ...currentItem, qty: currentItem.qty - 1 };
        message = `➖ Đã giảm số lượng "${currentItem.name}${currentItem.variant ? ` - ${currentItem.variant}` : ''}"`;
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
    
    if (user && newCart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(newCart));
    } else {
      localStorage.removeItem('cart');
    }
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