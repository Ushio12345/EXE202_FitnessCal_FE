import React from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle } from "lucide-react";

const FaqFloatingButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <button
      className="fixed bottom-8 right-8 z-50 bg-primary text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center hover:bg-primary-600 transition-all duration-200 border-4 border-white"
      style={{ boxShadow: '0 4px 16px rgba(49,46,129,0.15)' }}
      onClick={() => navigate('/faq')}
      aria-label="Câu hỏi thường gặp"
    >
      <HelpCircle className="w-7 h-7" />
    </button>
  );
};

export default FaqFloatingButton;
