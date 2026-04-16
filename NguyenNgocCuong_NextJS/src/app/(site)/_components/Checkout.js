"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function CheckoutButton({ cart }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const total = cart.reduce((sum, p) => sum + p.price * p.qty, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (!form.name || !form.email || !form.phone || !form.address) {
      toast.error("Vui lòng điền đầy đủ thông tin người nhận.");
      return;
    }

    setLoading(true);
    try {
      // Gửi thông tin đơn hàng lên backend
      await axios.post("/api/orders", {
        customer: form,
        items: cart,
        total,
      });

      // Gửi email xác nhận
      await axios.post("/api/send-email", {
        to: form.email,
        subject: "Xác nhận đơn hàng",
        body: `Cảm ơn ${form.name}, đơn hàng của bạn đã được ghi nhận với tổng số tiền: ${total.toLocaleString("vi-VN")}₫`,
      });

      toast.success("Đặt hàng thành công! Email xác nhận đã gửi.");
    } catch (error) {
      console.error(error);
      toast.error("Đặt hàng thất bại. Vui lòng thử lại.");
    }
    setLoading(false);
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Thông tin người nhận</h3>
      <div className="space-y-3 mb-4">
        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          name="phone"
          placeholder="Số điện thoại"
          value={form.phone}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          name="address"
          placeholder="Địa chỉ nhận hàng"
          value={form.address}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
        />
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-semibold text-lg shadow-md transition"
      >
        {loading ? "Đang xử lý..." : "Thanh toán"}
      </button>
    </div>
  );
}
