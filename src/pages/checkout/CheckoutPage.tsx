import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/axios/instance";
import { getUserIdFromToken } from "@/lib/utils/jwt";


interface Plan {
  packageId: number;
  name: string;
  durationMonths: number;
  price: number;
}

const CheckoutPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  // Lấy danh sách plans từ API
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
    fetchPlans();
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
  console.log('accessToken in checkout:', accessToken); // DEBUG
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
    try {
      const res = await axiosInstance.post(`/payments/buy-package?packageId=${packageId}`);
      if (res.data?.success) {
        const checkoutUrl = res.data?.data?.CheckoutUrl || res.data?.data?.checkoutUrl;
        if (checkoutUrl) {
          setRedirectUrl(checkoutUrl);
          setShowAlert(true);
          setCountdown(5);
        } else {
          alert("Đặt mua thành công! Không tìm thấy link thanh toán.");
        }
      } else {
        alert(res.data?.message || "Có lỗi xảy ra khi mua gói.");
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "Có lỗi xảy ra khi mua gói.");
    }
  };

    return (
    <div className="min-h-screen flex flex-col items-center justify-center relative" style={{
        background: "radial-gradient(ellipse 80% 80% at 60% 20%, #fff 40%, #312e81 100%)"
      }}>
        {/* Alert đếm ngược khi thanh toán thành công */}
        {showAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-xl shadow-lg px-8 py-6 flex flex-col items-center border border-indigo-200 animate-fade-in">
              <div className="text-xl font-bold text-indigo-700 mb-2">Đang chuyển hướng đến cổng thanh toán...</div>
              <div className="text-lg text-gray-700 mb-2">Vui lòng chờ <span className="font-semibold text-indigo-600">{countdown}s</span></div>
              <div className="text-sm text-gray-400">Không tắt trình duyệt hoặc reload trang trong quá trình này.</div>
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-3xl w-full border border-primary-100 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 text-indigo-700 text-center">Nâng cấp Premium</h1>
        <div className="mb-8 w-full">
          <label className="block font-medium mb-6 text-gray-700 text-center text-xl">Chọn gói nâng cấp:</label>
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
                    ${isSelected ? 'border-indigo-600 bg-indigo-50 scale-105' : 'border-gray-200 bg-white hover:scale-105'}`}
                  onClick={() => setSelected(plan.packageId)}
                >
                  <div className="text-2xl font-bold mb-3 text-indigo-700">{plan.durationMonths} tháng</div>
                  <div className="mb-6 flex flex-col items-center">
                    {isSale && (
                      <span className="text-gray-400 text-base line-through mb-1">
                        {originalPrice.toLocaleString('vi-VN')}₫
                      </span>
                    )}
                    <span className="font-bold text-3xl text-indigo-700">{plan.price.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <button
                    className={`mt-auto w-full py-3 rounded-lg font-semibold text-lg transition-colors duration-200
                      ${isSelected ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
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
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-all duration-300 mb-3"
          onClick={handleCheckout}
        >
          Thanh toán
        </button>
        <button
          className="w-full py-2 bg-gray-100 text-indigo-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
          onClick={() => navigate(-1)}
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
