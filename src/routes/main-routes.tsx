import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import NotFound from "../pages/not-found/not-found";

import WelcomePage from "../pages/not-found/welcome-page/welcome-page";
import Login from "../pages/login/login";
import LoadingSpinner from "@/components/loading/Loading";
import ManagePage from "@/pages/manage/manage-page";
import ROUTE_PATH from "@/types/route-type";
import ManageLayout from "@/layouts/manager-layout/manage-layout";
import UserLayout from "@/layouts/user-layout/user-layout";
import Authenticated from "@/pages/authenticated";
import CheckoutPage from "@/pages/checkout/CheckoutPage";

const router = createBrowserRouter([
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
]);

export default function MainRoutes() {
  return <RouterProvider router={router} />;
}
