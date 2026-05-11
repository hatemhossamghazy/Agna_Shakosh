import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, User, MapPin, Briefcase, FileText, Phone, ArrowRight, CreditCard, DollarSign, ListChecks, Receipt, Mail, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const navigate = useNavigate();
  
  // التبويب النشط (activeTab) لتحديد القسم المعروض: 'applications' أو 'payments'
  const [activeTab, setActiveTab] = useState('applications');
  
  // بيانات تجريبية لطلبات التقديم الخاصة بالصنايعية
  const [applications, setApplications] = useState([
    {
      id: 1,
      name: "محمد علي السيد",
      job: "سباك",
      experience: "5 سنوات",
      location: "المنصورة",
      phone: "01098765432",
      status: "pending",
      certificateUrl: "#"
    },
    {
      id: 2,
      name: "محمود إبراهيم",
      job: "كهربائي",
      experience: "8 سنوات",
      location: "طلخا",
      phone: "01234567890",
      status: "pending",
      certificateUrl: "#"
    }
  ]);

  // بيانات تجريبية لعمليات الدفع مع رابط الصورة
  const [payments, setPayments] = useState([
    {
      id: 101,
      user: "أحمد عبد الله",
      method: "فودافون كاش",
      amount: "450",
      referenceNumber: "876543219",
      date: "2026-05-04",
      status: "pending",
      paymentImageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 102,
      user: "كريم حسن",
      method: "محفظة إلكترونية",
      amount: "1,200",
      referenceNumber: "123456789",
      date: "2026-05-05",
      status: "pending",
      paymentImageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=400"
    }
  ]);

  // فنكشنات الصنايعية
  const handleAcceptApp = (id) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'accepted' } : app
    ));
    setTimeout(() => {
      setApplications(prev => prev.filter(app => app.id !== id));
    }, 1000);
  };

  const handleRejectApp = (id) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'rejected' } : app
    ));
    setTimeout(() => {
      setApplications(prev => prev.filter(app => app.id !== id));
    }, 1000);
  };

  // فنكشنات المدفوعات
  const handleConfirmPayment = (id) => {
    setPayments(prev => prev.map(p => 
      p.id === id ? { ...p, status: 'confirmed' } : p
    ));
    setTimeout(() => {
      setPayments(prev => prev.filter(p => p.id !== id));
    }, 1000);
  };

  const handleRejectPayment = (id) => {
    setPayments(prev => prev.map(p => 
      p.id === id ? { ...p, status: 'rejected' } : p
    ));
    setTimeout(() => {
      setPayments(prev => prev.filter(p => p.id !== id));
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] pb-20 font-['Cairo'] text-right" dir="rtl">
      
      {/* Navbar الإدارة */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')}
            className="text-[#1e2d3e] hover:text-[#d35400] transition-colors p-2 bg-gray-50 rounded-xl"
          >
            <ArrowRight size={20} className="rotate-180" />
          </button>
          
          <img src="/logo.png" alt="Logo" className="h-12 w-auto object-contain" />
          
          <div className="hidden sm:block">
            <h1 className="text-xl font-black text-[#1e2d3e]">لوحة تحكم الإدارة</h1>
            <p className="text-[10px] font-bold text-gray-400">إدارة الطلبات والعمليات المالية</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-[#1e2d3e] text-white px-4 py-2 rounded-2xl text-xs font-black shadow-lg">
            طلبات الصنايعية: <span className="text-[#d35400] text-sm">{applications.length}</span>
          </div>
          <div className="bg-[#d35400] text-white px-4 py-2 rounded-2xl text-xs font-black shadow-lg">
            عمليات الدفع: <span className="text-white text-sm">{payments.length}</span>
          </div>
        </div>
      </nav>

      {/* المحتوى الرئيسي */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* التبويبات (Tabs) */}
        <div className="flex flex-wrap gap-4 mb-10 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 max-w-lg">
          <button 
            onClick={() => setActiveTab('applications')}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl text-sm font-black transition-all ${
              activeTab === 'applications' 
              ? 'bg-[#1e2d3e] text-white shadow-md' 
              : 'bg-gray-50 text-[#1e2d3e] hover:bg-gray-100'
            }`}
          >
            <ListChecks size={18} />
            طلبات انضمام الصنايعية
          </button>
          
          <button 
            onClick={() => setActiveTab('payments')}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl text-sm font-black transition-all ${
              activeTab === 'payments' 
              ? 'bg-[#d35400] text-white shadow-md' 
              : 'bg-gray-50 text-[#1e2d3e] hover:bg-gray-100'
            }`}
          >
            <CreditCard size={18} />
            تأكيد عمليات الدفع
          </button>
        </div>

        <header className="mb-8">
          {activeTab === 'applications' ? (
            <div>
              <h2 className="text-4xl font-black text-[#1e2d3e] mb-2">مراجعة طلبات الانضمام</h2>
              <p className="text-gray-500 font-bold text-sm">راجع بيانات الصنايعية والمستندات قبل الموافقة على انضمامهم للمنصة.</p>
            </div>
          ) : (
            <div>
              <h2 className="text-4xl font-black text-[#1e2d3e] mb-2">تأكيد عمليات الدفع</h2>
              <p className="text-gray-500 font-bold text-sm">مراجعة وتأكيد التحويلات المالية اليدوية ومراجعة الإيصالات.</p>
            </div>
          )}
        </header>

        {/* 1. قسم الصنايعية */}
        {activeTab === 'applications' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {applications.length > 0 ? (
                applications.map((app) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={app.id}
                    className="bg-white p-6 rounded-2xl shadow-lg border-b-8 transition-all border-[#1e2d3e]"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <span className="text-[10px] font-black text-[#d35400] bg-[#d35400]/10 px-3 py-1 rounded-lg">
                          {app.job}
                        </span>
                        <h3 className="font-black text-xl text-[#1e2d3e] mt-2 mb-1">{app.name}</h3>
                        <div className="flex items-center gap-1 text-[11px] text-gray-400 font-bold">
                          <MapPin size={14} />
                          <span>{app.location}</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-2xl text-[#1e2d3e]">
                        <User size={24} />
                      </div>
                    </div>

                    <div className="space-y-3 mb-8 border-t border-gray-50 pt-4 text-sm text-gray-600 font-bold">
                      <div className="flex items-center gap-3">
                        <Briefcase size={16} className="text-[#d35400]" />
                        <span>الخبرة: <span className="text-[#1e2d3e]">{app.experience}</span></span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone size={16} className="text-[#d35400]" />
                        <span dir="ltr">{app.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 cursor-pointer hover:text-[#d35400] transition">
                        <FileText size={16} className="text-[#d35400]" />
                        <a href={app.certificateUrl} className="underline">مستندات وشهادات الصنايعي</a>
                      </div>
                    </div>

                    {app.status === 'pending' ? (
                      <div className="flex gap-3 mt-auto">
                        <button 
                          onClick={() => constAcceptApp(app.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-black transition shadow-md active:scale-95 cursor-pointer"
                        >
                          <Check size={18} /> قبول
                        </button>
                        <button 
                          onClick={() => handleRejectApp(app.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-black transition shadow-md active:scale-95 cursor-pointer"
                        >
                          <X size={18} /> رفض
                        </button>
                      </div>
                    ) : (
                      <div className={`text-center py-3 rounded-xl font-black text-sm shadow-inner ${
                        app.status === 'accepted' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {app.status === 'accepted' ? 'تم قبول الطلب بنجاح' : 'تم رفض الطلب'}
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-24">
                  <p className="text-gray-400 font-bold text-lg">لا توجد طلبات انضمام معلقة حالياً..</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* 2. قسم تأكيد المدفوعات اليدوية */}
        {activeTab === 'payments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {payments.length > 0 ? (
                payments.map((p) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={p.id}
                    className="bg-white p-6 rounded-2xl shadow-lg border-b-8 border-[#d35400] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <span className="text-[10px] font-black text-[#1e2d3e] bg-gray-100 px-3 py-1 rounded-lg">
                            {p.method}
                          </span>
                          <h3 className="font-black text-xl text-[#1e2d3e] mt-3 mb-1">{p.user}</h3>
                          <p className="text-xs text-gray-400 font-bold">العملية رقم: {p.referenceNumber}</p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-2xl text-[#d35400]">
                          <DollarSign size={24} />
                        </div>
                      </div>

                      <div className="space-y-3 mb-6 border-t border-gray-50 pt-4 text-sm font-bold text-gray-600">
                        <div className="flex items-center justify-between">
                          <span>المبلغ المطلوب:</span>
                          <span className="text-[#1e2d3e] text-base">{p.amount} ج.م</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>تاريخ التحويل:</span>
                          <span>{p.date}</span>
                        </div>
                      </div>

                      {/* قسم عرض صورة الإثبات أو الإيصال */}
                      {p.paymentImageUrl && (
                        <div className="mb-6">
                          <p className="text-xs font-black text-gray-500 mb-2 flex items-center gap-2">
                            <Receipt size={14} className="text-[#d35400]" /> صورة إيصال الدفع:
                          </p>
                          <div 
                            className="rounded-xl overflow-hidden border border-gray-100 shadow-inner h-44 cursor-pointer bg-gray-50 relative group"
                            onClick={() => window.open(p.paymentImageUrl, '_blank')}
                          >
                            <img 
                              src={p.paymentImageUrl} 
                              alt="إثبات الدفع" 
                              className="w-full h-full object-cover hover:scale-105 transition duration-500"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold">
                              اضغط للتكبير
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* أزرار تأكيد الدفع */}
                    <div className="mt-auto pt-4 border-t border-gray-50">
                      {p.status === 'pending' ? (
                        <div className="flex gap-3">
                          <button 
                            onClick={() => handleConfirmPayment(p.id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-black transition shadow-md active:scale-95 cursor-pointer"
                          >
                            <Check size={18} /> تأكيد
                          </button>
                          <button 
                            onClick={() => handleRejectPayment(p.id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-black transition shadow-md active:scale-95 cursor-pointer"
                          >
                            <X size={18} /> إلغاء
                          </button>
                        </div>
                      ) : (
                        <div className={`text-center py-3 rounded-xl font-black text-sm shadow-inner ${
                          p.status === 'confirmed' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {p.status === 'confirmed' ? 'تم تأكيد الدفع بنجاح' : 'تم إلغاء/رفض العملية'}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-24">
                  <p className="text-gray-400 font-bold text-lg">لا توجد عمليات دفع يدوية قيد المراجعة..</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* 📞 تواصل معنا (الفوتر) */}
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
};

// مساعدة لتمرير الرفض لعمليات الدفع (منعاً للخطأ في الفنكشن المكتوبة بالـ Inline)
function RejectPaymentAction(id) {
  console.log('Action for payment id ' + id + ' rejected.');
}

export default AdminPanel;