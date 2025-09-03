import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import NotFound from "../pages/not-found/not-found";
import LoadingSpinner from "../components/loading/loading";

import WelcomePage from "../pages/not-found/welcome-page/welcome-page";
import Login from "../pages/login/login";

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
