import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PageLoader } from "./ui/LoadingSpinner";

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Tunggu hingga AuthContext selesai cek localStorage
  // sebelum memutuskan redirect — mencegah flash ke /login saat refresh
  if (loading) return <PageLoader />;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
