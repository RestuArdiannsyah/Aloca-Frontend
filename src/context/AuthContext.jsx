import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const AuthContext = createContext(null);
const API_URL = "http://localhost:3000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cek token & data user di lokal saat aplikasi pertama kali dimuat
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("aloca_token");
      const savedUser  = localStorage.getItem("aloca_user");

      if (savedToken && savedUser) {
        // Jika JSON korup, blok catch akan membersihkan storage secara otomatis
        const parsed = JSON.parse(savedUser);

        // Validasi minimal: hasil parse harus berupa objek, bukan null/array/primitive
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          setUser({ ...parsed, name: parsed.name || parsed.username || "" });
        } else {
          throw new Error("Data user tidak valid");
        }
      }
    } catch {
      // Data korup di localStorage — bersihkan agar tidak memblokir app
      localStorage.removeItem("aloca_token");
      localStorage.removeItem("aloca_user");
      setUser(null);
    } finally {
      // Selalu set loading false, bahkan jika terjadi error
      setLoading(false);
    }
  }, []);

 // Fungsi login otomatis handle /auth/login atau /login + aman membaca token
  const login = async (email, password) => {
    try {
      let response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 404) {
        response = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Email atau password salah.");
      }

      const token = result.data?.token || result.token || result.accessToken;
      const rawUser = result.data?.user || result.user || result.data;

      if (!token) {
        throw new Error("Token tidak ditemukan dalam respon backend.");
      }

      // Normalisasi: backend menyimpan field 'username', sedangkan
      // komponen UI membaca 'name'. Tambahkan alias agar keduanya tersedia.
      const userData = {
        ...rawUser,
        name: rawUser.name || rawUser.username,
      };

      localStorage.setItem("aloca_token", token);
      localStorage.setItem("aloca_user", JSON.stringify(userData));
      
      setUser(userData);
      toast.success("Login Berhasil! Selamat datang.");
      return true;
    } catch (error) {
      toast.error(error.message || "Terjadi kesalahan saat login");
      return false;
    }
  };


  // Fungsi register otomatis handle /auth/register atau /register
  const register = async (username, email, password) => {
    try {
      // Coba jalur pertama (/auth/register)
      let response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      // Jika 404, otomatis coba jalur kedua (/register)
      if (response.status === 404) {
        response = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registrasi gagal.");
      }

      toast.success("Akun berhasil dibuat! Silakan login.");
      return true;
    } catch (error) {
      toast.error(error.message || "Terjadi kesalahan saat registrasi.");
      return false;
    }
  };

  // Fungsi logout bersihkan storage
  const logout = () => {
    localStorage.removeItem("aloca_token");
    localStorage.removeItem("aloca_user");
    setUser(null);
    toast.success("Berhasil logout");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);