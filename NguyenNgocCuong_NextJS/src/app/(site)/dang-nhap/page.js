// app/(site)/dang-nhap/page.js
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { loginUser } from '../api/apiUser';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Smartphone, Sparkles, Shield, Zap, Crown, Gem, Rocket, Infinity, Brain } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const formRef = useRef();
  const { login } = useAuth();
  const router = useRouter();

  // Advanced features carousel với AI-powered content
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Experience",
      description: "Hệ thống thông minh học hỏi từ thói quen của bạn",
      color: "from-violet-600 to-purple-600",
      gradient: "bg-gradient-to-br from-violet-600/20 to-purple-600/20"
    },
    {
      icon: Rocket,
      title: "Next-Gen Performance",
      description: "Tốc độ load trang dưới 0.3s với công nghệ Quantum",
      color: "from-cyan-500 to-blue-600",
      gradient: "bg-gradient-to-br from-cyan-500/20 to-blue-600/20"
    },
    {
      icon: Gem,
      title: "Luxury Interface",
      description: "Thiết kế kim cương với hiệu ứng 3D parallax",
      color: "from-amber-500 to-orange-500",
      gradient: "bg-gradient-to-br from-amber-500/20 to-orange-500/20"
    },
    {
      icon: Infinity,
      title: "Limitless Scalability",
      description: "Hệ thống mở rộng vô hạn cho triệu người dùng",
      color: "from-emerald-500 to-teal-600",
      gradient: "bg-gradient-to-br from-emerald-500/20 to-teal-600/20"
    },
    {
      icon: Shield,
      title: "Military-Grade Security",
      description: "Mã hóa lượng tử bảo vệ thông tin của bạn",
      color: "from-green-500 to-emerald-600",
      gradient: "bg-gradient-to-br from-green-500/20 to-emerald-600/20"
    }
  ];

  // Chỉ chạy trên client
  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto rotate features với easing curve cao cấp
  useEffect(() => {
    if (!mounted) return;
    
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [mounted, features.length]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.identifier || !formData.password) {
      toast.error('🎯 Vui lòng điền đầy đủ thông tin!');
      return;
    }

    setLoading(true);

    try {
      const result = await loginUser(formData.identifier, formData.password);

      if (result.success) {
        login(result.user, result.token);
        toast.success('🚀 Đăng nhập thành công! Chào mừng đến với thế giới cao cấp!');
        router.push('/');
      } else {
        toast.error(result.message || 'Đăng nhập thất bại!');
      }
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      toast.error(`⚠️ ${errorMessage}`);
      console.error('Login error details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInputIcon = () => {
    const identifier = formData.identifier.toLowerCase();
    if (identifier.includes('@')) return Mail;
    if (/^\d+$/.test(identifier)) return Smartphone;
    return User;
  };

  const InputIcon = getInputIcon();

  // Component Particle an toàn cho SSR - SỬA LỖI ANIMATION
  const FloatingParticle = ({ index }) => {
    if (!mounted) return null;
    
    const initialX = Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000);
    const initialY = Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000);
    
    return (
      <motion.div
        className="absolute rounded-full"
        style={{
          background: `radial-gradient(circle, ${index % 3 === 0 ? 'rgba(139, 92, 246, 0.3)' : index % 3 === 1 ? 'rgba(6, 182, 212, 0.3)' : 'rgba(34, 197, 94, 0.3)'})`,
          width: Math.random() * 4 + 2,
          height: Math.random() * 4 + 2,
        }}
        initial={{
          x: initialX,
          y: initialY,
          scale: 0,
        }}
        animate={{
          x: initialX + (Math.random() - 0.5) * 200,
          y: initialY + (Math.random() - 0.5) * 200,
          scale: [0, 1, 0],
        }}
        transition={{
          duration: 5 + Math.random() * 5,
          repeat: Number.POSITIVE_INFINITY,
          delay: Math.random() * 2,
          ease: "easeInOut"
        }}
      />
    );
  };

  // Hiển thị loading khi chưa mount
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Đang tải Quantum Experience...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Quantum Background System */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Quantum Orbs - SỬA LỖI ANIMATION */}
        <motion.div
          className="absolute -top-60 -right-44 w-96 h-96 bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 rounded-full blur-4xl opacity-15"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-60 -left-44 w-96 h-96 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-full blur-4xl opacity-15"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.1, 0.15],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        {/* Holographic Grid */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse(60%_50%_at_50%_50%,black,transparent))]"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
          }}
        />

        {/* Quantum Energy Waves - SỬA LỖI ANIMATION */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            background: `conic-gradient(from 0deg at 50% 50%, #ec4899, #8b5cf6, #06b6d4, #10b981, #ec4899)`
          }}
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 20, 
            repeat: Number.POSITIVE_INFINITY, 
            ease: "linear"
          }}
        />
      </div>

      {/* Advanced Particle System */}
      <div className="absolute inset-0">
        {mounted && [...Array(40)].map((_, i) => (
          <FloatingParticle key={i} index={i} />
        ))}
      </div>

      {/* Quantum Energy Beams - SỬA LỖI ANIMATION */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
            style={{
              top: `${20 + i * 30}%`,
              left: '-100%',
              width: '200%',
              filter: 'blur(8px)'
            }}
            animate={{
              x: ['0%', '100%'],
            }}
            transition={{
              duration: 4 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 1.5,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-7xl grid grid-cols-1 xl:grid-cols-2 gap-16 items-center"
          style={{
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
          }}
        >
          {/* Left Side - Quantum Experience Showcase */}
          <div className="hidden xl:block space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="space-y-8"
            >
              {/* Premium Branding */}
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
                    <Crown className="w-7 h-7 text-white" />
                  </div>
                  <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl blur-lg opacity-50"
                    animate={{ rotate: 360 }}
                    transition={{ 
                      duration: 8, 
                      repeat: Number.POSITIVE_INFINITY, 
                      ease: "linear"
                    }}
                  />
                </motion.div>
                <div>
                  <h1 className="text-5xl font-black bg-gradient-to-r from-white via-cyan-100 to-purple-200 bg-clip-text text-transparent">
                    NNC PET
                  </h1>
                  <p className="text-lg text-cyan-300 font-light mt-1">NNC Experience</p>
                </div>
              </div>
              
              {/* Hero Text */}
              <div className="space-y-4">
                <p className="text-2xl text-gray-200 leading-relaxed font-light">
                  Bước vào <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent font-bold">thế giới </span> của thú cưng
                </p>
                <p className="text-lg text-gray-400 leading-relaxed">
                  Nơi công nghệ AI gặp gỡ tình yêu thú cưng, tạo ra trải nghiệm <span className="text-cyan-300">độc nhất vô nhị</span>
                </p>
              </div>
            </motion.div>

            {/* Quantum Features Carousel */}
            <div className="relative h-56">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeature}
                  initial={{ opacity: 0, x: 60, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -60, scale: 1.05 }}
                  transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute inset-0"
                >
                  <div className={`p-8 rounded-3xl ${features[currentFeature].gradient} backdrop-blur-2xl border border-white/10 shadow-2xl h-full relative overflow-hidden`}>
                    {/* Animated Background */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${features[currentFeature].color} opacity-5`}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ 
                        duration: 4, 
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut"
                      }}
                    />
                    
                    <div className="relative z-10 flex items-start gap-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`p-4 rounded-2xl bg-gradient-to-r ${features[currentFeature].color} shadow-2xl`}
                      >
                        {(() => {
                          const IconComponent = features[currentFeature].icon;
                          return <IconComponent className="w-7 h-7 text-white" />;
                        })()}
                      </motion.div>
                      <div className="flex-1 space-y-3">
                        <h3 className="text-xl font-bold text-white">
                          {features[currentFeature].title}
                        </h3>
                        <p className="text-gray-200 text-sm leading-relaxed font-light">
                          {features[currentFeature].description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Quantum Indicators */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                {features.map((_, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentFeature(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${
                      index === currentFeature 
                        ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50 w-8' 
                        : 'bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Quantum Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-6 pt-8"
            >
              {[
                { number: "50K+", label: "Thành Viên", color: "from-purple-500 to-pink-500" },
                { number: "10K+", label: "Sản Phẩm", color: "from-cyan-500 to-blue-500" },
                { number: "99.9%", label: "Hài Lòng", color: "from-emerald-500 to-green-500" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-5 bg-white/5 rounded-2xl backdrop-blur-lg border border-white/10 shadow-xl"
                >
                  <div className={`text-2xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.number}
                  </div>
                  <div className="text-xs text-gray-400 mt-2 font-light tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Side - Quantum Login Interface */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="w-full max-w-lg mx-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div
              animate={{
                y: isHovered ? -5 : 0,
                scale: isHovered ? 1.02 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {/* Quantum Glow Effect */}
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"
                animate={{
                  opacity: isHovered ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
              />
              
              <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                {/* Quantum Header */}
                <div className="p-10 text-center border-b border-white/10 relative overflow-hidden">
                  {/* Animated Header Background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5"
                    animate={{
                      x: [0, 100, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear"
                    }}
                  />
                  
                  <div className="relative z-10">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                      className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-cyan-500/30 mx-auto mb-6"
                    >
                      <Shield className="w-9 h-9 text-white" />
                    </motion.div>
                    
                    <motion.h2
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      className="text-4xl font-black bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent mb-3"
                    >
                      NNC Login
                    </motion.h2>
                    
                    <motion.p
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.0 }}
                      className="text-cyan-300 text-lg font-light"
                    >
                      Đăng nhập vào hệ thống NNC PetShop
                    </motion.p>
                  </div>
                </div>

                {/* Quantum Login Form */}
                <form className="p-10 space-y-8" onSubmit={handleSubmit}>
                  {/* Smart Identifier Input */}
                  <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.1 }}
                  >
                    <label className="flex items-center text-sm font-semibold text-cyan-200 mb-4">
                      <InputIcon className="w-5 h-5 mr-3" />
                      NNC Account
                    </label>
                    <div className="relative">
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        id="identifier"
                        name="identifier"
                        type="text"
                        required
                        className="w-full px-5 py-4 bg-white/5 border border-cyan-500/20 rounded-2xl text-white placeholder-cyan-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-300 backdrop-blur-lg"
                        placeholder="email, username hoặc quantum ID..."
                        value={formData.identifier}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 pointer-events-none"
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Quantum Password Input */}
                  <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    <label className="flex items-center text-sm font-semibold text-cyan-200 mb-4">
                      <Lock className="w-5 h-5 mr-3" />
                      Password Key
                    </label>
                    <div className="relative">
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="w-full px-5 py-4 bg-white/5 border border-cyan-500/20 rounded-2xl text-white placeholder-cyan-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-300 backdrop-blur-lg pr-14"
                        placeholder="••••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-300/70 hover:text-cyan-200 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Quantum Submit Button */}
                  <motion.button
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.3 }}
                    whileHover={{ scale: loading ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-black text-lg py-5 px-8 rounded-2xl transition-all duration-500 transform shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 disabled:shadow-none flex items-center justify-center gap-4 group relative overflow-hidden"
                  >
                    {/* Animated Background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20"
                      animate={{
                        x: ['0%', '100%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear"
                      }}
                    />
                    
                    <div className="relative z-10 flex items-center gap-3">
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full"
                          />
                          <span className="text-white/90">Đang kích hoạt account...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />
                          <span>Kích Hoạt NNC Account</span>
                        </>
                      )}
                    </div>
                  </motion.button>

                  {/* Demo Quantum Account */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="text-center p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl backdrop-blur-lg"
                  >
                    <p className="text-amber-300 text-sm font-medium">
                      <Gem className="w-4 h-4 inline mr-2 mb-1" />
                      <strong>NNC Demo:</strong> nguyenngoccuong / your_password
                    </p>
                  </motion.div>

                  {/* Quantum Registration */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="text-center pt-6 border-t border-cyan-500/20"
                  >
                    <p className="text-cyan-300/80 text-sm font-light mb-4">
                      Chưa có  account?
                    </p>
                    <Link
                      href="/dang-ky"
                      className="inline-flex items-center gap-3 text-cyan-300 hover:text-cyan-200 font-semibold transition-all duration-300 hover:gap-4 group"
                    >
                      <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="bg-gradient-to-r from-cyan-300 to-cyan-200 bg-clip-text text-transparent">
                        Tạo NNC Account
                      </span>
                      <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </Link>
                  </motion.div>
                </form>
              </div>
            </motion.div>

            {/* Quantum Security Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="flex items-center justify-center gap-3 mt-8 text-cyan-400/70 text-sm font-light"
            >
              <Shield className="w-5 h-5" />
              <span>Quantum Encryption • Military Grade • 100% Secure</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}