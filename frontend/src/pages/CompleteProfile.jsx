import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, Send, Calendar, 
  Hash, PhoneForwarded, UserCircle, CreditCard 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CompleteProfile = () => {
  const navigate = useNavigate();
  
  // حالات الصور (States)
  const [profileImg, setProfileImg] = useState(null);
  const [idFrontImg, setIdFrontImg] = useState(null);
  const [idBackImg, setIdBackImg] = useState(null);
  
  // حالات البيانات النصية
  const [formData, setFormData] = useState({
    birthDate: "",
    nationalId: "",
    altPhone: ""
  });

  // حالة تفعيل الزرار
  const [isFormValid, setIsFormValid] = useState(false);

  // الفحص الدقيق لكل الحقول
  useEffect(() => {
    // التأكد من التاريخ (مش فاضي وطوله منطقي)
    const hasBirthDate = formData.birthDate !== "" && formData.birthDate.length >= 8;
    
    // التأكد من الأرقام (14 رقم بطاقة و 11 رقم موبايل)
    const isIdValid = formData.nationalId.length === 14;
    const isPhoneValid = formData.altPhone.length === 11;
    
    // التأكد من رفع الـ 3 صور
    const hasAllImages = profileImg !== null && idFrontImg !== null && idBackImg !== null;

    // تفعيل الحالة فقط لو كله تمام
    setIsFormValid(hasBirthDate && isIdValid && isPhoneValid && hasAllImages);
  }, [formData, profileImg, idFrontImg, idBackImg]);

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) setter(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // منع الحروف وتقييد الأطوال
    if (name === "altPhone" || name === "nationalId") {
      if (/^[0-9]*$/.test(value)) {
        if (name === "altPhone" && value.length <= 11) setFormData({ ...formData, [name]: value });
        if (name === "nationalId" && value.length <= 14) setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center p-4 py-10" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-2xl p-8 rounded-[2.5rem] shadow-2xl border-t-8 border-[#d35400]"
      >
        {/* اللوجو والعنوان */}
        <div className="text-center mb-6">
          <img src="/logo.png" alt="Logo" className="h-16 mx-auto mb-2 pointer-events-none" />
          <h2 className="text-3xl font-black text-[#1e2d3e]">كمل حسابك</h2>
          <p className="text-gray-500 font-bold text-sm">برجاء رفع بيانات دقيقة لضمان تفعيل الحساب</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* رفع الصورة الشخصية */}
          <div className="text-center mb-6">
            <div className="relative w-24 h-24 mx-auto">
              <div className="w-full h-full rounded-full border-4 border-gray-100 overflow-hidden flex items-center justify-center bg-gray-50">
                {profileImg ? <img src={profileImg} className="w-full h-full object-cover" /> : <UserCircle size={50} className="text-gray-300" />}
              </div>
              <label className="absolute bottom-0 right-0 bg-[#d35400] p-1.5 rounded-full text-white cursor-pointer shadow-md hover:bg-[#1e2d3e] transition-colors">
                <Camera size={14} />
                <input type="file" className="hidden" onChange={(e) => handleFileChange(e, setProfileImg)} accept="image/*" />
              </label>
            </div>
            <p className="text-[#d35400] text-xs font-bold mt-2">ضيف صورة شخصية خلفية بيضاء</p>
          </div>

          {/* التاريخ والبطاقة */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative text-right">
              <label className="block text-[#1e2d3e] font-bold mb-1 mr-2 text-sm">تاريخ الميلاد</label>
              <div className="relative">
                <input 
                  type="date" 
                  name="birthDate" 
                  value={formData.birthDate} 
                  onChange={handleChange} 
                  className="w-full pr-10 pl-4 py-3 rounded-xl border-2 border-gray-50 outline-none focus:border-[#d35400] font-bold text-right" 
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              </div>
            </div>

            <div className="relative text-right">
              <label className="block text-[#1e2d3e] font-bold mb-1 mr-2 text-sm">الرقم القومي (14 رقم)</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="nationalId" 
                  value={formData.nationalId} 
                  onChange={handleChange} 
                  placeholder="2990101XXXXXXXX"
                  className="w-full pr-10 pl-4 py-3 rounded-xl border-2 border-gray-50 outline-none focus:border-[#d35400] font-bold text-right" 
                />
                <Hash className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              </div>
            </div>
          </div>

          {/* رقم الهاتف */}
          <div className="relative text-right">
            <label className="block text-[#1e2d3e] font-bold mb-1 mr-2 text-sm">رقم هاتف بديل</label>
            <div className="relative">
              <input 
                type="tel" 
                name="altPhone" 
                value={formData.altPhone} 
                onChange={handleChange} 
                placeholder="01xxxxxxxxx"
                className="w-full pr-10 pl-4 py-3 rounded-xl border-2 border-gray-50 outline-none focus:border-[#d35400] font-bold text-right" 
              />
              <PhoneForwarded className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            </div>
          </div>

          {/* رفع صور البطاقة (Dashed Boxes) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-right">
              <label className="block text-[#1e2d3e] font-bold mb-2 text-sm">وجه البطاقة</label>
              <label className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all min-h-[100px] ${idFrontImg ? 'border-[#d35400] bg-orange-50' : 'border-gray-200'}`}>
                {idFrontImg ? <img src={idFrontImg} className="h-16 object-contain" /> : <><CreditCard className="text-gray-300 mb-1" /> <span className="text-[10px] text-gray-400">ارفع وجه البطاقة</span></>}
                <input type="file" className="hidden" onChange={(e) => handleFileChange(e, setIdFrontImg)} accept="image/*" />
              </label>
            </div>
            <div className="text-right">
              <label className="block text-[#1e2d3e] font-bold mb-2 text-sm">ظهر البطاقة</label>
              <label className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all min-h-[100px] ${idBackImg ? 'border-[#d35400] bg-orange-50' : 'border-gray-200'}`}>
                {idBackImg ? <img src={idBackImg} className="h-16 object-contain" /> : <><CreditCard className="text-gray-300 mb-1" /> <span className="text-[10px] text-gray-400">ارفع ظهر البطاقة</span></>}
                <input type="file" className="hidden" onChange={(e) => handleFileChange(e, setIdBackImg)} accept="image/*" />
              </label>
            </div>
          </div>

          {/* زر الإرسال الذكي */}
          <button 
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-4 rounded-2xl font-black text-xl transition-all shadow-xl flex items-center justify-center gap-3 mt-4
              ${isFormValid 
                ? "bg-[#1e2d3e] text-white hover:bg-[#d35400] cursor-pointer active:scale-95 shadow-lg" 
                : "bg-[#e0e3e7] text-[#a0a8b3] cursor-not-allowed shadow-none"}`}
          >
            <Send size={22} />
            ارسال الطلب للمراجعه
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CompleteProfile;