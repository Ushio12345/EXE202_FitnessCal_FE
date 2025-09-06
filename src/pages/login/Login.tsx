import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

import LoginForm from "./patials/login-form";

import Logo from "@/components/logo/logo";

const Login = () => {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="h-screen w-screen flex flex-col overflow-x-hidden overflow-y-hidden relative"
    >
      {/* Header */}
      <div className="bg-gradient-login absolute w-[1809px] -top-[400px] h-[1100px] rounded-bl-full -right-[900px]  blur-3xl "></div>
      <div className="bg-gradient-login absolute w-[1809px] h-[1100px] rounded-tr-full  blur-3xl -bottom-[500px] -left-[1000px]"></div>
      <header className="p-5">
        {" "}
        <Logo />
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
