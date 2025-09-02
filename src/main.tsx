import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import MainRoutes from "./routes/main-routes";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <MainRoutes />
    </Provider>
  </StrictMode>
);
