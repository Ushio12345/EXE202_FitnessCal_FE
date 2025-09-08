import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/../supabaseClient";
import axiosInstance from "@/axios/instance";
import { getUserRoleFromToken } from "@/lib/utils/jwt";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import Logo from "@/components/logo/logo";

export default function AuthenticatedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthLogin = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Dừng 0.5s
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session?.user) {
        setError("Không lấy được thông tin người dùng từ Supabase.");
        return;
      }
      const user = data.session.user;
      const payload = {
        Uid: user.id,
        Email: user.email,
        FirstName: user.user_metadata?.full_name?.split(" ").slice(0, -1).join(" ") || "",
        LastName: user.user_metadata?.full_name?.split(" ").slice(-1).join(" ") || "",
        CreatedAt: user.created_at,
      };
      // Xác định provider để gọi đúng API backend
      const provider = user.app_metadata?.provider || "google";
      const apiPath = provider === "discord" ? "/auth/discord-login" : "/auth/google-login";
      try {
        const response = await axiosInstance.post(apiPath, payload);
        console.log(response.data);
        if (response.data?.success) {
          const token = response.data?.data?.access_token;
          const refreshToken = response.data?.data?.refresh_token;
          if (token) {
            localStorage.setItem("accessToken", token);
            if (refreshToken) {
              localStorage.setItem("refreshToken", refreshToken);
            }
            const userRole = getUserRoleFromToken(token);
            console.log("User role from JWT:", userRole);
            // Kiểm tra role và redirect tương ứng
            if (userRole === "Admin" || userRole === "admin") {
              navigate("/admindashboard");
            } else if (userRole === "User" || userRole === "user") {
              navigate("/user");
            } else {
              navigate("/manage");
            }
          } else {
            setError("Đăng nhập thành công nhưng không nhận được access token.");
          }
        } else {
          setError(response.data?.message || "Đăng nhập thất bại.");
        }
      } catch (err: any) {
        console.error("OAuth login error:", err);
        if (err.response?.status === 409) {
          setError(err.response?.data?.message || "Email đã được sử dụng để đăng ký. Vui lòng đăng nhập bằng email/password hoặc sử dụng email khác để đăng nhập Google.");
        } else if (err.response?.status === 401) {
          setError(err.response?.data?.message || "Tài khoản của bạn đã bị vô hiệu hóa.");
        } else if (err.response?.status === 500) {
          setError("Có lỗi xảy ra từ server. Vui lòng thử lại sau.");
        } else {
          setError("Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.");
        }
      }
    };
    handleOAuthLogin();
  }, [navigate]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-x-hidden overflow-y-hidden relative">
      {/* Background gradient giống login */}
      <div className="bg-gradient-login absolute w-[1809px] -top-[400px] h-[1100px] rounded-bl-full -right-[900px]  blur-3xl "></div>
      <div className="bg-gradient-login absolute w-[1809px] h-[1100px] rounded-tr-full  blur-3xl -bottom-[500px] -left-[1000px]"></div>
      {/* Logo ở góc trên bên trái */}
      { <div className="absolute top-5 left-5">
          <Logo />
      </div> }
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex items-center justify-center min-h-screen relative"
        >
          {error ? (
            
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border border-red-200 flex flex-col items-center animate-fade-in">
              <svg className="w-14 h-14 text-red-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#fee2e2" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6m0-6l6 6" /></svg>
              <div className="text-xl font-bold text-red-700 mb-2">Không thể đăng nhập bằng O2Auth</div>
              <div className="text-base text-gray-700 mb-4 text-center">
                Email này đã được đăng ký bằng tài khoản thường.<br />
                Vui lòng đăng nhập bằng email/password hoặc sử dụng email khác để đăng nhập Google.<br />
                Nếu bạn quên mật khẩu, hãy sử dụng chức năng <a href="/forgot-password" className="text-primary-600 underline font-medium">Quên mật khẩu</a> để đặt lại.<br />
              </div>
              <button
                className="w-full py-3 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary-700 transition-all duration-300"
                onClick={() => navigate('/login')}
              >
                Quay lại trang đăng nhập
              </button>
            </div>
          ) : (
            <div className="text-lg font-semibold">Đang xác thực tài khoản...</div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
