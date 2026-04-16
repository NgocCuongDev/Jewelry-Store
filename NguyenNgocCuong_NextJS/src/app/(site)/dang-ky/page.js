"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, User, Mail, Phone, Lock, CheckCircle, Sparkles, Shield, Zap, Heart, PawPrint, Star, Award, Users } from "lucide-react";
import { toast } from "react-hot-toast";
import { registerUser } from "../api/apiUser";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [mounted, setMounted] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const router = useRouter();

  // Màu sắc sáng hơn, tươi sáng
  const gradients = [
    "from-green-400 to-emerald-600",
    "from-emerald-400 to-teal-500", 
    "from-yellow-400 to-amber-500"
  ];

  const [currentGradient, setCurrentGradient] = useState(0);

  // Features data với màu sắc tươi sáng
  const features = [
    {
      icon: Shield,
      title: "Bảo Mật Tuyệt Đối",
      description: "Dữ liệu thú cưng của bạn được mã hóa an toàn",
      color: "text-blue-600",
      gradient: "from-blue-400 to-sky-500",
      bg: "bg-blue-50"
    },
    {
      icon: Zap,
      title: "Tốc Độ Cao",
      description: "Trải nghiệm mượt mà với công nghệ hiện đại",
      color: "text-amber-600",
      gradient: "from-amber-400 to-orange-400",
      bg: "bg-amber-50"
    },
    {
      icon: Users,
      title: "Cộng Đồng Lớn",
      description: "Kết nối với hàng ngàn chủ thú cưng khác",
      color: "text-emerald-600",
      gradient: "from-emerald-400 to-green-500",
      bg: "bg-emerald-50"
    },
    {
      icon: Award,
      title: "Chuyên Nghiệp",
      description: "Đội ngũ bác sĩ thú y giàu kinh nghiệm",
      color: "text-violet-600",
      gradient: "from-violet-400 to-purple-500",
      bg: "bg-violet-50"
    }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  // Gradient rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGradient((prev) => (prev + 1) % gradients.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [gradients.length]);

  // Auto username generation
  useEffect(() => {
    if (formData.email && !formData.username) {
      const username = formData.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        username: username
      }));
    }
  }, [formData.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      calculatePasswordStrength(value);
    }

    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength >= 75) return "bg-emerald-500";
    if (passwordStrength >= 50) return "bg-amber-500";
    if (passwordStrength >= 25) return "bg-orange-500";
    return "bg-rose-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength >= 75) return "Rất mạnh";
    if (passwordStrength >= 50) return "Mạnh";
    if (passwordStrength >= 25) return "Trung bình";
    return "Yếu";
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Họ tên không được để trống";
    } else if (formData.name.length < 2) {
      errors.name = "Họ tên phải có ít nhất 2 ký tự";
    }

    if (!formData.email.trim()) {
      errors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Số điện thoại không được để trống";
    } else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone)) {
      errors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.username.trim()) {
      errors.username = "Tên đăng nhập không được để trống";
    } else if (formData.username.length < 3) {
      errors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    }

    if (!formData.password) {
      errors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        username: formData.username,
        password: formData.password,
        password_confirmation: formData.confirmPassword
      });

      if (result.success) {
        toast.success("🎉 Đăng ký thành công! Chào mừng đến với NNC PetShop!");
        if (mounted) {
          // Tự động đăng nhập sau khi đăng ký thành công
          localStorage.setItem('auth_token', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));
        }
        router.push("/");
      } else {
        toast.error(result.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error(error.message || "Đăng ký thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
          />
          <span className="text-slate-700 font-semibold">Khởi tạo Luxury Experience...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Background Elements sáng hơn */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-48 -right-48 w-96 h-96 bg-gradient-to-br ${gradients[currentGradient]} rounded-full blur-3xl opacity-20 transition-all duration-1000`}></div>
        <div className={`absolute -bottom-48 -left-48 w-96 h-96 bg-gradient-to-tr ${gradients[(currentGradient + 1) % gradients.length]} rounded-full blur-3xl opacity-20 transition-all duration-1000`}></div>
        
        {/* Grid Pattern tinh tế */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 30 - 15, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            {i % 4 === 0 ? (
              <PawPrint className="w-5 h-5 text-green-400/40" />
            ) : i % 4 === 1 ? (
              <Heart className="w-4 h-4 text-yellow-400/40" />
            ) : i % 4 === 2 ? (
              <Star className="w-4 h-4 text-emerald-400/40" />
            ) : (
              <Sparkles className="w-4 h-4 text-green-300/40" />
            )}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Column - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* Form Card sáng hơn */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl shadow-blue-100/50 overflow-hidden">
              {/* Header */}
              <div className="relative p-8 text-center border-b border-slate-100 bg-gradient-to-r from-white to-blue-50/50">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="flex items-center justify-center mb-6"
                >
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-800 rounded-2xl flex items-center justify-center shadow-2xl shadow-green-900/30">
                      <Shield className="w-10 h-10 text-white" />
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-3 border border-yellow-400/30 rounded-2xl"
                    />
                  </div>
                </motion.div>

                <motion.h1
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent mb-2"
                >
                  Tham Gia NNC PetShop
                </motion.h1>
                
                <motion.p
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-slate-600 text-sm"
                >
                  Tạo tài khoản để bắt đầu hành trình chăm sóc thú cưng
                </motion.p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Name & Email Row */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                  >
                    <label className="flex items-center text-sm font-medium text-slate-700">
                      <User className="w-4 h-4 mr-2 text-sky-500" />
                      Họ tên
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-3 py-2.5 bg-white border rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-300 text-sm ${
                          formErrors.name
                            ? "border-rose-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
                            : "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                        }`}
                        placeholder="Nguyễn Văn A"
                      />
                      <AnimatePresence>
                        {formData.name && !formErrors.name && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {formErrors.name && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-rose-500 text-xs mt-1"
                      >
                        {formErrors.name}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.55 }}
                    className="space-y-2"
                  >
                    <label className="flex items-center text-sm font-medium text-slate-700">
                      <Mail className="w-4 h-4 mr-2 text-blue-500" />
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-3 py-2.5 bg-white border rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-300 text-sm ${
                          formErrors.email
                            ? "border-rose-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
                            : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        }`}
                        placeholder="your@email.com"
                      />
                      <AnimatePresence>
                        {formData.email && !formErrors.email && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {formErrors.email && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-rose-500 text-xs mt-1"
                      >
                        {formErrors.email}
                      </motion.p>
                    )}
                  </motion.div>
                </div>

                {/* Phone & Username Row */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-2"
                  >
                    <label className="flex items-center text-sm font-medium text-slate-700">
                      <Phone className="w-4 h-4 mr-2 text-emerald-500" />
                      Điện thoại
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-3 py-2.5 bg-white border rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-300 text-sm ${
                          formErrors.phone
                            ? "border-rose-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
                            : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                        }`}
                        placeholder="0987654321"
                      />
                      <AnimatePresence>
                        {formData.phone && !formErrors.phone && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {formErrors.phone && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-rose-500 text-xs mt-1"
                      >
                        {formErrors.phone}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.65 }}
                    className="space-y-2"
                  >
                    <label className="flex items-center text-sm font-medium text-slate-700">
                      <User className="w-4 h-4 mr-2 text-amber-500" />
                      Tên đăng nhập
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`w-full px-3 py-2.5 bg-white border rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-300 text-sm ${
                          formErrors.username
                            ? "border-rose-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
                            : "border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                        }`}
                        placeholder="tendangnhap"
                      />
                      <AnimatePresence>
                        {formData.username && !formErrors.username && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {formErrors.username && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-rose-500 text-xs mt-1"
                      >
                        {formErrors.username}
                      </motion.p>
                    )}
                  </motion.div>
                </div>

                {/* Password Field */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-2"
                >
                  <label className="flex items-center text-sm font-medium text-slate-700">
                    <Lock className="w-4 h-4 mr-2 text-rose-500" />
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-3 py-2.5 bg-white border rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-300 text-sm ${
                        formErrors.password
                          ? "border-rose-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
                          : "border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength */}
                  {formData.password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-1 pt-2"
                    >
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Độ mạnh mật khẩu:</span>
                        <span className={passwordStrength >= 75 ? "text-emerald-600" : passwordStrength >= 50 ? "text-amber-600" : "text-rose-600"}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${passwordStrength}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className={`h-2 rounded-full transition-all duration-500 ${getPasswordStrengthColor()}`}
                        />
                      </div>
                    </motion.div>
                  )}

                  {formErrors.password && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-rose-500 text-xs mt-1"
                    >
                      {formErrors.password}
                    </motion.p>
                  )}
                </motion.div>

                {/* Confirm Password Field */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.75 }}
                  className="space-y-2"
                >
                  <label className="flex items-center text-sm font-medium text-slate-700">
                    <Shield className="w-4 h-4 mr-2 text-emerald-500" />
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-3 py-2.5 bg-white border rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-300 text-sm ${
                        formErrors.confirmPassword
                          ? "border-rose-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
                          : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-rose-500 text-xs mt-1"
                    >
                      {formErrors.confirmPassword}
                    </motion.p>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full"
                      />
                      <span className="text-white/90">Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                      <span>Tạo Tài Khoản</span>
                    </>
                  )}
                </motion.button>
              </form>

              {/* Footer */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="p-6 border-t border-slate-100 text-center bg-white/50"
              >
                <p className="text-slate-600 text-sm">
                  Đã có tài khoản?{" "}
                  <Link
                    href="/dang-nhap"
                    className="text-sky-600 hover:text-sky-700 font-semibold transition-colors duration-200 hover:underline"
                  >
                    Đăng nhập ngay
                  </Link>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Features Showcase sáng hơn */}
        <div className="flex-1 bg-gradient-to-br from-white to-blue-50/30 border-l border-slate-100 hidden lg:flex items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-2xl"
          >
            {/* Main Content */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center mb-8"
              >
                <div className="relative">
                  <div className="w-28 h-28 bg-gradient-to-br from-sky-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-sky-500/30">
                    <PawPrint className="w-14 h-14 text-white" />
                  </div>
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 3, repeat: Infinity }
                    }}
                    className="absolute -inset-5 border-2 border-sky-400/30 rounded-3xl"
                  />
                </div>
              </motion.div>

              <motion.h1
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-6xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-sky-700 bg-clip-text text-transparent mb-6"
              >
                NNC PetShop
              </motion.h1>

              <motion.p
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-2xl text-slate-700 mb-12 leading-relaxed font-light"
              >
                Nền tảng chăm sóc thú cưng<br />thông minh hàng đầu
              </motion.p>
            </div>

            {/* Features Carousel */}
            <div className="relative h-52">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <div className={`${features[activeFeature].bg} backdrop-blur-sm rounded-2xl border border-white/80 p-8 shadow-xl shadow-slate-200/50`}>
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 bg-gradient-to-br ${features[activeFeature].gradient} rounded-xl shadow-lg`}>
                        {(() => {
                          const IconComponent = features[activeFeature].icon;
                          return <IconComponent className="w-6 h-6 text-white" />;
                        })()}
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className={`text-lg font-semibold mb-2 ${features[activeFeature].color}`}>
                          {features[activeFeature].title}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {features[activeFeature].description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Feature Indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeFeature 
                      ? 'bg-sky-500 w-6' 
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>

            {/* Stats */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="grid grid-cols-3 gap-8 mt-16"
            >
              {[
                { number: "100K+", label: "Hội viên", color: "text-green-700" },
                { number: "25+", label: "Đối tác", color: "text-emerald-700" },
                { number: "99.9%", label: "An toàn", color: "text-yellow-600" }
              ].map((stat, index) => (
                <div key={index} className="text-center bg-white/50 p-4 rounded-2xl border border-white shadow-sm">
                  <div className={`text-2xl font-black ${stat.color} mb-1`}>{stat.number}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}