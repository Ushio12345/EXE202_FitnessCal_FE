
import { Link } from "react-router-dom";
import { LoginIcon } from "../Icon";
import { useAuth } from "@/hooks/useAuth";


const Logo = () => {
  const { user } = useAuth();
  // Nếu user null, undefined, hoặc không có id/email thì coi là chưa login
  const isLoggedIn = user && (user.id || user.email);
  const to = isLoggedIn ? "/plan" : "/";
  return (
    <Link
      to={to}
      className="flex items-center gap-4 px-6"
    >
      <LoginIcon />
      <h3 className="font-bold text-2xl text-primary-700">FitnessCal</h3>
    </Link>
  );
};

export default Logo;
