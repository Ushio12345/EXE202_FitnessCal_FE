import { motion } from "framer-motion";
import { useState, type FormEvent, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { Button } from "../../../components/ui/button";
import { useForm } from "react-hook-form";
import { Input } from "../../../components/ui/input";
import { DiscordIcon, GoogleIcon } from "../../../components/icon";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { type AppDispatch, type RootState } from "@/store/store";
import {
  loginWithDiscord,
  loginWithEmailPassword,
  loginWithGoogle,
} from "@/store/slices/auth-slice";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getUserRoleFromToken } from "@/lib/utils/jwt";
import { schema } from "../schema/login-schema";

type FormData = {
  email: string;
  password: string;
};
export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
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
    document.title = "Đăng nhập | FitnessCal";
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();
  const onSubmit = async (data: FormData) => {
    console.log("Submit login form", data);
    const result = await dispatch(
      loginWithEmailPassword({ email: data.email, password: data.password })
    );
    console.log("Login thunk result", result, result.payload);
    if (result.meta.requestStatus === "fulfilled" && result.payload?.access_token) {
      localStorage.setItem("accessToken", result.payload.access_token);
      if (result.payload?.refresh_token) {
        localStorage.setItem("refreshToken", result.payload.refresh_token);
      }
      // Lấy role từ JWT token
      const userRole = getUserRoleFromToken(result.payload.access_token);
      console.log("User role from JWT:", userRole);

      // Check for pending payment for this user
      try {
        const token = result.payload.access_token;
        const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
        const userId = payload && (payload.sub || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || payload.id);
        if (userId) {
          const pendingKey = `pendingPayment_${userId}`;
          const pending = localStorage.getItem(pendingKey);
          if (pending) {
            const { url, expiresAt } = JSON.parse(pending);
            if (url && expiresAt && Date.now() < expiresAt) {
              setPendingPaymentUrl(url);
              setPendingExpiresAt(expiresAt);
              // Không redirect ngay, show popup ở dưới
              return;
            } else {
              localStorage.removeItem(pendingKey);
            }
          }
        }
      } catch {}

      // Kiểm tra role và redirect tương ứng
      if (userRole === "Admin" || userRole === "admin") {
        navigate("/admindashboard");
      } else {
        navigate("/user");
      }
    }
  };

  // Typewriter cho placeholder input email
  const [typewriterText] = useTypewriter({
    words: ['emailcuaban@gmail.com', 'example@gmail.com'],
    loop: true,
    delaySpeed: 2000,
    typeSpeed: 60,
    deleteSpeed: 40,
  });

  return (
    <div className=" ">
      {/* Popup nếu có pending payment sau login */}
      {pendingPaymentUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg px-8 py-6 flex flex-col items-center border border-yellow-300 animate-fade-in">
            <div className="text-xl font-bold text-yellow-700 mb-2">Bạn có đơn hàng đang xử lý</div>
            <div className="text-base text-gray-700 mb-2">Vui lòng hoàn tất thanh toán hoặc đợi đơn hàng được xử lý.</div>
            <div className="text-sm text-gray-500 mb-4">Thời gian còn lại: <span className="font-semibold">{pendingCountdown}</span></div>
            <a
              href={pendingPaymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold text-lg hover:bg-yellow-600 transition-all duration-300 mb-2"
            >
              Đến trang thanh toán
            </a>
            <button
              className="w-full py-2 bg-gray-100 text-yellow-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
              onClick={() => setPendingPaymentUrl(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border border-primary-100"
      >
        <Button
          variant="outline"
          className="mb-6 border-primary text-primary bg-white hover:bg-primary-50 w-full"
          onClick={() => navigate("/")}
        >
          Quay về trang chủ
        </Button>
        {error && (
          <Alert variant={"destructive"}>
            <AlertTitle>Đăng nhập thất bại</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label
              htmlFor="signin-email"
              className="text-black font-medium text-lg"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-primary-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                id="signin-email"
                type="email"
                {...register("email")}
                placeholder={typewriterText}
                className="pl-10 pr-4 py-3"
              />
            </div>
            <span>
              {errors.email && (
                <p className="text-error italic text-sm">
                  {errors.email.message}
                </p>
              )}
            </span>
          </div>
          <div className="space-y-2 relative">
            <label
              htmlFor="signin-password"
              className="text-black font-medium  text-lg"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-primary-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                id="signin-password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="*******"
                className="pl-10 pr-10"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-500 focus:outline-none"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span>
                {errors.password && (
                  <p className="text-error italic text-sm">
                    {errors.password.message}
                  </p>
                )}
              </span>
              <a
                href="/forgot-password"
                className="text-primary-600 text-sm font-medium hover:underline ml-auto"
              >
                Quên mật khẩu?
              </a>
            </div>
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
            }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-6 py-3 bg-gradient-button text-white rounded-lg font-semibold text-lg hover:bg-primary-600 transition-all duration-300 flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Đăng nhập"
            )}
          </motion.button>
        </form>
        <div className="my-6 flex items-center">
          <hr className="flex-1 border-primary-200" />
          <span className="px-3 text-nomarl text-sm">Hoặc</span>
          <hr className="flex-1 border-primary-200" />
        </div>
        <Button
          variant="outline"
          className="flex items-center justify-center gap-4 w-full"
          disabled={loading}
          onClick={() => dispatch(loginWithGoogle())}
        >
          <GoogleIcon /> Đăng nhập với Gmail
        </Button>
        <Button
          className="flex items-center justify-center gap-4 w-full mt-3 bg-black"
          onClick={() => dispatch(loginWithDiscord())}
        >
          <DiscordIcon /> Đăng nhập với Discord
        </Button>
      </motion.div>
    </div>
  );
}
