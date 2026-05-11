import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import { 
  Calendar, Info, AlertCircle, CheckCircle, 
  ArrowRight, ChevronDown, ShoppingCart, Phone, Mail, MapPin, Star, ShieldCheck, LogOut
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

function RentalInformation() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rentalTotal, setRentalTotal] = useState(0);
  const [days, setDays] = useState(0);

 useEffect(() => {
  const fetchEquipmentById = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `http://localhost:3000/rental/equipment/${id}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "فشل في جلب بيانات المعدة");
      }

      const item = await response.json();

      setEquipment({
        id: item.equipment_id,
        name: item.name,
        pricePerDay: item.price_per_day || 0,
        insuranceAmount: item.insurance_amount || 0,
        status: item.status || "available",
        nextAvailableDate:
          item.next_available_date ||
          new Date().toISOString().split("T")[0],
        image:
          item.image_url ||
          `https://placehold.co/600x400?text=${encodeURIComponent(
            item.name || "Equipment"
          )}`,
      });

    } catch (err) {
      setError(err.message);
      setEquipment(null);
    } finally {
      setLoading(false);
    }
  };

  fetchEquipmentById();
}, [id]);

  useEffect(() => {
    if (startDate && endDate && equipment) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        setDays(diffDays);
        setRentalTotal(diffDays * equipment.pricePerDay);
      } else {
        setDays(0);
        setRentalTotal(0);
      }
    }
  }, [startDate, endDate, equipment]);
  const addToCart = async () => {
  if (!equipment || !startDate || !endDate) {
    console.log("missing data");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3000/cart/addR", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        equipment_id: equipment.id,
        quantity: 1,
        start_date: startDate,
        end_date: endDate,
        total: finalAmount,
        insurance_amount: equipment.insuranceAmount
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("ERROR:", data);
      return;
    }

    console.log("SUCCESS:", data);
    navigate("/cart");

  } catch (err) {
    console.error("REQUEST FAILED:", err);
  }
};
// ✅ بعد
const checkAvailability = () => {
    if (!equipment) return false;
    
    // لو متاحة أصلاً
    if (equipment.status === 'available') return true;
    
    // لو محجوزة بس فيه تاريخ انتهاء
    if (equipment.nextAvailableDate && startDate) {
        const chosenStart = new Date(startDate);
        const availableFrom = new Date(equipment.nextAvailableDate);
        // لو التاريخ المختار بعد تاريخ انتهاء الإيجار الحالي
        return chosenStart > availableFrom;
    }
    
    return false;
};

  const isAvailableOnSelectedDate = checkAvailability();
  const isFormValid = startDate !== '' && endDate !== '' && rentalTotal > 0 && isAvailableOnSelectedDate;
  const finalAmount = equipment ? rentalTotal + equipment.insuranceAmount : 0;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-black">جاري التحميل...</div>;
  }

  if (error || !equipment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-['Cairo'] text-right" dir="rtl">
        <p className="mb-4 text-red-500 font-black">{error || 'تعذر عرض تفاصيل المعدة حالياً'}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-[#1e2d3e] text-white px-8 py-3 rounded-2xl font-black hover:bg-[#d35400] transition"
        >
          رجوع
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Cairo'] text-right" dir="rtl">
      {/* 🟢 Navbar */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/logo.png" alt="أجنه وشاكوش" className="h-14 w-auto object-contain" />
          <div className="hidden sm:block text-right">
            <h1 className="text-xl font-black text-[#1e2d3e]">أجنه وشاكوش</h1>
            <p className="text-[10px] font-bold text-gray-400">لبيع وإيجار العدد وعرض خدمات الصنايعية</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={() => navigate('/cart')} className="relative p-2.5 text-[#1e2d3e] hover:bg-gray-100 rounded-full transition">
            <ShoppingCart size={24} />
            <span className="absolute top-0 right-0 bg-[#d35400] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black">2</span>
          </button>
          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 bg-[#1e2d3e] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#3b2a20] transition text-sm shadow-md">
              <ChevronDown size={16} className={isDropdownOpen ? 'rotate-180' : ''} />
              <span>حسابي</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 text-right font-bold">
                <button onClick={() => navigate('/profile')} className="w-full text-right px-4 py-2.5 text-sm hover:bg-gray-50">الملف الشخصي</button>
                <button onClick={() => navigate('/orders')} className="w-full text-right px-4 py-2.5 text-sm hover:bg-gray-50">طلباتي</button>
                <div className="my-1 border-t border-gray-100"></div>
                <button onClick={() => navigate('/login')} className="w-full text-right px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center justify-between">
                  <span>تسجيل خروج</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto py-10 px-6">
        <header className="flex items-center gap-4 mb-8">
           <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:bg-[#d35400] hover:text-white transition text-[#1e2d3e]">
             <ArrowRight size={22}/>
           </button>
           <h2 className="text-3xl font-black text-[#1e2d3e]">تفاصيل الإيجار</h2>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <img src={equipment.image} alt={equipment.name} className="w-full h-64 object-cover rounded-2xl mb-6 shadow-inner" />
            <h3 className="text-2xl font-black text-[#1e2d3e] mb-4">{equipment.name}</h3>
            
            <div className="space-y-3 bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-6 font-bold">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-500">سعر الإيجار اليومي:</span>
                 <span className="text-[#1e2d3e]">{equipment.pricePerDay} ج.م</span>
               </div>
               <div className="flex justify-between items-center pt-2 border-t border-gray-200 text-sm">
                 <span className="text-gray-500">مبلغ التأمين المسترد:</span>
                 <span className="text-[#d35400]">{equipment.insuranceAmount} ج.م</span>
               </div>
            </div>

            {/* حالة العدة */}
{equipment.status !== 'available' ? (
  <div className="bg-orange-50 text-orange-700 p-4 rounded-xl font-bold text-xs border border-orange-100 space-y-2">
    <div className="flex items-center gap-2 font-black">
      <AlertCircle size={18} /> المعدة محجوزة حالياً.
    </div>
<p className="pr-7 opacity-80 underline italic text-[11px]">
  متاحة للحجز بعد تاريخ: {equipment.nextAvailableDate 
    ? new Date(equipment.nextAvailableDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : "غير محدد"}
</p>
  </div>
) : (
  <div className="flex items-center gap-2 bg-green-50 text-green-700 p-4 rounded-xl font-bold text-xs border border-green-100">
    <CheckCircle size={18} /> المعدة متاحة حالياً للاستلام.
  </div>
)}
          </section>

          <section className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <h4 className="font-black text-xl text-[#1e2d3e] mb-6 flex items-center gap-2">
              <Calendar className="text-[#d35400]" /> فترة الإيجار
            </h4>

            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-black text-gray-600">من تاريخ</label>
                  <input type="date" min={new Date().toISOString().split('T')[0]} onChange={(e) => setStartDate(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:border-[#d35400]" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-black text-gray-600">إلى تاريخ</label>
                  <input type="date" min={startDate || new Date().toISOString().split('T')[0]} onChange={(e) => setEndDate(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:border-[#d35400]" />
                </div>
              </div>

{startDate && !isAvailableOnSelectedDate && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
    className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 text-[11px] font-bold flex gap-2">
    <AlertCircle size={14} className="shrink-0" />
    <span>
      {equipment.status !== 'available' && equipment.nextAvailableDate
        ? `المعدة محجوزة حتى ${new Date(equipment.nextAvailableDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })} — اختار تاريخ بعده`
        : "المعدة غير متاحة في هذا التاريخ"
      }
    </span>
  </motion.div>
)}

              <AnimatePresence>
                {days > 0 && isAvailableOnSelectedDate && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1e2d3e] text-white p-6 rounded-2xl space-y-4 shadow-xl">
                    <div className="flex justify-between items-center text-sm opacity-80 border-b border-white/10 pb-2">
                      <span>إيجار {days} أيام:</span>
                      <span className="font-black">{rentalTotal} ج.م</span>
                    </div>
                    <div className="flex justify-between items-center text-sm opacity-80 border-b border-white/10 pb-2">
                      <span>تأمين (يُرد عند التسليم):</span>
                      <span className="font-black">{equipment.insuranceAmount} ج.م</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-lg font-black">الإجمالي المطلوب:</span>
                      <span className="text-2xl font-black text-[#d35400]">{finalAmount.toLocaleString()} ج.م</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
<button 
  type="button"
  onClick={addToCart}
  disabled={!isFormValid || !equipment}
  className={`w-full py-4 rounded-xl font-black text-lg transition-all shadow-xl ${
    isFormValid 
      ? 'bg-[#d35400] text-white hover:bg-[#1e2d3e] cursor-pointer' 
      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
  }`}
>
  إضافة إلى السلة
</button>
            </form>
          </section>
        </div>
      </main>

      <footer className="bg-gray-100 py-16 px-6 mt-16 text-right border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-2xl font-black text-[#1e2d3e] mb-4">أجنه وشاكوش</h3>
            <p className="text-gray-500 font-bold text-sm leading-relaxed max-w-sm">المنصة الأولى في مصر لخدمات الصنايعية وبيع وتأجير العدد بأفضل الأسعار.</p>
          </div>
          <div>
            <h3 className="text-xl font-black text-[#1e2d3e] mb-4">روابط سريعة</h3>
            <ul className="space-y-2 font-bold text-gray-600 text-sm">
              <li><button onClick={() => navigate('/equipment-store')} className="hover:text-[#d35400]">سوق العدد</button></li>
              <li><button onClick={() => navigate('/workers')} className="hover:text-[#d35400]">دليل الصنايعية</button></li>
              <li><button onClick={() => navigate('/rental-information')} className="hover:text-[#d35400] transition cursor-pointer">أجر عدة</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-black text-[#1e2d3e] mb-4">تواصل معنا</h3>
            <ul className="space-y-3 font-bold text-gray-600 text-sm">
              <li className="flex items-center gap-3"><Phone size={18} className="text-[#d35400]" /> <span>+20 1012345678</span></li>
              <li className="flex items-center gap-3"><Mail size={18} className="text-[#d35400]" /> <span>support@agna-shakosh.com</span></li>
              <li className="flex items-center gap-3"><MapPin size={18} className="text-[#d35400]" /> <span>المنصورة / طلخا، مصر</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-300 mt-12 pt-8 text-center text-xs font-black text-gray-400">
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة لشركة أجنه وشاكوش</p>
        </div>
      </footer>
    </div>
  );
}

export default RentalInformation;