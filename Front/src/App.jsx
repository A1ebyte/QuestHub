import { useEffect, useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import "./assets/estilos/App.css";
import Header from "./assets/componentes/Header/Header.tsx";
import Inicio from "./assets/paginas/Inicio/Inicio";
import Ofertas from "./assets/paginas/Ofertas/Ofertas";
import Acerca from "./assets/paginas/Acerca/Acerca";
import Error404 from "./assets/paginas/Error404/Error404";
import Admin from "./assets/paginas/Admin";
import GameDetalles from "./assets/paginas/GameDetalles/GameDetalles";
import WishList from "./assets/paginas/WishList";
import ProtectedRoute from "./assets/componentes/ProtectedRoute";
import Login from "./assets/paginas/Login";
import Footer from "./assets/componentes/Footer/Footer.tsx";
import Privacidad from "./assets/paginas/Privacidad/Privacidad";
import { DEFAULT_DIRECTION, DEFAULT_SORT_BY } from "./assets/const/sort";

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
          {/* falta ruta para detallesjuego*/}
          <Route element={<Layout />}>
            <Route path="/ofertas" element={<Ofertas/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Inicio/>} />
            <Route path="/acerca" element={<Acerca />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="perfil" element={<ProtectedRoute></ProtectedRoute>} />
{/*             <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Admin
                    videojuegos={videojuegos}
                    setVideojuegos={setVideojuegos}
                    generos={generos}
                    setGeneros={setGeneros}
                    plataformas={plataformas}
                    setPlataformas={setPlataformas}
                  />
                </ProtectedRoute>
              }
            /> */}
            <Route path="/wishlist" element={<WishList />} />{" "}
            {/* Modificar esto luego con protexted en un futuro */}
            <Route path="/juego/:id" element={<GameDetalles />} />
          </Route>
          <Route path="*" element={<Error404 />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
