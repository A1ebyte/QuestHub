import { useEffect, useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import "./assets/estilos/App.css";
import Header from "./assets/componentes/Header";
import Inicio from "./assets/paginas/Inicio";
import Ofertas from "./assets/paginas/Ofertas";
import Autor from "./assets/paginas/Autor";
import Error404 from "./assets/paginas/Error404";
import Admin from "./assets/paginas/Admin";
import GameDetalles from "./assets/paginas/GameDetalles";
import WishList from "./assets/paginas/WishList";
import ProtectedRoute from "./assets/componentes/ProtectedRoute";
import Login from "./assets/paginas/Login";
import Footer from "./assets/componentes/Footer";
import Privacidad from "./assets/paginas/Privacidad";

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
        {/* Crear otro elemento buscador o dentro del header??? elegir luego*/}
        <Routes>
          {/* falta ruta para detallesjuegos,footer */}
          <Route element={<Layout />}>
            <Route path="/ofertas" element={<Ofertas/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Inicio/>} />
            <Route path="/contacto" element={<Autor />} />
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
