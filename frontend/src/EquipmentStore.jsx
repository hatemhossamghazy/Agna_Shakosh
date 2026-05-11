import React, { useState, useEffect ,useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Hammer, Drill, Ruler, Star, ArrowRight, Phone, Mail, MapPin, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const EquipmentStore = () => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  
  // State
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch from backend (Handles Category filtering server-side)
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        let url = "http://localhost:3000/RENT/equipment";
        const params = new URLSearchParams();

        if (activeCategory !== "الكل") {
          params.append("category", activeCategory);
        }

        const finalUrl = params.toString() ? `${url}?${params.toString()}` : url;
        const res = await fetch(finalUrl);
        const data = await res.json();

        if (data.success) {
          setProducts(data.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [activeCategory]);

  // Derived State: Handle Search filtering on the client side
  const displayedProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white pb-0 font-['Cairo'] text-right" dir="rtl">
      
      {/* 🟢 Navbar */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')}
            className="text-[#1e2d3e] hover:text-[#d35400] transition-colors p-2 bg-gray-50 rounded-xl"
          >
            <ArrowRight size={20} className="rotate-180" />
          </button>
          <img src="/logo.png" alt="Logo" className="h-14 w-auto object-contain" />
          <div className="hidden sm:block">
            <h1 className="text-xl font-black text-[#1e2d3e]">أجنه وشاكوش</h1>
            <p className="text-[10px] font-bold text-gray-400">لبيع وإيجار العدد وعرض خدمات الصنايعية</p>
          </div>
        </div>

        <div className="hidden md:flex gap-10 text-[#1e2d3e] font-bold">
  
  <button
    onClick={() => navigate('/equipment-store')}
    className="hover:text-[#d35400] transition-colors"
  >
    سوق العِدة
  </button>

  <button
    onClick={() => navigate('/workers')}
    className="hover:text-[#d35400] transition-colors"
  >
    دور على صنايعى
  </button>

  <button
    onClick={() => navigate('/rental')}
    className="hover:text-[#d35400] transition-colors"
  >
    تأجير معدات
  </button>

</div>

        {!isLoggedIn && (
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
      </nav>

      {/* 🟢 Hero Header */}
      <header className="py-32 px-6 relative overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/store-bg.png')" }}>
        <div className="absolute inset-0 bg-[#1e2d3e]/75 backdrop-blur-[2px] z-0"></div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 text-center md:text-right w-full text-white">
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              أجر معداتك.. <br/>
              <span className="text-[#d35400]">بأقل التكاليف</span>
            </h1>
            <p className="text-xl text-gray-200 mb-10 max-w-2xl font-bold">
              تأجير المعدات الأصلية لليوم أو الشهر بضمان المنصة.
            </p>
            <div className="max-w-3xl mx-auto md:mx-0 mb-12 relative z-20">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="بتدور على عِدة إيه؟" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-5 pr-14 pl-6 rounded-[2rem] border-2 border-transparent bg-white/10 backdrop-blur-lg shadow-xl focus:border-[#d35400] outline-none transition-all font-black text-sm md:text-base text-right text-white placeholder-gray-300"
                />
                <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#d35400] transition-colors" size={20} />
              </div>
            </div>
          </div>
        </div>
      </header>
          
      {/* Filters */}
      <div className="flex gap-4 px-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth my-10 max-w-7xl mx-auto">
        <CategoryChip icon={<Hammer size={18} />} label="الكل" active={activeCategory === "الكل"} onClick={() => setActiveCategory("الكل")} />
        <CategoryChip icon={<Drill size={18} />} label="كهربائية" active={activeCategory === "كهربائية"} onClick={() => setActiveCategory("كهربائية")} />
        <CategoryChip icon={<Ruler size={18} />} label="قياس" active={activeCategory === "قياس"} onClick={() => setActiveCategory("قياس")} />
        <CategoryChip icon={<Hammer size={18} />} label="يدوية" active={activeCategory === "يدوية"} onClick={() => setActiveCategory("يدوية")} />
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        {loading ? (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-400 font-bold text-lg">جاري تحميل المنتجات...</p>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-20">
            <p className="text-red-400 font-bold text-lg">خطأ في تحميل المنتجات: {error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode='popLayout'>
              {displayedProducts.length > 0 ? (
                displayedProducts.map((product) => (
                  <ProductCard key={product.equipment_id} product={product} navigate={navigate} />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-gray-400 font-bold text-lg">للأسف مفيش عِدة بالاسم ده حالياً..</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-16 px-6 mt-16 text-center md:text-right border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-2xl font-black text-[#1e2d3e] mb-4">أجنه وشاكوش</h3>
            <p className="text-gray-500 font-bold text-sm leading-relaxed max-w-sm">المنصة الأولى في مصر لخدمات الصنايعية وبيع وتأجير العدد بأفضل الأسعار.</p>
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

const ProductCard = ({ product, navigate }) => {
  const [showModal, setShowModal] = useState(false);
const handleAddToCart = async (e) => {
  e.stopPropagation();

  console.log("CLICKED ADD TO CART"); // 👈 مهم

  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      "http://localhost:3000/cart/add",
      {
        equipment_id: product.equipment_id,
        quantity: 1
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("RESPONSE:", response.data);
    setShowModal(true);

  } catch (error) {
    console.log("ERROR FRONT:", error);
  }
};
  return (
    <>
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -8 }}
        onClick={() => navigate(`/product/${product.equipment_id}`)}
        className="bg-white p-6 border-b-8 border-[#d35400] rounded-2xl shadow-md transition-all relative flex flex-col justify-between h-full cursor-pointer group"
      >
        <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4 bg-gray-50">
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-2xl text-[10px] font-black text-[#1e2d3e]">
            {product.status || 'متاح'}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black text-[#d35400] bg-[#d35400]/10 px-3 py-1 rounded-lg">
                {product.category}
              </span>
              <div className="flex items-center text-yellow-500 font-black text-xs bg-yellow-50 px-2 py-1 rounded-lg">
                <Star size={14} fill="currentColor" className="ml-1" />
                {product.rating || 5}
              </div>
            </div>
            <h3 className="font-black text-[#1e2d3e] text-lg mb-4 line-clamp-1">{product.name}</h3>
          </div>
          
          <div className="flex justify-between items-center mt-4 border-t pt-4 border-gray-100">
            <div>
              <span className="text-[10px] font-bold text-gray-400 block mb-[-4px]">سعر اليوم</span>
              <span className="text-2xl font-black text-[#1e2d3e]">
                {Number(product.sale_price).toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-gray-400 mr-1 text-sm">ج.م</span>
            </div>
            
            <motion.button 
  whileTap={{ scale: 0.9 }}
 onClick={handleAddToCart}
  className="bg-[#1e2d3e] text-white p-4 rounded-xl hover:bg-[#d35400] transition-all shadow-lg shadow-[#1e2d3e]/20 cursor-pointer"
>
  <ShoppingCart size={22} />
</motion.button>
          </div>
        </div>
      </motion.div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-b-8 border-[#d35400]" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-black text-[#1e2d3e] mb-2">تمت الإضافة بنجاح</h3>
            <p className="text-gray-500 font-bold text-sm mb-8">تمت إضافة العِدة إلى طلبات التأجير بنجاح!</p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="w-full bg-[#1e2d3e] text-white py-3.5 rounded-xl font-black hover:bg-[#d35400] transition-all active:scale-95 shadow-lg cursor-pointer"
              >
                أكمل التسوق
              </button>
              <button 
                onClick={() => {
                  setShowModal(false);
                  navigate('/cart');
                }}
                className="w-full bg-transparent border-2 border-[#1e2d3e] text-[#1e2d3e] py-3.5 rounded-xl font-black hover:bg-gray-50 transition-all active:scale-95 cursor-pointer"
              >
                إنهاء الطلب
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const CategoryChip = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-8 py-4 rounded-xl font-black whitespace-nowrap transition-all shadow-sm border border-transparent ${
    active 
    ? 'bg-[#1e2d3e] text-white shadow-[#1e2d3e]/20 scale-105' 
    : 'bg-white text-gray-500 hover:text-[#1e2d3e] hover:bg-gray-50 border-2'
  }`}>
    {icon}
    {label}
  </button>
);

export default EquipmentStore;