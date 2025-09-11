import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/logo/logo";
import ThemeToggle from "@/components/ui/ThemeToggle";

const faqs = [
  {
    question: "FitnessCal là gì?",
    answer: "FitnessCal là ứng dụng gợi ý món ăn dinh dưỡng và hỗ trợ xây dựng thực đơn phù hợp cho từng đối tượng, giúp bạn đạt mục tiêu tập luyện nhanh hơn."
  },
  {
    question: "Tôi có thể sử dụng miễn phí không?",
    answer: "Bạn có thể sử dụng gói Free với các tính năng cơ bản. Để trải nghiệm đầy đủ, bạn có thể nâng cấp lên Premium."
  },
  {
    question: "Làm sao để nâng cấp lên Premium?",
    answer: "Bạn chỉ cần đăng nhập, vào trang gói dịch vụ và chọn nâng cấp, sau đó thực hiện thanh toán theo hướng dẫn."
  },
  {
    question: "Tôi quên mật khẩu thì làm sao?",
    answer: "Bạn có thể sử dụng chức năng Quên mật khẩu ở trang đăng nhập để lấy lại mật khẩu qua email."
  },
  {
    question: "FitnessCal có app điện thoại không?",
    answer: "Hiện tại FitnessCal đang phát triển phiên bản mobile, hãy theo dõi fanpage để cập nhật thông tin mới nhất!"
  },
  {
    question: "Tôi cần hỗ trợ thêm thì liên hệ ở đâu?",
    answer: "Bạn có thể sử dụng box chat tư vấn ở góc phải dưới màn hình hoặc liên hệ fanpage của chúng tôi."
  }
];


const FAQPage: React.FC = () => {
  const navigate = useNavigate();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  // Đồng bộ dark mode với /plan (UserPlanPage)
  React.useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
  <div className="h-screen w-screen flex flex-col overflow-x-hidden overflow-y-hidden relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <header className="p-5 relative">
      <Logo />
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </header>
      {/* Background gradient login style for both light and dark mode */}
      <div className="bg-gradient-login absolute w-[1809px] -top-[400px] h-[1100px] rounded-bl-full -right-[900px] blur-3xl pointer-events-none dark:opacity-60 opacity-100 transition-opacity duration-300"></div>
      <div className="bg-gradient-login absolute w-[1809px] h-[1100px] rounded-tr-full blur-3xl -bottom-[500px] -left-[1000px] pointer-events-none dark:opacity-60 opacity-100 transition-opacity duration-300"></div>
      <main className="flex flex-1 justify-center items-center p-4 relative">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-primary-100 dark:border-gray-700 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-primary dark:text-indigo-200 mb-8 text-center">Câu hỏi thường gặp</h1>
          <div className="space-y-4 w-full">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="border border-primary-100 dark:border-gray-700 rounded-xl bg-primary-50/60 dark:bg-gray-800/70 overflow-hidden"
              >
                <button
                  className={`w-full flex justify-between items-center px-5 py-4 text-left font-semibold text-primary-700 dark:text-indigo-200 focus:outline-none transition-colors duration-200 ${openIdx === idx ? 'bg-primary-100 dark:bg-gray-700/60' : ''}`}
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  aria-expanded={openIdx === idx}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <span>{faq.question}</span>
                  <svg className={`w-5 h-5 ml-2 transform transition-transform duration-200 ${openIdx === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <AnimatePresence initial={false}>
                  {openIdx === idx && (
                    <motion.div
                      id={`faq-answer-${idx}`}
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 pb-4 text-gray-700 dark:text-gray-200 text-base"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          <Button className="mt-8 w-full" onClick={() => navigate("/plan")}>Quay lại</Button>
        </div>
      </main>
    </div>
  );
};

export default FAQPage;
