import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import NuevaReceta from "./pages/NuevaReceta";
import Pokemon from "./pages/Pokemon";
function App() {
  return (
    <>
      <Router>
        {/* Aquí es donde vive el menú para que se vea siempre */}
        <Menu />

        <main>
          <Routes>
            <Route path="/pokemon" element={<Pokemon></Pokemon>}></Route>
          </Routes>
        </main>

        <Footer></Footer>
      </Router>
    </>
  );
}

export default App;
