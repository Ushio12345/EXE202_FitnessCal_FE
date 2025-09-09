import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

import LoginForm from "./patials/login-form";

import LogoNotAuthenticated from "@/components/logo/logo-not_authenticated";
import ThemeToggle from "@/components/ui/ThemeToggle";

const Login = () => {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="h-screen w-screen flex flex-col overflow-x-hidden overflow-y-hidden relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
    >
      {/* Background gradient login style for both light and dark mode */}
      <div className="bg-gradient-login absolute w-[1809px] -top-[400px] h-[1100px] rounded-bl-full -right-[900px] blur-3xl pointer-events-none dark:opacity-60 opacity-100 transition-opacity duration-300"></div>
      <div className="bg-gradient-login absolute w-[1809px] h-[1100px] rounded-tr-full blur-3xl -bottom-[500px] -left-[1000px] pointer-events-none dark:opacity-60 opacity-100 transition-opacity duration-300"></div>

      {/* Logo và ThemeToggle */}
      <header className="p-5 relative">
        <LogoNotAuthenticated />
        <div className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 justify-center items-center p-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-md sm:w-[90%] md:w-3/4 lg:w-1/2"
        >
          <LoginForm />
        </motion.div>
      </main>
    </motion.div>
  );
};

export default Login;
