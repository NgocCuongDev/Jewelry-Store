"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function AboutPage() {
  const [activeStory, setActiveStory] = useState('beginning');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/10 to-rose-50/5">
      <Head>
        <title>Về Chúng Tôi | Luxury Pet Haven</title>
        <meta name="description" content="Giới thiệu về Luxury Pet Haven - Đẳng cấp trong chăm sóc thú cưng" />
      </Head>

      <main className="relative overflow-hidden">
        {/* Premium Background Elements */}
        <div className="absolute top-10% left-5% w-80 h-80 bg-gradient-to-br from-amber-200/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20% right-10% w-96 h-96 bg-gradient-to-tr from-rose-200/8 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-40% left-20% w-64 h-64 bg-gradient-to-r from-emerald-100/5 to-transparent rounded-full blur-2xl"></div>

        {/* Hero Section - Ultra Premium */}
        <section className={`relative py-28 md:py-36 transition-all duration-1500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="container mx-auto px-8 text-center">
            {/* Elegant Logo */}
            <div className="inline-flex items-center space-x-4 mb-12">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 via-amber-600 to-rose-600 rounded-2xl shadow-2xl flex items-center justify-center transform rotate-3">
                  <span className="text-white text-2xl filter drop-shadow-lg">🐾</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-rose-500 rounded-2xl opacity-20 blur-sm"></div>
              </div>
              <span className="text-3xl font-serif font-bold text-slate-800 tracking-tight">NNC Pet Shop</span>
            </div>
            
            {/* Main Headline */}
            <div className="max-w-6xl mx-auto">
              <h1 className="text-6xl md:text-8xl font-serif font-bold text-slate-800 mb-8 leading-none tracking-tight">
                Câu Chuyện
                <span className="block bg-gradient-to-r from-amber-600 via-amber-700 to-rose-700 bg-clip-text text-transparent mt-4">
                  Của Chúng Tôi
                </span>
              </h1>
              <p className="text-2xl text-slate-600/90 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
                Một thập kỷ kiến tạo những giá trị xuất sắc trong chăm sóc thú cưng, 
                nơi sự tinh tế hòa quyện cùng tình yêu thương vô điều kiện
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision - Premium Redesign */}
        <section className="py-24 relative">
          <div className="container mx-auto px-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-20 items-start">
              {/* Mission & Vision Content */}
              <div className={`space-y-12 transition-all duration-1500 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
                <div>
                  <h2 className="text-5xl md:text-6xl font-serif font-bold text-slate-800 mb-6 leading-tight">
                    Sứ Mệnh &<br />
                    <span className="bg-gradient-to-r from-amber-600 to-rose-700 bg-clip-text text-transparent">
                      Tầm Nhìn
                    </span>
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full mb-8"></div>
                </div>
                
                <div className="space-y-8">
                  {/* Mission Card */}
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-rose-500 rounded-3xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
                    <div className="relative bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-amber-100/50 group-hover:border-amber-200/80 transition-all duration-500">
                      <div className="flex items-start space-x-6">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-500">
                            <span className="text-white text-xl filter drop-shadow">🎯</span>
                          </div>
                          <div className="absolute -inset-1 bg-amber-400 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-3xl font-semibold text-slate-800 mb-4 font-serif">Sứ Mệnh</h3>
                          <p className="text-slate-600/90 leading-relaxed text-lg font-light tracking-wide">
                            Kiến tạo không gian chăm sóc thú cưng đẳng cấp thế giới, nơi mỗi khoảnh khắc 
                            đều là sự hòa quyện hoàn hảo giữa y học hiện đại và nghệ thuật yêu thương.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Vision Card */}
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
                    <div className="relative bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-rose-100/50 group-hover:border-rose-200/80 transition-all duration-500">
                      <div className="flex items-start space-x-6">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-500">
                            <span className="text-white text-xl filter drop-shadow">✨</span>
                          </div>
                          <div className="absolute -inset-1 bg-rose-400 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-3xl font-semibold text-slate-800 mb-4 font-serif">Tầm Nhìn</h3>
                          <p className="text-slate-600/90 leading-relaxed text-lg font-light tracking-wide">
                            Định hình tương lai ngành pet care Việt Nam, trở thành biểu tượng toàn cầu 
                            về sự xuất sắc trong dịch vụ chăm sóc thú cưng cao cấp.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Achievements Grid */}
              <div className={`relative transition-all duration-1500 delay-600 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
                <div className="bg-gradient-to-br from-amber-50/80 to-rose-50/60 rounded-4xl p-10 shadow-3xl border border-white/60 backdrop-blur-xl">
                  <div className="grid grid-cols-2 gap-8">
                    {/* Achievement 1 */}
                    <div className="group relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
                      <div className="relative bg-white/95 backdrop-blur-lg rounded-2xl p-8 shadow-2xl transform rotate-1 group-hover:rotate-0 transition-all duration-500">
                        <div className="h-40 bg-gradient-to-br from-amber-100/80 to-amber-50/60 rounded-xl mb-6 flex items-center justify-center">
                          <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl">
                              <span className="text-2xl text-white filter drop-shadow">🏆</span>
                            </div>
                            <div className="absolute -inset-1 bg-amber-400 rounded-2xl opacity-0 group-hover:opacity-30 blur transition-all duration-500"></div>
                          </div>
                        </div>
                        <h3 className="font-bold text-slate-800 text-center text-xl mb-2">Top 1 Việt Nam</h3>
                        <p className="text-slate-500/80 text-center text-sm">5 năm liên tiếp</p>
                      </div>
                    </div>
                    
                    {/* Achievement 2 */}
                    <div className="group relative mt-12">
                      <div className="absolute -inset-0.5 bg-gradient-to-br from-rose-400 to-rose-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
                      <div className="relative bg-white/95 backdrop-blur-lg rounded-2xl p-8 shadow-2xl transform -rotate-1 group-hover:rotate-0 transition-all duration-500">
                        <div className="h-40 bg-gradient-to-br from-rose-100/80 to-rose-50/60 rounded-xl mb-6 flex items-center justify-center">
                          <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-2xl">
                              <span className="text-2xl text-white filter drop-shadow">⭐</span>
                            </div>
                            <div className="absolute -inset-1 bg-rose-400 rounded-2xl opacity-0 group-hover:opacity-30 blur transition-all duration-500"></div>
                          </div>
                        </div>
                        <h3 className="font-bold text-slate-800 text-center text-xl mb-2">5 Sao Dịch Vụ</h3>
                        <p className="text-slate-500/80 text-center text-sm">10.000+ khách hàng</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section - Ultra Premium */}
        <section className="py-24 bg-gradient-to-br from-white/60 via-amber-50/10 to-transparent backdrop-blur-sm">
          <div className="container mx-auto px-8">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-slate-800 mb-6">
                Hành Trình
                <span className="block bg-gradient-to-r from-amber-600 to-rose-700 bg-clip-text text-transparent mt-2">
                  Phát Triển
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full mx-auto mb-8"></div>
              <p className="text-slate-600/80 text-xl max-w-2xl mx-auto font-light tracking-wide">
                Từ những bước chân đầu tiên đến vị thế tiên phong trong ngành
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              {/* Premium Timeline Navigation */}
              <div className="flex justify-center mb-20">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-3 shadow-2xl border border-white/40">
                  {[
                    { id: 'beginning', label: 'Khởi Đầu', year: '2014', icon: '🌱' },
                    { id: 'growth', label: 'Phát Triển', year: '2016-2018', icon: '📈' },
                    { id: 'expansion', label: 'Mở Rộng', year: '2019-2021', icon: '🚀' },
                    { id: 'present', label: 'Hiện Tại', year: '2022-Nay', icon: '🏆' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveStory(item.id)}
                      className={`relative px-10 py-5 rounded-2xl font-semibold transition-all duration-700 group ${
                        activeStory === item.id
                          ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-2xl transform scale-105'
                          : 'text-slate-600 hover:text-amber-600 hover:bg-amber-50/80'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-lg mb-1 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                        <div className="font-semibold tracking-wide">{item.label}</div>
                        <div className={`text-xs mt-2 ${activeStory === item.id ? 'text-amber-100' : 'text-slate-400'}`}>
                          {item.year}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Premium Timeline Content */}
              <div className="bg-white/90 backdrop-blur-xl rounded-4xl shadow-3xl p-16 border border-white/40">
                {activeStory === 'beginning' && (
                  <div className="text-center">
                    <div className="relative inline-block mb-10">
                      <div className="w-28 h-28 bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-2">
                        <span className="text-4xl text-white filter drop-shadow">🌱</span>
                      </div>
                      <div className="absolute -inset-2 bg-amber-400 rounded-3xl opacity-20 blur"></div>
                    </div>
                    <h3 className="text-4xl font-serif font-bold text-slate-800 mb-8">2014 - Khởi Đầu</h3>
                    <p className="text-slate-600/90 text-xl leading-relaxed max-w-3xl mx-auto font-light tracking-wide">
                      Từ một không gian nhỏ với 5 tâm huyết, chúng tôi bắt đầu hành trình định hình 
                      chuẩn mực mới về dịch vụ chăm sóc thú cưng đẳng cấp quốc tế tại Việt Nam.
                    </p>
                  </div>
                )}

                {activeStory === 'growth' && (
                  <div className="text-center">
                    <div className="relative inline-block mb-10">
                      <div className="w-28 h-28 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl transform -rotate-1">
                        <span className="text-4xl text-white filter drop-shadow">📈</span>
                      </div>
                      <div className="absolute -inset-2 bg-emerald-400 rounded-3xl opacity-20 blur"></div>
                    </div>
                    <h3 className="text-4xl font-serif font-bold text-slate-800 mb-8">2016-2018 - Phát Triển</h3>
                    <p className="text-slate-600/90 text-xl leading-relaxed max-w-3xl mx-auto font-light tracking-wide">
                      Mở rộng hệ sinh thái với 3 chi nhánh chiến lược, xây dựng đội ngũ 50 chuyên gia 
                      xuất sắc và đầu tư hệ thống trang thiết bị đạt chuẩn quốc tế.
                    </p>
                  </div>
                )}

                {activeStory === 'expansion' && (
                  <div className="text-center">
                    <div className="relative inline-block mb-10">
                      <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-1">
                        <span className="text-4xl text-white filter drop-shadow">🚀</span>
                      </div>
                      <div className="absolute -inset-2 bg-blue-400 rounded-3xl opacity-20 blur"></div>
                    </div>
                    <h3 className="text-4xl font-serif font-bold text-slate-800 mb-8">2019-2021 - Mở Rộng</h3>
                    <p className="text-slate-600/90 text-xl leading-relaxed max-w-3xl mx-auto font-light tracking-wide">
                      Ra mắt chuỗi spa cao cấp và khách sạn thú cưng 5 sao, thiết lập quan hệ đối tác 
                      toàn cầu và đón nhận giải thưởng Doanh nghiệp xuất sắc ngành Pet Care.
                    </p>
                  </div>
                )}

                {activeStory === 'present' && (
                  <div className="text-center">
                    <div className="relative inline-block mb-10">
                      <div className="w-28 h-28 bg-gradient-to-br from-rose-500 to-rose-600 rounded-3xl flex items-center justify-center shadow-2xl transform -rotate-2">
                        <span className="text-4xl text-white filter drop-shadow">🏆</span>
                      </div>
                      <div className="absolute -inset-2 bg-rose-400 rounded-3xl opacity-20 blur"></div>
                    </div>
                    <h3 className="text-4xl font-serif font-bold text-slate-800 mb-8">2022-Nay - Hiện Tại</h3>
                    <p className="text-slate-600/90 text-xl leading-relaxed max-w-3xl mx-auto font-light tracking-wide">
                      Với 15 chi nhánh toàn quốc và đội ngũ 200+ chuyên gia ưu tú, chúng tôi tiên phong 
                      ứng dụng công nghệ 4.0, hướng tới vị thế dẫn đầu khu vực Đông Nam Á.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Final Ultra Premium CTA */}
        <section className="py-28 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/90 via-amber-600 to-rose-600/90"></div>
          <div className="absolute inset-0 bg-black/5"></div>
          
          <div className="container mx-auto px-8 text-center relative z-10">
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-8 tracking-tight">
              Sẵn Sàng Trải Nghiệm?
            </h2>
            <p className="text-amber-100/90 text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-light tracking-wide">
              Để lại thông tin để được tư vấn về dịch vụ phù hợp nhất cho thú cưng của bạn
            </p>
            
            <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-2xl rounded-3xl p-12 border border-white/20 shadow-2xl">
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                <input 
                  type="text" 
                  placeholder="Họ và tên của bạn" 
                  className="flex-grow px-8 py-5 rounded-2xl bg-white/95 backdrop-blur-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-amber-300/50 border border-white/60 text-lg font-light tracking-wide"
                />
                <button className="bg-slate-800 hover:bg-slate-900 text-white px-12 py-5 rounded-2xl font-semibold transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:scale-105 whitespace-nowrap text-lg tracking-wide">
                  Đặt Lịch Tư Vấn
                </button>
              </div>
              <p className="text-amber-100/80 text-lg mt-6 tracking-wide">
                📞 Gọi ngay: <span className="font-semibold">(028) 1234 5678</span>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}