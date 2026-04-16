// app/(site)/thank-you/page.js
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const [countdown, setCountdown] = useState(5);

  // Effect cho countdown
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

  // Effect riêng cho chuyển hướng khi countdown = 0
  useEffect(() => {
    if (countdown === 0) {
      router.push("/");
    }
  }, [countdown, router]);

  return (
    <main className="max-w-4xl mx-auto py-20 px-6 text-center">
      <div className="bg-white rounded-3xl shadow-lg p-12">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Cảm ơn bạn đã đặt hàng!
        </h1>
        
        {orderId && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-semibold">
              Mã đơn hàng: <span className="text-lg">#{orderId}</span>
            </p>
            <p className="text-green-600 text-sm mt-1">
              Chúng tôi đã gửi email xác nhận đến bạn
            </p>
          </div>
        )}
        
        <p className="text-lg text-gray-600 mb-8">
          Đơn hàng của bạn đã được tiếp nhận và đang được xử lý. 
          Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition"
          >
            Tiếp tục mua sắm
          </Link>
          <Link
            href="/don-hang"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition"
          >
            Xem đơn hàng của tôi
          </Link>
        </div>
        
        <p className="text-sm text-gray-500 mt-6">
          Bạn sẽ được chuyển hướng về trang chủ trong {countdown} giây...
        </p>
      </div>
    </main>
  );
}