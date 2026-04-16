"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });

  // Kiểm tra đăng nhập
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/user"); // API lấy thông tin user
        setUser(res.data);
        setFormData({ name: res.data.name, email: res.data.email, phone: res.data.phone });
        const orderRes = await axios.get(`/api/orders?userId=${res.data.id}`);
        setOrders(orderRes.data);
      } catch (error) {
        toast.error("Bạn chưa đăng nhập!");
        router.push("/login");
      }
    };
    fetchUser();
  }, [router]);

  // Update thông tin cá nhân
  const handleUpdateProfile = async () => {
    try {
      await axios.put(`/api/user/${user.id}`, formData);
      toast.success("Cập nhật thông tin thành công!");
    } catch {
      toast.error("Cập nhật thất bại!");
    }
  };

  // Update avatar
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    const form = new FormData();
    form.append("avatar", file);
    try {
      const res = await axios.post(`/api/user/${user.id}/avatar`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAvatar(res.data.avatar);
      toast.success("Cập nhật avatar thành công!");
    } catch {
      toast.error("Cập nhật avatar thất bại!");
    }
  };

  // Đổi mật khẩu
  const handleChangePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      return toast.error("Mật khẩu mới không khớp!");
    }
    try {
      await axios.post(`/api/user/${user.id}/change-password`, passwordData);
      toast.success("Đổi mật khẩu thành công!");
      setPasswordData({ current: "", new: "", confirm: "" });
    } catch {
      toast.error("Đổi mật khẩu thất bại!");
    }
  };

  // Hủy đơn hàng
  const handleCancelOrder = async (orderId) => {
    try {
      await axios.put(`/api/orders/${orderId}/cancel`);
      setOrders((prev) => prev.map(o => o.id === orderId ? { ...o, status: "Đã hủy" } : o));
      toast.success("Hủy đơn hàng thành công!");
    } catch {
      toast.error("Hủy đơn thất bại!");
    }
  };

  if (!user) return null; // Hoặc loading spinner

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Thông tin tài khoản</h1>

      {/* Thông tin avatar */}
      <div className="flex items-center gap-6 mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
          <Image
            src={avatar || user.avatar || "/default-avatar.png"}
            alt="Avatar"
            width={96}
            height={96}
            className="object-cover"
          />
        </div>
        <input type="file" onChange={handleAvatarChange} className="text-sm" />
      </div>

      {/* Thông tin cá nhân */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Cập nhật thông tin</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Họ và tên"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={handleUpdateProfile}
          className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Cập nhật
        </button>
      </div>

      {/* Đổi mật khẩu */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Đổi mật khẩu</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <input
            type="password"
            placeholder="Mật khẩu hiện tại"
            value={passwordData.current}
            onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={passwordData.new}
            onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={passwordData.confirm}
            onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={handleChangePassword}
          className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Đổi mật khẩu
        </button>
      </div>

      {/* Danh sách đơn hàng */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Đơn hàng của bạn</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">Chưa có đơn hàng nào.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2">Mã đơn</th>
                <th className="py-2">Ngày</th>
                <th className="py-2">Tổng tiền</th>
                <th className="py-2">Trạng thái</th>
                <th className="py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{order.code}</td>
                  <td className="py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-2">{order.total.toLocaleString()}₫</td>
                  <td className="py-2">{order.status}</td>
                  <td className="py-2">
                    {order.status === "Chưa xác thực" && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Hủy đơn
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
