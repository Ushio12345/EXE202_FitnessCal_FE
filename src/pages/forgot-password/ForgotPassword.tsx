import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/axios/instance";

const ForgotPassword: React.FC = () => {
    useEffect(() => {
      document.title = "Quên mật khẩu | FitnessCal";
    }, []);
  const [email, setEmail] = useState(() => {
    // Lấy email từ localStorage nếu có
    return localStorage.getItem("forgot_email") || "";
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<"email" | "reset">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();

  // Gửi email lấy mã OTP
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      localStorage.setItem("forgot_email", email); // Lưu email vào localStorage
      setStep("reset");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Không gửi được email xác nhận. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  // Đổi mật khẩu mới
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setLoading(true);
    try {
      const otpValue = otp.join("");
      // Lấy lại email từ localStorage nếu chưa có
      const emailToUse = email || localStorage.getItem("forgot_email") || "";
      await axiosInstance.post("/auth/reset-password", {
        email: emailToUse,
        otpCode: otpValue,
        newPassword: password,
        confirmPassword: confirmPassword
      });
      setSuccess("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.");
      localStorage.removeItem("forgot_email");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Không thể đặt lại mật khẩu. Vui lòng kiểm tra lại mã OTP và thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  // Xử lý nhập từng số OTP
  const handleOtpChange = (idx: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    // Nếu user paste nhiều ký tự vào 1 ô
    if (value.length > 1) {
      const chars = value.slice(0, 6).split("");
      const newOtp = [...otp];
      for (let i = 0; i < chars.length; i++) {
        if (idx + i < 6) newOtp[idx + i] = chars[i];
      }
      setOtp(newOtp);
      // Focus vào ô cuối cùng được paste
      const nextIdx = Math.min(idx + value.length - 1, 5);
      setTimeout(() => inputsRef.current[nextIdx]?.focus(), 0);
      return;
    }
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    if (value && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
    if (!value && idx > 0) {
      // Nếu xóa thì focus về trước
      inputsRef.current[idx - 1]?.focus();
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-x-hidden overflow-y-hidden relative">
      {/* Background gradient giống login */}
      <div className="bg-gradient-login absolute w-[1809px] -top-[400px] h-[1100px] rounded-bl-full -right-[900px]  blur-3xl "></div>
      <div className="bg-gradient-login absolute w-[1809px] h-[1100px] rounded-tr-full  blur-3xl -bottom-[500px] -left-[1000px]"></div>
      <main className="flex flex-1 justify-center items-center p-4 relative">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border border-primary-100">
          <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center">Quên mật khẩu</h2>
          {step === "email" && (
            <form onSubmit={handleSendEmail} className="space-y-5">
              <div>
                <label htmlFor="forgot-email" className="block font-medium mb-2 text-gray-700">
                  Nhập email của bạn
                </label>
                <Input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  required
                  className="py-3 px-4"
                />
              </div>
              {error && <div className="text-error text-sm italic">{error}</div>}
              <Button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 text-lg rounded-lg hover:bg-indigo-700 mb-2"
                disabled={loading}
              >
                {loading ? "Đang gửi..." : "Gửi mã xác nhận"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full border-primary text-primary bg-white hover:bg-primary-50"
                onClick={() => navigate('/login')}
              >
                Quay lại
              </Button>
            </form>
          )}
          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block font-medium mb-2 text-gray-700">
                  Nhập mã OTP đã gửi về email
                </label>
                <div className="flex gap-2 justify-center mb-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => {
                        inputsRef.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      className="w-12 h-14 text-center text-2xl border border-primary-200 rounded-lg focus:outline-primary-500 bg-gray-50"
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onPaste={e => {
                        const paste = e.clipboardData.getData("text").replace(/\D/g, "");
                        if (paste) {
                          e.preventDefault();
                          handleOtpChange(idx, paste);
                        }
                      }}
                      onFocus={e => e.target.select()}
                    />
                  ))}
                </div>
                <label className="block font-medium mb-2 text-gray-700 mt-4">Mật khẩu mới</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                    required
                    className="py-3 px-4 pr-12"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    tabIndex={-1}
                    onClick={() => setShowPassword(v => !v)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <label className="block font-medium mb-2 text-gray-700 mt-4">Xác nhận mật khẩu mới</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    required
                    className="py-3 px-4 pr-12"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword(v => !v)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              {error && <div className="text-error text-sm italic">{error}</div>}
              {success && <div className="text-success-600 text-sm italic font-semibold">{success}</div>}
              <Button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 text-lg rounded-lg hover:bg-indigo-700 mb-2"
                disabled={loading}
              >
                {loading ? "Đang đặt lại mật khẩu..." : "Xác nhận"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full border-primary text-primary bg-white hover:bg-primary-50"
                onClick={() => navigate('/login')}
              >
                Quay lại
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
