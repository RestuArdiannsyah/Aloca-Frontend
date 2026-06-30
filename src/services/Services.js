const API_URL = "https://aloca-backend-production.up.railway.app/api";

// Helper: request JSON dengan JWT otomatis
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem("aloca_token");

  const headers = { ...options.headers };
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Terjadi kesalahan pada server");
  }
  return result;
};

export const ApiService = {
  // ── KANTONG ──────────────────────────────────────────────────────────────
  getSemuaKantong: () =>
    fetchWithAuth("/kantong"),

  buatKantong: (data) =>
    fetchWithAuth("/kantong", { method: "POST", body: JSON.stringify(data) }),

  editKantong: (id, data) =>
    fetchWithAuth(`/kantong/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  hapusKantong: (id) =>
    fetchWithAuth(`/kantong/${id}`, { method: "DELETE" }),

  // ── TRANSAKSI ─────────────────────────────────────────────────────────────
  // Riwayat log: query params opsional { kantong_id, tipe, limit, offset }
  getRiwayatTransaksi: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchWithAuth(`/transaksi${qs ? `?${qs}` : ""}`);
  },

  tambahPemasukan: (data) =>
    fetchWithAuth("/transaksi/pemasukan", { method: "POST", body: JSON.stringify(data) }),

  tambahPengeluaran: (data) =>
    fetchWithAuth("/transaksi/pengeluaran", { method: "POST", body: JSON.stringify(data) }),

  pindahSaldo: (data) =>
    fetchWithAuth("/transaksi/pindah-saldo", { method: "POST", body: JSON.stringify(data) }),

  // ── KATEGORI (admin only) ─────────────────────────────────────────────────
  getKategoriPemasukan: () =>
    fetchWithAuth("/kategori/pemasukan"),

  buatKategoriPemasukan: (formData) =>
    fetchWithAuth("/kategori/pemasukan", { method: "POST", body: formData }),

  hapusKategoriPemasukan: (id) =>
    fetchWithAuth(`/kategori/pemasukan/${id}`, { method: "DELETE" }),

  getKategoriPengeluaran: () =>
    fetchWithAuth("/kategori/pengeluaran"),

  buatKategoriPengeluaran: (formData) =>
    fetchWithAuth("/kategori/pengeluaran", { method: "POST", body: formData }),

  hapusKategoriPengeluaran: (id) =>
    fetchWithAuth(`/kategori/pengeluaran/${id}`, { method: "DELETE" }),

  // ── ADMIN ─────────────────────────────────────────────────────────────────
  getAdminStats: () =>
    fetchWithAuth("/admin/stats"),
};
