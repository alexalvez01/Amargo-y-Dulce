import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <h1 className="text-center mt-20 font-brand text-[#6B4C3A]">Cargando...</h1>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (user?.rol !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;