import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Package, MapPin, CreditCard, Clock, Wallet } from 'lucide-react';

const OrderDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:3000/history/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        setOrderData(data.order);
      } catch (err) {
        console.log(err);
      }
    };

    fetchOrder();
  }, [id]);

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>لا توجد بيانات للطلب</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-10" dir="rtl">
      {/* 1. Header الصفحة */}
      <div className="bg-white border-b border-gray-200 py-4 mb-6 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 flex items-center gap-4">
          <button 
            onClick={() => navigate('/orders')} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowRight size={20} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-[#1A237E]">تفاصيل الطلب #{id}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* العمود الأيمن: تفاصيل المنتجات */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <span className="flex items-center gap-2 font-bold text-gray-700">
                <Package size={18} /> المنتجات المشتراة
              </span>
              <span className="text-sm text-gray-500">{orderData.quantity || 1} منتجات</span>
            </div>
            
            <div className="flex items-center justify-between p-6 border-b border-gray-50">
  
  <div className="flex items-center gap-4">
    <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
      <Package className="text-gray-400" />
    </div>

    <div>
      <h4 className="font-bold text-gray-800">
        {orderData.equipment_name}
      </h4>

      <p className="text-sm text-gray-500 mt-1">
        الكمية: {orderData.quantity}
      </p>
    </div>
  </div>

  <div className="font-bold text-[#1A237E]">
    {orderData.total_price?.toLocaleString()} ج.م
  </div>

</div>
          </div>
        </div>

        {/* العمود الأيسر: ملخص الحساب والعنوان والدفع */}
        <div className="space-y-6">
          {/* كارد الحالة */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-gray-500 text-sm mb-3 flex items-center gap-2 font-bold">
              <Clock size={16} /> حالة الطلب
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="font-bold text-blue-600">{orderData.status}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <p className="font-bold text-gray-800 mt-2">
  {orderData.order_type}
</p>
            </div>
          </div>

          {/* كارد طريقة الدفع (الإضافة المطلوبة) */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-gray-500 text-sm mb-3 flex items-center gap-2 font-bold">
              <Wallet size={16} /> طريقة الدفع
            </h3>
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-800">{orderData.payment_type || "Cash"}</span>
              <div className="text-[#1A237E]">
                <CreditCard size={20} />
              </div>
            </div>
          </div>

          {/* كارد التوصيل */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-gray-500 text-sm mb-3 flex items-center gap-2 font-bold">
              <MapPin size={16} /> معلومات الشحن
            </h3>
            <p className="text-gray-800 font-medium leading-relaxed">
              {orderData.delivery_address}
            </p>
          </div>
{orderData.order_type === "rental" && (
  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
    <h3 className="text-gray-500 text-sm mb-3 font-bold">
      فترة الإيجار
    </h3>

    <p className="text-sm text-gray-700">
      من {new Date(orderData.start_date).toLocaleDateString('ar-EG')}
    </p>

    <p className="text-sm text-gray-700">
      إلى {new Date(orderData.end_date).toLocaleDateString('ar-EG')}
    </p>
  </div>
)}
          {/* كارد ملخص الفاتورة */}
          <div className="bg-[#1A237E] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-[-20px] left-[-20px] w-24 h-24 bg-white/10 rounded-full blur-3xl"></div>
            
            <h3 className="text-white/70 text-sm mb-4 flex items-center gap-2 font-bold">
              <CreditCard size={16} /> ملخص الحساب
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/80">المجموع الفرعي</span>
                <span>{orderData.subtotal?.toLocaleString()} ج.م</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/80">مصاريف الشحن</span>
                <span>{orderData.shipping_cost?.toLocaleString()} ج.م</span>
              </div>
              <div className="pt-3 mt-3 border-t border-white/20 flex justify-between items-center">
                <span className="font-bold">الإجمالي الكلي</span>
                <span className="text-2xl font-black text-[#FF9800]">
                  {orderData.total_price?.toLocaleString()} <span className="text-xs font-normal text-white">ج.م</span>
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;