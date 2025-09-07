import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: 0,
    features: [
      "Truy cập các tính năng cơ bản",
      "Giới hạn số lượng bài tập",
      "Hỗ trợ cơ bản",
    ],
    color: "bg-white border-gray-200 text-gray-900",
    button: "Bắt đầu miễn phí",
  },
  {
    name: "Premium",
    price: 59000,
    features: [
      "Tất cả tính năng của Free",
      "Không giới hạn bài tập",
      "Hỗ trợ ưu tiên",
      "Cập nhật tính năng mới sớm",
    ],
    color: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-blue-500",
    button: "Nâng cấp Premium",
  },
];

import { getUserIdFromToken } from "@/lib/utils/jwt";
import axiosInstance from "@/axios/instance";

const UserLayout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSubscription = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;
      let userId;
      try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || getUserIdFromToken(accessToken);
      } catch {
        userId = getUserIdFromToken(accessToken);
      }
      if (!userId) return;
      try {
        const res = await axiosInstance.get(`/Subscription/${userId}`);
        if (res.data?.success && res.data?.data) {
          navigate("/plan", { replace: true });
        }
      } catch {}
    };
    checkSubscription();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10" style={{
      background: "radial-gradient(ellipse 80% 80% at 60% 20%, #fff 40%, #312e81 100%)"
    }}>
      <h1 className="text-3xl font-bold mb-8 text-indigo-700">Chọn gói sử dụng</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`w-80 rounded-xl shadow-lg border-2 ${plan.color} p-8 flex flex-col items-center transition-transform hover:scale-105`}
          >
            <h2 className="text-2xl font-semibold mb-4">{plan.name}</h2>
            <div className="mb-6">
              <span className="text-4xl font-bold">
                {plan.price === 0 ? "Miễn phí" : plan.price.toLocaleString("vi-VN") + "₫"}
              </span>
              {plan.price !== 0 && <span className="text-base ml-1">/tháng</span>}
            </div>
            <ul className="mb-8 space-y-2 text-left w-full">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-2 rounded-lg font-semibold transition-colors duration-200 ${
                plan.price === 0
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
                  : "bg-white text-indigo-700 border border-white hover:bg-indigo-50 shadow"
              }`}
              onClick={() => plan.price !== 0 ? navigate("/checkout") : navigate("/plan")}
            >
              {plan.button}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserLayout;
