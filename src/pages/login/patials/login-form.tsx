import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { yupResolver } from "@hookform/resolvers/yup";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { useTypewriter } from 'react-simple-typewriter';
import { Button } from "../../../components/ui/Button";
import { useForm } from "react-hook-form";
import { Input } from "../../../components/ui/input";
import { DiscordIcon, GoogleIcon } from "../../../components/Icon";
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
  useEffect(() => {
    document.title = "Đăng nhập | FitnessCal";
  }, []);

  // Lưu tài khoản
  const [saveAccount, setSaveAccount] = useState(false);
  const savedEmail = Cookies.get("savedEmail") || "";
  const savedPassword = Cookies.get("savedPassword") || "";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { email: savedEmail, password: savedPassword },
  });

  useEffect(() => {
    if (savedEmail && savedPassword) setSaveAccount(true);
  }, [savedEmail, savedPassword]);

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();
  const onSubmit = async (data: FormData) => {
    if (saveAccount) {
      Cookies.set("savedEmail", data.email, { expires: 7 });
      Cookies.set("savedPassword", data.password, { expires: 7 });
    } else {
      Cookies.remove("savedEmail");
      Cookies.remove("savedPassword");
    }
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



      // Kiểm tra role và redirect tương ứng
      if (userRole === "Admin" || userRole === "admin") {
        navigate("/admindashboard");
      } else {
        // Kiểm tra gói Premium
        try {
          const token = result.payload.access_token;
          const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
          const userId = payload && (payload.sub || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || payload.id);
          if (userId) {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/Subscription/${userId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
              const data = await res.json();
              const planType = data?.data?.package?.packageType || "Premium";
              if (planType === "Premium") {
                navigate("/plan");
                return;
              }
            }
          }
        } catch {}
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
              <div className="flex items-center">
                <input
                  id="save-account"
                  type="checkbox"
                  checked={saveAccount}
                  onChange={e => setSaveAccount(e.target.checked)}
                  className="mr-2 accent-indigo-600 w-4 h-4"
                />
                <label htmlFor="save-account" className="text-sm text-gray-700 select-none cursor-pointer">
                  Lưu tài khoản
                </label>
              </div>
              <a
                href="/forgot-password"
                className="text-primary-600 text-sm font-medium hover:underline ml-auto"
              >
                Quên mật khẩu?
              </a>
            </div>
            <span>
              {errors.password && (
                <p className="text-error italic text-sm">
                  {errors.password.message}
                </p>
              )}
            </span>
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
