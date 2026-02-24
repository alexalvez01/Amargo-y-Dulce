import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  // Nos traemos el estado de si está logueado y si está cargando la validación
  const { isAuthenticated, loading } = useAuth();

  // Si React todavía está yendo al backend a preguntar si el token es válido, mostramos algo temporal
  if (loading) return <h1 className="text-center mt-20 font-brand text-[#6B4C3A]">Cargando...</h1>;

  // Si terminó de cargar y NO está autenticado, lo pateamos al Home ("/")
  if (!loading && !isAuthenticated) return <Navigate to="/" replace />;

  // Si está autenticado, lo dejamos renderizar la página a la que quería ir
  return <Outlet />;
};

export default ProtectedRoute;