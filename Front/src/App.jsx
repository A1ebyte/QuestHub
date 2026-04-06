import { useEffect, useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import "./assets/estilos/App.css";
import Header from "./assets/componentes/Header";
import Inicio from "./assets/paginas/Inicio";
import ServicioVideojuegos from "./assets/servicios/Axios/ServicioVideojuegos";
import ServicioGeneros from "./assets/servicios/Axios/ServicioGeneros";
import ServicioPlataformas from "./assets/servicios/Axios/ServicioPlataformas";
import Juegos from "./assets/paginas/Juegos";
import Autor from "./assets/paginas/Autor";
import Error404 from "./assets/paginas/Error404";
import Admin from "./assets/paginas/Admin";
import GameDetalles from "./assets/paginas/GameDetalles"
import WishList from "./assets/paginas/WishList";
import ProtectedRoute from "./assets/componentes/ProtectedRoute";
import Login from "./assets/paginas/Login";
import Footer from "./assets/componentes/Footer";
import Privacidad from "./assets/paginas/Privacidad";
import ServicioOfertas from "./assets/servicios/Axios/ServicioOfertas";



function App() {
  const [videojuegos, setVideojuegos] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  const [ofertas,setOfertas] = useState([]);
  useEffect(() => {
    ServicioOfertas.getAll()
  .then(response => {
    
    setOfertas(response.data.content);
    console.log(response.data)
  })
  .catch(e => {
    console.log(e);
  });  
  
    ServicioVideojuegos.getAll().then((res) => setVideojuegos(res.data)).catch((error) => {alert(error);});
      ServicioGeneros.getAll().then((res) => setGeneros(res.data)).catch((error) => {alert(error);});
      ServicioPlataformas.getAll().then((res) => setPlataformas(res.data)).catch((error) => {alert(error);});
    }, []);

  const Layout = () => {
    return (
      <>
        <Header/>
        <Outlet />
        <Footer/>
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
            <Route path="/juegos" element={<Juegos juegos={videojuegos} generos={generos} plataformas={plataformas}/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Inicio videojuegos={ofertas} />} />
            <Route path="/contacto" element={<Autor />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="perfil" element={<ProtectedRoute></ProtectedRoute>}/>
            <Route path="/admin"
              element={
              <ProtectedRoute requireAdmin={true}>
                <Admin videojuegos={videojuegos} setVideojuegos={setVideojuegos} generos={generos} 
                setGeneros={setGeneros} plataformas={plataformas} setPlataformas={setPlataformas}/>
              </ProtectedRoute>}/>
            <Route path="/wishlist" element={<WishList/>} /> {/* Modificar esto luego con protexted en un futuro */}
            <Route path="/juego/:id" element={< GameDetalles/>} />
          </Route>
          <Route path="*" element={<Error404 />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
