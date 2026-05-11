import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  UserPlus, Phone, Lock, ArrowRight, User as UserIcon, 
  Briefcase, Eye, EyeOff, Wrench, ShieldCheck, CheckCircle2, Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const nameInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "customer",
    jobTitle: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (nameInputRef.current) nameInputRef.current.focus();
  }, []);

  // دالة حساب قوة كلمة السر بناءً على نوع البيانات (تراكمي)
  const getStrengthScore = (pass) => {
    if (pass.length === 0) return 0;
    
    const hasLetters = /[a-zA-Z]/.test(pass);
    const hasNumbers = /[0-9]/.test(pass);
    const hasSymbols = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pass);

    // 3. قوية جداً: رموز + (أرقام أو حروف)
    if (hasSymbols && (hasNumbers || hasLetters)) return 3;
    
    // 2. متوسطة: حروف + أرقام
    if (hasNumbers && hasLetters) return 2;
    
    // 1. ضعيفة: نوع واحد فقط (أرقام بس أو حروف بس)
    return 1;
  };

  const strength = getStrengthScore(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      // منع إدخال غير الأرقام وتحديد الطول بـ 11 رقم
      if (/^[0-9]*$/.test(value) && value.length <= 11) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const mapRoleToBackend = (role) => {
    if (role === "technician") return "craftsman";
    if (role === "owner") return "seller";
    return "client";
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      setIsSubmitting(true);

      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.name.trim(),
          email: formData.email.trim(),
          mobileNumber: formData.phone,
          userType: mapRoleToBackend(formData.role),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          jobType: formData.role === "technician" ? formData.jobTitle : null
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const firstFieldError = Array.isArray(data?.errors) ? data.errors[0]?.message : "";
        throw new Error(firstFieldError || data?.message || "فشل إنشاء الحساب");
      }

      setSuccessMessage("تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول الآن");
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      setErrorMessage(error.message || "حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    const basicInfo =
      formData.name.trim().length >= 3 &&
      formData.email.trim().length > 0 &&
      formData.phone.length === 11 &&
      formData.password.length >= 8;
    const passwordMatch = formData.password === formData.confirmPassword;
    const jobSelected = formData.role === "technician" ? formData.jobTitle !== "" : true;
    return basicInfo && passwordMatch && jobSelected;
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center p-4 py-10" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="bg-white w-full max-w-lg p-8 rounded-[2rem] shadow-2xl border-t-8 border-[#1e2d3e] relative overflow-hidden">
        {/* زر العودة */}
        <button onClick={() => navigate('/')} className="absolute top-6 left-6 text-gray-400 hover:text-[#d35400] transition-colors">
          <ArrowRight size={28} className="rotate-180" />
        </button>

        <div className="text-center mb-8 select-none">
          <img src="/logo.png" alt="Logo" className="h-20 mx-auto mb-4 pointer-events-none" />
          <h2 className="text-3xl font-black text-[#1e2d3e]">فتح حساب جديد</h2>
          <p className="text-gray-500 font-bold mt-2 text-sm">انضم لأكبر تجمع للصنايعية والعدد في مصر</p>
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          {/* حقل الاسم */}
          <div className="relative">
            <label className="block text-[#1e2d3e] font-bold mb-2 mr-2 text-sm text-right">الاسم بالكامل</label>
            <div className="relative group">
              <input 
                ref={nameInputRef} type="text" name="name" value={formData.name} onChange={handleChange}
                className="w-full pr-12 pl-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-[#d35400] outline-none transition-all text-right font-bold"
                placeholder="اكتب اسمك الثلاثي"
              />
              <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#d35400]" size={20} />
            </div>
          </div>

          <div className="relative">
            <label className="block text-[#1e2d3e] font-bold mb-2 mr-2 text-sm text-right">البريد الإلكتروني</label>
            <div className="relative group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pr-12 pl-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-[#d35400] outline-none transition-all text-right font-bold"
                placeholder="example@email.com"
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#d35400]" size={20} />
            </div>
          </div>

          {/* حقل الموبايل */}
          <div className="relative">
            <label className="block text-[#1e2d3e] font-bold mb-2 mr-2 text-sm text-right">رقم الموبايل</label>
            <div className="relative group">
              <input 
                type="tel" name="phone" value={formData.phone} onChange={handleChange}
                className="w-full pr-12 pl-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-[#d35400] outline-none transition-all text-right font-bold"
                placeholder="01xxxxxxxxx"
              />
              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#d35400]" size={20} />
            </div>
          </div>

          {/* اختيار الدور */}
          <div className="relative">
            <label className="block text-[#1e2d3e] font-bold mb-2 mr-2 text-sm text-right">أنا داخل كـ :</label>
            <div className="relative group">
              <select 
                name="role" value={formData.role} onChange={handleChange}
                className="w-full pr-12 pl-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-[#d35400] outline-none transition-all font-bold appearance-none bg-white text-right"
              >
                <option value="customer">عميل (أبحث عن خدمات)</option>
                <option value="technician">صنايعي (أعرض خدماتي)</option>
                <option value="owner">صاحب معرض عِدة</option>
              </select>
              <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#d35400]" size={20} />
            </div>
          </div>

          {/* اختيار الصنعة (مشروط) */}
          <AnimatePresence>
            {formData.role === "technician" && (
              <div className="relative overflow-hidden">
                <label className="block text-[#d35400] font-bold mb-2 mr-2 text-sm text-right">حدد صنعتك:</label>
                <div className="relative group">
                  <select 
                    name="jobTitle" value={formData.jobTitle} onChange={handleChange}
                    className="w-full pr-12 pl-5 py-4 rounded-2xl border-2 border-[#d35400]/30 focus:border-[#d35400] outline-none transition-all font-bold appearance-none bg-[#d35400]/5 text-right"
                  >
                    <option value="">اختار الصنعة...</option>
                    <option value="كهربائي">كهربائي</option>
                    <option value="نجار">نجار</option>
                    <option value="سباك">سباك</option>
                    <option value="نقاش">نقاش</option>
                  </select>
                  <Wrench className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d35400]" size={20} />
                </div>
              </div>
            )}
          </AnimatePresence>

          {/* كلمة السر ومقياس القوة */}
          <div className="relative">
            <label className="block text-[#1e2d3e] font-bold mb-2 mr-2 text-sm text-right">الباسورد</label>
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                className="w-full pr-12 pl-12 py-4 rounded-2xl border-2 border-gray-100 focus:border-[#d35400] outline-none transition-all text-right font-bold"
                placeholder="********"
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#d35400]" size={20} />
              <button 
                type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#d35400]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {/* مقياس القوة البصري */}
            {formData.password.length > 0 && (
              <div className="mt-3 px-1">
                <div className="flex gap-2 h-2">
                  {/* الخانة 1: تلون دائماً لو فيه باسورد */}
                  <div className={`flex-1 rounded-full transition-all duration-300 ${strength >= 1 ? (strength === 1 ? 'bg-red-500' : strength === 2 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-gray-100'}`} />
                  {/* الخانة 2: تلون لو متوسطة (حروف + أرقام) */}
                  <div className={`flex-1 rounded-full transition-all duration-300 ${strength >= 2 ? (strength === 2 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-gray-100'}`} />
                  {/* الخانة 3: تلون لو قوية (رموز + أرقام/حروف) */}
                  <div className={`flex-1 rounded-full transition-all duration-300 ${strength >= 3 ? 'bg-green-500' : 'bg-gray-100'}`} />
                </div>
                <p className={`text-[11px] font-bold mt-2 text-right transition-colors ${strength === 1 ? 'text-red-500' : strength === 2 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {strength === 1 && "🔴 ضعيفة (نوع واحد فقط)"}
                  {strength === 2 && "🟡 متوسطة (حروف + أرقام)"}
                  {strength === 3 && "🟢 قوية جداً (رموز + أرقام)"}
                </p>
              </div>
            )}
          </div>

          {/* تأكيد كلمة السر */}
          <div className="relative">
            <label className="block text-[#1e2d3e] font-bold mb-2 mr-2 text-sm text-right">تأكيد الباسورد</label>
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                className={`w-full pr-12 pl-12 py-4 rounded-2xl border-2 outline-none transition-all text-right font-bold ${
                  formData.confirmPassword 
                    ? (formData.password === formData.confirmPassword ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') 
                    : 'border-gray-100 focus:border-[#d35400]'
                }`}
                placeholder="********"
              />
              <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" size={20} />
              )}
            </div>
          </div>

          {errorMessage && (
            <p className="text-sm font-bold text-red-600 text-right">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-sm font-bold text-green-600 text-right">{successMessage}</p>
          )}

          <button 
            disabled={!isFormValid() || isSubmitting}
            type="submit"
            className={`w-full py-4 rounded-2xl font-black text-xl transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 mt-6 ${
              isFormValid() && !isSubmitting
              ? 'bg-[#1e2d3e] text-white hover:bg-[#d35400] shadow-[#1e2d3e]/20' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            <UserPlus size={24} />
            {isSubmitting ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="font-bold text-gray-600 text-sm">
            عندك حساب فعلاً؟ 
            <button type="button" onClick={() => navigate('/login')} className="text-[#d35400] hover:underline mr-2">
              سجل دخول من هنا
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;