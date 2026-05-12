// 🔹 تحقق من وجود وصلاحية التوكن
function checkToken() {
    const token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (!token || (tokenExpiry && Date.now() > tokenExpiry)) {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        alert('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجددًا');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// 🔹 استدعاء الدالة تلقائي عند تحميل الصفحة
checkToken();

// 🔹 دالة للحصول على token موجود وصالح
function getToken() {
    if (checkToken()) {
        return localStorage.getItem('token');
    }
    return null;
}
