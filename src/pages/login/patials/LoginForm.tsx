import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { GoogleIcon } from "../../../components/Icon";
import { Input } from "../../../components/ui/input";

// Placeholder for Google Sign-In callback
declare global {
  interface Window {
    google: any;
  }
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className=" ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border border-primary-100"
      >
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-error text-sm mb-4 text-center"
          >
            {error}
          </motion.p>
        )}
        <form className="space-y-4">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className=" pl-10 pr-4 py-3 "
                required
              />
            </div>
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className=" pl-10 pr-4 py-3 "
                required
              />
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
          className="flex items-center justify-center gap-4"
        >
          <GoogleIcon /> Đăng nhập với Gmail
        </Button>
        <div id="googleSignInButton" className="flex justify-center"></div>
      </motion.div>
    </div>
  );
}
