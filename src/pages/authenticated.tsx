import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/../supabaseClient";
import axiosInstance from "@/axios/instance";

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
      const provider = user.app_metadata?.provider || user.raw_app_meta_data?.provider || "google";
      const apiPath = provider === "discord" ? "/auth/discord-login" : "/auth/google-login";
      try {
        const response = await axiosInstance.post(apiPath, payload);
        if (response.data?.success) {
          const token = response.data?.data?.accessToken || response.data?.data?.access_token;
          if (token) {
            localStorage.setItem("accessToken", token);
            navigate("/user");
          } else {
            setError("Đăng nhập thành công nhưng không nhận được access token.");
          }
        } else {
          setError(response.data?.message || "Đăng nhập thất bại.");
        }
      } catch (err: any) {
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
