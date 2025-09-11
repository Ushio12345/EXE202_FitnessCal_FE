import React from "react";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Logo from "@/components/logo/logo";
import ThemeToggle from "@/components/ui/ThemeToggle";

const PolicyPage: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Chính sách & Quyền riêng tư | FitnessCal";
  }, []);
  return (
    <div className="h-screen w-screen flex flex-col overflow-x-hidden overflow-y-hidden relative bg-white dark:bg-gray-950 transition-colors duration-300">
      <header className="p-5 relative">
        <Logo />
        <div className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>
      </header>
  {/* Background gradient cho cả light và dark mode */}
  {/* Light mode gradient */}
  <div className="bg-gradient-login absolute w-[1809px] -top-[400px] h-[1100px] rounded-bl-full -right-[900px] blur-3xl pointer-events-none opacity-100 dark:opacity-60 transition-opacity duration-300"></div>
  <div className="bg-gradient-login absolute w-[1809px] h-[1100px] rounded-tr-full blur-3xl -bottom-[500px] -left-[1000px] pointer-events-none opacity-100 dark:opacity-60 transition-opacity duration-300"></div>
      <main className="flex flex-1 justify-center items-center p-4 relative">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-primary-100 dark:border-gray-700 flex flex-col items-center transition-colors duration-300">
          <h1 className="text-3xl font-bold text-primary dark:text-indigo-200 mb-8 text-center">Chính sách & Quyền riêng tư</h1>
          <div className="space-y-6 text-gray-700 dark:text-gray-200 text-base w-full">
            <p>
              <b>1. Cookie & Lưu trữ thông tin:</b> Chúng tôi sử dụng cookie để lưu thông tin đăng nhập, cá nhân hóa trải nghiệm và phân tích truy cập. Cookie không chứa thông tin nhạy cảm và bạn có thể từ chối sử dụng cookie bất cứ lúc nào.
            </p>
            <p>
              <b>2. Bảo mật thông tin:</b> Mọi thông tin cá nhân bạn cung cấp sẽ được bảo mật tuyệt đối, không chia sẻ cho bên thứ ba ngoài mục đích vận hành dịch vụ.
            </p>
            <p>
              <b>3. Quyền truy cập & chỉnh sửa:</b> Bạn có quyền truy cập, chỉnh sửa hoặc xóa thông tin cá nhân bất cứ lúc nào qua tài khoản của mình hoặc liên hệ hỗ trợ.
            </p>
            <p>
              <b>4. Liên hệ:</b> Nếu có thắc mắc về quyền riêng tư, vui lòng liên hệ qua box chat hoặc fanpage của chúng tôi.
            </p>
          </div>
          <Button className="mt-8 w-full" onClick={() => navigate("/")}>Về trang chủ</Button>
        </div>
      </main>
    </div>
  );
};

export default PolicyPage;
