import { Link } from "react-router-dom";
import { LoginIcon } from "../icon";
import ROUTE_PATH from "@/types/route-type";

const Logo = () => {
  return (
    <Link
      to={`${ROUTE_PATH.WELCOME_PAGE}`}
      className="flex items-center gap-4 px-6"
    >
      <LoginIcon />
      <h3 className="font-bold text-2xl text-primary-700">FitnessCal</h3>
    </Link>
  );
};

export default Logo;
