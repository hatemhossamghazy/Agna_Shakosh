import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, ArrowRight, Phone, Mail, MapPin, Key, Construction, Truck, HardHat, Zap, Layers, Wind } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EquipmentRental = () => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch equipment from backend
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        let url = "http://localhost:3000/rental/equipment";

        // If a specific category is selected (not "الكل"), filter by rental_type
        if (activeCategory !== "الكل") {
          url = `http://localhost:3000/rental/equipment/rental/${activeCategory}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (Array.isArray(data)) {
          // Map backend fields to frontend structure
          const mappedEquipment = data.map(item => ({
            id: item.equipment_id,
            name: item.name,
            price: item.price_per_day || 0,
            category: item.category || item.rental_type || "عام",
            rating: 4.5, // Default since DB doesn't have rating
            image: item.image_url || `https://placehold.co/600x400?text=${encodeURIComponent(item.name)}`,
            status: item.status === "available" ? "متاح" : "محجوز",
            period: "يوم",
            rental_type: item.rental_type,
            description: item.description
          }));
          setRentals(mappedEquipment);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [activeCategory]);

  // Client-side search filtering
  const filteredRentals = rentals.filter(item => {
    const matchesCategory = activeCategory === "الكل" || item.rental_type === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white pb-0 font-['Cairo'] text-right" dir="rtl">
      
      {/* 🟢 Navbar */}
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
          <button onClick={() => navigate('/workers')} className="hover:text-[#d35400] transition-colors">دور على صنايعى</button>
          <span className="text-[#d35400] cursor-pointer">تأجير معدات</span>
        </div>
        {!isLoggedIn && (
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/register')} className="hidden sm:block border-2 border-[#1e2d3e] text-[#1e2d3e] px-6 py-2 rounded-lg font-bold transition-all duration-300 hover:border-[#d35400] hover:text-[#d35400] active:scale-95">تسجيل</button>
            <button onClick={() => navigate('/login')} className="bg-[#1e2d3e] text-white px-8 py-2.5 rounded-lg font-bold hover:bg-[#d35400] transition-colors shadow-lg active:scale-95">دخول</button>
          </div>
        )}
      </nav>

      {/* 🟢 Hero Header */}
      <header className="py-32 px-6 relative overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/rental-bg.jpeg')" }}>
        <div className="absolute inset-0 bg-[#1e2d3e]/75 backdrop-blur-[2px] z-0"></div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10 text-white">
          <div className="flex-1 text-center md:text-right w-full">
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">أجر عِدة.. <br/><span className="text-[#d35400]">خلص شغلك</span></h1>
            <p className="text-xl text-gray-200 mb-10 max-w-2xl font-bold">وفر فلوسك وأجر أحدث المعدات الثقيلة والخفيفة بأسعار على قد الإيد.</p>
            <div className="max-w-3xl mx-auto md:mx-0 mb-12 relative z-20">
              <form className="relative group" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="text" placeholder="بتدور على معدة إيه للإيجار؟" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-5 pr-14 pl-6 rounded-[2rem] border-2 border-transparent bg-white/10 backdrop-blur-lg shadow-xl focus:border-[#d35400] outline-none transition-all font-black text-white placeholder-gray-300"
                />
                <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#d35400]" size={20} />
                <button type="submit" className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#1e2d3e] text-white px-8 py-3.5 rounded-[1.5rem] font-black hover:bg-[#d35400] transition-all shadow-lg active:scale-95">بحث</button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* 🟢 الفلاتر */}
      <div className="flex gap-4 px-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth my-10 max-w-7xl mx-auto">
        <CategoryChip icon={<Construction size={18} />} label="الكل" active={activeCategory === "الكل"} onClick={() => setActiveCategory("الكل")} />
        <CategoryChip icon={<Truck size={18} />} label="رفع" active={activeCategory === "رفع"} onClick={() => setActiveCategory("رفع")} />
        <CategoryChip icon={<Zap size={18} />} label="طاقة" active={activeCategory === "طاقة"} onClick={() => setActiveCategory("طاقة")} />
        <CategoryChip icon={<Layers size={18} />} label="هدم" active={activeCategory === "هدم"} onClick={() => setActiveCategory("هدم")} />
        <CategoryChip icon={<Wind size={18} />} label="قطع" active={activeCategory === "قطع"} onClick={() => setActiveCategory("قطع")} />
        <CategoryChip icon={<HardHat size={18} />} label="إنشاءات" active={activeCategory === "إنشاءات"} onClick={() => setActiveCategory("إنشاءات")} />
      </div>

      {/* 🟢 شبكة المنتجات */}
      <main className="max-w-7xl mx-auto px-6 mt-6 min-h-[400px]">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-400 font-bold text-lg">جاري تحميل المعدات...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 font-bold text-lg">خطأ في تحميل المعدات: {error}</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode='popLayout'>
            {filteredRentals.length > 0 ? filteredRentals.map((item) => (
              <motion.div 
                key={item.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} whileHover={{ y: -8 }}
                className="bg-white p-6 border-b-8 border-[#d35400] rounded-2xl shadow-md transition-all relative flex flex-col justify-between h-full group"
              >
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-4 bg-gray-50 border border-gray-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className={`absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-2xl text-[10px] font-black ${item.status === 'متاح' ? 'text-green-600' : 'text-red-500'}`}>
                    {item.status}
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-[#d35400] bg-[#d35400]/10 px-3 py-1 rounded-lg">{item.category}</span>
                      <div className="flex items-center text-yellow-500 font-black text-xs bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star size={14} fill="currentColor" className="ml-1" />{item.rating}
                      </div>
                    </div>
                    <h3 className="font-black text-[#1e2d3e] text-lg mb-4 line-clamp-2 leading-snug">{item.name}</h3>
                  </div>
                  <div className="flex justify-between items-center mt-4 border-t pt-4 border-gray-100">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 block mb-[-4px]">سعر الإيجار</span>
                      <span className="text-2xl font-black text-[#1e2d3e]">{item.price.toLocaleString()}</span>
                      <span className="text-sm font-bold text-gray-400 mr-1">ج.م / {item.period}</span>
                    </div>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(`/rental-information/${item.id}`)} className="bg-[#1e2d3e] text-white p-4 rounded-xl hover:bg-[#d35400] transition-all shadow-lg shadow-[#1e2d3e]/20">
                      <Key size={22} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-400 font-bold text-lg">للأسف مفيش معدات إيجار بالقسم ده حالياً</p>
              </div>
            )}
          </AnimatePresence>
        </div>
        )}
      </main>

      {/* 📞 الفوتر */}
      <footer className="bg-gray-100 py-16 px-6 mt-16 text-center md:text-right border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-2xl font-black text-[#1e2d3e] mb-4">أجنه وشاكوش</h3>
            <p className="text-gray-500 font-bold text-sm leading-relaxed max-w-sm">
              المنصة الأولى في مصر لخدمات الصنايعية وبيع وتأجير العدد بأفضل الأسعار.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-black text-[#1e2d3e] mb-4">اقسام السوق</h3>
            <ul className="space-y-2 font-bold text-gray-600 text-sm">
              <li><button onClick={() => setActiveCategory("كهربائية")} className="hover:text-[#d35400] transition">عدد كهربائية</button></li>
              <li><button onClick={() => setActiveCategory("قياس")} className="hover:text-[#d35400] transition">أجهزة القياس</button></li>
              <li><button onClick={() => setActiveCategory("يدوية")} className="hover:text-[#d35400] transition">عدد يدوية</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-black text-[#1e2d3e] mb-4">تواصل مع الدعم</h3>
            <ul className="space-y-3 font-bold text-gray-600 text-sm">
              <li className="flex items-center justify-center md:justify-start gap-3">
                <Phone size={18} className="text-[#1e2d3e]" /> <span>+20 1012345678</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <Mail size={18} className="text-[#1e2d3e]" /> <span>store@agna-shakosh.com</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <MapPin size={18} className="text-[#1e2d3e]" /> <span>طلخا / المنصورة، مصر</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-[#c04e00] mt-12 pt-6 text-center text-xs font-bold text-gray-100">
          &copy; {new Date().getFullYear()} جميع الحقوق محفوظة لمنصة أجنه وشاكوش
        </div>
      </footer>
    </div>
  );
};

const CategoryChip = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-8 py-4 rounded-xl font-black whitespace-nowrap transition-all shadow-sm border-2 ${
    active ? 'bg-[#1e2d3e] text-white border-transparent scale-105 shadow-lg shadow-[#1e2d3e]/20' 
    : 'bg-white text-gray-500 border-gray-100 hover:text-[#1e2d3e] hover:bg-gray-50'
  }`}>
    {icon}
    {label}
  </button>
);

export default EquipmentRental;