import { Link } from "react-router-dom";
import { LoginIcon } from "../Icon";
import ROUTE_PATH from "@/types/route-type";

const LogoNotAuthenticated = () => {
  return (
    <Link
      to={ROUTE_PATH.AUTH_PAGE}
      className="flex items-center gap-4 px-6"
    >
      <LoginIcon />
      <h3 className="font-bold text-2xl text-primary-700">FitnessCal</h3>
    </Link>
  );
};

export default LogoNotAuthenticated;
