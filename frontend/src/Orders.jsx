import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft, Package, Clock, CheckCircle2,
  Truck, Box, ShoppingCart, ChevronDown,
  Phone, Mail, MapPin,
  ShoppingBag, Wrench
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Orders() {
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [items] = useState([]); // سلة فارغة مؤقتاً
const getOrderTypeDetails = (type) => {
  switch (type) {
    case 'sale':
      return {
        text: "بيع",
        icon: <ShoppingBag size={16} />,
        color: "text-purple-600 bg-purple-50"
      };

    case 'rent':
      return {
        text: "إيجار",
        icon: <Wrench size={16} />,
        color: "text-indigo-600 bg-indigo-50"
      };

    default:
      return {
        text: "غير معروف",
        icon: <Box size={16} />,
        color: "text-gray-600 bg-gray-50"
      };
  }
};
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
useEffect(() => {
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/history/orders", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      setOrders(data);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, []);

  const getStatusDetails = (status) => {
  switch(status) {
    case 'delivered':
      return { text: "تم التوصيل", color: "text-green-600 bg-green-50", icon: <CheckCircle2 size={16} /> };

    case 'pending':
    case 'processing':
      return { text: "قيد التحضير", color: "text-blue-600 bg-blue-50", icon: <Clock size={16} /> };

    case 'shipped':
      return { text: "جاري الشحن", color: "text-[#d35400] bg-orange-50", icon: <Truck size={16} /> };

    case 'waiting_review':
      return { text: "في انتظار المراجعة", color: "text-yellow-600 bg-yellow-50", icon: <Clock size={16} /> };

    default:
      return { text: status || "غير معروف", color: "text-gray-600 bg-gray-50", icon: <Box size={16} /> };
  }
};
  return (
    <div className="min-h-screen bg-gray-50 font-['Cairo'] text-right pb-20" dir="rtl">
      
      {/* 🟢 Navbar */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
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
              <ChevronDown size={16} className={isDropdownOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
              <span>حسابي</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 text-right">
                <button onClick={() => { setIsDropdownOpen(false); navigate('/profile'); }} className="w-full text-right px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-bold transition">الملف الشخصي</button>
                <button onClick={() => { setIsDropdownOpen(false); navigate('/orders'); }} className="w-full text-right px-4 py-2.5 text-sm text-[#d35400] bg-orange-50 font-bold transition">طلباتي</button>
                <hr className="my-1 border-gray-50" />
                <button onClick={() => { setIsDropdownOpen(false); navigate('/login'); }} className="w-full text-right px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-bold transition">تسجيل خروج</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 🟢 المحتوى الرئيسي */}
      <main className="py-12 px-6 max-w-4xl mx-auto">
        <div className="mb-10 text-center md:text-right">
          <h2 className="text-4xl font-black text-[#1e2d3e] flex items-center gap-4 justify-center md:justify-start">
            <Package size={40} className="text-[#d35400]" /> سجل الطلبات
          </h2>
          <p className="text-gray-400 font-bold mt-2 mr-2">تابع حالة طلبات العِدة ومواعيد الوصول</p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => {
            const status = getStatusDetails(order.status);
            const type = getOrderTypeDetails(order.order_type|| 'unknown');
            return (
              <motion.div 
                key={order.order_id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:border-[#d35400] border-r-4 transition-all"
              >
                <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex gap-8">
                    <div>
                      <span className="text-xs font-bold text-gray-400 block mb-1">رقم الطلب</span>
                      <span className="font-black text-[#1e2d3e]">{order.order_id}</span>
                    </div>
                    <div className="hidden sm:block">
                      <span className="text-xs font-bold text-gray-400 block mb-1">التاريخ</span>
                      <span className="font-bold text-gray-600">{order.date ? new Date(order.date).toLocaleDateString('ar-EG') : "—"}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
  
  {/* TYPE (SALE / RENT) */}
  <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-bold ${type.color}`}>
    {type.icon}
    {type.text}
  </div>

  {/* STATUS */}
  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-sm ${status.color}`}>
    {status.icon} {status.text}
  </div>

</div>
                </div>

                <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                      <Box size={32} />
                    </div>
                    <div>
                      <p className="font-black text-[#1e2d3e] text-lg">{order.quantity} منتجات</p>
                      <p className="text-sm font-bold text-gray-400" > شحن إلى: {order.delivery_address}</p>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-sm font-bold text-gray-400">إجمالي الفاتورة</p>
                    <p className="text-2xl font-black text-[#d35400]">{order.total_price?.toLocaleString()} <small className="text-xs">ج.م</small></p>
                  </div>
                  <button className="bg-[#1e2d3e] text-white px-8 py-3 rounded-xl font-black text-sm hover:bg-[#d35400] transition-all shadow-lg active:scale-95 flex items-center gap-2">
                    عرض التفاصيل <ChevronLeft size={18} />
                  </button>
                </div>
              </motion.div>
            );
          })}
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
      </footer>
    </div>
  );
}

export default Orders;