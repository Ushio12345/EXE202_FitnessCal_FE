import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/axios/instance";
import { getUserIdFromToken } from "@/lib/utils/jwt";

const plans = [
  { label: "1 tháng", value: 1, price: 59000 },
  { label: "3 tháng", value: 3, price: 169000 },
  { label: "6 tháng", value: 6, price: 319000 },
];

const CheckoutPage: React.FC = () => {
  const [selected, setSelected] = useState(1);
  const navigate = useNavigate();

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
    let packageId = 1;
    if (selected === 3) packageId = 2;
    if (selected === 6) packageId = 3;
    try {
  const res = await axiosInstance.post(`/payments/buy-package?packageId=${packageId}`);
      if (res.data?.success) {
        const checkoutUrl = res.data?.data?.CheckoutUrl || res.data?.data?.checkoutUrl;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border border-primary-100">
        <h1 className="text-2xl font-bold mb-6 text-indigo-700 text-center">Nâng cấp Premium</h1>
        <div className="mb-6">
          <label className="block font-medium mb-2 text-gray-700">Chọn gói nâng cấp:</label>
          <div className="flex flex-col gap-3">
            {plans.map((plan) => {
              const originalPrice = plan.value * 59000;
              const isSale = plan.value > 1 && plan.price < originalPrice;
              return (
                <label key={plan.value} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${selected === plan.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="plan"
                    value={plan.value}
                    checked={selected === plan.value}
                    onChange={() => setSelected(plan.value)}
                    className="mr-3 accent-indigo-600"
                  />
                  <span className="flex-1 font-semibold">{plan.label}</span>
                  <span className="flex flex-col items-end">
                    {isSale && (
                      <span className="text-gray-400 text-sm line-through mb-0.5">
                        {originalPrice.toLocaleString('vi-VN')}₫
                      </span>
                    )}
                    <span className="font-bold text-indigo-700">{plan.price.toLocaleString('vi-VN')}₫</span>
                  </span>
                </label>
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
