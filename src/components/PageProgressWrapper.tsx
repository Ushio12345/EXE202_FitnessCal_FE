import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function PageProgressWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  useEffect(() => {
    NProgress.start();
    NProgress.set(0.4);
    NProgress.inc();
    NProgress.done();
    return () => {
      NProgress.done();
    };
  }, [location.pathname]);
  return <>{children}</>;
}
