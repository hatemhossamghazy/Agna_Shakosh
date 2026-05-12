import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ShoppingCart, ChevronLeft, Drill, Search, Star, MapPin, Phone, Mail, ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate(); // المساعد بتاع التنقل
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  // حالات تسجيل الدخول والدروب داون
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(Boolean(token));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    navigate('/login');
  };

  // بيانات تجريبية لأبرز المنتجات والصنايعية
  const topProducts = [
    { id: 1, name: "هيلتي تكسير 1500 وات", price: "4,500", category: "كهربائية", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=400" },
    { id: 2, name: "صاروخ قطعية 7 بوصة", price: "2,800", category: "كهربائية", image: "https://images.unsplash.com/photo-1581235720704-06d3acfc1c6f?auto=format&fit=crop&q=80&w=400" },
    { id: 3, name: "ميزان ليزر 360 درجة", price: "3,200", category: "قياس", image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=400" },
  ];

  const topWorkers = [
    { id: 1, name: "أحمد محمد", job: "سباك", rating: 4.8, location: "دمياط", image: "https://images.unsplash.com/photo-1581244276891-9964c15d035b?auto=format&fit=crop&q=80&w=400" },
    { id: 2, name: "حسن عبد الله", job: "كهربائي", rating: 4.9, location: "الإسكندرية", image: "https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&q=80&w=400" },
  ];

  // فنكشن البحث الذكي
  const handleSearch = (e) => {
    e.preventDefault();
    const text = searchQuery.toLowerCase().trim();

    if (!text) return;

    if (text.includes("صنايعي") || text.includes("سباك") || text.includes("كهربائي") || text.includes("نجار") || text.includes("نقاش")) {
      navigate('/workers');
    } else if (text.includes("عدة") || text.includes("هيلتي") || text.includes("صاروخ") || text.includes("شنيور") || text.includes("مفكات")) {
      navigate('/equipment-store');
    } else {
      alert("جرب تبحث عن حاجة زي (سباك، كهربائي، أو هيلتي)");
    }
  };

  return (
    <div className="min-h-screen bg-white text-right font-['Cairo']" dir="rtl">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="أجنه وشاكوش" className="h-14 w-auto object-contain" />
          <div className="hidden sm:block">
            <h1 className="text-xl font-black text-[#1e2d3e]">أجنه وشاكوش</h1>
            <p className="text-[10px] font-bold text-gray-400">لبيع وإيجار العدد وعرض خدمات الصنايعية</p>
          </div>
        </div>
        
        <div className="hidden md:flex gap-10 text-[#1e2d3e] font-bold">
          <button type="button" className="hover:text-[#d35400] transition" onClick={() => navigate('/equipment-store')}>سوق العدد</button>
          <button type="button" className="hover:text-[#d35400] transition" onClick={() => navigate('/workers')}>دور على صنايعى</button>
          <button type="button" className="hover:text-[#d35400] transition" onClick={() => navigate('/rental')}>تأجير معدات</button>
        </div>

        {/* الجزء الخاص بالعميل (سلة المشتريات وحالة الحساب) */}
        <div className="flex items-center gap-4">
          {/* سلة الأوردرات */}
          <button 
            onClick={() => navigate('/cart')}
            className="relative p-2.5 text-[#1e2d3e] hover:bg-gray-100 rounded-full transition cursor-pointer"
          >
            <ShoppingCart size={24} />
            <span className="absolute top-0 right-0 bg-[#d35400] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black animate-pulse">
              2
            </span>
          </button>

          {/* حالة المستخدم: تسجيل دخول أو حسابي */}
          {isLoggedIn ? (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-[#1e2d3e] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#d35400] transition shadow-lg select-none cursor-pointer active:scale-95"
              >
                <span>حسابي</span>
                <ChevronDown size={16} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 text-right">
                  <button 
                    onClick={() => { setIsDropdownOpen(false); navigate('/profile'); }}
                    className="w-full text-right px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-bold transition"
                  >
                    الملف الشخصي
                  </button>
                  <button 
                   onClick={() => navigate('/orders')}
                    className="w-full text-right px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-bold transition"
                  >
                    طلباتي
                  </button>
                  <hr className="my-1 border-gray-50" />
                  <button 
                    onClick={handleLogout}
                    className="w-full text-right px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-bold transition"
                  >
                    تسجيل خروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/register')}
                className="hidden sm:block border-2 border-[#1e2d3e] text-[#1e2d3e] px-6 py-2 rounded-lg font-bold transition-all duration-300 hover:border-[#d35400] hover:text-[#d35400] active:scale-95"
              >
                تسجيل
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="bg-[#1e2d3e] text-white px-8 py-2.5 rounded-lg font-bold hover:bg-[#d35400] transition-colors shadow-lg shadow-gray-200 active:scale-95"
              >
                دخول
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-32 px-6 relative overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/home-bg.png')" }}>
        <div className="absolute inset-0 bg-[#1e2d3e]/75 backdrop-blur-[2px] z-0"></div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 text-center md:text-right w-full text-white">
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              كل اللي يحتاجه الشغل.. <br/>
              <span className="text-[#d35400]">في مكان واحد</span>
            </h1>
            <p className="text-xl text-gray-200 mb-10 max-w-2xl font-bold">
              أكبر منصة لبيع وإيجار العدد، ودليل لأشطر الصنايعية في مصر.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto md:mx-0 mb-12 relative z-20">
              <form onSubmit={handleSearch} className="relative group">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="قولنا مشكلتك وهنساعدك تحلها ..." 
                  className="w-full py-5 pr-14 pl-6 rounded-[2rem] border-2 border-transparent bg-white/10 backdrop-blur-lg shadow-xl focus:border-[#d35400] outline-none transition-all font-black text-sm md:text-base text-right text-white placeholder-gray-300"
                />
                <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#d35400] transition-colors" size={20} />
                
                <button 
                  type="submit"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#1e2d3e] text-white px-8 py-3.5 rounded-[1.5rem] font-black hover:bg-[#d35400] transition-all text-xs md:text-sm active:scale-95 shadow-lg z-30"
                >
                  بحث
                </button>
              </form>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-5 mt-6 z-20 relative">
              <button onClick={() => navigate('/rental')} className="bg-[#d35400] text-white px-10 py-4 rounded-xl text-xl font-black shadow-xl hover:scale-105 transition-transform flex items-center gap-3">
                أجر عِدة دلوقتي <ChevronLeft />
              </button>
              <button onClick={() => navigate('/workers')} className="bg-transparent text-white border-4 border-white px-10 py-4 rounded-xl text-xl font-black hover:bg-white hover:text-[#1e2d3e] transition-all">
                اطلب صنايعي
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ⭐ العدد الأكثر مبيعاً والأعلى تقييماً */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* قسم الأكثر مبيعاً */}
          <div>
            <h2 className="text-3xl font-black text-[#1e2d3e] mb-8">الأكثر مبيعاً في السوق</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {topProducts.map(product => (
                <div 
                  key={product.id}
                  onClick={() => navigate('/equipment-store')}
                  className="bg-[#f4f7f6] p-4 rounded-2xl shadow-sm border-b-4 border-[#d35400] cursor-pointer hover:shadow-md transition-all flex flex-col justify-between h-full"
                >
                  <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-xl mb-3" />
                  <div>
                    <h4 className="text-sm font-black text-[#1e2d3e] mb-1 truncate">{product.name}</h4>
                    <span className="text-[10px] font-black text-[#d35400] bg-[#d35400]/10 px-2 py-0.5 rounded">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-base font-black text-[#1e2d3e]">{product.price} <span className="text-[10px] text-gray-500">ج.م</span></span>
                    <button className="bg-[#1e2d3e] text-white p-2 rounded-xl hover:bg-[#d35400] transition">
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* قسم أعلى الصنايعية تقييماً */}
          <div>
            <h2 className="text-3xl font-black text-[#1e2d3e] mb-8">الصنايعية الأعلى تقييماً</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {topWorkers.map(worker => (
                <div 
                  key={worker.id}
                  onClick={() => navigate('/workers')}
                  className="bg-[#f4f7f6] p-4 rounded-2xl shadow-sm border-b-4 border-[#1e2d3e] cursor-pointer hover:shadow-md transition-all flex items-center gap-4 h-full"
                >
                  <img src={worker.image} alt={worker.name} className="w-20 h-20 object-cover rounded-2xl" />
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-[#1e2d3e] mb-0.5">{worker.name}</h4>
                    <span className="text-[#d35400] font-bold text-xs">{worker.job}</span>
                    <div className="flex items-center gap-1 my-2 text-yellow-500 text-xs font-black bg-white px-2 py-1 rounded-lg w-fit shadow-sm">
                      <Star size={12} fill="currentColor" />
                      {worker.rating}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                      <MapPin size={12} />
                      {worker.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-10 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10">
          <FeatureCard 
            icon={<Drill size={40} />} 
            title="إيجار معدات" 
            desc="شواكيش، هيلتي، وصواريخ بأسعار يومية بسيطة." 
            color="#d35400"
            onClick={() => navigate('/rental')}
          />
          <FeatureCard 
            icon={<Users size={40} />} 
            title="دور على صنايعى" 
            desc="نجارين، سباكين، وكهربائية بتقييمات حقيقية." 
            color="#1e2d3e"
            onClick={() => navigate('/workers')}
          />
          <FeatureCard 
            onClick={() => navigate('/equipment-store')}
            icon={<ShoppingCart size={40} />} 
            title="سوق العدد" 
            desc="اشتري عدتك الجديدة أو المستعملة بضمان المنصة." 
            color="#d35400"
          />
        </div>
      </section>

      {/* 📞 تواصل معنا */}
      <footer className="bg-gray-100 py-16 px-6 mt-16 text-center md:text-right border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-2xl font-black text-[#1e2d3e] mb-4">أجنه وشاكوش</h3>
            <p className="text-gray-500 font-bold text-sm leading-relaxed max-w-sm">
              المنصة الأولى في مصر لخدمات الصنايعية وبيع وتأجير العدد بأفضل الأسعار.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-black text-[#1e2d3e] mb-4">روابط سريعة</h3>
            <ul className="space-y-2 font-bold text-gray-600 text-sm">
              <li><button onClick={() => navigate('/equipment-store')} className="hover:text-[#d35400] transition">سوق العدد</button></li>
              <li><button onClick={() => navigate('/workers')} className="hover:text-[#d35400] transition">دليل الصنايعية</button></li>
              <li><button onClick={() => navigate('/login')} className="hover:text-[#d35400] transition">تسجيل الدخول</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-black text-[#1e2d3e] mb-4">تواصل معنا</h3>
            <ul className="space-y-3 font-bold text-gray-600 text-sm">
              <li className="flex items-center justify-center md:justify-start gap-3">
                <Phone size={18} className="text-[#d35400]" /> <span>+20 1012345678</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <Mail size={18} className="text-[#d35400]" /> <span>support@agna-shakosh.com</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <MapPin size={18} className="text-[#d35400]" /> <span>المنصورة / طلخا، مصر</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-300/60 mt-12 pt-6 text-center text-xs font-bold text-gray-400">
          &copy; {new Date().getFullYear()} جميع الحقوق محفوظة لمنصة أجنه وشاكوش
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color, onClick }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-8 bg-white border-b-8 rounded-2xl shadow-md transition-all cursor-pointer"
      style={{ borderBottomColor: color }}
      onClick={onClick}
    >
      <div className="mb-6" style={{ color: color }}>{icon}</div>
      <h3 className="text-2xl font-black mb-4 text-[#1e2d3e]">{title}</h3>
      <p className="text-gray-500 font-bold leading-relaxed">{desc}</p>
    </motion.div>
  );
}

export default Home;