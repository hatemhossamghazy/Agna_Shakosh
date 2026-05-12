import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// تم إضافة ChevronDown هنا
import { 
  Users, ShoppingCart, ChevronLeft, Drill, Search, Star, MapPin, 
  Phone, Mail, Trash2, Plus, Minus, Truck, Loader2, ChevronDown 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  
  // 1. السلة بتبدأ فاضية تماماً
 useEffect(() => {
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:3000/getcart", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("CART DATA:", res.data);

      if (res.data.success) {
        setItems(res.data.data);
      }

    } catch (err) {
      console.error(err);
    }
  };

  fetchCart();
}, []);

  // 2. حالة القائمة المنسدلة (تمت إضافتها هنا)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 3. مصاريف التوصيل
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [isLoadingFee, setIsLoadingFee] = useState(true);

  // جلب مصاريف التوصيل من الداتابيز
  useEffect(() => {
    const fetchFee = async () => {
      try {
        setIsLoadingFee(true);
        // محاكاة طلب API
        setTimeout(() => {
          setDeliveryFee(65); 
          setIsLoadingFee(false);
        }, 1200);
      } catch (err) {
        setIsLoadingFee(false);
      }
    };
    fetchFee();
  }, []);

  const updateQuantity = (id, delta) => {
    setItems(prev => prev.map(item => 
      item.cart_id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

 const removeItem = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(`http://localhost:3000/getcart/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setItems(prev => prev.filter(item => item.cart_id !== id));

  } catch (err) {
    console.error(err);
  }
};

 const subtotal = items.reduce((acc, item) => {
  const price = item.type === "rent" 
    ? (item.total || 0) 
    : (item.sale_price * item.quantity);
  return acc + price;
}, 0);
  const totalAmount = items.length > 0 ? subtotal + deliveryFee : 0;

  return (
    <div className="min-h-screen bg-gray-50 font-['Cairo'] text-right pb-20" dir="rtl">
      
      {/* 🟢 Navbar علوي */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          {/* تأكد من وجود ملف اللوجو في folder الـ public */}
          <img src="/logo.png" alt="أجنه وشاكوش" className="h-14 w-auto object-contain" />
          <div className="hidden sm:block text-right">
            <h1 className="text-xl font-black text-[#1e2d3e]">أجنه وشاكوش</h1>
            <p className="text-[10px] font-bold text-gray-400">لبيع وإيجار العدد وعرض خدمات الصنايعية</p>
          </div>
        </div>
        
        <div className="flex-grow"></div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/cart')}
            className="relative p-2.5 text-[#1e2d3e] hover:bg-gray-100 rounded-full transition cursor-pointer"
          >
            <ShoppingCart size={24} />
            {items.length > 0 && (
              <span className="absolute top-0 right-0 bg-[#d35400] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black">
                {items.length}
              </span>
            )}
          </button>

          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-[#1e2d3e] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#3b2a20] transition shadow-lg select-none cursor-pointer active:scale-95"
            >
              <ChevronDown size={16} className={isDropdownOpen ? 'rotate-180' : ''} />
              <span>حسابي</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 text-right">
                <button 
                  onClick={() => { setIsDropdownOpen(false); navigate('/profile'); }}
                  className="w-full text-right px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-bold transition"
                >
                  الملف الشخصي
                </button>
                <button 
                  onClick={() => { setIsDropdownOpen(false); navigate('/orders'); }}
                  className="w-full text-right px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-bold transition"
                >
                  طلباتي
                </button>
                <hr className="my-1 border-gray-50" />
                <button 
                  onClick={() => { setIsDropdownOpen(false); navigate('/login'); }}
                  className="w-full text-right px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-bold transition"
                >
                  تسجيل خروج
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {/* 🟢 محتوى السلة */}
      <main className="py-16 px-6 max-w-7xl mx-auto min-h-[60vh]">
        <h2 className="text-4xl font-black text-[#1e2d3e] mb-12 flex items-center gap-4">
          <ShoppingCart size={40} className="text-[#d35400]" /> سلة العِدّة
        </h2>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {items.length > 0 ? (
                items.map((item) => (
                  <motion.div
                    key={item.cart_id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#f4f7f6] p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 border-b-4 border-transparent hover:border-[#d35400] transition-all"
                  >
                    <img src={item.image_url} alt={item.name} className="w-28 h-28 object-cover rounded-2xl shadow-sm" />
                    <div className="flex-1 text-center md:text-right">
                      <h3 className="font-black text-[#1e2d3e] text-xl">
  {item.name}
</h3>

{item.type === "rent" && (
  <div className="text-xs text-gray-500 mt-2 space-y-1">
    <p>من: {item.start_date}</p>
    <p>إلى: {item.end_date}</p>
  </div>
)}

<p className="text-[#d35400] font-black text-lg mt-1">
  {item.type === "rent"
    ? `${item.total} ج.م`
    : `${item.sale_price} ج.م`
  }
</p>
                      <p className="text-[#d35400] font-black text-lg mt-1">
  {item.type === "rent"
    ? `${item.total} ج.م`
    : `${item.sale_price} ج.م`
  }
</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
                      <button onClick={() => updateQuantity(item.cart_id, -1)} className="text-gray-400 hover:text-[#d35400]"><Minus size={18} /></button>
                      <span className="font-black text-[#1e2d3e] w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cart_id, 1)} className="text-gray-400 hover:text-[#d35400]"><Plus size={18} /></button>
                    </div>
                    <button onClick={() => removeItem(item.cart_id)} className="p-3 text-red-300 hover:text-red-500 rounded-xl transition-all">
                      <Trash2 size={24} />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                  <Drill size={80} className="mx-auto text-gray-200 mb-6" />
                  <h3 className="text-2xl font-black text-gray-400 mb-6">سلتك فاضية مفيهاش أي عِدة</h3>
                  <button 
                    onClick={() => navigate('/equipment-store')}
                    className="bg-[#1e2d3e] text-white px-10 py-4 rounded-xl font-black shadow-xl hover:bg-[#d35400] transition-all flex items-center gap-3 mx-auto"
                  >
                    تصفح سوق العدد دلوقتي <ChevronLeft />
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* ملخص الحساب */}
          <div className="lg:col-span-1">
            <div className="bg-[#1e2d3e] text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-28">
              <h3 className="text-2xl font-black mb-8 border-b border-white/10 pb-4 text-[#d35400]">فاتورة الطلب</h3>
              <div className="space-y-6 mb-10">
                <div className="flex justify-between font-bold text-gray-400">
                  <span>إجمالي العِدّة</span>
                  <span>{subtotal.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between font-bold text-gray-400 items-center">
                  <div className="flex items-center gap-2">
                    <Truck size={18} />
                    <span>مصاريف التوصيل</span>
                  </div>
                  {isLoadingFee ? (
                    <Loader2 size={16} className="animate-spin text-[#d35400]" />
                  ) : (
                    <span className="text-white">{items.length > 0 ? `${deliveryFee} ج.م` : "0 ج.م"}</span>
                  )}
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                  <span className="text-lg font-black">الإجمالي الكلي</span>
                  <span className="text-3xl font-black text-[#d35400]">
                    {isLoadingFee ? "..." : totalAmount.toLocaleString()} <small className="text-sm">ج.م</small>
                  </span>
                </div>
              </div>
              <button 
onClick={() => {
 
  navigate("/checkout");
}}
  disabled={items.length === 0 || isLoadingFee}
  className={`w-full py-5 rounded-2xl font-black text-xl transition-all shadow-lg active:scale-95 ${
    items.length > 0
      ? "bg-[#d35400] hover:bg-white hover:text-[#1e2d3e]"
      : "bg-gray-700 cursor-not-allowed text-gray-500"
  }`}
>
  تأكيد العملية
</button>
            </div>
          </div>
        </div>
      </main>

      {/* 🟢 Footer */}
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
              <li><button onClick={() => navigate('/rental')} className="hover:text-[#d35400] transition">أجر عدة</button></li>
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

export default Cart;
