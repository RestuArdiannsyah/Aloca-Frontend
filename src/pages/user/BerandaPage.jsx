// import { useQuery } from '@tanstack/react-query';
// import { getDashboard } from '../../api/dashboard';
import { useState, useEffect, useCallback } from "react";
import { Card, CardBody } from "../../components/ui/Card";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { formatRupiah } from "../../utils/format";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ChevronRight,
  Target,
  ArrowLeftRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../../services/Services";
import toast from "react-hot-toast";

const TransaksiItem = ({ t }) => {
  const isPemasukan = t.tipe === "pemasukan";
  const isTransfer = t.tipe === "pindah_saldo";
  const label = isPemasukan
    ? t.kategori_pemasukan || "Pemasukan"
    : isTransfer
      ? `Transfer → ${t.kantong_tujuan_nama || "Kantong Tujuan"}`
      : t.kategori_pengeluaran || "Pengeluaran";

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
        isPemasukan ? "bg-green-50" : isTransfer ? "bg-blue-50" : "bg-red-50"
      }`}>
        {isPemasukan ? "💰" : isTransfer ? "↔️" : "💸"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5 truncate">
          {t.kantong_nama} · {t.tanggal}
        </p>
      </div>
      <span className={`text-sm font-semibold flex-shrink-0 ${
        isPemasukan ? "text-green-600" : isTransfer ? "text-blue-600" : "text-red-500"
      }`}>
        {isPemasukan ? "+" : "-"}{formatRupiah(t.jumlah)}
      </span>
    </div>
  );
};

export const BerandaPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [kantong, setKantong]             = useState([]);
  const [transaksiTerbaru, setTransaksi]  = useState([]);
  const [isLoading, setIsLoading]         = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [kantongRes, txRes] = await Promise.all([
        ApiService.getSemuaKantong(),
        ApiService.getRiwayatTransaksi({ limit: 6 }),
      ]);
      setKantong(kantongRes.data || []);
      setTransaksi(txRes.data || []);
    } catch (err) {
      toast.error(err.message || "Gagal memuat data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Hitung total saldo, pemasukan, pengeluaran dari data yang ada
  const totalSaldo       = kantong.reduce((sum, k) => sum + parseFloat(k.saldo || 0), 0);
  const totalPemasukan   = transaksiTerbaru
    .filter((t) => t.tipe === "pemasukan")
    .reduce((sum, t) => sum + parseFloat(t.jumlah || 0), 0);
  const totalPengeluaran = transaksiTerbaru
    .filter((t) => t.tipe === "pengeluaran")
    .reduce((sum, t) => sum + parseFloat(t.jumlah || 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 space-y-6 lg:pt-0 lg:px-0">
      {/* ── Mobile greeting (hidden on desktop — header handles it) ── */}
      <div className="flex items-center justify-between lg:hidden">
        <div>
          <p className="text-sm text-gray-500">
            Hai, {user?.name?.split(" ")[0]} 👋
          </p>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#00C2A8]/10 flex items-center justify-center">
          <span className="text-lg">👝</span>
        </div>
      </div>

      {/* ── Stats cards ── */}
      {/* Mobile: saldo card + 2 stats */}
      {/* Desktop: 4 equal cards in a row */}

      {/* Desktop stat grid */}
      <div className="hidden grid-cols-4 gap-4 lg:grid">
        {/* Total Saldo */}
        <div className="col-span-1 relative bg-gradient-to-br from-[#00C2A8] to-[#009F8A] rounded-2xl p-5 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 translate-x-6 -translate-y-6 rounded-full bg-white/10" />
          <div className="relative">
            <p className="mb-1 text-xs text-white/80">Total Saldo</p>
            <p className="text-xl font-bold text-white">
              {formatRupiah(totalSaldo)}
            </p>
            <p className="text-white/60 text-[10px] mt-1">
              {kantong.length} kantong
            </p>
          </div>
        </div>

        {/* Pemasukan */}
        <Card>
          <CardBody className="flex items-center gap-3">
            <div className="flex items-center justify-center flex-shrink-0 w-11 h-11 rounded-xl bg-green-50">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400">Pemasukan</p>
              <p className="text-base font-bold text-gray-900 truncate">
                {formatRupiah(totalPemasukan)}
              </p>
              <p className="text-[10px] text-gray-400">Bulan ini</p>
            </div>
          </CardBody>
        </Card>

        {/* Pengeluaran */}
        <Card>
          <CardBody className="flex items-center gap-3">
            <div className="flex items-center justify-center flex-shrink-0 w-11 h-11 rounded-xl bg-red-50">
              <TrendingDown size={20} className="text-red-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400">Pengeluaran</p>
              <p className="text-base font-bold text-gray-900 truncate">
                {formatRupiah(totalPengeluaran)}
              </p>
              <p className="text-[10px] text-gray-400">Bulan ini</p>
            </div>
          </CardBody>
        </Card>

        {/* Jumlah Kantong */}
        <Card>
          <CardBody className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#00C2A8]/10 flex items-center justify-center flex-shrink-0">
              <Wallet size={20} className="text-[#00C2A8]" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Kantong Aktif</p>
              <p className="text-2xl font-bold text-gray-900">
                {kantong.length}
              </p>
              <p className="text-[10px] text-gray-400">kantong</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Mobile: saldo hero */}
      <div className="lg:hidden relative bg-gradient-to-br from-[#00C2A8] to-[#009F8A] rounded-2xl p-5 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 translate-x-8 -translate-y-8 rounded-full bg-white/10" />
        <div className="absolute bottom-0 left-0 w-20 h-20 -translate-x-4 translate-y-6 rounded-full bg-white/5" />
        <div className="relative">
          <p className="mb-1 text-sm text-white/80">Total Saldo</p>
          <p className="text-2xl font-bold text-white">
            {formatRupiah(totalSaldo)}
          </p>
          <p className="mt-1 text-xs text-white/60">
            {kantong.length} kantong aktif
          </p>
        </div>
      </div>

      {/* Mobile: stats */}
      <div className="grid grid-cols-2 gap-3 lg:hidden">
        <Card>
          <CardBody className="flex items-center gap-3">
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-xl bg-green-50">
              <TrendingUp size={18} className="text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Pemasukan</p>
              <p className="text-sm font-bold text-gray-900 truncate">
                {formatRupiah(totalPemasukan)}
              </p>
              <p className="text-[10px] text-gray-400">Bulan ini</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-3">
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-xl bg-red-50">
              <TrendingDown size={18} className="text-red-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Pengeluaran</p>
              <p className="text-sm font-bold text-gray-900 truncate">
                {formatRupiah(totalPengeluaran)}
              </p>
              <p className="text-[10px] text-gray-400">Bulan ini</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* ── Middle section: Kantong ── */}
      {/* Desktop: grid + transactions side by side */}
      <div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
        {/* Kantong list */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Kantong</h2>
            <button
              onClick={() => navigate("/kantong")}
              className="text-xs text-[#00C2A8] font-medium flex items-center gap-1"
            >
              Lihat semua <ChevronRight size={14} />
            </button>
          </div>

          {kantong.length === 0 ? (
            <Card>
              <CardBody className="py-8 text-center">
                <Wallet size={32} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm text-gray-400">Belum ada kantong</p>
                <button
                  onClick={() => navigate("/kantong")}
                  className="mt-2 text-[#00C2A8] text-sm font-medium"
                >
                  Buat kantong pertama
                </button>
              </CardBody>
            </Card>
          ) : (
            <>
              {/* Mobile: horizontal scroll */}
              <div className="flex gap-3 px-4 pb-1 -mx-4 overflow-x-auto lg:hidden">
                {kantong.slice(0, 5).map((k) => (
                  <Card
                    key={k.id}
                    className="flex-shrink-0 w-40"
                    onClick={() => navigate("/kantong")}
                  >
                    <CardBody>
                      <div className="w-8 h-8 rounded-lg bg-[#00C2A8]/10 flex items-center justify-center mb-3">
                        <Wallet size={16} className="text-[#00C2A8]" />
                      </div>
                      <p className="text-xs text-gray-500 truncate">{k.nama}</p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">
                        {formatRupiah(k.saldo)}
                      </p>
                      {k.goal && (
                        <div className="mt-2">
                          <div className="w-full h-1 bg-gray-100 rounded-full">
                            <div
                              className="h-full bg-[#00C2A8] rounded-full"
                              style={{
                                width: `${Math.min((k.saldo / k.goal) * 100, 100)}%`,
                              }}
                            />
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1">
                            {Math.round((k.saldo / k.goal) * 100)}% dari{" "}
                            {formatRupiah(k.goal)}
                          </p>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </div>

              {/* Desktop: grid */}
              <div className="hidden grid-cols-2 gap-3 lg:grid xl:grid-cols-3">
                {kantong.map((k) => (
                  <Card
                    key={k.id}
                    onClick={() => navigate("/kantong")}
                    className="hover:border-[#00C2A8]/30"
                  >
                    <CardBody>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl bg-[#00C2A8]/10 flex items-center justify-center">
                          <Wallet size={18} className="text-[#00C2A8]" />
                        </div>
                        {k.goal && (
                          <span className="text-[10px] font-medium text-[#00C2A8] bg-[#00C2A8]/10 px-2 py-0.5 rounded-full">
                            {Math.round((k.saldo / k.goal) * 100)}%
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{k.nama}</p>
                      <p className="text-base font-bold text-gray-900 mt-0.5">
                        {formatRupiah(k.saldo)}
                      </p>
                      {k.goal && (
                        <div className="mt-2.5">
                          <div className="w-full h-1.5 bg-gray-100 rounded-full">
                            <div
                              className="h-full bg-[#00C2A8] rounded-full"
                              style={{
                                width: `${Math.min((k.saldo / k.goal) * 100, 100)}%`,
                              }}
                            />
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1">
                            <Target size={9} />
                            Target {formatRupiah(k.goal)}
                          </p>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Quick actions — desktop only sidebar-like */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Aksi Cepat</h2>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => navigate("/transaksi")}
              className="flex items-center gap-3 p-3 text-left transition-colors border border-green-100 bg-green-50 rounded-xl hover:bg-green-100"
            >
              <div className="flex items-center justify-center flex-shrink-0 bg-green-500 rounded-full w-9 h-9">
                <TrendingUp size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">
                  Tambah Pemasukan
                </p>
                <p className="text-xs text-green-600">Catat uang masuk</p>
              </div>
            </button>
            <button
              onClick={() => navigate("/transaksi")}
              className="flex items-center gap-3 p-3 text-left transition-colors border border-red-100 bg-red-50 rounded-xl hover:bg-red-100"
            >
              <div className="flex items-center justify-center flex-shrink-0 bg-red-500 rounded-full w-9 h-9">
                <TrendingDown size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-800">
                  Catat Pengeluaran
                </p>
                <p className="text-xs text-red-600">Kurangi saldo kantong</p>
              </div>
            </button>
            <button
              onClick={() => navigate("/transaksi")}
              className="flex items-center gap-3 p-3 text-left transition-colors border border-blue-100 bg-blue-50 rounded-xl hover:bg-blue-100"
            >
              <div className="flex items-center justify-center flex-shrink-0 bg-blue-500 rounded-full w-9 h-9">
                <ArrowLeftRight size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Transfer Saldo
                </p>
                <p className="text-xs text-blue-600">Pindah antar kantong</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ── Transaksi Terbaru ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Transaksi Terbaru</h2>
          <button
            onClick={() => navigate("/transaksi")}
            className="text-xs text-[#00C2A8] font-medium flex items-center gap-1"
          >
            Lihat semua <ChevronRight size={14} />
          </button>
        </div>
        <Card>
          <CardBody className="py-2">
            {transaksiTerbaru.length === 0 ? (
              <p className="py-6 text-sm text-center text-gray-400">
                Belum ada transaksi
              </p>
            ) : (
              <div className="lg:grid lg:grid-cols-2 lg:divide-x lg:divide-gray-50">
                <div className={transaksiTerbaru.length > 3 ? "lg:pr-4" : ""}>
                  {transaksiTerbaru
                    .slice(0, Math.ceil(transaksiTerbaru.length / 2))
                    .map((t) => (
                      <TransaksiItem key={t.id} t={t} />
                    ))}
                </div>
                {transaksiTerbaru.length > 1 && (
                  <div className="hidden lg:pl-4 lg:block">
                    {transaksiTerbaru
                      .slice(Math.ceil(transaksiTerbaru.length / 2))
                      .map((t) => (
                        <TransaksiItem key={t.id} t={t} />
                      ))}
                  </div>
                )}
                <div className="lg:hidden">
                  {transaksiTerbaru
                    .slice(Math.ceil(transaksiTerbaru.length / 2))
                    .map((t) => (
                      <TransaksiItem key={t.id} t={t} />
                    ))}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default BerandaPage;
