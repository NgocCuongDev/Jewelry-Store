// app/(site)/thank-you/page.js - PREMIUM REDESIGN
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  ShoppingBag, 
  ArrowRight, 
  Box, 
  Mail, 
  Clock,
  Sparkles,
  PartyPopper,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const [countdown, setCountdown] = useState(7);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      router.push("/");
    }
  }, [countdown, router]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background Ornaments */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="max-w-4xl mx-auto py-20 px-6 relative z-10">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {/* Success Icon Animation */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="flex justify-center mb-10"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
                <div className="relative bg-gradient-to-tr from-amber-400 to-amber-600 p-6 rounded-full shadow-[0_0_40px_rgba(245,158,11,0.4)]">
                  <CheckCircle size={48} className="text-black" />
                </div>
                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      y: [-20, -100], 
                      x: [0, (i % 2 === 0 ? 50 : -50)],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 2 + Math.random() * 2, 
                      repeat: Infinity, 
                      delay: i * 0.4 
                    }}
                    className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full"
                  />
                ))}
              </div>
            </motion.div>

            <div className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6"
              >
                <Sparkles size={14} className="text-amber-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200/80">Order Confirmed Successfully</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-5xl md:text-6xl font-serif font-light mb-6 tracking-tight text-white"
              >
                Tuyệt vời! <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 animate-gradient-x italic">
                  Cảm ơn bạn đã tin tưởng
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-lg text-neutral-400 font-light max-w-2xl mx-auto mb-12 leading-relaxed"
              >
                Đơn hàng của bạn đã được niêm phong và gửi đến bộ phận vận chuyển cao cấp. 
                Một email xác nhận chi tiết đã được gửi tới hòm thư của bạn.
              </motion.p>
            </div>

            {/* Order Card */}
            {orderId && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 mb-12 max-w-lg mx-auto overflow-hidden relative group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <PartyPopper size={80} />
                </div>
                
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 mb-2">Tracking ID</span>
                  <div className="flex items-center gap-3">
                    <Box size={20} className="text-amber-400" />
                    <span className="text-3xl font-serif font-medium text-white tracking-wider">#{orderId}</span>
                  </div>
                  
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />
                  
                  <div className="grid grid-cols-2 gap-8 w-full text-center">
                    <div>
                      <div className="flex items-center justify-center gap-2 text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1">
                        <Mail size={12} /> Email
                      </div>
                      <p className="text-xs text-neutral-300 font-medium">Đã gửi</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-2 text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1">
                        <ShieldCheck size={12} /> Bảo hiểm
                      </div>
                      <p className="text-xs text-neutral-300 font-medium">Đã kích hoạt</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/" className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
                <div className="relative flex items-center gap-3 px-10 py-4 bg-amber-500 text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-transform duration-300 group-hover:-translate-y-1">
                  Tiếp tục mua sắm
                  <ShoppingBag size={16} />
                </div>
              </Link>

              <Link href="/don-hang" className="group flex items-center gap-3 px-10 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:-translate-y-1 text-center">
                Xem đơn hàng
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Redirect Progress */}
            <div className="mt-20 max-w-xs mx-auto">
              <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest text-neutral-600 mb-2">
                <span className="flex items-center gap-1.5">
                  <Clock size={10} /> Auto Redirect
                </span>
                <span>{countdown}s</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 7, ease: "linear" }}
                  className="h-full bg-amber-500/50"
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 8s ease infinite;
        }
      `}</style>
    </main>
  );
}