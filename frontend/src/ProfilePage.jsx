import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Phone, Mail, Lock, Calendar, MapPin, 
  CreditCard, Camera, Save, Plus, Trash2,
  ShoppingCart, ChevronDown, X, Hammer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [showAddrModal, setShowAddrModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);

  const [userData, setUserData] = useState({
    name: "أحمد محمد علي",
    phone: "01012345678",
    birthDate: "1995-05-15",
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
    addresses: [
      { id: 1, type: "المنزل", details: "12 شارع الجمهورية، طلخا، الدقهلية" },
    ],
    payments: [
      { id: 1, type: "Visa", last4: "4242" }
    ],
    // إضافة بيانات افتراضية للعدة
    tools: [
      { id: 1, name: "شنيور هلتي توتال", price: "200 ج.م / يوم", status: "نشط" }
    ]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newAddr = {
      id: Date.now(),
      type: formData.get('type'),
      details: formData.get('details')
    };
    setUserData({ ...userData, addresses: [...userData.addresses, newAddr] });
    setShowAddrModal(false);
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const cardNum = formData.get('cardNumber');
    if (!cardNum) return;
    const newCard = {
      id: Date.now(),
      type: "Visa",
      last4: cardNum.slice(-4)
    };
    setUserData({ ...userData, payments: [...userData.payments, newCard] });
    setShowCardModal(false);
  };

  const deleteItem = (id, field) => {
    setUserData({ ...userData, [field]: userData[field].filter(item => item.id !== id) });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsDropdownOpen(false);
    navigate('/login');
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
          <button onClick={() => navigate('/cart')} className="relative p-2.5 text-[#1e2d3e] hover:bg-gray-100 rounded-full transition">
            <ShoppingCart size={24} />
            <span className="absolute top-0 right-0 bg-[#d35400] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black">2</span>
          </button>

          <div className="relative">
          <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-[#1e2d3e] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#d35400] transition shadow-lg select-none cursor-pointer active:scale-95"
              >
                <span>حسابي</span>
                <ChevronDown size={16} />
              </button>
            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 text-right">
                <button onClick={() => { setIsDropdownOpen(false); navigate('/profile'); }} className="w-full text-right px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-bold transition">الملف الشخصي</button>
                <button onClick={() => { setIsDropdownOpen(false); navigate('/orders'); }} className="w-full text-right px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-bold transition">طلباتي</button>
                {/* الخيار الجديد في القائمة المنسدلة */}
                <button onClick={() => { setIsDropdownOpen(false); setActiveTab('my-tools'); }} className="w-full text-right px-4 py-2.5 text-sm text-[#d35400] hover:bg-orange-50 font-bold transition">إدارة عدتي</button>
                <hr className="my-1 border-gray-50" />
                <button 
                    onClick={handleLogout}
                    className="w-full text-right px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-bold transition"
                  >
                    تسجيل خروج
                  </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8 pb-20">
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="relative w-32 h-32 mx-auto mb-4 group">
              <img src={userData.image} className="w-full h-full rounded-full object-cover border-4 border-[#d35400]/20" alt="" />
              <label className="absolute bottom-0 left-0 bg-[#d35400] text-white p-2.5 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-all">
                <Camera size={18} />
                <input type="file" className="hidden" />
              </label>
            </div>
            <h2 className="font-black text-[#1e2d3e] text-lg">{userData.name}</h2>
            <p className="text-gray-400 font-bold text-xs">{userData.phone}</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <TabButton icon={<User size={20} />} label="البيانات الأساسية" active={activeTab === 'personal'} onClick={() => setActiveTab('personal')} />
            {/* التبويب الجديد في السايد بار */}
            <TabButton icon={<Hammer size={20} />} label="إدارة عدتي" active={activeTab === 'my-tools'} onClick={() => setActiveTab('my-tools')} />
            <TabButton icon={<Lock size={20} />} label="تغيير الباسورد" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
            <TabButton icon={<MapPin size={20} />} label="عناويني" active={activeTab === 'addresses'} onClick={() => setActiveTab('addresses')} />
            <TabButton icon={<CreditCard size={20} />} label="بيانات الدفع" active={activeTab === 'payment'} onClick={() => setActiveTab('payment')} />
          </div>
        </div>

        {/* Content Tabs */}
        <div className="lg:col-span-3">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[500px]">
            
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-[#1e2d3e] border-b-2 border-gray-50 pb-4">البيانات الشخصية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="الاسم بالكامل" icon={<User size={18}/>} name="name" value={userData.name} onChange={handleChange} />
                  <InputGroup label="رقم التليفون" icon={<Phone size={18}/>} name="phone" value={userData.phone} onChange={handleChange} />
                  <InputGroup label="تاريخ الميلاد" icon={<Calendar size={18}/>} name="birthDate" value={userData.birthDate} type="date" onChange={handleChange} />
                </div>
                <button className="bg-[#1e2d3e] text-white px-10 py-4 rounded-2xl font-black hover:bg-[#d35400] transition-all flex items-center gap-2 mt-8 shadow-lg">
                  <Save size={20} /> حفظ التعديلات
                </button>
              </div>
            )}

            {/* محتوى تبويب إدارة العدة المدمج */}
            {activeTab === 'my-tools' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b-2 border-gray-50 pb-4">
                  <h3 className="text-2xl font-black text-[#1e2d3e]">عدتي المعروضة</h3>
                  <button className="bg-[#d35400] text-white font-black px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-[#1e2d3e] transition-all text-sm">
                    <Plus size={18} /> إضافة معدة جديدة
                  </button>
                </div>
                <div className="grid gap-4">
                  {userData.tools?.map(tool => (
                    <div key={tool.id} className="flex justify-between items-center p-5 border-2 border-gray-50 rounded-2xl group hover:border-[#d35400]/20 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-100 p-3 rounded-2xl text-[#d35400]"><Hammer size={24} /></div>
                        <div>
                          <p className="font-black text-[#1e2d3e] text-lg">{tool.name}</p>
                          <p className="text-gray-500 font-bold text-sm">{tool.price} - <span className="text-green-600 font-black">{tool.status}</span></p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-gray-400 hover:text-[#1e2d3e] font-bold text-sm px-2">تعديل</button>
                        <button onClick={() => deleteItem(tool.id, 'tools')} className="text-red-400 hover:text-red-600 p-2 transition-colors"><Trash2 size={20} /></button>
                      </div>
                    </div>
                  ))}
                  {userData.tools?.length === 0 && (
                    <p className="text-center text-gray-400 font-bold py-10">لم تقم بإضافة أي معدات بعد.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 max-w-md">
                <h3 className="text-2xl font-black text-[#1e2d3e] border-b-2 border-gray-50 pb-4">تغيير كلمة المرور</h3>
                <InputGroup label="كلمة المرور القديمة" icon={<Lock size={18}/>} type="password" />
                <InputGroup label="كلمة المرور الجديدة" icon={<Lock size={18}/>} type="password" />
                <InputGroup label="تأكيد الكلمة الجديدة" icon={<Lock size={18}/>} type="password" />
                <button className="bg-[#d35400] text-white w-full py-4 rounded-2xl font-black hover:bg-[#1e2d3e] transition-all shadow-lg">تحديث كلمة المرور</button>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b-2 border-gray-50 pb-4">
                  <h3 className="text-2xl font-black text-[#1e2d3e]">عناوين الشحن</h3>
                  <button onClick={() => setShowAddrModal(true)} className="bg-[#d35400]/10 text-[#d35400] font-black px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-[#d35400] hover:text-white transition-all text-sm">
                    <Plus size={18} /> إضافة جديد
                  </button>
                </div>
                <div className="grid gap-4">
                  {userData.addresses.map(addr => (
                    <div key={addr.id} className="flex justify-between items-center p-5 border-2 border-gray-50 rounded-2xl group hover:border-[#d35400]/20 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-100 p-3 rounded-2xl text-[#1e2d3e] group-hover:bg-[#d35400]/10 group-hover:text-[#d35400]"><MapPin size={24} /></div>
                        <div><p className="font-black text-[#1e2d3e] text-lg">{addr.type}</p><p className="text-gray-500 font-bold text-sm">{addr.details}</p></div>
                      </div>
                      <button onClick={() => deleteItem(addr.id, 'addresses')} className="text-red-400 hover:text-red-600 p-2 rounded-xl transition-colors"><Trash2 size={20} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b-2 border-gray-50 pb-4">
                  <h3 className="text-2xl font-black text-[#1e2d3e]">طرق الدفع</h3>
                  <button onClick={() => setShowCardModal(true)} className="bg-[#1e2d3e]/10 text-[#1e2d3e] font-black px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-[#1e2d3e] hover:text-white transition-all text-sm">
                    <Plus size={18} /> إضافة بطاقة
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userData.payments.map(pay => (
                    <div key={pay.id} className="bg-gradient-to-br from-[#1e2d3e] to-[#34495e] p-6 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-10"><CreditCard size={35} className="text-[#d35400]" /><span className="font-black italic text-xl">VISA</span></div>
                        <p className="text-xl font-black tracking-[4px] mb-6">**** **** **** {pay.last4}</p>
                        <div className="flex justify-between items-end">
                          <div><p className="text-[10px] text-gray-400 font-black mb-1">Card Holder</p><p className="font-black text-sm">{userData.name}</p></div>
                          <Trash2 size={18} onClick={() => deleteItem(pay.id, 'payments')} className="text-white/30 hover:text-red-400 cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {/* Modals remain the same as your original code */}
        {showAddrModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative text-right">
              <button onClick={() => setShowAddrModal(false)} className="absolute top-6 left-6 text-gray-400 hover:text-black"><X /></button>
              <h3 className="text-xl font-black mb-6">إضافة عنوان جديد</h3>
              <form onSubmit={handleAddAddress} className="space-y-4">
                <InputGroup label="نوع العنوان (مثال: الشغل)" name="type" required />
                <InputGroup label="تفاصيل العنوان" name="details" required />
                <button type="submit" className="w-full bg-[#d35400] text-white py-4 rounded-2xl font-black mt-4 hover:bg-[#1e2d3e] transition-colors">إضافة الآن</button>
              </form>
            </motion.div>
          </div>
        )}

        {showCardModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative text-right">
              <button onClick={() => setShowCardModal(false)} className="absolute top-6 left-6 text-gray-400 hover:text-black"><X /></button>
              <h3 className="text-xl font-black mb-6">إضافة بطاقة بنكية</h3>
              <form onSubmit={handleAddCard} className="space-y-4">
                <InputGroup label="رقم البطاقة" name="cardNumber" maxLength="16" required />
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup label="تاريخ الانتهاء" placeholder="MM/YY" required />
                  <InputGroup label="CVV" placeholder="***" required />
                </div>
                <button type="submit" className="w-full bg-[#1e2d3e] text-white py-4 rounded-2xl font-black mt-4 hover:bg-[#d35400] transition-colors">تأكيد الإضافة</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
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

export default ProfilePage;