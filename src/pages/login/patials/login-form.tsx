import { motion } from "framer-motion";
import { useState, type FormEvent, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Mail, Lock, Loader2 } from "lucide-react";
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
import { schema } from "../schema/login-schema";

type FormData = {
  email: string;
  password: string;
};
export default function LoginForm() {
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
      navigate("/manage");
    }
  };
  return (
    <div className=" ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border border-primary-100"
      >
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
                placeholder="emailcuaban@email.com"
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
                type="password"
                {...register("password")}
                placeholder="*******"
                className="pl-10"
              />
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
