"use client";

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Zap, ChevronDown, Check, Diamond, ShieldCheck } from "lucide-react";
import { IMAGE_URL } from "../../config";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function ProductDetailClient({ product, selectedImage }) {
  const [qty, setQty] = useState(1);
  const [selectedAttrs, setSelectedAttrs] = useState({});
  const { addToCart } = useCart();
  const router = useRouter();

  // Gom nhóm attributes
  const groupedAttrs = product?.attributes?.reduce((acc, attr) => {
    const key = attr.attribute?.name || "Lựa chọn";
    if (!acc[key]) acc[key] = [];
    acc[key].push({
      value: attr.value,
      attribute_id: attr.attribute_id,
      attribute_name: attr.attribute?.name,
      product_attribute_id: attr.id
    });
    return acc;
  }, {}) || {};

  const handleSelectAttr = (name, value) => {
    setSelectedAttrs((prev) => ({ ...prev, [name]: value }));
  };

  const checkAllSelected = () => {
    const keys = Object.keys(groupedAttrs);
    return keys.every((k) => selectedAttrs[k]);
  };

  const getVariantInfo = () => {
    if (Object.keys(selectedAttrs).length === 0) return null;
    
    const variantString = Object.values(selectedAttrs).join(' - ');
    const selectedAttributesFull = [];
    
    Object.entries(selectedAttrs).forEach(([attrName, attrValue]) => {
      const attrGroup = groupedAttrs[attrName];
      if (attrGroup) {
        const selectedAttr = attrGroup.find(attr => attr.value === attrValue);
        if (selectedAttr) {
          selectedAttributesFull.push({
            attribute_id: selectedAttr.attribute_id,
            attribute_name: selectedAttr.attribute_name,
            value: selectedAttr.value,
            product_attribute_id: selectedAttr.product_attribute_id
          });
        }
      }
    });

    return {
      variantString: variantString,
      attributesFull: selectedAttributesFull
    };
  };

  const handleAdd = () => {
    if (!product) {
      toast.error("❌ Lỗi: Không có thông tin sản phẩm");
      return;
    }

    if (Object.keys(groupedAttrs).length > 0 && !checkAllSelected()) {
      toast.error("⚠️ Vui lòng chọn đầy đủ thuộc tính!");
      return;
    }

    const variantInfo = getVariantInfo();
    const productImage = selectedImage || product.thumbnail || "/images/placeholder.png";

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: productImage,
      qty: qty,
      variant: variantInfo?.variantString || null,
      attributes: selectedAttrs,
    };

    addToCart(cartItem);
    toast.success(`Đã thêm vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    if (Object.keys(groupedAttrs).length > 0 && !checkAllSelected()) {
      toast.error("⚠️ Vui lòng chọn đầy đủ thuộc tính!");
      return;
    }
    handleAdd();
    router.push("/gio-hang");
  };

  return (
    <div className="mt-8 space-y-8">
      {/* Attributes */}
      {Object.keys(groupedAttrs).length > 0 &&
        Object.entries(groupedAttrs).map(([attrName, values]) => (
          <div key={attrName}>
            <h3 className="text-sm font-bold text-neutral-900 mb-4 uppercase tracking-widest flex items-center gap-2">
              <Diamond size={14} className="text-amber-500" />
              Chọn {attrName}
            </h3>
            <div className="flex flex-wrap gap-3">
              {values.map((attr) => (
                <button
                  key={attr.value}
                  onClick={() => handleSelectAttr(attrName, attr.value)}
                  className={`px-6 py-3 rounded-2xl border-2 transition-all flex items-center gap-2 font-medium text-sm
                    ${selectedAttrs[attrName] === attr.value
                      ? "border-amber-500 bg-amber-50 text-amber-700 shadow-md scale-105"
                      : "border-gray-100 text-gray-500 hover:border-amber-200 hover:text-amber-600"
                    }`}
                >
                  {attr.value}
                  {selectedAttrs[attrName] === attr.value && <Check size={16} />}
                </button>
              ))}
            </div>
          </div>
        ))}

      {/* Quantity */}
      <div className="flex items-center gap-6">
        <span className="text-sm font-bold text-neutral-900 uppercase tracking-widest">Số lượng</span>
        <div className="flex items-center border-2 border-gray-100 rounded-2xl overflow-hidden bg-white">
          <button
            className="px-5 py-3 text-lg font-bold text-gray-400 hover:bg-gray-50 transition"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <div className="px-6 py-3 font-bold text-neutral-900 bg-gray-50/50">{qty}</div>
          <button
            className="px-5 py-3 text-lg font-bold text-gray-400 hover:bg-gray-50 transition"
            onClick={() => setQty((q) => q + 1)}
          >
            +
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="flex items-center justify-center gap-3 flex-1 px-8 py-5 
                     bg-neutral-900 text-amber-500 rounded-3xl font-bold shadow-xl border border-amber-500/20 
                     hover:bg-neutral-800 transition-all"
        >
          <ShoppingCart size={22} />
          THÊM VÀO GIỎ
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBuyNow}
          className="flex items-center justify-center gap-3 flex-1 px-8 py-5 
                     bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-3xl font-bold shadow-xl shadow-amber-200/50 
                     hover:from-amber-600 hover:to-amber-700 transition-all"
        >
          <Zap size={22} />
          MUA NGAY
        </motion.button>
      </div>

      {/* Guarantee */}
      <div className="bg-neutral-50 rounded-3xl p-6 border border-gray-100 mt-6">
         <div className="flex items-start gap-4">
            <div className="bg-amber-100 p-3 rounded-2xl">
                <ShieldCheck className="text-amber-600 w-6 h-6" />
            </div>
            <div>
                <h4 className="font-bold text-neutral-900 text-sm mb-1 uppercase">Cam kết chính hãng 100%</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Mọi sản phẩm trang sức tại NNC đều đi kèm chứng thư kiểm định chất lượng quốc tế và chế độ bảo hành vĩnh viễn.</p>
            </div>
         </div>
      </div>
    </div>
  );
}