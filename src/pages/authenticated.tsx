import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/../supabaseClient";
import axiosInstance from "@/axios/instance";
import { getUserRoleFromToken } from "@/lib/utils/jwt";

export default function AuthenticatedPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthLogin = async () => {
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
    <div className="flex items-center justify-center min-h-screen">
      {error ? (
        <div className="text-lg font-semibold text-red-600">{error}</div>
      ) : (
        <div className="text-lg font-semibold">Đang xác thực tài khoản...</div>
      )}
    </div>
  );
}
