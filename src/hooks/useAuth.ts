import { fetchUser } from "@/store/slices/auth-slice";
import type { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        console.log("useAuth - Fetching user...");
        await dispatch(fetchUser()).unwrap();
        if (isMounted) {
          console.log("useAuth - User fetched, setting isInitialized to true");
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Lỗi khởi tạo auth:", error);
        if (isMounted) setIsInitialized(true);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;

      console.log("useAuth - Cleanup completed");
    };
  }, [dispatch]);

  //   console.log("useAuth - Returning:", { user, loading, isInitialized });
  return { user, loading, isInitialized };
};
