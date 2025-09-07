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
import { Button } from "@/components/ui/button";
import { Typewriter } from 'react-simple-typewriter';

import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function WelcomePage() {
  useEffect(() => {
    document.title = "Trang chủ | FitnessCal";
  }, []);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col justify-between bg-white"
    >
      {/* Hero Section */}
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
            FitnessCal
          </h1>
          <p className="text-lg md:text-2xl text-white max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Ứng dụng gợi ý <span className="font-semibold text-success-500">món ăn dinh dưỡng</span>
            {" cho "}
            <span className="font-semibold text-primary-300">
              <Typewriter
                words={["gymer", "trẻ em", "người lớn", "người đi làm", "người cao tuổi", "người ăn kiêng"]}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={140}
                deleteSpeed={90}
                delaySpeed={1400}
              />
            </span>
            {" – giúp bạn chinh phục mục tiêu tập luyện nhanh hơn."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-5">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/login")}
              >
                Khám phá ngay
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary bg-white hover:bg-primary-50"
                onClick={() => setShowPopup(true)}
              >
                Tải ngay
              </Button>
            </motion.div>
          </div>
          {/* Popup thông báo ra mắt */}
          {showPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-lg w-full text-center relative">
                <div className="text-2xl font-bold mb-6 text-primary">Thông báo</div>
                <div className="mb-8 text-gray-700 text-lg leading-relaxed">
                  Ứng dụng sẽ được ra mắt vào thời gian sắp tới.<br />
                  Mọi người nhớ cập nhật thông tin về thời điểm ra mắt chính thức ở fanpage của tụi mình nhé!
                </div>
                <Button className="w-full bg-primary text-white py-3 text-lg rounded-xl" onClick={() => setShowPopup(false)}>
                  Đóng
                </Button>
              </div>
            </div>
          )}
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
          © 2025 FitnessCal - Eat Clean, Train Hard, Stay Fit.
        </p>
      </footer>
    </motion.div>
  );
}
