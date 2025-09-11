import React, { useEffect, useState } from "react";
import ChatAI from "@/components/ai/ChatAI";
import { Typewriter } from 'react-simple-typewriter';
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/axios/instance";
import { getUserIdFromToken } from "@/lib/utils/jwt";
import FaqFloatingButton from "@/components/ui/FaqFloatingButton";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { User2, ArrowUpCircle, LogOut } from "lucide-react";
import Logo from "@/components/logo/logo";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


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
  const [] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Thông tin gói | FitnessCal";
  }, []);
  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        showToast("Vui lòng đăng nhập để tiếp tục.", "error");
        setLoading(false);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 relative transition-colors duration-300 overflow-x-hidden overflow-y-hidden">
      {/* Background gradient login style for both light and dark mode */}
      <div className="bg-gradient-login absolute w-[1809px] -top-[400px] h-[1100px] rounded-bl-full -right-[900px] blur-3xl pointer-events-none dark:opacity-60 opacity-100 transition-opacity duration-300"></div>
      <div className="bg-gradient-login absolute w-[1809px] h-[1100px] rounded-tr-full blur-3xl -bottom-[500px] -left-[1000px] pointer-events-none dark:opacity-60 opacity-100 transition-opacity duration-300"></div>
      {/* Thông báo ứng dụng đang phát triển */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
        <span className="text-lg md:text-xl font-semibold text-indigo-700 dark:text-indigo-200 bg-white/80 dark:bg-gray-900/80 px-6 py-3 rounded-xl shadow-lg border border-indigo-100 dark:border-gray-700">
          <Typewriter
            words={["Ứng dụng đang được phát triển, các bạn hãy chờ đợi bọn mình nhé!"]}
            loop={0}
            cursor
            cursorStyle="|"
            deleteSpeed={40}
            delaySpeed={2000}
          />
        </span>
      </div>
      {/* Theme toggle button */}
      <div className="fixed top-8 right-8 z-[101] flex flex-col items-end gap-2">
        <ThemeToggle />
        {/* ToastContainer top right, just below ThemeToggle */}
        <ToastContainer
          position="top-right"
          toastStyle={{ background: '#111', color: '#fff' }}
          closeOnClick
          draggable
        />
      </div>

      <button
        className="absolute top-6 left-6 p-0 bg-transparent border-none outline-none shadow-none hover:bg-transparent"
        onClick={() => {
          const accessToken = localStorage.getItem("accessToken");
          navigate(accessToken ? "/plan" : "/");
        }}
        aria-label="Trang chủ"
      >
        <Logo />
      </button>
      {/* Thông tin người dùng ở góc trái dưới */}
      {/* User info button with menu */}
      <UserInfoMenu loading={loading} user={user} onLogout={() => {
        showToast("Đăng xuất thành công!", "success");
        setTimeout(() => navigate("/"), 1200);
      }} />

      {/* Chat AI ở trung tâm trang */}
      <div className="flex flex-1 justify-center items-center p-4 relative z-40">
        <ChatAI />
      </div>

      {/* FAQ floating button */}
      <FaqFloatingButton />
    </div>
  );

interface UserInfoMenuProps {
  loading: boolean;
  user: UserInfo | null;
  onLogout?: () => void;
}

function UserInfoMenu({ loading, user, onLogout }: UserInfoMenuProps) {
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
        className="flex items-center gap-3 bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-lg px-4 py-3 border border-gray-200 dark:border-gray-700 min-w-[220px] hover:bg-indigo-50 dark:hover:bg-gray-800 transition relative"
        onClick={() => setOpen(o => !o)}
        aria-label="Thông tin người dùng"
      >
        {loading ? (
          <div className="text-gray-500 dark:text-gray-300 text-sm">Đang tải...</div>
        ) : user ? (
          <>
            <div className="flex flex-col text-left">
              <span className="text-xs text-gray-500 dark:text-gray-400">Email</span>
              <span className="font-semibold text-indigo-700 dark:text-indigo-200 text-sm truncate max-w-[160px]">{user.email || user.fullName || user.name}</span>
            </div>
            <div className="flex flex-col items-end ml-auto">
              <span className="text-xs text-gray-500 dark:text-gray-400">Gói</span>
              <span className={user.plan === 'Premium' ? "font-semibold text-yellow-600 dark:text-yellow-400 text-sm" : "font-semibold text-green-600 dark:text-green-400 text-sm"}>
                {user.plan === 'Premium' ? 'Premium' : 'Free'}
              </span>
            </div>
          </>
        ) : (
          <div className="text-red-500 dark:text-red-400 text-sm">Không lấy được thông tin</div>
        )}
        <svg className="w-4 h-4 ml-2 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        {/* Dropdown menu */}
        {open && (
          <div className="absolute left-0 bottom-14 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 min-w-[180px] py-2 z-50 animate-fade-in">
            <button
              className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-gray-800 text-indigo-700 dark:text-indigo-200"
              onClick={e => { e.stopPropagation(); setOpen(false); alert('Chức năng Xem thông tin sẽ được phát triển!'); }}
            >
              <User2 className="w-4 h-4 mr-1 text-indigo-500 dark:text-indigo-300" />
              Xem thông tin
            </button>
            <button
              className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-gray-800 text-indigo-700 dark:text-indigo-200"
              onClick={e => { e.stopPropagation(); setOpen(false); window.location.href = '/checkout'; }}
            >
              <ArrowUpCircle className="w-4 h-4 mr-1 text-yellow-500 dark:text-yellow-300" />
              Nâng cấp
            </button>
            <button
              className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-gray-800 text-red-600 dark:text-red-400"
              onClick={e => {
                e.stopPropagation();
                setOpen(false);
                localStorage.removeItem('accessToken');
                if (onLogout) onLogout();
              }}
            >
              <LogOut className="w-4 h-4 mr-1 text-red-500 dark:text-red-300" />
              Đăng xuất
            </button>
          </div>
        )}
      </button>

    </div>
  );
}
}

export default UserPlanPage;


function showToast(message: string, type: "success" | "error" | "info" | "warning" = "info") {
  toast(message, {
    type,
    position: "top-right",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
}
// Toast component với progress bar và màu tương phản
