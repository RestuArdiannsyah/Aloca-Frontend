import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

import { AppLayout, AuthLayout, AdminLayout } from "./components/layouts/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

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
          {/* Rute publik: redirect ke /beranda kalau sudah login */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Rute terproteksi: tendang ke /login kalau belum login */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/beranda" element={<BerandaPage />} />
              <Route path="/transaksi" element={<TransaksiPage />} />
              <Route path="/kantong" element={<KantongPage />} />
              <Route path="/profil" element={<ProfilPage />} />
            </Route>
          </Route>

          {/* Rute admin: proteksi role ada di dalam AdminLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>

          {/* Redirect default: '/' → '/beranda' */}
          <Route path="/" element={<Navigate to="/beranda" replace />} />

          {/* Catch-all 404 */}
          <Route path="*" element={<Navigate to="/beranda" replace />} />
        </Routes>

        <Toaster position="top-center" />
      </BrowserRouter>
    </AuthProvider>
  );
}
