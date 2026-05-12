import React, { useEffect, useRef, useState } from 'react';
import { LogIn, Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const emailInputRef = useRef(null);
  
  // States الحقول
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // حالة إظهار/إخفاء الباسورد
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // فوكاس تلقائي على حقل البريد الإلكتروني
  useEffect(() => {
    if (emailInputRef.current) emailInputRef.current.focus();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      setIsSubmitting(true);

      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "فشل تسجيل الدخول");
      }

      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      navigate('/');
    } catch (error) {
      setErrorMessage(error.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center p-4 font-['Cairo']" dir="rtl">
      <div className="bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border-t-8 border-[#d35400] relative">
        {/* زر الرجوع */}
        <button onClick={() => navigate('/')} className="absolute top-8 left-8 text-gray-400 hover:text-[#d35400] transition-colors">
          <ArrowLeft size={24} />
        </button>

        <div className="text-center mb-10"> 
            <img src="/logo.png" alt="Logo" className="h-20 mx-auto mb-4" />
            <h2 className="text-3xl font-black text-[#1e2d3e]">تسجيل الدخول</h2>
            <p className="text-gray-500 font-bold mt-2 text-sm">نورت منصة أجنه وشاكوش</p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          
          {/* البريد الإلكتروني */}
          <div>
            <label className="block text-[#1e2d3e] font-bold mb-2 mr-1 text-sm text-right">البريد الإلكتروني</label>
            <div className="relative group">
              <input 
                ref={emailInputRef}
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-12 pl-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-[#d35400] outline-none transition-all font-bold text-right"
                placeholder="example@email.com"
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#d35400]" size={18} />
            </div>
          </div>

          {/* الباسورد مع أيقونة العين */}
          <div>
            <label className="block text-[#1e2d3e] font-bold mb-2 mr-1 text-sm text-right">الباسورد</label>
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} // تبديل النوع هنا
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-12 pl-12 py-4 rounded-2xl border-2 border-gray-100 focus:border-[#d35400] outline-none transition-all font-bold text-right"
                placeholder="********"
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#d35400]" size={18} />
              
              {/* زر العين */}
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#d35400] transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* تذكرني ونسيت الباسورد */}
          <div className="flex justify-between items-center px-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 accent-[#d35400] rounded cursor-pointer"
              />
              <span className="text-xs font-bold text-gray-600 group-hover:text-[#1e2d3e]">تذكرني</span>
            </label>
            <button type="button" className="text-xs font-bold text-[#d35400] hover:underline">نسيت الباسورد؟</button>
          </div>

          {errorMessage && (
            <p className="text-sm font-bold text-red-600 text-right">{errorMessage}</p>
          )}

          {/* زر الدخول */}
          <button 
            type="submit"
            disabled={email.trim().length === 0 || password.length < 6 || isSubmitting}
            className={`w-full py-4 rounded-2xl font-black text-xl transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95 mt-4 ${
              email.trim().length > 0 && password.length >= 6 && !isSubmitting
              ? 'bg-[#1e2d3e] text-white hover:bg-[#d35400]' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <LogIn size={22} />
            {isSubmitting ? "جاري تسجيل الدخول..." : "دخول"}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="font-bold text-gray-600 text-sm">
            ليس لديك حساب؟ 
            <button onClick={() => navigate('/register')} className="text-[#d35400] hover:underline mr-2">سجل حساب جديد</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;