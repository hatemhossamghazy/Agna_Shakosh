import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Phone, Lock, Calendar, MapPin, 
  CreditCard, Camera, Save, Plus, Trash2,
  ChevronDown, X, Briefcase, Zap, Check, Clock, Hammer,
  AlertCircle, Mail // تم إضافة Mail هنا للفوتر
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WorkersProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false); 
  // للتحكم في ظهور مودال الإلغاء
  const [showAddrModal, setShowAddrModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showPaymentSelectionModal, setShowPaymentSelectionModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // --- تعريف المتغيرات والدوال المفقودة ---
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      id: 1,
      name: "الباقة الأساسية",
      basePrice: 100,
      popular: false,
      features: ["ظهور محدود", "دعم فني عادي"]
    },
    {
      id: 2,
      name: "باقة المحترفين",
      basePrice: 250,
      popular: true,
      features: ["أولوية في البحث", "شارة موثق", "دعم فني 24/7"]
    },
    {
      id: 3,
      name: " الباقة برو ماكس",
      basePrice: 2000,
      popular: false,
      features: ["كل مميزات المحترفين", "خصم 20%", "إعلانات ممولة لخدماتك"]
    }
  ];

  const calculatePrice = (basePrice) => {
    if (billingCycle === 'quarterly') return Math.round(basePrice * 3 * 0.9);
    if (billingCycle === 'yearly') return Math.round(basePrice * 12 * 0.8);
    return basePrice;
  };

  const getLabel = () => {
    if (billingCycle === 'quarterly') return "/ 3 شهور";
    if (billingCycle === 'yearly') return "/ سنة";
    return "/ شهرياً";
  };

  const [workerData, setWorkerData] = useState({
    name: " الاسطي حسام عبد المجيد",
    phone: "01234567890",
    profession: "سباك صحي",
    experience: "12 سنة",
    bio: "متخصص في تأسيس وتشطيب جميع أعمال السباكة والصرف الصحي بأحدث المعدات.",
    image: "WhatsApp%20Image%202026-05-03%20at%204.49.49%20AM.jpeg",
    subscriptionStatus: "نشط",
    subscriptionPlanId: 2, 
    subscriptionExpiry: "2026-06-15",
    addresses: [{ id: 1, type: "الورشة", details: "ميدان المحطة، المنصورة" }],
    payments: [{ id: 1, type: "Visa", last4: "8842" }],
    tools: [
      { id: 1, name: "صاروخ تقطيع بوش", price: "150 ج.م / يوم", status: "معروض للإيجار" }
    ]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkerData(prev => ({ ...prev, [name]: value }));
  };
  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // هنا بنحول الصورة لرابط مؤقت عشان تظهر فوراً في الصفحة
    const imageUrl = URL.createObjectURL(file);
    setWorkerData(prev => ({ ...prev, image: imageUrl }));
  }
};

  const deleteItem = (id, field) => {
    setWorkerData({ ...workerData, [field]: workerData[field].filter(item => item.id !== id) });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Cairo'] text-right" dir="rtl">
      
      {/* Navbar */}
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
          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 bg-[#4a3427] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#3b2a20] transition shadow-lg active:scale-95">
              <ChevronDown size={16} className={isDropdownOpen ? 'rotate-180' : ''} />
              <span>حسابي</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 text-right">
                <button onClick={() => { setIsDropdownOpen(false); setActiveTab('personal'); }} className="w-full text-right px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-bold transition">الملف الشخصي</button>
                <button onClick={() => { setIsDropdownOpen(false); setActiveTab('my-tools'); }} className="w-full text-right px-4 py-2.5 text-sm text-[#d35400] hover:bg-orange-50 font-bold transition">اعرض عدتك</button>
                <hr className="my-1 border-gray-50" />
                <button className="w-full text-right px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-bold transition">تسجيل خروج</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="relative w-32 h-32 mx-auto mb-4 group">
              <img src={workerData.image} className="w-full h-full rounded-full object-cover border-4 border-[#d35400]/20" alt="" />
              <label className="absolute bottom-0 left-0 bg-[#d35400] text-white p-2.5 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-all">
                <Camera size={18} />
                <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" // عشان يفتح الصور بس
                    onChange={handleImageChange} // ربط الدالة هنا
                />
                </label>
            </div>
            <h2 className="font-black text-[#1e2d3e] text-lg">{workerData.name}</h2>
            <p className="text-orange-600 font-bold text-xs">{workerData.profession}</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <TabButton icon={<Briefcase size={20} />} label="البيانات المهنية" active={activeTab === 'personal'} onClick={() => setActiveTab('personal')} />
            <TabButton icon={<Hammer size={20} />} label="إدارة عدتي" active={activeTab === 'my-tools'} onClick={() => setActiveTab('my-tools')} />
            <TabButton icon={<Zap size={20} />} label="باقة الاشتراك" active={activeTab === 'subscription'} onClick={() => setActiveTab('subscription')} />
            <TabButton icon={<MapPin size={20} />} label="منطقة الخدمة" active={activeTab === 'addresses'} onClick={() => setActiveTab('addresses')} />
            <TabButton icon={<CreditCard size={20} />} label="بيانات الدفع" active={activeTab === 'payment'} onClick={() => setActiveTab('payment')} />
            <TabButton icon={<Lock size={20} />} label="تغيير الباسورد" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
          </div>
        </div>

        {/* Content Tabs */}
        <div className="lg:col-span-3">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[500px]">
            
            {activeTab === 'personal' && (
              <div className="space-y-6 text-right">
                <h3 className="text-2xl font-black text-[#1e2d3e] border-b-2 border-gray-50 pb-4">الملف المهني للصنايعي</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                  <InputGroup label="الاسم بالكامل" icon={<User size={18}/>} name="name" value={workerData.name} onChange={handleChange} />
                  <InputGroup label="التخصص الحالي" icon={<Briefcase size={18}/>} name="profession" value={workerData.profession} onChange={handleChange} />
                  <InputGroup label="رقم التواصل" icon={<Phone size={18}/>} name="phone" value={workerData.phone} onChange={handleChange} />
                  <InputGroup label="سنين الخبرة" icon={<Clock size={18}/>} name="experience" value={workerData.experience} onChange={handleChange} />
                </div>
                <div className="space-y-2 text-right">
                  <label className="block text-xs font-black text-gray-400 mr-2">وصف لخدماتك (بيو)</label>
                  <textarea name="bio" value={workerData.bio} onChange={handleChange} className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#d35400] font-bold text-[#1e2d3e] h-32 resize-none text-right"></textarea>
                </div>
                <button className="bg-[#1e2d3e] text-white px-10 py-4 rounded-2xl font-black hover:bg-[#d35400] transition-all flex items-center gap-2 shadow-lg mr-auto">
                  <Save size={20} /> حفظ البيانات المهنية
                </button>
              </div>
            )}

            {activeTab === 'subscription' && (
              <div className="space-y-8">
               {/* 1. كارت حالة الاشتراك الحالي */}
<div className="bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200 flex flex-wrap items-center justify-between gap-4 text-right">
  <div className="flex items-center gap-4">
    <div className={`p-3 rounded-2xl ${workerData.subscriptionPlanId ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
      {workerData.subscriptionPlanId ? <Clock size={24} /> : <AlertCircle size={24} />}
    </div>
    <div>
      <h4 className="font-black text-[#1e2d3e]">
        {workerData.subscriptionPlanId 
          ? `أنت مشترك في ${plans.find(p => p.id === workerData.subscriptionPlanId)?.name || 'باقة نشطة'}` 
          : "لا يوجد اشتراك نشط حالياً"}
      </h4>
      <p className="text-xs font-bold text-gray-500">
        {workerData.subscriptionPlanId ? `ينتهي اشتراكك بتاريخ: ${workerData.subscriptionExpiry}` : "اشترك الآن لتمتع بكافة المميزات"}
      </p>
    </div>
  </div>
  
  {/* التعديل هنا: إضافة رسالة التأكيد */}
 {workerData.subscriptionPlanId && (
  <button 
    onClick={() => setShowCancelModal(true)} // نفتح المودال بدلاً من الحذف المباشر
    className="px-4 py-2 rounded-xl border-2 border-red-100 text-red-500 font-black text-xs hover:bg-red-50 transition-all"
  >
    إلغاء الاشتراك
  </button>
)}
</div>

                <div className="flex justify-center mb-6">
                  <div className="bg-gray-100 p-1.5 rounded-2xl flex items-center gap-1">
                    {[{ id: 'monthly', label: 'شهري' }, { id: 'quarterly', label: '3 شهور (-10%)' }, { id: 'yearly', label: 'سنوي (-20%)' }].map((tab) => (
                      <button key={tab.id} onClick={() => setBillingCycle(tab.id)} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${billingCycle === tab.id ? 'bg-white text-[#d35400] shadow-sm scale-105' : 'text-gray-400 hover:text-gray-600'}`}>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan) => {
                    const isActive = workerData.subscriptionPlanId === plan.id;
                    return (
                      <motion.div key={plan.id} whileHover={{ y: -5 }} className={`relative p-8 rounded-[2.5rem] border-2 transition-all flex flex-col bg-white ${isActive ? 'border-[#d35400] shadow-xl' : 'border-gray-100 shadow-sm hover:border-orange-100'}`}>
                        {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#d35400] text-white px-4 py-1 rounded-full text-[10px] font-black">الأكثر طلباً</div>}
                        <div className="mb-6 flex justify-between items-center"><div className="p-4 bg-gray-50 rounded-2xl"><Zap size={24} className="text-blue-500" /></div>{isActive && <span className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-[10px] font-black italic">مفعلة</span>}</div>
                        <h4 className="text-lg font-black text-[#1e2d3e] mb-2 text-right">{plan.name}</h4>
                        <div className="flex items-baseline gap-1 mb-8 text-right" dir="rtl"><span className="text-3xl font-black text-[#d35400]">{calculatePrice(plan.basePrice)}</span><span className="text-gray-400 text-[10px] font-bold">{getLabel()}</span></div>
                        <div className="space-y-4 mb-10 flex-grow text-right">{plan.features.map((f, i) => (<div key={i} className="flex items-center gap-3 text-[11px] font-bold text-gray-600 justify-start"><Check size={14} className="text-green-500 shrink-0" /><span>{f}</span></div>))}</div>
                        <button 
                        onClick={() => {
                            setSelectedPlanId(plan.id); // تخزين رقم الباقة المختار
                            setShowPaymentSelectionModal(true); // فتح مودال الفيزا
                        }}
                        disabled={isActive} 
                        className={`w-full py-4 rounded-2xl font-black text-sm transition-all shadow-md active:scale-95 ${
                            isActive ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#1e2d3e] text-white hover:bg-[#d35400]'
                        }`}
                        >
                        {isActive ? "أنت مشترك حالياً" : "اختيار الباقة"}
                        </button>                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-6 text-right">
                <div className="flex justify-between items-center border-b-2 border-gray-50 pb-4">
                  <h3 className="text-2xl font-black text-[#1e2d3e]">وسائل تحصيل ودفع الأموال</h3>
                  <button onClick={() => setShowCardModal(true)} className="bg-[#1e2d3e] text-white font-black px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-[#d35400] transition-all text-sm"><Plus size={18} /> إضافة بطاقة</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {workerData.payments.map(pay => (
                    <div key={pay.id} className="bg-gradient-to-br from-[#1e2d3e] to-[#34495e] p-6 rounded-[2rem] text-white shadow-lg relative overflow-hidden group">
                      <div className="relative z-10 text-right">
                        <div className="flex justify-between items-start mb-10"><CreditCard size={35} className="text-orange-400" /><span className="font-black italic text-xl">VISA</span></div>
                        <p className="text-xl font-black tracking-[4px] mb-6 text-center">**** **** **** {pay.last4}</p>
                        <div className="flex justify-between items-end text-sm">
                          <div><p className="text-[10px] text-gray-400 font-black mb-1 text-right">صاحب البطاقة</p><p className="font-black">{workerData.name}</p></div>
                          <Trash2 size={18} onClick={() => deleteItem(pay.id, 'payments')} className="text-white/30 hover:text-red-400 cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-6 text-right">
                <div className="flex justify-between items-center border-b-2 border-gray-50 pb-4">
                  <h3 className="text-2xl font-black text-[#1e2d3e]">مناطق العمل</h3>
                  <button onClick={() => setShowAddrModal(true)} className="bg-[#d35400] text-white font-black px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-[#1e2d3e] transition-all text-sm"><Plus size={18} /> إضافة منطقة خدمة</button>
                </div>
                <div className="grid gap-4">
                  {workerData.addresses.map(addr => (
                    <div key={addr.id} className="flex justify-between items-center p-5 border-2 border-gray-50 rounded-2xl hover:border-[#d35400]/20 transition-all">
                      <div className="flex items-center gap-4"><div className="bg-gray-100 p-3 rounded-2xl text-[#1e2d3e]"><MapPin size={24} /></div><div><p className="font-black text-[#1e2d3e] text-lg">{addr.type}</p><p className="text-gray-500 font-bold text-sm">{addr.details}</p></div></div>
                      <button onClick={() => deleteItem(addr.id, 'addresses')} className="text-red-400 hover:text-red-600 p-2 transition-colors"><Trash2 size={20} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 max-w-md text-right mr-0">
                <h3 className="text-2xl font-black text-[#1e2d3e] border-b-2 border-gray-50 pb-4">تغيير كلمة المرور</h3>
                <InputGroup label="كلمة المرور القديمة" icon={<Lock size={18}/>} type="password" />
                <InputGroup label="كلمة المرور الجديدة" icon={<Lock size={18}/>} type="password" />
                <InputGroup label="تأكيد الكلمة الجديدة" icon={<Lock size={18}/>} type="password" />
                <button className="bg-[#d35400] text-white w-full py-4 rounded-2xl font-black hover:bg-[#1e2d3e] transition-all shadow-lg">تحديث كلمة المرور</button>
              </div>
            )}

            {activeTab === 'my-tools' && (
              <div className="space-y-6 text-right">
                <div className="flex justify-between items-center border-b-2 border-gray-50 pb-4">
                  <h3 className="text-2xl font-black text-[#1e2d3e]">عدتي المعروضة للإيجار</h3>
                  <button className="bg-[#d35400] text-white font-black px-4 py-2 rounded-xl flex items-center gap-2 text-sm"><Plus size={18} /> إضافة معدة</button>
                </div>
                {workerData.tools.map(tool => (
                   <div key={tool.id} className="flex justify-between items-center p-5 border-2 border-gray-100 rounded-2xl">
                      <div className="flex items-center gap-4"><Hammer className="text-[#d35400]" /><div><p className="font-black">{tool.name}</p><p className="text-xs text-gray-500">{tool.price}</p></div></div>
                      <button onClick={() => deleteItem(tool.id, 'tools')}><Trash2 size={18} className="text-red-400" /></button>
                   </div>
                ))}
              </div>
            )}

          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCardModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl p-8 w-full max-w-md text-right relative shadow-2xl">
              <button onClick={() => setShowCardModal(false)} className="absolute top-6 left-6 text-gray-400 hover:text-black"><X /></button>
              <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-[#1e2d3e]"><CreditCard size={20} className="text-[#d35400]"/> إضافة بطاقة</h3>
              <div className="space-y-4 text-right">
                <InputGroup label="رقم البطاقة" placeholder="**** **** **** ****" />
                <div className="grid grid-cols-2 gap-4 text-right"><InputGroup label="تاريخ الانتهاء" placeholder="MM/YY" /><InputGroup label="CVC" placeholder="***" /></div>
                <button onClick={() => setShowCardModal(false)} className="w-full bg-[#1e2d3e] text-white py-4 rounded-2xl font-black mt-4">ربط البطاقة الآن</button>
              </div>
            </motion.div>
          </div>
        )}
        
        {showAddrModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl p-8 w-full max-w-md text-right relative shadow-2xl">
              <button onClick={() => setShowAddrModal(false)} className="absolute top-6 left-6 text-gray-400 hover:text-black"><X /></button>
              <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-[#1e2d3e]"><MapPin size={20} className="text-[#d35400]"/> إضافة منطقة خدمة</h3>
              <div className="space-y-4 text-right">
                <InputGroup label="اسم المنطقة" />
                <button onClick={() => setShowAddrModal(false)} className="w-full bg-[#d35400] text-white py-4 rounded-2xl font-black mt-4">إضافة</button>
              </div>
            </motion.div>
          </div>
          
        )}
        {/* مودال تأكيد إلغاء الاشتراك */}
        {showCancelModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.9, opacity: 0 }} 
            className="bg-white rounded-[2.5rem] p-8 w-full max-w-md text-center relative shadow-2xl border-2 border-red-50"
            >
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} className="text-red-500" />
            </div>
            
            <h3 className="text-2xl font-black mb-4 text-[#1e2d3e]">تنبيه هام!</h3>
            
            <p className="text-gray-500 font-bold leading-relaxed mb-8">
                خد بالك، لو لغيت الاشتراك مش هتعرف تسترد المبلغ المدفوع حالياً. هل أنت متأكد تماماً من قرارك؟
            </p>

            <div className="flex flex-col gap-3">
                <button 
                onClick={() => {
                    setWorkerData({...workerData, subscriptionPlanId: null});
                    setShowCancelModal(false);
                }}
                className="w-full bg-red-500 text-white py-4 rounded-2xl font-black hover:bg-red-600 transition-all shadow-lg shadow-red-200"
                >
                نعم، إلغاء الاشتراك
                </button>
                
                <button 
                onClick={() => setShowCancelModal(false)}
                className="w-full bg-gray-100 text-gray-500 py-4 rounded-2xl font-black hover:bg-gray-200 transition-all"
                >
                رجوع (تراجع عن الإلغاء)
                </button>
            </div>
            </motion.div>
        </div>
        )}
        {/* مودال اختيار بطاقة الدفع */}
        {showPaymentSelectionModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.9, opacity: 0 }} 
            className="bg-white rounded-[2.5rem] p-8 w-full max-w-md text-right relative shadow-2xl"
            >
            <button onClick={() => setShowPaymentSelectionModal(false)} className="absolute top-6 left-6 text-gray-400 hover:text-black"><X /></button>
            
            <h3 className="text-2xl font-black mb-6 text-[#1e2d3e] flex items-center gap-2">
                <CreditCard size={24} className="text-[#d35400]"/> تأكيد الدفع
            </h3>
            
            <p className="text-gray-500 font-bold mb-6 text-sm">اختر البطاقة التي ترغب في استخدامها لتفعيل الاشتراك:</p>

            <div className="space-y-3 mb-8">
                {workerData.payments.map((card) => (
                <div 
                    key={card.id}
                    onClick={() => setSelectedCard(card.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    selectedCard === card.id ? 'border-[#d35400] bg-orange-50' : 'border-gray-100 hover:border-gray-200'
                    }`}
                >
                    <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedCard === card.id ? 'border-[#d35400]' : 'border-gray-300'}`}>
                        {selectedCard === card.id && <div className="w-2.5 h-2.5 bg-[#d35400] rounded-full" />}
                    </div>
                    <div>
                        <p className="font-black text-[#1e2d3e] text-sm">فيزا تنتهي بـ {card.last4}</p>
                        <p className="text-[10px] text-gray-400 font-bold">بطاقة دفع أساسية</p>
                    </div>
                    </div>
                    <CreditCard size={20} className="text-gray-400" />
                </div>
                ))}
                
                <button 
                onClick={() => { setShowPaymentSelectionModal(false); setActiveTab('payment'); }}
                className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold text-xs hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                <Plus size={14} /> إضافة بطاقة جديدة
                </button>
            </div>

            <button 
            disabled={!selectedCard}
            onClick={() => {
                // 1. تحديث بيانات المشترك
                setWorkerData({
                ...workerData, 
                subscriptionPlanId: selectedPlanId,
                subscriptionExpiry: "2027-05-03" // تم تعيين تاريخ انتهاء بناءً على تاريخ اليوم
                });
                
                // 2. إغلاق مودال الدفع
                setShowPaymentSelectionModal(false);
                
                // 3. فتح مودال النجاح
                setTimeout(() => {
                setShowSuccessModal(true);
                }, 300); // تأخير بسيط ليعطي سلاسة في الانتقال بين المودالات
            }}
            className={`w-full py-4 rounded-2xl font-black transition-all shadow-lg ${
                selectedCard 
                ? 'bg-[#1e2d3e] text-white hover:bg-[#d35400]' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            >
            تأكيد الدفع وتفعيل الباقة
            </button>
            </motion.div>
            </div>
        )}
        {/* مودال نجاح الاشتراك */}
        {showSuccessModal && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
            initial={{ scale: 0.5, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.5, opacity: 0 }} 
            className="bg-white rounded-[3rem] p-10 w-full max-w-sm text-center relative shadow-2xl overflow-hidden"
            >
            {/* تأثير خلفية زينة */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400"></div>
            
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 mt-4">
                <Check size={50} className="text-emerald-500" />
            </div>
            
            <h3 className="text-3xl font-black mb-3 text-[#1e2d3e]">مبروك!</h3>
            <p className="text-gray-500 font-bold leading-relaxed mb-8">
                تم تفعيل باقتك بنجاح. تقدر دلوقتي تستمتع بكل مميزات منصة "أجنه وشاكوش".
            </p>

            <button 
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-[#1e2d3e] text-white py-4 rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
            >
                بدء استخدام المنصة
            </button>
            </motion.div>
        </div>
        )}
      </AnimatePresence>

      {/* Footer المضاف حديثاً */}
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
              <li><button onClick={() => navigate('/rental')} className="hover:text-[#d35400] transition">أجر عدة</button></li>
              <li><button onClick={() => navigate('/login')} className="hover:text-[#d35400] transition">تسجيل الدخول</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-black text-[#1e2d3e] mb-4">تواصل معنا</h3>
            <ul className="space-y-3 font-bold text-gray-600 text-sm">
              <li className="flex items-center justify-center md:justify-start gap-3"><Phone size={18} className="text-[#d35400]" /> <span>+20 1012345678</span></li>
              <li className="flex items-center justify-center md:justify-start gap-3"><Mail size={18} className="text-[#d35400]" /> <span>support@agna-shakosh.com</span></li>
              <li className="flex items-center justify-center md:justify-start gap-3"><MapPin size={18} className="text-[#d35400]" /> <span>المنصورة / طلخا، مصر</span></li>
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

const TabButton = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-5 font-black transition-all border-r-4 ${active ? 'bg-[#1e2d3e]/5 border-[#d35400] text-[#d35400]' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}>
    {icon} <span className="text-sm">{label}</span>
  </button>
);

const InputGroup = ({ label, icon, type = "text", ...props }) => (
  <div className="space-y-2 text-right">
    <label className="block text-xs font-black text-gray-400 mr-2">{label}</label>
    <div className="relative group">
      {icon && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#d35400]">{icon}</div>}
      <input type={type} {...props} className={`w-full py-4 ${icon ? 'pr-12' : 'pr-4'} pl-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#d35400] font-black text-[#1e2d3e] transition-all bg-gray-50/30 text-right`} />
    </div>
  </div>
);

export default WorkersProfile;