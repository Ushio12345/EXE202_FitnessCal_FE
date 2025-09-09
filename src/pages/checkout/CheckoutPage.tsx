import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/axios/instance";
import { getUserIdFromToken } from "@/lib/utils/jwt";
import Logo from "@/components/logo/logo";
import ThemeToggle from "@/components/ui/ThemeToggle";


interface Plan {
  packageId: number;
  name: string;
  durationMonths: number;
  price: number;
}

const CheckoutPage: React.FC = () => {
  useEffect(() => {
    document.title = "Thanh toán | FitnessCal";
  }, []);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  // Lấy danh sách plans từ API
  // Check for pending payment on mount, show alert with button if exists
  const [pendingPaymentUrl, setPendingPaymentUrl] = useState<string | null>(null);
  const [pendingExpiresAt, setPendingExpiresAt] = useState<number | null>(null);
  const [pendingCountdown, setPendingCountdown] = useState<string>("");

  // Countdown for pending payment
  useEffect(() => {
    if (!pendingExpiresAt) return;
    const updateCountdown = () => {
      const ms = pendingExpiresAt - Date.now();
      if (ms > 0) {
        const min = Math.floor(ms / 60000);
        const sec = Math.floor((ms % 60000) / 1000);
        setPendingCountdown(`${min}:${sec.toString().padStart(2, '0')}`);
      } else {
        setPendingCountdown("0:00");
      }
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [pendingExpiresAt]);
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = accessToken ? getUserIdFromToken(accessToken) : null;
    if (!userId) return;
    const pendingKey = `pendingPayment_${userId}`;
    const pending = localStorage.getItem(pendingKey);
    if (pending) {
      try {
        const { url, expiresAt } = JSON.parse(pending);
        if (url && expiresAt && Date.now() < expiresAt) {
          console.log('[CheckoutPage] pendingPaymentUrl from localStorage:', url);
          setPendingPaymentUrl(url);
          setPendingExpiresAt(expiresAt);
        } else {
          localStorage.removeItem(pendingKey);
        }
      } catch {
        localStorage.removeItem(pendingKey);
      }
    }
  }, []);
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axiosInstance.get("/premium-packages");
        if (Array.isArray(res.data)) {
          // Loại bỏ gói Free
          const filtered = res.data.filter((p: any) => p.price > 0);
          setPlans(filtered);
          if (filtered.length > 0) setSelected(filtered[0].packageId);
        }
      } catch (err) {
        setPlans([]);
      }
    };

    // Check trạng thái subscription
    const checkSubscriptionStatus = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const userId = accessToken ? getUserIdFromToken(accessToken) : null;
        if (!userId) return;
        const res = await axiosInstance.get(`/Subscription/${userId}`);
        if (res.data?.success && res.data?.data) {
          const sub = res.data.data;
          if (sub.paymentStatus === "failed") {
            const duration = sub.package?.durationMonths || "";
            alert(`Bạn đã hủy gói ${duration} tháng.`);
            // Xóa pendingPayment nếu có
            const pendingKey = `pendingPayment_${userId}`;
            localStorage.removeItem(pendingKey);
            setPendingPaymentUrl(null);
            setPendingExpiresAt(null);
          }
        }
      } catch {}
    };

    fetchPlans();
    checkSubscriptionStatus();
  }, []);
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showAlert && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (showAlert && countdown === 0 && redirectUrl) {
      window.location.href = redirectUrl;
    }
    return () => clearTimeout(timer);
  }, [showAlert, countdown, redirectUrl]);

  const handleCheckout = async () => {
    // Lấy userId hệ thống từ supabaseId nếu cần
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("Bạn cần đăng nhập để thanh toán.");
      return;
    }
    let userId = getUserIdFromToken(accessToken);
    // Nếu userId là supabaseId (không phải GUID), gọi API lấy userId hệ thống
    if (userId && userId.length < 36) {
      try {
        const resUser = await axiosInstance.get(`/get-user-by-supbase-id?supabaseId=${userId}`);
        if (resUser.data?.success && resUser.data?.data?.userId) {
          userId = resUser.data.data.userId;
        } else {
          alert("Không tìm thấy userId hệ thống từ supabaseId.");
          return;
        }
      } catch (err: any) {
        alert("Không lấy được userId hệ thống từ supabaseId.");
        return;
      }
    }
    if (!userId) {
      alert("Không xác định được người dùng.");
      return;
    }
    // Xác định packageId theo selected
    const packageId = selected;
    if (!packageId) {
      alert("Vui lòng chọn gói nâng cấp trước khi thanh toán.");
      return;
    }
    // Kiểm tra pending payment trước khi gọi API
    const pendingKey = `pendingPayment_${userId}`;
    const pending = localStorage.getItem(pendingKey);
    if (pending) {
      try {
        const { url, expiresAt } = JSON.parse(pending);
        if (url && expiresAt && Date.now() < expiresAt) {
          setPendingPaymentUrl(url);
          setPendingExpiresAt(expiresAt);
          // Chỉ hiển thị lại popup, không chuyển hướng, không tạo đơn mới
          return;
        } else {
          localStorage.removeItem(pendingKey);
        }
      } catch {
        localStorage.removeItem(pendingKey);
      }
    }
    // Nếu không có pending hoặc đã hết hạn, gọi API tạo mới
    try {
      const res = await axiosInstance.post(`/payments/buy-package?packageId=${packageId}`);
      if (res.data?.success) {
        const checkoutUrl = res.data?.data?.CheckoutUrl || res.data?.data?.checkoutUrl;
        console.log('[CheckoutPage] checkoutUrl from API:', checkoutUrl);
        if (checkoutUrl) {
          setRedirectUrl(checkoutUrl);
          setShowAlert(true);
          setCountdown(5);
          // Store pending payment in localStorage for 30 minutes
          localStorage.setItem(pendingKey, JSON.stringify({
            url: checkoutUrl,
            expiresAt: Date.now() + 30 * 60 * 1000 // 30 minutes
          }));
        } else {
          alert("Đặt mua thành công! Không tìm thấy link thanh toán.");
        }
      } else {
        console.error('Lỗi backend:', res.data);
        alert(res.data?.message || "Có lỗi xảy ra khi mua gói.");
      }
    } catch (err: any) {
      console.error('Lỗi khi gọi API:', err);
      alert(err?.response?.data?.message || "Có lỗi xảy ra khi mua gói.");
    }
  };

    return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300"
    >
      <header className="p-5 pl-8 pr-5 flex items-center justify-between w-full max-w-7xl">
        <div className="absolute top-6 left-6 z-50">
          <Logo />
        </div>
        <div className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>
      </header>
      {/* Background gradient for both modes */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="hidden dark:block w-full h-full" style={{background: 'radial-gradient(ellipse 80% 80% at 60% 20%, #18181b 40%, #312e81 100%)'}}></div>
        <div className="block dark:hidden w-full h-full" style={{background: 'radial-gradient(ellipse 80% 80% at 60% 20%, #fff 40%, #6366f1 100%)'}}></div>
      </div>
        {/* Alert đếm ngược khi thanh toán thành công */}
        {showAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/60">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg px-8 py-6 flex flex-col items-center border border-indigo-200 dark:border-indigo-700 animate-fade-in">
              <div className="text-xl font-bold text-indigo-700 dark:text-indigo-200 mb-2">Đang chuyển hướng đến cổng thanh toán...</div>
              <div className="text-lg text-gray-700 dark:text-gray-200 mb-2">Vui lòng chờ <span className="font-semibold text-indigo-600 dark:text-indigo-300">{countdown}s</span></div>
              <div className="text-sm text-gray-400 dark:text-gray-400">Không tắt trình duyệt hoặc reload trang trong quá trình này.</div>
            </div>
          </div>
        )}
        {/* Alert nếu có pending payment */}
        {pendingPaymentUrl && !showAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/60">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg px-8 py-6 flex flex-col items-center border border-yellow-300 dark:border-yellow-500 animate-fade-in">
              <div className="text-xl font-bold text-yellow-700 dark:text-yellow-400 mb-2">Bạn có đơn hàng đang xử lý</div>
              <div className="text-base text-gray-700 dark:text-gray-200 mb-2">Vui lòng hoàn tất thanh toán hoặc đợi đơn hàng được xử lý.</div>
              <div className="text-sm text-gray-500 dark:text-gray-300 mb-4">Thời gian còn lại: <span className="font-semibold">{pendingCountdown}</span></div>
              <a
                href={pendingPaymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold text-lg hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 transition-all duration-300 mb-2"
              >
                Đến trang thanh toán
              </a>
              <button
                className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-yellow-700 dark:text-yellow-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200"
                onClick={() => setPendingPaymentUrl(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        )}
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 max-w-3xl w-full border border-primary-100 dark:border-gray-700 flex flex-col items-center transition-colors duration-300">
  <h1 className="text-2xl font-bold mb-6 text-indigo-700 dark:text-indigo-200 text-center">Nâng cấp Premium</h1>
        <div className="mb-8 w-full">
          <label className="block font-medium mb-6 text-gray-700 dark:text-gray-200 text-center text-xl">Chọn gói nâng cấp:</label>
          <div className="flex flex-col md:flex-row gap-8 justify-center w-full">
            {plans.map((plan) => {
              const basePlan = plans.find(p => p.durationMonths === 1);
              const basePrice = basePlan ? basePlan.price : 59000;
              const originalPrice = plan.durationMonths * basePrice;
              const isSale = plan.durationMonths > 1 && plan.price < originalPrice;
              const isSelected = selected === plan.packageId;
              return (
                <div
                  key={plan.packageId}
                  className={`w-72 h-64 rounded-2xl border-2 p-8 flex flex-col items-center shadow transition-transform cursor-pointer select-none
                    ${isSelected
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-gray-900 scale-105'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:scale-105'}`}
                  onClick={() => setSelected(plan.packageId)}
                >
                  <div className="text-2xl font-bold mb-3 text-indigo-700 dark:text-indigo-200">{plan.durationMonths} tháng</div>
                  <div className="mb-6 flex flex-col items-center">
                    {isSale && (
                      <span className="text-gray-400 dark:text-gray-500 text-base line-through mb-1">
                        {originalPrice.toLocaleString('vi-VN')}₫
                      </span>
                    )}
                    <span className="font-bold text-3xl text-indigo-700 dark:text-indigo-200">{plan.price.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <button
                    className={`mt-auto w-full py-3 rounded-lg font-semibold text-lg transition-colors duration-200
                      ${isSelected
                        ? 'bg-indigo-600 text-white dark:bg-indigo-700 dark:text-white'
                        : 'bg-indigo-100 dark:bg-gray-700 text-indigo-700 dark:text-indigo-200 hover:bg-indigo-200 dark:hover:bg-gray-800'}`}
                    onClick={e => { e.stopPropagation(); setSelected(plan.packageId); }}
                  >
                    {isSelected ? 'Đã chọn' : 'Chọn gói này'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <button
          className="w-full py-3 bg-indigo-600 text-white dark:bg-indigo-700 dark:text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-all duration-300 mb-3"
          onClick={handleCheckout}
        >
          Thanh toán
        </button>
        <button
          className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-indigo-700 dark:text-indigo-200 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200"
          onClick={() => navigate(-1)}
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
