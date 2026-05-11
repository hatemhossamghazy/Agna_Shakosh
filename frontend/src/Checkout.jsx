import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Phone, Mail, MapPin, 
  CreditCard, Truck, ShieldCheck, ArrowRight, CheckCircle,
  Wallet, Landmark, Barcode, Upload, ImageIcon, X, ChevronDown, Loader2
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const rentalItem = location.state?.rentalItem || null;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [addressOption, setAddressOption] = useState('saved'); 
  const [selectedAddress, setSelectedAddress] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [newAddress, setNewAddress] = useState({ title: '', details: '' });
  const [paymentMethod, setPaymentMethod] = useState('visa'); 
  const [paymentImage, setPaymentImage] = useState(null);
  const [isOrdered, setIsOrdered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  // ── جيب السلة ──────────────────────────────────────────────
  useEffect(() => {
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/getcart", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.success) {
        setCartItems(data.data);
      }

    } catch (err) {
      console.log(err);
    }
  };

  if (rentalItem) {
    setCartItems([rentalItem]);
  } else {
    fetchCart();
  }
}, [rentalItem]);
  // ── جيب العناوين القديمة ───────────────────────────────────
useEffect(() => {
  const fetchAddresses = async () => {
    try {

      if (!token) {
        setAddressOption('new');
        setLoadingAddresses(false);
        return;
      }

      const res = await fetch("http://localhost:3000/order/addresses", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.addresses && data.addresses.length > 0) {

        setSavedAddresses(
          data.addresses.map(a => a.delivery_address)
        );

        setSelectedAddress(
          data.addresses[0].delivery_address
        );

      } else {
        setAddressOption('new');
      }

    } catch (err) {

      console.log(err);
      setAddressOption('new');

    } finally {

      setLoadingAddresses(false);

    }
  };

  fetchAddresses();

}, [token]);



  // ── حساب الفاتورة ──────────────────────────────────────────
  const subtotal = cartItems.reduce((acc, item) => acc + (item.total || item.sale_price * item.quantity), 0);
  const shipping = cartItems.length > 0 ? 65 : 0;
  const total = subtotal + shipping;

  const needsImage = ['vodafone', 'instapay', 'fawry'].includes(paymentMethod);

  const isAddressComplete = addressOption === 'saved' 
    ? selectedAddress !== '' 
    : (newAddress.title.trim() !== '' && newAddress.details.trim() !== '');
  const isPaymentComplete = !needsImage || paymentImage !== null;
  const isFormValid = isAddressComplete && isPaymentComplete && cartItems.length > 0;

  // ── تأكيد الطلب ────────────────────────────────────────────
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const address = addressOption === 'saved'
        ? selectedAddress
        : `${newAddress.title}: ${newAddress.details}`;

      const formData = new FormData();

      formData.append("address", address);

      formData.append(
        "payment_method",
        paymentMethod === "cash" ? "cash_on_delivery" :
        paymentMethod === "visa" ? "card" :
        paymentMethod === "vodafone"? "vodafone_cash" :
        paymentMethod === "instapay"? "instapay" :
        paymentMethod === "fawry"? "fawry" :
        paymentMethod
      );

      const itemsToSubmit = cartItems.map(item => ({
        equipment_id: item.equipment_id,
        type: item.type,
        quantity: item.quantity,
        start_date: item.start_date || null,
        end_date: item.end_date || null
      }));

      formData.append("items", JSON.stringify(itemsToSubmit));

      if (paymentImage && needsImage) {
        const blob = await fetch(paymentImage).then(r => r.blob());
        formData.append("transfer_image", blob, "payment.jpg");
      }

      const res = await fetch("http://localhost:3000/order/confirm", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`
  },
  body: formData
});
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

     if (!res.ok) throw new Error(data.error || "فشل الطلب");

// 🔥 1) امسح الكارت من السيرفر (DB)
await fetch("http://localhost:3000/getcart/cart/clear", {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`
  }
});

// 🔥 2) امسح الكارت من localStorage (لو مستخدمه)
localStorage.removeItem("cart");

// نجاح
setIsOrdered(true);
setTimeout(() => navigate("/orders"), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setPaymentImage(URL.createObjectURL(file));
  };

  // ── Success Screen ──────────────────────────────────────────
  if (isOrdered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-['Cairo']" dir="rtl">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-sm border-t-8 border-green-500">
          <CheckCircle size={80} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-[#1e2d3e]">تم تأكيد الطلب!</h2>
          <p className="text-gray-500 mt-2 font-bold text-sm">جاري التحويل لصفحة طلباتك...</p>
          <p className="text-xs text-gray-400 mt-4">جاري مراجعة الدفع وتجهيز العِدّة...</p>
        </motion.div>
      </div>
    );
  }

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
          <button onClick={() => navigate('/cart')} className="relative p-2.5 text-[#1e2d3e] hover:bg-gray-100 rounded-full transition cursor-pointer">
            <ShoppingCart size={24} />
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 bg-[#d35400] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black">
                {cartItems.length}
              </span>
            )}
          </button>
          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 bg-[#1e2d3e] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#3b2a20] transition shadow-lg select-none cursor-pointer">
              <ChevronDown size={16} className={isDropdownOpen ? 'rotate-180' : ''} />
              <span>حسابي</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 text-right">
                <button onClick={() => navigate('/profile')} className="w-full text-right px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-bold transition">الملف الشخصي</button>
                <button onClick={() => navigate('/orders')} className="w-full text-right px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-bold transition">طلباتي</button>
                <hr className="my-1 border-gray-50" />
                <button onClick={() => { localStorage.removeItem("token"); navigate('/login'); }} className="w-full text-right px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-bold transition">تسجيل خروج</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto py-10 px-6 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <header className="flex items-center gap-4 mb-2">
            <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:bg-[#d35400] hover:text-white transition cursor-pointer text-[#1e2d3e]">
              <ArrowRight size={22}/>
            </button>
            <h2 className="text-3xl font-black text-[#1e2d3e]">إتمام الطلب</h2>
          </header>

          {cartItems.length === 0 && (
            <div className="bg-white p-8 rounded-2xl text-center shadow-sm border border-gray-100">
              <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="font-black text-gray-400">سلتك فاضية!</p>
              <button onClick={() => navigate('/equipment-store')} className="mt-4 bg-[#1e2d3e] text-white px-8 py-3 rounded-xl font-black hover:bg-[#d35400] transition">
                تصفح العدد
              </button>
            </div>
          )}

          {cartItems.length > 0 && (
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              
              {/* قسم العنوان */}
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-black text-[#1e2d3e] mb-4 flex items-center gap-2">
                  <Truck size={20} className="text-[#d35400]"/> أين تريد استلام الطلب؟
                </h3>

                {loadingAddresses ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 size={24} className="animate-spin text-[#d35400]" />
                  </div>
                ) : (
                  <>
                    {savedAddresses.length > 0 && (
                      <div className="flex gap-4 mb-6 p-1 bg-gray-100 rounded-xl">
                        <button type="button" onClick={() => setAddressOption('saved')} className={`flex-1 py-2 text-sm font-black rounded-lg transition ${addressOption === 'saved' ? 'bg-white shadow-sm text-[#d35400]' : 'text-gray-500'}`}>عناوين سابقة</button>
                        <button type="button" onClick={() => setAddressOption('new')} className={`flex-1 py-2 text-sm font-black rounded-lg transition ${addressOption === 'new' ? 'bg-white shadow-sm text-[#d35400]' : 'text-gray-500'}`}>عنوان جديد</button>
                      </div>
                    )}

                    <AnimatePresence mode="wait">
                      {addressOption === 'saved' && savedAddresses.length > 0 ? (
                        <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                          {savedAddresses.map((addr, i) => (
                            <label key={i} className={`block p-4 border rounded-xl cursor-pointer transition ${selectedAddress === addr ? 'border-[#d35400] bg-orange-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                              <div className="flex items-center gap-3">
                                <input type="radio" checked={selectedAddress === addr} onChange={() => setSelectedAddress(addr)} className="accent-[#d35400]" />
                                <p className="font-bold text-sm text-[#1e2d3e]">{addr}</p>
                              </div>
                            </label>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div key="new" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                          <input required value={newAddress.title} onChange={(e) => setNewAddress({...newAddress, title: e.target.value})} placeholder="اسم العنوان (بيت، ورشة...)" className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#d35400] font-bold text-sm w-full" />
                          <textarea required value={newAddress.details} onChange={(e) => setNewAddress({...newAddress, details: e.target.value})} placeholder="العنوان بالتفصيل..." className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#d35400] font-bold text-sm w-full h-32"></textarea>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </section>

              {/* قسم الدفع */}
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-black text-[#1e2d3e] mb-4 flex items-center gap-2">
                  <CreditCard size={20} className="text-[#d35400]"/> اختر وسيلة الدفع
                </h3>
                <div className="grid gap-3 mb-6">
                  {[
                    { id: 'visa',     title: 'بطاقة بنكية',      sub: 'دفع آمن ومباشر',  icon: <CreditCard className="text-blue-700"/> },
                    { id: 'vodafone', title: 'فودافون كاش',      sub: '01012345678',      icon: <Wallet className="text-red-600"/> },
                    { id: 'instapay', title: 'انستا باي',        sub: '@أجنه_وشاكوش',    icon: <Landmark className="text-pink-700"/> },
                    { id: 'fawry',    title: 'فوري باي',         sub: 'منافذ فوري',       icon: <Barcode className="text-blue-600"/> },
                    { id: 'cash',     title: 'دفع عند الاستلام', sub: 'كاش للمندوب',     icon: <Truck className="text-gray-500"/> }
                  ].map((method) => (
                    <label key={method.id} className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === method.id ? 'border-[#d35400] bg-orange-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                      <input type="radio" checked={paymentMethod === method.id} onChange={() => { setPaymentMethod(method.id); setPaymentImage(null); }} className="accent-[#d35400] w-4 h-4" />
                      <div className="p-2 bg-white rounded-lg shadow-sm">{method.icon}</div>
                      <div className="flex-1 text-right">
                        <p className="font-black text-sm">{method.title}</p>
                        <p className="text-[10px] text-gray-500 font-bold">{method.sub}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <AnimatePresence>
                  {needsImage && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl">
                        <label className="block mb-3 font-black text-blue-700 text-sm flex items-center gap-2">
                          <Upload size={18} /> ارفع صورة إيصال التحويل
                        </label>
                        {!paymentImage ? (
                          <label className="border-2 border-dashed border-blue-200 bg-white rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition">
                            <ImageIcon className="text-blue-400 mb-2" size={32} />
                            <p className="text-[11px] font-bold text-gray-400 text-center">اضغط هنا لرفع صورة الإسكرين شوت</p>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                          </label>
                        ) : (
                          <div className="relative w-32 mx-auto">
                            <img src={paymentImage} alt="إيصال" className="rounded-xl shadow-md border-2 border-white w-full h-auto" />
                            <button onClick={() => setPaymentImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg cursor-pointer"><X size={14} /></button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                  <p className="text-red-600 font-bold text-sm">{error}</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={!isFormValid || isSubmitting}
                className={`w-full py-4 rounded-xl font-black text-lg transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 ${isFormValid && !isSubmitting ? 'bg-[#1e2d3e] text-white hover:bg-[#d35400] cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >
                {isSubmitting ? <><Loader2 size={20} className="animate-spin" /> جاري الإرسال...</> : 'تأكيد وإرسال الطلب'}
              </button>
            </form>
          )}
        </div>

        {/* ملخص الحساب */}
        <aside className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24 space-y-4">
            <h3 className="font-black text-[#1e2d3e] border-b pb-3 text-lg">ملخص الطلب</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {cartItems.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm font-bold text-gray-600 border-b pb-2">
                  <span className="text-[#d35400]">x{item.quantity}</span>
                  <span className="flex-1 mx-2 line-clamp-1">{item.name}</span>
                  <span>{(item.total || item.sale_price * item.quantity).toLocaleString()} ج.م</span>
                </div>
              ))}
            </div>
            <div className="space-y-3 font-bold text-sm text-gray-500">
              <div className="flex justify-between"><span>إجمالي العدد</span><span>{subtotal.toLocaleString()} ج.م</span></div>
              <div className="flex justify-between"><span>مصاريف الشحن</span><span>{shipping} ج.م</span></div>
              <div className="flex justify-between text-xl font-black text-[#d35400] pt-2 border-t"><span>الإجمالي النهائي</span><span>{total.toLocaleString()} ج.م</span></div>
            </div>
            <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 flex items-start gap-2">
              <ShieldCheck size={18} className="text-[#d35400] shrink-0" />
              <p className="text-[10px] font-bold text-[#d35400] leading-tight">معاملاتك مشفرة ومؤمنة.</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-16 px-6 mt-16 text-center md:text-right border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 text-right">
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
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-black text-[#1e2d3e] mb-4">تواصل معنا</h3>
            <ul className="space-y-3 font-bold text-gray-600 text-sm">
              <li className="flex items-center gap-3"><Phone size={18} className="text-[#d35400]" /><span>+20 1012345678</span></li>
              <li className="flex items-center gap-3"><Mail size={18} className="text-[#d35400]" /><span>support@agna-shakosh.com</span></li>
              <li className="flex items-center gap-3"><MapPin size={18} className="text-[#d35400]" /><span>المنصورة / طلخا، مصر</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-300 mt-12 pt-8 text-center text-xs font-black text-gray-400">
          © {new Date().getFullYear()} جميع الحقوق محفوظة لشركة أجنه وشاكوش
        </div>
      </footer>
    </div>
  );
}

export default Checkout;