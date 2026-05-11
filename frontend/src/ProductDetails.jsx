import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from "axios";
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

useEffect(() => {
  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/getcart/eq/${id}`);

      if (res.data.success) {
        setItem(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  fetchProduct();
  window.scrollTo(0, 0);
}, [id]);

  const handleAddToCart = async (e) => {
  e.stopPropagation();

  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      "http://localhost:3000/cart/add",
      {
        equipment_id: id,
        quantity: 1
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (res.data.success) {
      setShowModal(true);
    }

  } catch (err) {
  alert("يجب تسجيل الدخول أولاً");
}
};

  if (!item) return <div className="text-center py-20 font-black text-[#1e2d3e]">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-white font-['Cairo'] text-right" dir="rtl">
      
      {/* 🟢 Navbar */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="text-[#1e2d3e] hover:text-[#d35400] transition-colors p-2 bg-gray-50 rounded-xl"
          >
            <ArrowRight size={20} className="rotate-180" />
          </button>
          <img src="/logo.png" alt="Logo" className="h-14 w-auto object-contain" />
          <div className="hidden sm:block text-right">
            <h1 className="text-xl font-black text-[#1e2d3e]">أجنه وشاكوش</h1>
            <p className="text-[10px] font-bold text-gray-400">لبيع وإيجار العدد وعرض خدمات الصنايعية</p>
          </div>
        </div>

        <div className="hidden md:flex gap-10 text-[#1e2d3e] font-bold">
          <button onClick={() => navigate('/equipment-store')} className="text-[#d35400] cursor-pointer hover:text-[#d35400] transition">سوق العِدة</button>
          <button onClick={() => navigate('/workers')} className="hover:text-[#d35400] transition-colors">دور على صنايعى</button>
          <button onClick={() => navigate('/rental')} className="hover:text-[#d35400] transition-colors">تأجير معدات</button>
        </div>

        
      </nav>

      {/* 🟢 محتوى التفاصيل */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* الصورة وعليها التاج */}
          <div className="relative">
            <div className="bg-gray-50 rounded-3xl overflow-hidden shadow-inner border border-gray-100">
              <img src={item.image} alt={item.name} className="w-full h-auto object-cover aspect-square md:aspect-auto" />
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm shadow-xl px-6 py-2 rounded-2xl text-xs font-black text-[#1e2d3e] border-b-4 border-[#d35400]">
                {item.status}
              </div>
            </div>
          </div>

          {/* بيانات المنتج */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-black text-[#d35400] bg-[#d35400]/10 px-4 py-1 rounded-lg">{item.category}</span>
              <div className="flex items-center text-yellow-500 font-black text-sm bg-yellow-50 px-3 py-1 rounded-lg">
                <Star size={16} fill="currentColor" className="ml-1" /> {item.rating}
              </div>
            </div>

            <h1 className="text-4xl font-black text-[#1e2d3e] mb-6 leading-tight">{item.name}</h1>
            
            <div className="mb-8 p-6 bg-gray-50 rounded-2xl border-r-8 border-[#d35400]">
              <span className="text-xs font-bold text-gray-400 block mb-[-4px]">السعر</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#1e2d3e]">{item.sale_price.toLocaleString()}</span>
                <span className="text-lg font-bold text-gray-400">ج.م</span>
              </div>
            </div>

            <p className="text-gray-500 font-bold text-lg mb-8 leading-relaxed">{item.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {item.specs && item.specs.map((spec, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-bold text-[#1e2d3e] bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <CheckCircle2 size={18} className="text-green-500" /> {spec}
                </div>
              ))}
            </div>

            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="w-full bg-[#1e2d3e] text-white py-5 rounded-2xl font-black text-xl hover:bg-[#d35400] transition-all shadow-xl shadow-[#1e2d3e]/20 flex items-center justify-center gap-3 cursor-pointer"
            >
              <ShoppingCart size={24} /> أضف العِدة للسلة
            </motion.button>
          </div>
        </div>
      </main>

      {/* 🟢 Modal الاختيار (تم إضافته هنا) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-b-8 border-[#d35400]" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-black text-[#1e2d3e] mb-2">تمت الإضافة بنجاح</h3>
            <p className="text-gray-500 font-bold text-sm mb-8">تمت إضافة العِدة إلى عربة التسوق بنجاح!</p>
            
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
                شراء الآن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 الفوتر */}
      <footer className="bg-gray-100 py-16 px-6 mt-16 text-right border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-2xl font-black text-[#1e2d3e] mb-4">أجنه وشاكوش</h3>
            <p className="text-gray-500 font-bold text-sm leading-relaxed max-w-sm">المنصة الأولى في مصر لخدمات الصنايعية وبيع وتأجير العدد بأفضل الأسعار.</p>
          </div>
          <div>
            <h3 className="text-xl font-black text-[#1e2d3e] mb-4">اقسام السوق</h3>
            <ul className="space-y-2 font-bold text-gray-600 text-sm">
              <li className="hover:text-[#d35400] cursor-pointer transition">عدد كهربائية</li>
              <li className="hover:text-[#d35400] cursor-pointer transition">أجهزة القياس</li>
              <li className="hover:text-[#d35400] cursor-pointer transition">عدد يدوية</li>
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

export default ProductDetails;