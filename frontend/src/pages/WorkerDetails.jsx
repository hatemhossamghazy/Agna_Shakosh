import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Star,
  MapPin,
  Award,
  Wrench,
  Image as ImageIcon,
  Phone,
  MessageCircle,
  ShieldCheck
} from "lucide-react";
const WorkersDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/worker/${id}`);
        setWorker(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchWorker();
  }, [id]);

  if (!worker) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-['Cairo']">
        <p className="mb-4 font-bold text-gray-500">عذراً، لم يتم العثور على بيانات هذا الصنايعي</p>
        <button onClick={() => navigate(-1)} className="bg-[#1e2d3e] text-white px-8 py-3 rounded-2xl font-black">رجوع للبحث</button>
      </div>
    );
  }

  const isBusy = worker.status === "في شغل";

  return (
    <div className="min-h-screen bg-white font-['Cairo'] text-right" dir="rtl">
      {/* زر الرجوع */}
      <div className="fixed top-6 right-6 z-50">
        <button onClick={() => {
  if (window.history.length > 1) {
    navigate(-1);
  } else {
    navigate("/workers");
  }
}} className="p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg text-[#1e2d3e] hover:bg-white transition">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* الهيدر */}
      <div className="relative h-80 bg-[#1e2d3e] flex items-end justify-center pb-12">
        <div className="absolute inset-0 overflow-hidden">
           <img src={worker.image} className="w-full h-full object-cover blur-sm opacity-30" alt="" />
        </div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <img src={worker.image} className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-white shadow-2xl" alt="" />
            <div className={`absolute -bottom-2 -left-2 p-2 rounded-full border-4 border-white text-white ${isBusy ? 'bg-red-500' : 'bg-green-500'}`}>
              <ShieldCheck size={20} />
            </div>
          </div>
          <h2 className="mt-4 text-2xl font-black text-white">{worker.name}</h2>
          <span className={`text-xs font-bold px-4 py-1.5 rounded-full mt-2 shadow-lg ${isBusy ? 'bg-red-600 text-white' : 'bg-[#d35400] text-white'}`}>
            {worker.status}
          </span>
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 pb-32">
        {/* كروت المعلومات */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-gray-50 p-4 rounded-3xl text-center border border-gray-100">
            <Star className="mx-auto mb-1 text-orange-400" fill="currentColor" size={20} />
            <p className="text-[10px] text-gray-400 font-bold">التقييم</p>
            <p className="font-black text-[#1e2d3e]">{worker.rating}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-3xl text-center border border-gray-100">
            <MapPin className="mx-auto mb-1 text-blue-500" size={20} />
            <p className="text-[10px] text-gray-400 font-bold">المنطقة</p>
            <p className="font-black text-[#1e2d3e]">
  {worker.location ?? "غير محدد"}
</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-3xl text-center border border-gray-100">
            <Award className="mx-auto mb-1 text-green-500" size={20} />
            <p className="text-[10px] text-gray-400 font-bold">الحالة</p>
            <p className="font-black text-[#1e2d3e]">موثق</p>
          </div>
        </div>

        {/* رقم التليفون */}
        <div className="mb-10 bg-gray-50 p-6 rounded-[2rem] border-dashed border-2 border-gray-200">
           <h3 className="text-gray-400 font-bold text-sm mb-2 text-center md:text-right">رقم التواصل المباشر:</h3>
           <div className={`text-3xl font-black tracking-widest text-center ${isBusy ? 'text-gray-300' : 'text-[#1e2d3e]'}`}>
              {isBusy ? "01X XXXX XXXX" : worker.phone.replace("20", "0")}
           </div>
           {isBusy && <p className="text-center text-red-500 font-bold text-xs mt-2">الصنايعي مشغول في شغلانة حالياً</p>}
        </div>

        {/* النبذة */}
        <div className="mb-10">
          <h3 className="text-xl font-black text-[#1e2d3e] mb-3 flex items-center gap-2">
            <Wrench size={20} className="text-[#d35400]" /> نبذة عن الصنايعي
          </h3>
          <p className="text-gray-600 font-bold leading-relaxed">{worker.bio || "لا توجد نبذة متاحة"}</p>
        </div>

        {/* معرض الصور */}
        <div className="mb-10">
          <h3 className="text-xl font-black text-[#1e2d3e] mb-4 flex items-center gap-2">
            <ImageIcon size={20} className="text-[#d35400]" /> صور من الشغل
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {(worker.gallery || []).map((img, index) => (
              <img key={index} src={img} className="w-full h-48 object-cover rounded-[2rem] border border-gray-100 shadow-sm" alt="Work" />
            ))}
          </div>
        </div>

        {/* أزرار التواصل */}
        <div className="fixed bottom-6 inset-x-6 max-w-3xl mx-auto z-50">
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl p-4 rounded-[2.5rem] flex gap-3">
            <button 
              disabled={isBusy}
              onClick={() => window.location.href = `tel:${worker.phone}`}
              className={`flex-grow flex items-center justify-center gap-3 py-4 rounded-[1.5rem] font-black transition-all ${
                isBusy ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#1e2d3e] text-white hover:bg-[#d35400] shadow-lg active:scale-95'
              }`}
            >
              <Phone size={22} />
              {isBusy ? "مشغول حالياً" : "اتصل الآن"}
            </button>

            <button 
              disabled={isBusy}
              onClick={() => window.open(`https://wa.me/${worker.phone}`, '_blank')}
              className={`w-20 flex items-center justify-center rounded-[1.5rem] transition-all ${
                isBusy ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600 shadow-lg active:scale-95'
              }`}
            >
              <MessageCircle size={28} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkersDetails;