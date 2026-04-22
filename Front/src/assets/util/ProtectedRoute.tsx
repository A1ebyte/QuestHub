import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Componente de ruta protegida que envuelve contenido que requiere autenticación
// Recibe 'children' como prop - estos serán los componentes/rutas a proteger

const ProtectedRoute = ({ children}:{ children:any}) => {
  // Extraer el usuario actual y estado de carga del contexto de autenticación
  const { user, loading } = useAuth();
  // Estado de carga: mostrar indicador mientras se verifica la autenticación
  if (loading) {
    // UI de carga temporal mientras se determina el estado de autenticación
    return <div>Cargando...</div>;
  }

  // Si no hay usuario autenticado (y ya terminó la carga), redirigir al login
  if (!user) {    
    return <Navigate to="/login" replace />;    
  }

  // Si hay usuario autenticado, renderizar los children (contenido protegido)
  return children;
};

export default ProtectedRoute;

