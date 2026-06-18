import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

import { AppLayout, AuthLayout, AdminLayout } from "./components/layouts/AppLayout";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import BerandaPage from "./pages/user/BerandaPage";
import TransaksiPage from "./pages/user/TransaksiPage";
import KantongPage from "./pages/user/KantongPage";
import ProfilPage from "./pages/user/ProfilPage";

import AdminPage from "./pages/admin/AdminPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<AppLayout />}>
            <Route path="/beranda" element={<BerandaPage />} />
            <Route path="/transaksi" element={<TransaksiPage />} />
            <Route path="/kantong" element={<KantongPage />} />
            <Route path="/profil" element={<ProfilPage />} />
          </Route>

          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster />
    </AuthProvider>
  );
}