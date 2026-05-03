import "./assets/estilos/App.css";
import { Routes, Route, Outlet } from "react-router-dom";
import Header from "./assets/componentes/Header/Header.tsx";
import Inicio from "./assets/paginas/Inicio/Inicio.tsx";
import Ofertas from "./assets/paginas/Ofertas/Ofertas.tsx";
import Acerca from "./assets/paginas/Acerca/Acerca.tsx";
import Error404 from "./assets/paginas/Error404/Error404.tsx";
import GameDetalles from "./assets/paginas/GameDetalles/GameDetalles.tsx";
import WishList from "./assets/paginas/WishList.jsx";
import ProtectedRoute from "./assets/util/ProtectedRoute.tsx";
import Login from "./assets/paginas/Login/Login.tsx";
import Footer from "./assets/componentes/Footer/Footer.tsx";
import Privacidad from "./assets/paginas/Privacidad/Privacidad.tsx";

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
            <Route path="/ofertas" element={<Ofertas/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Inicio/>} />
            <Route path="/acerca" element={<Acerca />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="cuenta" element={<ProtectedRoute>""</ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><WishList /></ProtectedRoute>} />
            <Route path="/juego/:id" element={<GameDetalles />} />
          </Route>
          <Route path="*" element={<Error404 />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
