import "./styles/index.css";
import MainRoutes from "./routes/main-routes";

import { AnimatePresence } from "framer-motion";
import { useAuth } from "./hooks/useAuth";
import LoadingSpinner from "./components/loading/Loading";
import { useEffect } from "react";

const App = () => {
  // Đồng bộ theme khi load app
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  // const { user, loading, isInitialized } = useAuth();
  // console.log("user", user);

  // if (!isInitialized || (loading && !user))
  //   return (
  //     <div>
  //       <LoadingSpinner />
  //     </div>
  //   );
  return (
    <AnimatePresence mode="wait">
      <MainRoutes />
    </AnimatePresence>
  );
};

export default App;
