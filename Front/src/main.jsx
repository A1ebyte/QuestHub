import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { WishlistProvider } from "./assets/context/WishlistContext.jsx";
import { AuthProvider } from "./assets/context/AuthContext.jsx";
import ScrollToTop from "./assets/toolkit/ScroolTop.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./assets/estilos/index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <ScrollToTop />
      <AuthProvider>
        <WishlistProvider>
          {/* El ToastContainer aqui o no sirvee esta mierda coño */}
          <ToastContainer
            position="top-right"
            autoClose={4000}
            newestOnTop
            hideProgressBar
            closeOnClick
            pauseOnHover
            draggable
            theme="dark"
            toastClassName="toast-gamer"
            bodyClassName="toast-gamer-body"
            closeButton={false}
            limit={3}
          />
          <App />
        </WishlistProvider>
      </AuthProvider>
    </StrictMode>
  </BrowserRouter>,
);
