import "./assets/estilosGenerales/App.css";
import { Routes, Route, Outlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Header from "./assets/componentes/Header/Header";
import Inicio from "./assets/paginas/Inicio/Inicio";
import Ofertas from "./assets/paginas/Ofertas/Ofertas";
import Acerca from "./assets/paginas/Acerca/Acerca";
import Error404 from "./assets/paginas/Error404/Error404";
import GameDetalles from "./assets/paginas/GameDetalles/GameDetalles";
import WishList from "./assets/paginas/WishList/WishList.jsx";
import ProtectedRoute from "./assets/util/ProtectedRoute";
import Login from "./assets/paginas/Login/Login";
import Footer from "./assets/componentes/Footer/Footer";
import Privacidad from "./assets/paginas/Privacidad/Privacidad";
import Cuenta from "./assets/paginas/Cuenta/Cuenta";

function App() {

  const Layout = () => {
    return (
      <>
        <Header />
        <Outlet />
        <Footer />
      </>
    );
  };

  return (
    <>
      <div className="fondo">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/ofertas" element={<Ofertas />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Inicio />} />
            <Route path="/acerca" element={<Acerca />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route
              path="cuenta"
              element={
                <ProtectedRoute>
                  <Cuenta />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <WishList />
                </ProtectedRoute>
              }
            />
            <Route path="/juego/:id" element={<GameDetalles />} />
          </Route>
          <Route path="*" element={<Error404 />} />
        </Routes>
      </div>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
