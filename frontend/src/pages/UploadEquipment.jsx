import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, ImageIcon, CheckCircle, Info, Plus,
  ShoppingCart, ChevronDown, Phone, Mail, MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UploadEquipment() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [items] = useState([]); 

  const [formData, setFormData] = useState({
    title: '',
    category: 'أدوات يدوية',
    type: 'sale', // بيع أو إيجار
    price: '',
    description: '',
    condition: 'used' // القيمة الافتراضية للحالة
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert("يرجى رفع صورة للمعدة أولاً");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append('image', imageFile);
    data.append('name', formData.title);
    data.append('price', formData.price);
    data.append('type', formData.type);
    // نبعت الحالة بس لو النوع "بيع"
    data.append('condition', formData.type === 'sale' ? formData.condition : 'N/A');
    data.append('description', formData.description);
    data.append('category', formData.category);

    try {
      const response = await axios.post("http://localhost:3000/review/add", data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setIsSubmitted(true);
        setTimeout(() => navigate('/orders'), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.error || "حدث خطأ أثناء الرفع");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-['Cairo']" dir="rtl">
        <div className="bg-white p-10 rounded-3xl shadow-lg text-center max-w-sm border-t-8 border-green-500">
          <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-[#1e2d3e]">تم إرسال طلبك!</h2>
          <p className="text-gray-500 mt-2 font-bold">جاري المراجعة من الإدارة لتفعيل عرض العدة.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Cairo'] text-right" dir="rtl">
      {/* 🟢 الهيدر (Navbar) */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/logo.png" alt="أجنه وشاكوش" className="h-14 w-auto object-contain" />
          <div className="hidden sm:block text-right">
            <h1 className="text-xl font-black text-[#1e2d3e]">أجنه وشاكوش</h1>
            <p className="text-[10px] font-bold text-gray-400">لبيع وإيجار العدد وعرض خدمات الصنايعية</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/cart')} className="relative p-2.5 text-[#1e2d3e] hover:bg-gray-100 rounded-full transition cursor-pointer">
            <ShoppingCart size={24} />
            {items.length > 0 && (
              <span className="absolute top-0 right-0 bg-[#d35400] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black">
                {items.length}
              </span>
            )}
          </button>

          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-[#1e2d3e] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#3b2a20] transition shadow-lg select-none cursor-pointer active:scale-95"
            >
              <ChevronDown size={16} className={isDropdownOpen ? 'rotate-180' : ''} />
              <span>حسابي</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 text-right">
                <button onClick={() => { setIsDropdownOpen(false); navigate('/profile'); }} className="w-full text-right px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-bold transition">الملف الشخصي</button>
                <button onClick={() => { setIsDropdownOpen(false); navigate('/orders'); }} className="w-full text-right px-4 py-2.5 text-sm text-[#d35400] bg-orange-50 font-bold transition">طلباتي</button>
                <hr className="my-1 border-gray-50" />
                <button onClick={() => { setIsDropdownOpen(false); localStorage.removeItem("token"); navigate('/login'); }} className="w-full text-right px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-bold transition">تسجيل خروج</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto py-10 px-6">
        <header className="mb-8">
          <h2 className="text-3xl font-black text-[#1e2d3e] flex items-center gap-2">
            <Plus className="text-[#d35400]" /> ارفع عِدتك للبيع أو الإيجار
          </h2>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <label className="block mb-4 font-black text-[#1e2d3e] flex items-center gap-2">
              <ImageIcon size={20} className="text-[#d35400]" /> صور العُدة
            </label>
            <div 
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center hover:bg-orange-50 transition-all cursor-pointer overflow-hidden"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="mx-auto h-48 rounded-lg object-contain" />
              ) : (
                <>
                  <Upload className="mx-auto text-gray-300 mb-2" size={40} />
                  <p className="text-gray-400 text-sm font-bold">اضغط هنا لرفع الصور</p>
                </>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm grid md:grid-cols-2 gap-4">
            <div className="col-span-full">
              <label className="block mb-2 font-black text-sm text-gray-600">اسم العُدة</label>
              <input name="title" required onChange={handleChange} placeholder="مثلاً: صاروخ بوش 4 بوصة" className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-[#d35400] font-bold" />
            </div>

            <div>
              <label className="block mb-2 font-black text-sm text-gray-600">السعر (ج.م)</label>
              <input type="number" name="price" required onChange={handleChange} placeholder="0.00" className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-[#d35400] font-bold" />
            </div>

            <div>
              <label className="block mb-2 font-black text-sm text-gray-600">نوع العرض</label>
              <select name="type" onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl outline-none font-bold cursor-pointer">
                <option value="sale">بيع</option>
                <option value="rent">إيجار</option>
              </select>
            </div>

            {/* 🟢 تعديل: خانة الحالة تظهر فقط إذا كان النوع "بيع" */}
            {formData.type === 'sale' && (
              <div>
                <label className="block mb-2 font-black text-sm text-gray-600">حالة العُدة</label>
                <select name="condition" onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl outline-none font-bold cursor-pointer">
                  <option value="new">جديد (بكرتونته)</option>
                  <option value="used">مستعمل</option>
                </select>
              </div>
            )}

            <div className={formData.type === 'sale' ? '' : 'col-span-full'}>
              <label className="block mb-2 font-black text-sm text-gray-600">القسم</label>
              <select name="category" onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl outline-none font-bold cursor-pointer">
                <option value="أدوات يدوية">أدوات يدوية</option>
                <option value="أدوات كهربائية">أدوات كهربائية</option>
                <option value="معدات ثقيلة">معدات ثقيلة</option>
              </select>
            </div>

            <div className="col-span-full">
              <label className="block mb-2 font-black text-sm text-gray-600">وصف الحالة والتفاصيل</label>
              <textarea name="description" rows="3" onChange={handleChange} placeholder="اشرح حالة العدة وأي تفاصيل تانية تهم العميل..." className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-[#d35400] font-bold"></textarea>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-3">
            <Info size={20} className="text-blue-500" />
            <p className="text-xs text-blue-700 font-bold">طلبك هيتراجع وهيوصلك إشعار أول ما يتوافق عليه.</p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1e2d3e] hover:bg-[#d35400]'} text-white py-4 rounded-xl font-black text-lg transition-all shadow-md active:scale-[0.98]`}
          >
            {loading ? "جاري إرسال الطلب..." : "إرسال طلب الرفع"}
          </button>
        </form>
      </div>

      <footer className="bg-gray-100 py-16 px-6 mt-16 text-center md:text-right border-t border-gray-200">
        {/* ... (باقي الفوتر كما هو) */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-2xl font-black text-[#1e2d3e] mb-4">أجنه وشاكوش</h3>
            <p className="text-gray-500 font-bold text-sm leading-relaxed max-w-sm">المنصة الأولى في مصر لخدمات الصنايعية وبيع وتأجير العدد بأفضل الأسعار.</p>
          </div>
          <div>
            <h3 className="text-xl font-black text-[#1e2d3e] mb-4">روابط سريعة</h3>
            <ul className="space-y-2 font-bold text-gray-600 text-sm">
              <li><button onClick={() => navigate('/equipment-store')} className="hover:text-[#d35400] transition">سوق العدد</button></li>
              <li><button onClick={() => navigate('/rental')} className="hover:text-[#d35400] transition">أجر عدة</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-black text-[#1e2d3e] mb-4">تواصل معنا</h3>
            <ul className="space-y-3 font-bold text-gray-600 text-sm">
              <li className="flex items-center justify-center md:justify-start gap-3"><Phone size={18} className="text-[#d35400]" /> <span>+20 1012345678</span></li>
              <li className="flex items-center justify-center md:justify-start gap-3"><MapPin size={18} className="text-[#d35400]" /> <span>المنصورة / طلخا، مصر</span></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default UploadEquipment;