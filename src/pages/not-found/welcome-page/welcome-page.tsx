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
import { Button } from "@/components/ui/Button";
import { Typewriter } from 'react-simple-typewriter';

import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function WelcomePage() {
  useEffect(() => {
    document.title = "Trang chủ | FitnessCal";
  }, []);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  // Cookie consent
  const [showCookie, setShowCookie] = useState(() => !localStorage.getItem("cookieConsent"));
  const handleAcceptCookie = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowCookie(false);
  };
  const handleDeclineCookie = () => {
    setShowCookie(false);
  };
  // Chat box state
  const [showChat, setShowChat] = useState(false);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const [chatMessages, setChatMessages] = useState<{from: 'user'|'bot', text: string}[]>([]);
  // Scroll to top
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // Gửi tin nhắn chat
  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const value = chatInputRef.current?.value?.trim();
    if (!value) return;
    setChatMessages(msgs => [...msgs, { from: 'user', text: value }]);
    // Giả lập trả lời bot
    setTimeout(() => {
      setChatMessages(msgs => [...msgs, { from: 'bot', text: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm.' }]);
    }, 800);
    if (chatInputRef.current) chatInputRef.current.value = '';
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col justify-between bg-white"
    >
      {/* Nút scroll lên đầu trang */}
      {/* Nút mở chat */}
      <button
        className="fixed bottom-24 right-8 z-40 bg-white border border-primary-200 text-primary rounded-full shadow-lg w-12 h-12 flex items-center justify-center hover:bg-primary-50 transition-all duration-200"
        onClick={() => setShowChat(v => !v)}
        aria-label="Chat tư vấn"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
      </button>
      {/* Nút scroll lên đầu trang */}
      <button
        className="fixed bottom-8 right-8 z-40 bg-primary text-white rounded-full shadow-lg w-12 h-12 flex items-center justify-center hover:bg-primary-600 transition-all duration-200"
        style={{ boxShadow: '0 4px 16px rgba(49,46,129,0.15)' }}
        onClick={handleScrollTop}
        aria-label="Lên đầu trang"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
      </button>
      {/* Box chat nhỏ */}
      {showChat && (
        <div className="fixed bottom-24 right-8 z-50 w-80 max-w-[90vw] bg-white rounded-xl shadow-2xl border border-primary-200 flex flex-col animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-primary-100 bg-primary-50 rounded-t-xl">
            <span className="font-semibold text-primary">Tư vấn & hỗ trợ</span>
            <button className="text-gray-400 hover:text-primary" onClick={() => setShowChat(false)} aria-label="Đóng chat">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex-1 px-4 py-2 overflow-y-auto max-h-60 min-h-[80px]">
            {chatMessages.length === 0 && (
              <div className="text-gray-400 text-sm text-center mt-4">Hãy đặt câu hỏi, chúng tôi sẽ hỗ trợ bạn!</div>
            )}
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`my-1 flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <span className={`inline-block px-3 py-2 rounded-lg text-sm ${msg.from === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>{msg.text}</span>
              </div>
            ))}
          </div>
          <form className="flex items-center border-t border-primary-100 p-2" onSubmit={handleSendChat}>
            <input
              ref={chatInputRef}
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-3 py-2 rounded-lg border border-primary-200 focus:outline-primary-400 text-sm"
              onKeyDown={e => { if (e.key === 'Enter') handleSendChat(e); }}
            />
            <button type="submit" className="ml-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-all">
              Gửi
            </button>
          </form>
        </div>
      )}
      {showCookie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full text-center animate-fade-in border border-primary-100">
            <div className="text-lg font-semibold mb-2 text-primary">Chúng tôi sử dụng cookie</div>
            <div className="mb-4 text-gray-700 text-base leading-relaxed">
              Để nâng cao trải nghiệm, trang web này sử dụng cookie để lưu thông tin đăng nhập, cá nhân hóa nội dung và phân tích truy cập.<br/>
              Nếu bạn bấm <b>Đồng ý</b>, bạn xác nhận đã đọc và đồng ý với <a href="/policy" className="text-primary underline hover:text-primary-600" target="_blank" rel="noopener noreferrer">chính sách của chúng tôi</a>.
            </div>
            <div className="flex gap-3 justify-center">
              <Button className="bg-primary text-white px-6" onClick={handleAcceptCookie}>Đồng ý</Button>
              <Button variant="outline" className="border-primary text-primary px-6" onClick={handleDeclineCookie}>Từ chối</Button>
            </div>
          </div>
        </div>
      )}
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
