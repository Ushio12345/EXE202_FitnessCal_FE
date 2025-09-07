import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import { Apple, Dumbbell, Home, Utensils } from "lucide-react";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    document.title = "404 Not Found | FitnessCal";
  }, []);
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="min-h-screen bg-background flex items-center justify-center p-4 "
    >
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-6">
          <div className="flex justify-center items-center gap-4 text-primary">
            <Dumbbell className="w-12 h-12" />
            <Apple className="w-12 h-12" />
            <Utensils className="w-12 h-12" />
          </div>
          <div className="text-8xl font-bold text-primary">404</div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
            Oops! Bạn đã tập luyện sai đường rồi!
          </h1>
          <p className="text-lg  text-pretty max-w-md mx-auto">
            Đừng lo lắng! Hãy để chúng tôi đưa bạn trở lại con đường với những
            gợi ý món ăn dinh dưỡng tuyệt vời.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="w-full sm:w-auto">
            <Link to="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Về Trang Chủ
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link to="/" className="flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              Khám Phá Công Thức
            </Link>
          </Button>
        </div>
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Cần hỗ trợ? Hãy liên hệ với chúng tôi để được tư vấn về chế độ dinh
            dưỡng phù hợp.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
