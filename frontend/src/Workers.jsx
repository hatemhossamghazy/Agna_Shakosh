import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, ArrowRight, Phone, Mail, MapPin, Box, Hammer, Zap, Paintbrush, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WorkersPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch workers from backend
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true);
        let url = "http://localhost:3000/worker/workers";
        
        // If a specific category is selected (not "الكل"), filter by job_type
        if (activeCategory !== "الكل") {
          url += `/${activeCategory}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        if (Array.isArray(data)) {
          // Map backend fields to frontend structure
          const mappedWorkers = data.map(worker => ({
            id: worker.user_id,
            name: `${worker.fname} ${worker.lname}`,
            title: worker.job_type,
            exp: worker.experience_years || 0,
            category: worker.job_type,
            location: worker.city || "غير محدد",
            rating: worker.rating || 5,
            image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.user_id}`,
            status: worker.availability_status === "available" ? "متاح الآن" : "في شغل",
            phone: worker.phone
          }));
          setWorkers(mappedWorkers);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, [activeCategory]);

  const filtered = workers.filter(w => {
  const matchesCategory =
    activeCategory === "الكل" || w.category === activeCategory;

  const matchesSearch =
    searchQuery.trim() === "" ||
    w.title.toLowerCase().includes(searchQuery.toLowerCase());

  return matchesCategory && matchesSearch;
});

  return (
    <div className="min-h-screen bg-white font-['Cairo'] text-right flex flex-col" dir="rtl">
      
      {/* 🟢 Navbar - النسخة الأصلية اللي طلبتها */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-[#1e2d3e] hover:text-[#d35400] transition-colors p-2 bg-gray-50 rounded-xl">
            <ArrowRight size={20} className="rotate-180" />
          </button>
          <img src="/logo.png" alt="Logo" className="h-14 w-auto object-contain" />
          <div className="hidden sm:block">
            <h1 className="text-xl font-black text-[#1e2d3e]">أجنه وشاكوش</h1>
            <p className="text-[10px] font-bold text-gray-400">لبيع وإيجار العدد وعرض خدمات الصنايعية</p>
          </div>
        </div>
        <div className="hidden md:flex gap-10 text-[#1e2d3e] font-bold">
          <button onClick={() => navigate('/equipment-store')} className="hover:text-[#d35400] transition-colors">سوق العِدة</button>
          <span className="text-[#d35400] cursor-pointer">دور على صنايعى</span>
          <button onClick={() => navigate('/rental')} className="hover:text-[#d35400] transition-colors">تأجير معدات</button>
        </div>
        {!isLoggedIn && (
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/register')} className="hidden sm:block border-2 border-[#1e2d3e] text-[#1e2d3e] px-6 py-2 rounded-lg font-bold hover:border-[#d35400] hover:text-[#d35400] transition-all">تسجيل</button>
            <button onClick={() => navigate('/login')} className="bg-[#1e2d3e] text-white px-8 py-2.5 rounded-lg font-bold hover:bg-[#d35400] transition-colors shadow-lg active:scale-95">دخول</button>
          </div>
        )}
      </nav>

      {/* 🟢 Hero Section - النسخة الأصلية المظبوطة */}
      <header className="py-32 px-6 relative overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200')" }}>
        <div className="absolute inset-0 bg-[#1e2d3e]/75 backdrop-blur-[2px] z-0"></div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10 text-white">
          <div className="flex-1 text-center md:text-right w-full">
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">أشطر صنايعية..<br/><span className="text-[#d35400]">في منطقتك</span></h1>
            <p className="text-xl text-gray-200 mb-10 max-w-2xl font-bold">بيتك في أمان.. دليل كامل لأشطر الصنايعية في كل التخصصات.</p>
            <div className="max-w-3xl mx-auto md:mx-0 mb-12 relative z-20">
              <div className="relative group">
                <input 
                  type="text" placeholder="بتدور على صنايعي إيه؟ (سباك، نجار...)" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-5 pr-14 pl-6 rounded-[2rem] border-2 border-transparent bg-white/10 backdrop-blur-lg shadow-xl focus:border-[#d35400] outline-none transition-all font-black text-white placeholder-gray-300"
                />
                <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#d35400]" size={20} />
                <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#1e2d3e] text-white px-8 py-3.5 rounded-[1.5rem] font-black hover:bg-[#d35400] transition-all shadow-lg active:scale-95">بحث</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 🟢 Main Content - الفلاتر */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-10">
        <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar my-10">
          <FilterChip icon={<Box size={18} />} label="الكل" active={activeCategory === "الكل"} onClick={() => setActiveCategory("الكل")} />
          <FilterChip icon={<Hammer size={18} />} label="سباكة" active={activeCategory === "سباكة"} onClick={() => setActiveCategory("سباكة")} />
          <FilterChip icon={<Zap size={18} />} label="كهرباء" active={activeCategory === "كهرباء"} onClick={() => setActiveCategory("كهرباء")} />
          <FilterChip icon={<Paintbrush size={18} />} label="نقاشة" active={activeCategory === "نقاشة"} onClick={() => setActiveCategory("نقاشة")} />
          <FilterChip icon={<Settings size={18} />} label="نجارة" active={activeCategory === "نجارة"} onClick={() => setActiveCategory("نجارة")} />
        </div>

        {/* 🟢 الكروت المحدثة (التحويل عند الضغط على الكارت) */}
        {loading ? (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-400 font-bold text-lg">جاري تحميل الصنايعية...</p>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-20">
            <p className="text-red-400 font-bold text-lg">خطأ في تحميل الصنايعية: {error}</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode='popLayout'>
            {filtered.length > 0 ? filtered.map(worker => (
              <motion.div 
                key={worker.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} whileHover={{ y: -8 }} 
                // 🔥 التعديل المطلوب: الربط بصفحة التفاصيل
                onClick={() => navigate(`/worker-details/${worker.category}/${worker.id}`)}
                className="bg-white p-6 border-b-8 border-[#d35400] rounded-2xl shadow-md flex flex-col justify-between h-full group cursor-pointer"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-gray-50">
                  <img src={worker.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="" />
                  <div className="absolute top-3 right-3 bg-[#d35400] text-white px-4 py-1.5 rounded-2xl text-[10px] font-black shadow-lg">{worker.status}</div>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-[#d35400] bg-[#d35400]/10 px-3 py-1 rounded-lg">{worker.category}</span>
                  <div className="flex items-center text-yellow-500 font-black text-xs bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star size={14} fill="currentColor" className="ml-1" />{worker.rating}
                  </div>
                </div>

                <h3 className="font-black text-[#1e2d3e] text-2xl mb-1">{worker.name}</h3>
                <p className="text-[#d35400] font-black text-sm mb-4">{worker.title}</p>
                
                {/* المحافظة */}
                <div className="flex items-center gap-2 text-[#1e2d3e] font-black text-sm mb-6 bg-gray-50 p-2.5 rounded-xl w-fit border border-gray-100">
                  <MapPin size={18} className="text-[#d35400]" />
                  <span>محافظة {worker.location}</span>
                </div>

                <div className="flex justify-between items-center border-t pt-5 border-gray-100">
                  <div>
                    <span className="text-[11px] font-black text-gray-400 block mb-1">سنوات الخبرة</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-[#1e2d3e] leading-none">{worker.exp}</span>
                      <span className="text-sm font-black text-[#1e2d3e]">{worker.exp >= 11 ? "سنة" : "سنوات"}</span>
                    </div>
                  </div>
                  {/* منع الـ onClick بتاع الكارت عند الضغط على زرار التليفون */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `tel:${worker.phone}`; // هنا حط رقم التليفون الحقيقي
                    }}
                    className="bg-[#1e2d3e] text-white p-4 rounded-xl hover:bg-[#d35400] shadow-lg transition-all active:scale-95"
                  >
                    <Phone size={24} />
                  </button>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-400 font-bold text-lg">للأسف مفيش صنايعية بالتخصص ده حالياً</p>
              </div>
            )}
          </AnimatePresence>
        </div>
        )}
      </main>

      {/* 🟢 الفوتر - النسخة الأصلية اللي طلبتها */}
      <footer className="bg-gray-100 py-16 px-6 mt-16 text-center md:text-right border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-2xl font-black text-[#1e2d3e] mb-4">أجنه وشاكوش</h3>
            <p className="text-gray-500 font-bold text-sm leading-relaxed max-w-sm">المنصة الأولى في مصر لخدمات الصنايعية وبيع وتأجير العدد بأفضل الأسعار.</p>
          </div>
          <div>
            <h3 className="text-xl font-black text-[#1e2d3e] mb-4">اقسام السوق</h3>
            <ul className="space-y-2 font-bold text-gray-600 text-sm">
              <li><button onClick={() => setActiveCategory("سباكة")} className="hover:text-[#d35400] transition">أشطر سباكين</button></li>
              <li><button onClick={() => setActiveCategory("كهرباء")} className="hover:text-[#d35400] transition">فنيين كهرباء</button></li>
              <li><button onClick={() => setActiveCategory("نقاشة")} className="hover:text-[#d35400] transition">معلمين نقاشة</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-black text-[#1e2d3e] mb-4">تواصل مع الدعم</h3>
            <ul className="space-y-3 font-bold text-gray-600 text-sm">
              <li className="flex items-center justify-center md:justify-start gap-3"><Phone size={18} className="text-[#1e2d3e]" /> <span>+20 1012345678</span></li>
              <li className="flex items-center justify-center md:justify-start gap-3"><Mail size={18} className="text-[#1e2d3e]" /> <span>store@agna-shakosh.com</span></li>
              <li className="flex items-center justify-center md:justify-start gap-3"><MapPin size={18} className="text-[#1e2d3e]" /> <span>طلخا / المنصورة، مصر</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-300 mt-12 pt-6 text-center text-xs font-bold text-gray-400">
          &copy; {new Date().getFullYear()} جميع الحقوق محفوظة لمنصة أجنه وشاكوش
        </div>
      </footer>
    </div>
  );
};

// مكون الـ Chips المظبوط
const FilterChip = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-3 px-8 py-4 rounded-xl font-black transition-all border-2 ${
      active 
      ? 'bg-[#1e2d3e] text-white border-transparent scale-105 shadow-lg shadow-[#1e2d3e]/20' 
      : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'
    }`}
  >
    {icon}
    {label}
  </button>
);

export default WorkersPage;