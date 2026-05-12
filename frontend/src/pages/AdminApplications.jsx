import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, User, MapPin, Briefcase, FileText, Phone, ArrowRight, CreditCard, DollarSign, ListChecks, Receipt, Mail, ShoppingCart, Hammer, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminPanel = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('applications');
  const [equipmentReviews, setEquipmentReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [workerApps, setWorkerApps] = useState([]);
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  
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

  // جلب طلبات الصنايعية من API
  useEffect(() => {
    if (activeTab === 'applications') {
      fetchWorkerApplications();
    }
  }, [activeTab]);

  // جلب طلبات المعدات المعلقة من API
  useEffect(() => {
    if (activeTab === 'equipment') {
      fetchEquipmentReviews();
    }
  }, [activeTab]);

  const fetchWorkerApplications = async () => {
    setLoadingWorkers(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/worker/pending/subscriptions", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setWorkerApps(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching worker applications:", err);
    } finally {
      setLoadingWorkers(false);
    }
  };

  const fetchEquipmentReviews = async () => {
    setLoadingReviews(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/review/pending", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setEquipmentReviews(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching equipment reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleAcceptWorker = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:3000/worker/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkerApps(prev => prev.filter(w => w.user_id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "حدث خطأ أثناء الموافقة");
    }
  };

  const handleRejectWorker = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:3000/worker/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkerApps(prev => prev.filter(w => w.user_id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "حدث خطأ أثناء الرفض");
    }
  };

  const handleApproveEquipment = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:3000/review/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEquipmentReviews(prev => prev.filter(r => r.review_id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "حدث خطأ أثناء الموافقة");
    }
  };

  const handleRejectEquipment = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:3000/review/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEquipmentReviews(prev => prev.filter(r => r.review_id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "حدث خطأ أثناء الرفض");
    }
  };

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
        
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <div className="bg-[#1e2d3e] text-white px-4 py-2 rounded-2xl text-xs font-black shadow-lg">
            طلبات الصنايعية: <span className="text-[#d35400] text-sm">{workerApps.length}</span>
          </div>
          <div className="bg-[#8B4513] text-white px-4 py-2 rounded-2xl text-xs font-black shadow-lg">
            طلبات المعدات: <span className="text-yellow-300 text-sm">{equipmentReviews.length}</span>
          </div>
          <div className="bg-[#d35400] text-white px-4 py-2 rounded-2xl text-xs font-black shadow-lg">
            عمليات الدفع: <span className="text-white text-sm">{payments.length}</span>
          </div>
        </div>
      </nav>

      {/* المحتوى الرئيسي */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* التبويبات (Tabs) — 3 tabs */}
        <div className="flex flex-wrap gap-4 mb-10 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 max-w-3xl">
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
            onClick={() => setActiveTab('equipment')}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl text-sm font-black transition-all ${
              activeTab === 'equipment' 
              ? 'bg-[#8B4513] text-white shadow-md' 
              : 'bg-gray-50 text-[#1e2d3e] hover:bg-gray-100'
            }`}
          >
            <Hammer size={18} />
            الموافقة على عرض المعدات
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
          {activeTab === 'applications' && (
            <div>
              <h2 className="text-4xl font-black text-[#1e2d3e] mb-2">مراجعة طلبات الانضمام</h2>
              <p className="text-gray-500 font-bold text-sm">راجع بيانات الصنايعية قبل تفعيل اشتراكهم في المنصة.</p>
            </div>
          )}
          {activeTab === 'equipment' && (
            <div>
              <h2 className="text-4xl font-black text-[#1e2d3e] mb-2">مراجعة طلبات عرض المعدات</h2>
              <p className="text-gray-500 font-bold text-sm">راجع صور وبيانات المعدات قبل الموافقة على عرضها في المتجر.</p>
            </div>
          )}
          {activeTab === 'payments' && (
            <div>
              <h2 className="text-4xl font-black text-[#1e2d3e] mb-2">تأكيد عمليات الدفع</h2>
              <p className="text-gray-500 font-bold text-sm">مراجعة وتأكيد التحويلات المالية اليدوية ومراجعة الإيصالات.</p>
            </div>
          )}
        </header>

        {/* 1. قسم الصنايعية — من API حقيقي */}
        {activeTab === 'applications' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingWorkers ? (
              <div className="col-span-full text-center py-24">
                <p className="text-gray-400 font-bold text-lg">جاري التحميل...</p>
              </div>
            ) : workerApps.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {workerApps.map((app) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={app.user_id}
                    className="bg-white p-6 rounded-2xl shadow-lg border-b-8 transition-all border-[#1e2d3e]"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <span className="text-[10px] font-black text-[#d35400] bg-[#d35400]/10 px-3 py-1 rounded-lg">
                          {app.job_type}
                        </span>
                        <h3 className="font-black text-xl text-[#1e2d3e] mt-2 mb-1">{app.fname} {app.lname}</h3>
                        <div className="flex items-center gap-1 text-[11px] text-gray-400 font-bold">
                          <MapPin size={14} />
                          <span>{app.government} / {app.city}</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-2xl text-[#1e2d3e]">
                        <User size={24} />
                      </div>
                    </div>

                    <div className="space-y-3 mb-8 border-t border-gray-50 pt-4 text-sm text-gray-600 font-bold">
                      <div className="flex items-center gap-3">
                        <Briefcase size={16} className="text-[#d35400]" />
                        <span>الخبرة: <span className="text-[#1e2d3e]">{app.experience_years} سنوات</span></span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone size={16} className="text-[#d35400]" />
                        <span dir="ltr">{app.phone}</span>
                      </div>
                      {app.bio && (
                        <div className="flex items-center gap-3">
                          <FileText size={16} className="text-[#d35400]" />
                          <span className="text-xs">{app.bio}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 mt-auto">
                      <button 
                        onClick={() => handleAcceptWorker(app.user_id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-black transition shadow-md active:scale-95 cursor-pointer"
                      >
                        <Check size={18} /> قبول
                      </button>
                      <button 
                        onClick={() => handleRejectWorker(app.user_id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-black transition shadow-md active:scale-95 cursor-pointer"
                      >
                        <X size={18} /> رفض
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="col-span-full text-center py-24">
                <p className="text-gray-400 font-bold text-lg">لا توجد طلبات انضمام معلقة حالياً..</p>
              </div>
            )}
          </div>
        )}

        {/* 2. قسم الموافقة على عرض المعدات */}
        {activeTab === 'equipment' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingReviews ? (
              <div className="col-span-full text-center py-24">
                <p className="text-gray-400 font-bold text-lg">جاري التحميل...</p>
              </div>
            ) : equipmentReviews.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {equipmentReviews.map((review) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={review.review_id}
                    className="bg-white p-6 rounded-2xl shadow-lg border-b-8 border-[#8B4513] transition-all"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <span className="text-[10px] font-black text-[#8B4513] bg-[#8B4513]/10 px-3 py-1 rounded-lg">
                          {review.category}
                        </span>
                        <h3 className="font-black text-xl text-[#1e2d3e] mt-2 mb-1">{review.name}</h3>
                        <div className="flex items-center gap-1 text-[11px] text-gray-400 font-bold">
                          <User size={14} />
                          <span>{review.seller_name}</span>
                        </div>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-2xl text-[#8B4513]">
                        <Package size={24} />
                      </div>
                    </div>

                    {review.image_url && (
                      <div className="mb-4 rounded-xl overflow-hidden border border-gray-100 h-44 bg-gray-50">
                        <img 
                          src={review.image_url} 
                          alt={review.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="space-y-3 mb-6 border-t border-gray-50 pt-4 text-sm text-gray-600 font-bold">
                      <div className="flex items-center justify-between">
                        <span>السعر:</span>
                        <span className="text-[#1e2d3e] font-black">{review.sale_price} ج.م</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>النوع:</span>
                        <span className="text-[#1e2d3e]">{review.type === 'sale' ? 'بيع' : review.type === 'rent' ? 'إيجار' : review.type}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>الحالة:</span>
                        <span className="text-[#1e2d3e]">{review.condition === 'new' ? 'جديد' : 'مستعمل'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>التليفون:</span>
                        <span className="text-[#1e2d3e]" dir="ltr">{review.seller_phone}</span>
                      </div>
                      {review.description && (
                        <div className="pt-2 border-t border-gray-50">
                          <p className="text-xs text-gray-400 mb-1">الوصف:</p>
                          <p className="text-[#1e2d3e] text-sm">{review.description}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 mt-auto">
                      <button 
                        onClick={() => handleApproveEquipment(review.review_id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-black transition shadow-md active:scale-95 cursor-pointer"
                      >
                        <Check size={18} /> قبول
                      </button>
                      <button 
                        onClick={() => handleRejectEquipment(review.review_id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-black transition shadow-md active:scale-95 cursor-pointer"
                      >
                        <X size={18} /> رفض
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="col-span-full text-center py-24">
                <p className="text-gray-400 font-bold text-lg">لا توجد طلبات عرض معدات معلقة حالياً..</p>
              </div>
            )}
          </div>
        )}

        {/* 3. قسم تأكيد المدفوعات اليدوية */}
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
                    <div><div className="flex items-start justify-between mb-6">
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
                      {p.paymentImageUrl && (
                        <div className="mb-6">
                          <p className="text-xs font-black text-gray-500 mb-2 flex items-center gap-2">
                            <Receipt size={14} className="text-[#d35400]" /> صورة إيصال الدفع:
                          </p>
                          <div 
                            className="rounded-xl overflow-hidden border border-gray-100 shadow-inner h-44 cursor-pointer bg-gray-50 relative group"
                            onClick={() => window.open(p.paymentImageUrl, '_blank')}
                          >
                            <img src={p.paymentImageUrl} alt="إثبات الدفع" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold">اضغط للتكبير</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-auto pt-4 border-t border-gray-50">
                      {p.status === 'pending' ? (
                        <div className="flex gap-3">
                          <button onClick={() => handleConfirmPayment(p.id)} className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-black transition shadow-md active:scale-95 cursor-pointer">
                            <Check size={18} /> تأكيد
                          </button>
                          <button onClick={() => handleRejectPayment(p.id)} className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-black transition shadow-md active:scale-95 cursor-pointer">
                            <X size={18} /> إلغاء
                          </button>
                        </div>
                      ) : (
                        <div className={`text-center py-3 rounded-xl font-black text-sm shadow-inner ${p.status === 'confirmed' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
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

      <footer className="bg-gray-100 py-16 px-6 mt-16 text-center md:text-right border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-2xl font-black text-[#1e2d3e] mb-4">أجنه وشاكوش</h3>
            <p className="text-gray-500 font-bold text-sm leading-relaxed max-w-sm">المنصة الأولى في مصر لخدمات الصنايعية وبيع وتأجير العدد بأفضل الأسعار.</p>
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

export default AdminPanel;