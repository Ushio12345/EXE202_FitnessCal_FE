import React, { useEffect, useState, useRef } from "react";
import { Typewriter } from 'react-simple-typewriter';
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/axios/instance";
import { getUserIdFromToken } from "@/lib/utils/jwt";

interface UserInfo {
  fullName?: string;
  name?: string;
  email?: string;
  plan?: string;
  endDate?: string;
  daysRemaining?: number;
}

const UserPlanPage: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Thông tin gói | FitnessCal";
  }, []);
  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("Bạn cần đăng nhập để xem thông tin.");
        navigate("/login");
        return;
      }
      // Ưu tiên lấy userId từ nameidentifier trong JWT
      let userId = undefined;
      try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
          || payload["sub"]
          || payload["id"]
          || getUserIdFromToken(accessToken);
        console.log("[UserPlanPage] userId from JWT:", userId, payload);
      } catch (e) {
        userId = getUserIdFromToken(accessToken);
        console.log("[UserPlanPage] userId fallback:", userId);
      }
      if (userId) {
        try {
          // Lấy thông tin subscription
          let plan = "Free";
          let email = undefined;
          let endDate = undefined;
          let daysRemaining = undefined;
          try {
            const subRes = await axiosInstance.get(`/Subscription/${userId}`);
            if (subRes.data?.success && subRes.data?.data) {
              const sub = subRes.data.data;
              plan = sub.package?.packageType || "Premium";
              email = sub.userEmail;
              endDate = sub.endDate;
              daysRemaining = sub.daysRemaining;
            }
          } catch {}
          // Nếu không có email từ subscription thì lấy từ JWT
          if (!email) {
            try {
              const payload = JSON.parse(atob(accessToken.split(".")[1]));
              email = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
            } catch {}
          }
          setUser({ email, plan, endDate, daysRemaining });
        } catch (err) {
          // fallback: chỉ lấy email từ JWT nếu có
          let email = undefined;
          try {
            const payload = JSON.parse(atob(accessToken.split(".")[1]));
            email = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
          } catch {}
          setUser({ email, plan: "Free" });
          console.error("[UserPlanPage] API error:", err);
        }
      } else {
        // fallback: chỉ lấy email từ JWT nếu có
        let email = undefined;
        try {
          const payload = JSON.parse(atob(accessToken.split(".")[1]));
          email = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
        } catch {}
        setUser({ email, plan: "Free" });
      }
      setLoading(false);
    };
    fetchUser();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      {/* Thông báo ứng dụng đang phát triển */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
        <span className="text-lg md:text-xl font-semibold text-indigo-700 bg-white/80 px-6 py-3 rounded-xl shadow-lg border border-indigo-100">
          <Typewriter
            words={["Ứng dụng đang được phát triển, các bạn hãy chờ đợi bọn mình nhé!"]}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={60}
            deleteSpeed={40}
            delaySpeed={2000}
          />
        </span>
      </div>
      <button
        className="absolute top-6 left-6 p-0 bg-transparent border-none outline-none shadow-none hover:bg-transparent"
        onClick={() => navigate("/")}
        aria-label="Trang chủ"
      >
        <img src="/logo.png" alt="Logo" className="w-14 h-14 object-contain" />
      </button>
      {/* Thông tin người dùng ở góc trái dưới */}
      {/* User info button with menu */}
      <UserInfoMenu loading={loading} user={user} />
    </div>
  );

interface UserInfoMenuProps {
  loading: boolean;
  user: UserInfo | null;
}

function UserInfoMenu({ loading, user }: UserInfoMenuProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="absolute left-4 bottom-4 z-50">
      <button
        ref={ref}
        className="flex items-center gap-3 bg-white/90 rounded-xl shadow-lg px-4 py-3 border border-gray-200 min-w-[220px] hover:bg-indigo-50 transition relative"
        onClick={() => setOpen(o => !o)}
        aria-label="Thông tin người dùng"
      >
        {loading ? (
          <div className="text-gray-500 text-sm">Đang tải...</div>
        ) : user ? (
          <>
            <div className="flex flex-col text-left">
              <span className="text-xs text-gray-500">Email</span>
              <span className="font-semibold text-indigo-700 text-sm truncate max-w-[160px]">{user.email || user.fullName || user.name}</span>
            </div>
            <div className="flex flex-col items-end ml-auto">
              <span className="text-xs text-gray-500">Gói</span>
              <span className={user.plan === 'Premium' ? "font-semibold text-yellow-600 text-sm" : "font-semibold text-green-600 text-sm"}>
                {user.plan === 'Premium' ? 'Premium' : 'Free'}
              </span>
            </div>
          </>
        ) : (
          <div className="text-red-500 text-sm">Không lấy được thông tin</div>
        )}
        <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        {/* Dropdown menu */}
        {open && (
          <div className="absolute left-0 bottom-14 bg-white rounded-xl shadow-lg border border-gray-200 min-w-[180px] py-2 z-50 animate-fade-in">
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 text-indigo-700"
              onClick={e => { e.stopPropagation(); setOpen(false); alert('Chức năng Xem thông tin sẽ được phát triển!'); }}
            >
              Xem thông tin
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 text-indigo-700"
              onClick={e => { e.stopPropagation(); setOpen(false); window.location.href = '/checkout'; }}
            >
              Nâng cấp
            </button>
          </div>
        )}
      </button>

    </div>
  );
}
}
export default UserPlanPage;
