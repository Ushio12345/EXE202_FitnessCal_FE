import { motion } from "framer-motion";
import {
  Salad,
  Flame,
  Apple,
  Instagram,
  Twitter,
  Facebook,
} from "lucide-react";
import Banner from "@/assets/images/banner.jpg";

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen  text-title flex flex-col justify-between">
      <section
        className="relative flex flex-col items-center justify-center text-center px-6 py-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${Banner})`,
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg ">
            FitnessCall
          </h1>
          <p className="text-lg md:text-2xl text-white max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Ứng dụng gợi ý{" "}
            <span className="font-semibold text-success-500">
              món ăn dinh dưỡng
            </span>{" "}
            cho gymer – giúp bạn chinh phục mục tiêu tập luyện nhanh hơn.
          </p>
          <motion.button
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="primary"
              size="lg"
              className="mt-5"
              onClick={() => navigate("/login")}
            >
              Khám phá ngay
            </Button>
          </motion.button>
        </motion.div>
        {/* Decorative Element */}
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-primary-50 rounded-full opacity-20 blur-3xl" />
      </section>

      {/* Benefits Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 md:px-16 py-20">
        {[
          {
            icon: (
              <Salad className="w-14 h-14 text-success-500 mb-4 border rounded-full p-2 bg-secondary-100" />
            ),
            title: "Tăng cơ",
            description:
              "Thực đơn giàu protein được thiết kế khoa học để tối ưu hóa quá trình xây dựng cơ bắp.",
          },
          {
            icon: (
              <Flame className="w-14 h-14 text-error-500 mb-4 order rounded-full p-2 bg-secondary-100" />
            ),
            title: "Giảm mỡ",
            description:
              "Gợi ý món ăn ít calo, hỗ trợ giảm cân an toàn mà vẫn đảm bảo dinh dưỡng.",
          },
          {
            icon: (
              <Apple className="w-14 h-14 text-primary-500 mb-4 order rounded-full p-2 bg-secondary-100" />
            ),
            title: "Cân bằng",
            description:
              "Duy trì sức khỏe và phong độ với chế độ ăn đầy đủ dưỡng chất.",
          },
        ].map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="relative rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border border-primary hover:border-primary-300 hover:bg-primary-50/30 transition-all duration-300 hover:bg-secondary-100  "
          >
            {benefit.icon}
            <h3 className="text-2xl font-bold text-primary-600 mb-3">
              {benefit.title}
            </h3>
            <p className="text-nomarl text-base leading-relaxed">
              {benefit.description}
            </p>
          </motion.div>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r bg-primary-900 py-10 text-center">
        <div className="flex justify-center gap-6 mb-4">
          <motion.a
            href="#"
            whileHover={{ scale: 1.2, color: "var(--color-primary-300)" }}
            className="text-white"
          >
            <Instagram className="w-6 h-6" />
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ scale: 1.2, color: "var(--color-primary-300)" }}
            className="text-white"
          >
            <Twitter className="w-6 h-6" />
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ scale: 1.2, color: "var(--color-primary-300)" }}
            className="text-white"
          >
            <Facebook className="w-6 h-6" />
          </motion.a>
        </div>
        <p className="text-sm text-white font-medium">
          © 2025 FitnessCall - Eat Clean, Train Hard, Stay Fit.
        </p>
      </footer>
    </div>
  );
}
