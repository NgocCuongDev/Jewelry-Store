// app/(site)/thong-tin/page.js
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { getCurrentUser, updateUser, changePassword } from '../api/apiUser';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User, Mail, Phone, MapPin, Camera, Save, Edit3, Shield,
  Crown, Calendar, Star, Award, CreditCard, Package,
  Heart, Settings, LogOut, Sparkles, Zap, Lock, Key, Eye, EyeOff
} from 'lucide-react';

export default function ProfilePage() {
  const { user: contextUser, logout, updateUserProfile } = useAuth();
  const [user, setUser] = useState(contextUser);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [imagePreview, setImagePreview] = useState(null);
  const router = useRouter();

  // Form data cho thông tin cá nhân
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: ''
  });

  // Form data cho đổi mật khẩu
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Stats mẫu
  const userStats = [
    { icon: Package, label: 'Đơn hàng', value: '24', color: 'from-blue-500 to-cyan-500' },
    { icon: Heart, label: 'Yêu thích', value: '18', color: 'from-pink-500 to-rose-500' },
    { icon: Star, label: 'Đánh giá', value: '36', color: 'from-amber-500 to-orange-500' },
    { icon: Award, label: 'Điểm tích lũy', value: '1,250', color: 'from-purple-500 to-pink-500' }
  ];

  // Recent activities
  const recentActivities = [
    { action: 'Đặt hàng', item: 'Thức ăn cho mèo', time: '2 giờ trước', type: 'order' },
    { action: 'Đánh giá', item: 'Sữa tắm cho chó', time: '1 ngày trước', type: 'review' },
    { action: 'Thêm vào yêu thích', item: 'Chuồng mèo cao cấp', time: '2 ngày trước', type: 'favorite' },
    { action: 'Cập nhật thông tin', item: 'Địa chỉ giao hàng', time: '3 ngày trước', type: 'update' }
  ];

  // Hàm xử lý chuyển trang đơn hàng
  const handleOrdersClick = () => {
    router.push('/don-hang');
  };

  // Hàm xử lý chuyển trang yêu thích
  const handleFavoritesClick = () => {
    router.push('/yeu-thich');
  };

  // Navigation items với handler
  const navigationItems = [
    { id: 'profile', icon: User, label: 'Thông tin cá nhân', onClick: () => setActiveTab('profile') },
    { id: 'security', icon: Shield, label: 'Bảo mật', onClick: () => setActiveTab('security') },
    { id: 'orders', icon: Package, label: 'Đơn hàng', onClick: handleOrdersClick },
    { id: 'favorites', icon: Heart, label: 'Yêu thích', onClick: handleFavoritesClick },
    { id: 'settings', icon: Settings, label: 'Cài đặt', onClick: () => setActiveTab('settings') }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      if (!contextUser) return;

      setLoading(true);
      try {
        const currentUser = await getCurrentUser();
        if (currentUser.success) {
          console.log('✅ Fetched user data:', currentUser.user);
          setUser(currentUser.user);
          setFormData({
            name: currentUser.user.name || '',
            email: currentUser.user.email || '',
            phone: currentUser.user.phone || '',
            address: currentUser.user.address || '',
            avatar: currentUser.user.avatar || ''
          });

          console.log('🔍 Required fields check:', {
            username: currentUser.user.username,
            roles: currentUser.user.roles,
            status: currentUser.user.status
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [contextUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        username: user.username,
        roles: user.roles,
        address: formData.address,
        status: user.status || 1,
      };

      console.log('📤 Sending JSON payload:', payload);

      const result = await updateUser(user.id, payload);

      if (result.success) {
        updateUserProfile(result.user);
        setUser(result.user);
        setIsEditing(false);
        toast.success('🎉 Cập nhật thông tin thành công!');
      } else {
        toast.error(result.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      console.error('Update error:', error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.values(errors).forEach(errorArray => {
          errorArray.forEach(message => toast.error(message));
        });
      } else {
        toast.error(error.message || 'Có lỗi xảy ra khi cập nhật');
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setChangingPassword(true);

    try {
      // Validate mật khẩu
      if (passwordData.new_password !== passwordData.new_password_confirmation) {
        toast.error('Mật khẩu xác nhận không khớp!');
        return;
      }

      if (passwordData.new_password.length < 6) {
        toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
        return;
      }

      console.log('🔐 Changing password:', passwordData);

      const result = await changePassword(passwordData);

      if (result.success) {
        toast.success('🔒 Đổi mật khẩu thành công!');
        setPasswordData({
          current_password: '',
          new_password: '',
          new_password_confirmation: ''
        });
      } else {
        toast.error(result.message || 'Đổi mật khẩu thất bại');
      }
    } catch (error) {
      console.error('Password change error:', error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.values(errors).forEach(errorArray => {
          errorArray.forEach(message => toast.error(message));
        });
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Có lỗi xảy ra khi đổi mật khẩu');
      }
    } finally {
      setChangingPassword(false);
    }
  };

  // Thêm useEffect này để debug
  useEffect(() => {
    console.log('🔍 User context changed:', contextUser);
  }, [contextUser]);

  useEffect(() => {
    console.log('🔍 User state changed:', user);
  }, [user]);

  useEffect(() => {
    console.log('🔍 Form data changed:', formData);
  }, [formData]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('👋 Đã đăng xuất thành công!');
    } catch (error) {
      toast.error('❌ Đăng xuất thất bại');
    }
  };

  const getAvatarUrl = (avatar) => {
    if (!avatar) return "/images/default-avatar.png";
    if (avatar.startsWith('http')) return avatar;
    if (avatar.startsWith('uploads/')) {
      return `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/storage/${avatar}`;
    }
    return avatar;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 text-lg">Đang tải thông tin người dùng...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Chưa đăng nhập</h2>
          <p className="text-gray-600 mb-4">Vui lòng đăng nhập để xem thông tin</p>
          <button
            onClick={() => window.location.href = '/dang-nhap'}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-4"
            >
              Thông Tin Cá Nhân
            </motion.h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Quản lý thông tin tài khoản và theo dõi hoạt động của bạn
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:w-96"
            >
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sticky top-8">
                {/* User Card */}
                <div className="text-center mb-8">
                  <div className="relative inline-block mb-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative"
                    >
                      <img
                        src={imagePreview || getAvatarUrl(user.avatar)}
                        alt={user.name}
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg mx-auto"
                      />
                      {isEditing && activeTab === 'profile' && (
                        <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer shadow-lg">
                          <Camera className="w-4 h-4" />
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      )}
                    </motion.div>
                  </div>

                  <h2 className="text-xl font-bold text-gray-800 mb-1">{user.name}</h2>
                  <p className="text-gray-600 text-sm mb-3">{user.email}</p>

                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    <Crown className="w-4 h-4" />
                    {user.roles === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={item.onClick}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${activeTab === item.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                        }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300 mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Đăng xuất</span>
                </button>
              </div>

              {/* Stats Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 grid grid-cols-2 gap-4"
              >
                {userStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-2xl p-4 text-center shadow-lg border border-gray-100"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-2`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex-1 space-y-8"
            >
              {/* Profile Tab */}
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-white mb-2">Thông Tin Cá Nhân</h2>
                          <p className="text-blue-100">Quản lý thông tin tài khoản của bạn</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsEditing(!isEditing)}
                          className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all duration-300 hover:shadow-lg"
                        >
                          {isEditing ? (
                            <>
                              <Edit3 className="w-5 h-5" />
                              Đang chỉnh sửa
                            </>
                          ) : (
                            <>
                              <Edit3 className="w-5 h-5" />
                              Chỉnh sửa
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                          <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                            <User className="w-4 h-4 mr-2" />
                            Họ và tên
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-100 disabled:text-gray-500"
                            placeholder="Nhập họ và tên"
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-100 disabled:text-gray-500"
                            placeholder="Nhập địa chỉ email"
                          />
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                            <Phone className="w-4 h-4 mr-2" />
                            Số điện thoại
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-100 disabled:text-gray-500"
                            placeholder="Nhập số điện thoại"
                          />
                        </div>

                        {/* Role */}
                        <div>
                          <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                            <Shield className="w-4 h-4 mr-2" />
                            Vai trò
                          </label>
                          <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-500">
                            {user.roles === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                          </div>
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                          <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                            <MapPin className="w-4 h-4 mr-2" />
                            Địa chỉ
                          </label>
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-100 disabled:text-gray-500 resize-none"
                            placeholder="Nhập địa chỉ của bạn"
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {isEditing && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-4 mt-8 pt-6 border-t border-gray-200"
                        >
                          <button
                            type="submit"
                            disabled={saving}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {saving ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                />
                                Đang lưu...
                              </>
                            ) : (
                              <>
                                <Save className="w-5 h-5" />
                                Lưu thay đổi
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditing(false);
                              setFormData({
                                name: user.name || '',
                                email: user.email || '',
                                phone: user.phone || '',
                                address: user.address || '',
                                avatar: user.avatar || ''
                              });
                              setImagePreview(null);
                            }}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
                          >
                            Hủy bỏ
                          </button>
                        </motion.div>
                      )}
                    </form>
                  </motion.div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-white mb-2">Bảo Mật Tài Khoản</h2>
                          <p className="text-green-100">Đổi mật khẩu và quản lý bảo mật</p>
                        </div>
                        <Key className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Password Change Form */}
                    <form onSubmit={handlePasswordSubmit} className="p-8">
                      <div className="max-w-2xl mx-auto space-y-6">
                        <div>
                          <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                            <Lock className="w-4 h-4 mr-2" />
                            Mật khẩu hiện tại
                          </label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              name="current_password"
                              value={passwordData.current_password}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                              placeholder="Nhập mật khẩu hiện tại"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                            <Key className="w-4 h-4 mr-2" />
                            Mật khẩu mới
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              name="new_password"
                              value={passwordData.new_password}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                              placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                              required
                              minLength={6}
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                            <Key className="w-4 h-4 mr-2" />
                            Xác nhận mật khẩu mới
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="new_password_confirmation"
                              value={passwordData.new_password_confirmation}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                              placeholder="Xác nhận mật khẩu mới"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        {/* Action Button */}
                        <motion.button
                          type="submit"
                          disabled={changingPassword}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {changingPassword ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                              />
                              Đang đổi mật khẩu...
                            </>
                          ) : (
                            <>
                              <Lock className="w-5 h-5" />
                              Đổi mật khẩu
                            </>
                          )}
                        </motion.button>

                        {/* Security Tips */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                          <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Mẹo bảo mật
                          </h3>
                          <ul className="text-sm text-blue-600 space-y-1">
                            <li>• Sử dụng mật khẩu ít nhất 6 ký tự</li>
                            <li>• Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                            <li>• Không sử dụng mật khẩu dễ đoán</li>
                            <li>• Đổi mật khẩu định kỳ 3-6 tháng</li>
                          </ul>
                        </div>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Recent Activities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Hoạt Động Gần Đây</h3>
                  <Zap className="w-6 h-6 text-yellow-500" />
                </div>

                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300"
                    >
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${activity.type === 'order' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'review' ? 'bg-green-100 text-green-600' :
                          activity.type === 'favorite' ? 'bg-pink-100 text-pink-600' :
                            'bg-purple-100 text-purple-600'
                        }`}>
                        {activity.type === 'order' && <Package className="w-5 h-5" />}
                        {activity.type === 'review' && <Star className="w-5 h-5" />}
                        {activity.type === 'favorite' && <Heart className="w-5 h-5" />}
                        {activity.type === 'update' && <Edit3 className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{activity.action}</div>
                        <div className="text-sm text-gray-600">{activity.item}</div>
                      </div>
                      <div className="text-sm text-gray-500">{activity.time}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}