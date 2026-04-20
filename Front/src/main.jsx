import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { WishlistProvider } from "./assets/context/WishlistContext.js";
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
            autoClose={3500} // dura 3.5 segundos
            hideProgressBar // sin barra
            newestOnTop // los nuevos arriba
            closeOnClick // clic para cerrar si quieres
            pauseOnHover // pausa si pasas el mouse
            draggable
            theme="dark"
            toastClassName="toast" // nuestro CSS
            bodyClassName="toast-body"
            limit={5} // máximo de toasts visibles
          />
          <App />
        </WishlistProvider>
      </AuthProvider>
    </StrictMode>
  </BrowserRouter>,
);
