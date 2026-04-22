// src/app/(site)/quen-mat-khau/page.js
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { forgotPassword, verifyResetCode, resetUserPassword } from '../api/apiUser';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Shield, Zap, Sparkles, CheckCircle2, ArrowLeft, Loader2, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Pass, 4: Success
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState({ new: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const router = useRouter();

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

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Vui lòng nhập Email!');
    setLoading(true);
    try {
      await forgotPassword(email);
      setStep(2);
      toast.success('🚀 Mã xác thực đã được gửi tới Email của bạn!');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Không thể gửi mã. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!code) return toast.error('Vui lòng nhập mã OTP!');
    setLoading(true);
    try {
      await verifyResetCode(email, code);
      setStep(3);
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Mã xác thực không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) return toast.error('Mật khẩu không khớp!');
    setLoading(true);
    try {
      await resetUserPassword(email, code, password.new);
      setStep(4);
      toast.success('💎 Mật khẩu đã được cập nhật thành công!');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Lỗi khi cập nhật mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background System (Reused from login for consistency) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-60 -right-44 w-96 h-96 bg-purple-600/20 rounded-full blur-4xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div 
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse(60%_50%_at_50%_50%,black,transparent))]"
          style={{ transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)` }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-8 text-center border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
            <Link href="/dang-nhap" className="absolute left-6 top-8 text-cyan-400/50 hover:text-cyan-300 transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <motion.div 
              className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-cyan-500/20"
              whileHover={{ rotate: 5, scale: 1.05 }}
            >
              {step === 4 ? <CheckCircle2 className="text-white" size={32} /> : <KeyRound className="text-white" size={32} />}
            </motion.div>
            <h1 className="text-3xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-200">
              {step === 4 ? 'Hoàn Thành' : 'Quên Mật Khẩu'}
            </h1>
            <p className="text-cyan-300/60 text-sm mt-2">Dịch vụ khôi phục tài khoản Quantum</p>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.form
                  key="step1"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  onSubmit={handleSendCode}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-cyan-200/50 uppercase tracking-widest flex items-center gap-2">
                      <Mail size={14} /> Email khôi phục
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Nhập email của bạn..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                      required
                    />
                  </div>
                  <CtaButton loading={loading} text="Gửi mã xác thực" icon={<Zap size={20} />} />
                </motion.form>
              )}

              {step === 2 && (
                <motion.form
                  key="step2"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  onSubmit={handleVerifyCode}
                  className="space-y-6"
                >
                  <p className="text-gray-400 text-sm italic text-center">
                    Mã 6 chữ số đã được gửi tới <span className="text-cyan-300">{email}</span>
                  </p>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-cyan-200/50 uppercase tracking-widest flex items-center gap-2">
                      <Shield size={14} /> Mã OTP 6 số
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="0 0 0 0 0 0"
                      maxLength={6}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-center text-2xl tracking-[1em] font-black focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-mono"
                      required
                    />
                  </div>
                  <CtaButton loading={loading} text="Xác thực mã" icon={<Sparkles size={20} />} />
                  <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-cyan-300/50 hover:text-cyan-300 transition-colors uppercase font-bold tracking-widest">
                    Quay lại nhập Email
                  </button>
                </motion.form>
              )}

              {step === 3 && (
                <motion.form
                  key="step3"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  onSubmit={handleResetPassword}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-cyan-200/50 uppercase tracking-widest flex items-center gap-2">
                      <Lock size={14} /> Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={password.new}
                      onChange={(e) => setPassword({ ...password, new: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-cyan-200/50 uppercase tracking-widest flex items-center gap-2">
                      <Lock size={14} /> Xác nhận mật khẩu
                    </label>
                    <input
                      type="password"
                      value={password.confirm}
                      onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                      required
                    />
                  </div>
                  <CtaButton loading={loading} text="Cập nhật mật khẩu" icon={<Zap size={20} />} />
                </motion.form>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center space-y-6"
                >
                  <div className="p-6 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                    <p className="text-cyan-300 leading-relaxed font-medium">
                      Mật khẩu của bạn đã được khôi phục thành công bằng công nghệ Quantum Encryption.
                    </p>
                  </div>
                  <Link
                    href="/dang-nhap"
                    className="w-full block bg-gradient-to-r from-cyan-500 to-blue-600 py-4 rounded-xl text-white font-black hover:scale-[1.02] transition-transform shadow-lg shadow-cyan-500/20"
                  >
                    Quay lại Đăng nhập
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Security Badge */}
        <p className="mt-8 text-center text-cyan-400/40 text-xs font-light tracking-widest flex items-center justify-center gap-2 uppercase">
          <Shield size={12} /> Military-Grade Verification • 100% Encrypted
        </p>
      </motion.div>
    </div>
  );
}

function CtaButton({ loading, text, icon }) {
  return (
    <button
      disabled={loading}
      type="submit"
      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-5 rounded-xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-cyan-500/30 disabled:opacity-50"
    >
      {loading ? <Loader2 className="animate-spin" size={24} /> : <>{icon} {text}</>}
    </button>
  );
}
