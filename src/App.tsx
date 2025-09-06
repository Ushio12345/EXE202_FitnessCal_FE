import "./styles/index.css";
import MainRoutes from "./routes/main-routes";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "./hooks/useAuth";
import LoadingSpinner from "./components/loading/Loading";

const App = () => {
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
