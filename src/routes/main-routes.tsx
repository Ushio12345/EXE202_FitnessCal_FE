import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import NotFound from "../pages/not-found/not-found";
import FAQPage from "../pages/faq/FAQPage";
import WelcomePage from "../pages/not-found/welcome-page/welcome-page";
import Login from "../pages/login/Login";
import PolicyPage from "../pages/policy/PolicyPage";
import LoadingSpinner from "@/components/loading/Loading";
import ManagePage from "@/pages/manage/manage-page";
import ROUTE_PATH from "@/types/route-type";
import ManageLayout from "@/layouts/manager-layout/manage-layout";
import UserLayout from "@/layouts/user-layout/user-layout";
import Authenticated from "@/pages/authenticated";
import ForgotPassword from "@/pages/forgot-password/ForgotPassword";

import CheckoutPage from "@/pages/checkout/CheckoutPage";
import UserPlanPage from "@/pages/user/UserPlanPage";

const router = createBrowserRouter([
  {
    path: "/policy",
    element: <PolicyPage />,
  },
  {
    path: "/faq",
    element: <FAQPage />,
  },
  {
    path: `${ROUTE_PATH.WELCOME_PAGE}`,
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <WelcomePage />
      </Suspense>
    ),
    errorElement: <NotFound />,
  },
  {
    path: `${ROUTE_PATH.AUTH_PAGE}`,
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: `${ROUTE_PATH.MANAGE_PAGE}`,
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <ManageLayout />
      </Suspense>
    ),
    children: [{ index: true, element: <ManagePage /> }],
  },
  {
    path: `${ROUTE_PATH.USER_VERIFY_PAGE}`,
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Authenticated />
      </Suspense>
    ),
  },
  {
    path: `${ROUTE_PATH.USER_LAYOUT}`,
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <UserLayout />
      </Suspense>
    ),
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "/plan",
    element: <UserPlanPage />,
  },
  {
    path: `${ROUTE_PATH.FORGOT_PASSWORD}`,
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <ForgotPassword />
      </Suspense>
    )
  },
]);

export default function MainRoutes() {
  return <RouterProvider router={router} />;
}
