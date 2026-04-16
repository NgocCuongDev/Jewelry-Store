"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Eye, Tag, Sparkles, Diamond } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useRouter, usePathname } from "next/navigation";

export default function ProductCard({ 
  id, 
  images, 
  name, 
  price, 
  oldPrice, 
  badge,
  description,
  availability,
  attributes = [],
  hasAttributes = false
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  const hasSale = oldPrice && oldPrice > price;
  const discountPercent = hasSale ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const displayAttributes = attributes.slice(0, 2);

  const productUrl = `/chi-tiet-san-pham/${id}`;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productData = {
      id: id,
      name: name,
      price: price,
      oldPrice: oldPrice,
      image: images[0],
      qty: 1
    };

    addToCart(productData);
  };

  return (
    <motion.div
      className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden border border-gray-100 hover:border-amber-300/50 relative flex flex-col h-full"
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium Badge */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {badge && (
          <motion.span 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm border border-white/20 flex items-center gap-1 uppercase tracking-wider"
          >
            <Diamond className="w-3 h-3" />
            {badge}
          </motion.span>
        )}
        
        {/* Availability Badge */}
        {availability !== undefined && (
          <motion.span 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`text-[9px] font-bold px-2 py-1 rounded-lg backdrop-blur-md border ${
              availability > 0 
                ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                : "bg-rose-50 text-rose-600 border-rose-100"
            }`}
          >
            {availability > 0 ? `Sẵn hàng: ${availability}` : "Hết hàng"}
          </motion.span>
        )}
      </div>

      {/* Discount Badge */}
      {hasSale && (
        <div className="absolute top-4 right-4 z-20">
          <motion.span 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="bg-neutral-900 text-amber-500 text-xs font-black px-3 py-2 rounded-full shadow-lg border border-amber-500/20"
          >
            -{discountPercent}%
          </motion.span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative overflow-hidden bg-[#fcfcfc] flex-shrink-0">
        <Link href={productUrl}>
          <div className="relative h-64 w-full overflow-hidden">
            <motion.img
              src={images[currentImage]}
              alt={name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1, transition: { duration: 1 } }}
            />
            
            <div className={`absolute inset-0 bg-gradient-to-t from-neutral-900/40 via-transparent to-transparent transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

            {/* Action Buttons */}
            <motion.div 
              className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3 transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white text-neutral-900 p-4 rounded-2xl shadow-xl hover:bg-amber-500 hover:text-white transition-all duration-300 border border-amber-100 group/btn"
                onClick={() => router.push(productUrl)}
              >
                <Eye className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="bg-neutral-900 text-amber-500 p-4 rounded-2xl shadow-xl hover:bg-amber-600 hover:text-white transition-all duration-300 border border-amber-500/30"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </Link>
      </div>

      {/* Product Info */}
      <div className="p-6 flex flex-col flex-1">
        <Link href={productUrl}>
          <h3 className="font-serif font-bold text-lg text-neutral-900 hover:text-amber-600 transition-colors duration-300 line-clamp-1 mb-1 leading-tight flex-none">
            {name}
          </h3>
        </Link>

        {/* Description */}
        {description && (
          <p className="text-gray-400 text-xs line-clamp-2 mb-4 italic leading-relaxed min-h-[2rem]">
            {description}
          </p>
        )}

        <div className="mt-auto">
          {/* Pricing */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div className="flex flex-col">
              <span className="text-xl font-black text-amber-600">
                {price.toLocaleString('vi-VN')}₫
              </span>
              {hasSale && (
                <span className="text-sm text-gray-400 line-through font-medium">
                  {oldPrice.toLocaleString('vi-VN')}₫
                </span>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-neutral-900 text-amber-500 p-3 rounded-xl shadow-lg hover:bg-amber-600 hover:text-white transition-all duration-300 hidden lg:block border border-amber-500/20"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Mobile Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full bg-neutral-900 text-amber-500 py-4 rounded-2xl shadow-lg mt-4 lg:hidden font-bold flex items-center justify-center gap-3 border border-amber-500/20"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Thêm vào giỏ</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
