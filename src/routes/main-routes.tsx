import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import NotFound from "../pages/not-found/NotFound";
import LoadingSpinner from "../components/loading/Loading";

import WelcomePage from "../pages/not-found/welcome-page/WelcomePage";
import Login from "../pages/login/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <WelcomePage />
      </Suspense>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Login />
      </Suspense>
    ),
  },
]);

export default function MainRoutes() {
  return <RouterProvider router={router} />;
}
