import { useState, useEffect, useCallback } from "react";
import { Card, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input, Select } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { Badge } from "../../components/ui/Badge";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { formatRupiah } from "../../utils/format";
import { TrendingUp, TrendingDown, ArrowLeftRight } from "lucide-react";
import toast from "react-hot-toast";
import { ApiService } from "../../services/Services";

// ── Helpers ───────────────────────────────────────────────────────────────────
const tipeMap = {
  pemasukan:    { label: "Pemasukan",   variant: "success", color: "text-green-600", sign: "+" },
  pengeluaran:  { label: "Pengeluaran", variant: "danger",  color: "text-red-500",   sign: "-" },
  pindah_saldo: { label: "Transfer",    variant: "info",    color: "text-blue-600",  sign: "-" },
};

const today = () => new Date().toISOString().split("T")[0];

// Fungsi Helper Pengelompokan Berdasarkan Bulan & Tahun
const groupByMonth = (dataTransaksi) => {
  return dataTransaksi.reduce((groups, transaksi) => {
    if (!transaksi.tanggal) return groups;
    const date = new Date(transaksi.tanggal);
    const monthYear = date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
    
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(transaksi);
    return groups;
  }, {});
};

// ── Form Pemasukan ────────────────────────────────────────────────────────────
const PemasukanForm = ({ kantong, kategori, onSubmit, loading }) => {
  const [form, setForm] = useState({
    kantong_id: "",
    kategori_pemasukan_id: "",
    jumlah: "",
    catatan: "",
    tanggal: today(),
  });
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.kantong_id || !form.kategori_pemasukan_id || !form.jumlah) {
      toast.error("Kantong, kategori, dan nominal wajib diisi");
      return;
    }
    onSubmit({ ...form, jumlah: parseFloat(form.jumlah) });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Nominal *" name="jumlah" type="number" placeholder="0"
        prefix="Rp" value={form.jumlah} onChange={handle} min="1" />
      <Select label="Kantong *" name="kantong_id" value={form.kantong_id} onChange={handle}>
        <option value="">Pilih kantong</option>
        {kantong.map((k) => (
          <option key={k.id} value={k.id}>{k.nama} ({formatRupiah(k.saldo)})</option>
        ))}
      </Select>
      <Select label="Kategori *" name="kategori_pemasukan_id" value={form.kategori_pemasukan_id} onChange={handle}>
        <option value="">Pilih kategori</option>
        {kategori.map((k) => (
          <option key={k.id} value={k.id}>{k.nama}</option>
        ))}
      </Select>
      <Input label="Tanggal *" name="tanggal" type="date" value={form.tanggal} onChange={handle} />
      <Input label="Catatan (opsional)" name="catatan" placeholder="Keterangan transaksi"
        value={form.catatan} onChange={handle} />
      <Button type="submit" size="full" loading={loading}>Tambah Pemasukan</Button>
    </form>
  );
};

// ── Form Pengeluaran ──────────────────────────────────────────────────────────
const PengeluaranForm = ({ kantong, kategori, onSubmit, loading }) => {
  const [form, setForm] = useState({
    kantong_id: "",
    kategori_pengeluaran_id: "",
    jumlah: "",
    catatan: "",
    tanggal: today(),
  });
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.kantong_id || !form.kategori_pengeluaran_id || !form.jumlah) {
      toast.error("Kantong, kategori, dan nominal wajib diisi");
      return;
    }
    onSubmit({ ...form, jumlah: parseFloat(form.jumlah) });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Nominal *" name="jumlah" type="number" placeholder="0"
        prefix="Rp" value={form.jumlah} onChange={handle} min="1" />
      <Select label="Kantong *" name="kantong_id" value={form.kantong_id} onChange={handle}>
        <option value="">Pilih kantong</option>
        {kantong.map((k) => (
          <option key={k.id} value={k.id}>{k.nama} ({formatRupiah(k.saldo)})</option>
        ))}
      </Select>
      <Select label="Kategori *" name="kategori_pengeluaran_id" value={form.kategori_pengeluaran_id} onChange={handle}>
        <option value="">Pilih kategori</option>
        {kategori.map((k) => (
          <option key={k.id} value={k.id}>{k.nama}</option>
        ))}
      </Select>
      <Input label="Tanggal *" name="tanggal" type="date" value={form.tanggal} onChange={handle} />
      <Input label="Catatan (opsional)" name="catatan" placeholder="Keterangan transaksi"
        value={form.catatan} onChange={handle} />
      <Button type="submit" size="full" loading={loading}>Catat Pengeluaran</Button>
    </form>
  );
};

// ── Form Pindah Saldo ─────────────────────────────────────────────────────────
const TransferForm = ({ kantong, onSubmit, loading }) => {
  const [form, setForm] = useState({
    kantong_asal_id: "",
    kantong_tujuan_id: "",
    jumlah: "",
    catatan: "",
    tanggal: today(),
  });
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.kantong_asal_id || !form.kantong_tujuan_id || !form.jumlah) {
      toast.error("Semua field wajib diisi");
      return;
    }
    if (form.kantong_asal_id === form.kantong_tujuan_id) {
      toast.error("Kantong asal dan tujuan tidak boleh sama");
      return;
    }
    onSubmit({ ...form, jumlah: parseFloat(form.jumlah) });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Nominal *" name="jumlah" type="number" placeholder="0"
        prefix="Rp" value={form.jumlah} onChange={handle} min="1" />
      <Select label="Dari Kantong *" name="kantong_asal_id" value={form.kantong_asal_id} onChange={handle}>
        <option value="">Pilih kantong asal</option>
        {kantong.map((k) => (
          <option key={k.id} value={k.id}>{k.nama} ({formatRupiah(k.saldo)})</option>
        ))}
      </Select>
      <Select label="Ke Kantong *" name="kantong_tujuan_id" value={form.kantong_tujuan_id} onChange={handle}>
        <option value="">Pilih kantong tujuan</option>
        {kantong
          .filter((k) => k.id !== parseInt(form.kantong_asal_id))
          .map((k) => (
            <option key={k.id} value={k.id}>{k.nama} ({formatRupiah(k.saldo)})</option>
          ))}
      </Select>
      <Input label="Tanggal *" name="tanggal" type="date" value={form.tanggal} onChange={handle} />
      <Input label="Catatan (opsional)" name="catatan" placeholder="Keterangan transfer"
        value={form.catatan} onChange={handle} />
      <Button type="submit" size="full" loading={loading}>Transfer Saldo</Button>
    </form>
  );
};

// ── Baris riwayat transaksi di dalam kolom ─────────────────────────────────────
const TransaksiRow = ({ t }) => {
  const meta = tipeMap[t.tipe] || tipeMap.pengeluaran;
  const label =
    t.tipe === "pemasukan"
      ? t.kategori_pemasukan || "Pemasukan"
      : t.tipe === "pindah_saldo"
        ? `Transfer → ${t.kantong_tujuan_nama || "Kantong Tujuan"}`
        : t.kategori_pengeluaran || "Pengeluaran";

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${
        t.tipe === "pemasukan" ? "bg-green-50" : t.tipe === "pindah_saldo" ? "bg-blue-50" : "bg-red-50"
      }`}>
        {t.tipe === "pemasukan" ? "💰" : t.tipe === "pindah_saldo" ? "↔️" : "💸"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-800 truncate">{label}</p>
        <p className="text-[10px] text-gray-400 mt-0.5 truncate">
          {t.kantong_nama} · {new Date(t.tanggal).toLocaleDateString('id-ID')}
        </p>
        {t.catatan && (
          <p className="text-[10px] italic text-gray-400 truncate">"{t.catatan}"</p>
        )}
      </div>
      <span className={`text-xs font-bold flex-shrink-0 ${meta.color}`}>
        {meta.sign}{formatRupiah(t.jumlah)}
      </span>
    </div>
  );
};

// Sub-komponen Box per Struktur Kolom
const KolomTransaksiBox = ({ judul, dataPerBulan, warnaJudul, borderClass }) => {
  const daftarBulan = Object.keys(dataPerBulan);

  return (
    <Card className={`border-t-4 ${borderClass}`}>
      <CardBody className="p-4 flex flex-col gap-4">
        <h3 className={`text-base font-bold ${warnaJudul}`}>{judul}</h3>
        
        {daftarBulan.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">Belum ada transaksi</p>
        ) : (
          daftarBulan.map((bulan) => (
            <div key={bulan} className="flex flex-col gap-2">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-0.5 rounded-md w-max">
                {bulan}
              </div>
              <div className="flex flex-col pl-1">
                {dataPerBulan[bulan].map((t) => (
                  <TransaksiRow key={t.id} t={t} />
                ))}
              </div>
            </div>
          ))
        )}
      </CardBody>
    </Card>
  );
};

// ── Halaman Utama ─────────────────────────────────────────────────────────────
export const TransaksiPage = () => {
  const [modal, setModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [transaksi, setTransaksi]           = useState([]);
  const [kantong, setKantong]               = useState([]);
  const [kategoriPemasukan, setKatPemasukan]   = useState([]);
  const [kategoriPengeluaran, setKatPengeluaran] = useState([]);
  const [isLoading, setIsLoading]           = useState(true);

  // State untuk filter dropdown bulan aktif
  const [selectedBulan, setSelectedBulan] = useState("Semua");

  const [offset, setOffset] = useState(0);
  const LIMIT = 50; // Menaikkan limit untuk mengakomodasi pencarian filter lokal bulanan

  const fetchAll = useCallback(async (newOffset = 0) => {
    setIsLoading(true);
    try {
      const [riwayat, kantongRes, katP, katPen] = await Promise.all([
        ApiService.getRiwayatTransaksi({ limit: LIMIT, offset: newOffset }),
        ApiService.getSemuaKantong(),
        ApiService.getKategoriPemasukan(),
        ApiService.getKategoriPengeluaran(),
      ]);
      if (newOffset === 0) {
        setTransaksi(riwayat.data || []);
      } else {
        setTransaksi((prev) => [...prev, ...(riwayat.data || [])]);
      }
      setKantong(kantongRes.data || []);
      setKatPemasukan(katP.data || []);
      setKatPengeluaran(katPen.data || []);
      setOffset(newOffset);
    } catch (err) {
      toast.error(err.message || "Gagal memuat data transaksi");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(0); }, [fetchAll]);

  const refreshKantong = async () => {
    try {
      const res = await ApiService.getSemuaKantong();
      setKantong(res.data || []);
    } catch (_) {}
  };

  const handlePemasukan = async (formData) => {
    setSubmitting(true);
    try {
      await ApiService.tambahPemasukan(formData);
      toast.success("Pemasukan berhasil ditambahkan");
      setModal(null);
      await Promise.all([fetchAll(0), refreshKantong()]);
    } catch (err) {
      toast.error(err.message || "Gagal menambah pemasukan");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePengeluaran = async (formData) => {
    setSubmitting(true);
    try {
      await ApiService.tambahPengeluaran(formData);
      toast.success("Pengeluaran berhasil dicatat");
      setModal(null);
      await Promise.all([fetchAll(0), refreshKantong()]);
    } catch (err) {
      toast.error(err.message || "Gagal mencatat pengeluaran");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTransfer = async (formData) => {
    setSubmitting(true);
    try {
      await ApiService.pindahSaldo(formData);
      toast.success("Transfer saldo berhasil");
      setModal(null);
      await Promise.all([fetchAll(0), refreshKantong()]);
    } catch (err) {
      toast.error(err.message || "Gagal transfer saldo");
    } finally {
      setSubmitting(false);
    }
  };

  // Logika Pemformatan & Penyaringan String Tanggal yang Sinkron
  const dapatkanFormatBulan = (tanggalStr) => {
    if (!tanggalStr) return "";
    const date = new Date(tanggalStr);
    return date.toLocaleString("id-ID", { month: "long", year: "numeric" });
  };

  const daftarPilihanBulan = Array.from(
    new Set(
      transaksi.map((t) => dapatkanFormatBulan(t.tanggal)).filter(Boolean)
    )
  );

  const transaksiDifilter = transaksi.filter((t) => {
    if (selectedBulan === "Semua") return true;
    return dapatkanFormatBulan(t.tanggal) === selectedBulan;
  });

  const dataPemasukan = transaksiDifilter.filter((t) => t.tipe === "pemasukan");
  const dataPengeluaran = transaksiDifilter.filter((t) => t.tipe === "pengeluaran");
  const dataTransfer = transaksiDifilter.filter((t) => t.tipe === "pindah_saldo");

  const pemasukanPerBulan = groupByMonth(dataPemasukan);
  const pengeluaranPerBulan = groupByMonth(dataPengeluaran);
  const transferPerBulan = groupByMonth(dataTransfer);

  return (
    <div className="px-4 pt-6 space-y-5 lg:pt-0 lg:px-0">
      <div className="hidden lg:block">
        <h1 className="text-xl font-bold text-gray-900">Transaksi</h1>
        <p className="text-sm text-gray-500">Riwayat pemasukan &amp; pengeluaran</p>
      </div>
      <div className="lg:hidden">
        <h1 className="text-xl font-bold text-gray-900">Transaksi</h1>
        <p className="text-sm text-gray-500">Kelola pemasukan &amp; pengeluaran</p>
      </div>

      {/* ── Tombol Aksi ── */}
      <div className="grid grid-cols-3 gap-3">
        <button onClick={() => setModal("pemasukan")}
          className="flex flex-col items-center gap-2 py-4 transition-colors border border-green-100 bg-green-50 rounded-2xl hover:bg-green-100">
          <div className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full">
            <TrendingUp size={18} className="text-white" />
          </div>
          <span className="text-xs font-semibold text-green-700">Pemasukan</span>
        </button>
        <button onClick={() => setModal("pengeluaran")}
          className="flex flex-col items-center gap-2 py-4 transition-colors border border-red-100 bg-red-50 rounded-2xl hover:bg-red-100">
          <div className="flex items-center justify-center w-10 h-10 bg-red-500 rounded-full">
            <TrendingDown size={18} className="text-white" />
          </div>
          <span className="text-xs font-semibold text-red-700">Pengeluaran</span>
        </button>
        <button onClick={() => setModal("transfer")}
          className="flex flex-col items-center gap-2 py-4 transition-colors border border-blue-100 bg-blue-50 rounded-2xl hover:bg-blue-100">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full">
            <ArrowLeftRight size={18} className="text-white" />
          </div>
          <span className="text-xs font-semibold text-blue-700">Transfer</span>
        </button>
      </div>

      {/* ── Filter Indikator Bulan ── */}
      <Card className="bg-white border border-gray-100 shadow-sm rounded-2xl">
        <CardBody className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Filter Periode</h3>
            <p className="text-xs text-gray-400">Tampilkan riwayat berdasarkan bulan tertentu</p>
          </div>
          <div className="w-full sm:w-48">
            <select
              value={selectedBulan}
              onChange={(e) => setSelectedBulan(e.target.value)}
              className="w-full text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
            >
              <option value="Semua">🗓️ Semua Bulan</option>
              {daftarPilihanBulan.map((bulan) => (
                <option key={bulan} value={bulan}>
                  📦 {bulan}
                </option>
              ))}
            </select>
          </div>
        </CardBody>
      </Card>

      {/* ── Grid List Riwayat 3 Kolom ── */}
      <div>
        <h2 className="mb-3 font-semibold text-gray-900">Riwayat Transaksi</h2>

        {isLoading && transaksi.length === 0 ? (
          <div className="flex justify-center py-12"><LoadingSpinner /></div>
        ) : transaksiDifilter.length === 0 ? (
          <Card>
            <CardBody className="py-12 text-center">
              <ArrowLeftRight size={32} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-400">Tidak ada transaksi pada periode ini</p>
            </CardBody>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <KolomTransaksiBox 
                judul="Pemasukan" 
                dataPerBulan={pemasukanPerBulan} 
                warnaJudul="text-green-600"
                borderClass="border-t-green-500"
              />
              <KolomTransaksiBox 
                judul="Pengeluaran" 
                dataPerBulan={pengeluaranPerBulan} 
                warnaJudul="text-red-500"
                borderClass="border-t-red-500"
              />
              <KolomTransaksiBox 
                judul="Transfer" 
                dataPerBulan={transferPerBulan} 
                warnaJudul="text-blue-600"
                borderClass="border-t-blue-500"
              />
            </div>

            {/* Pagination Load More hanya aktif ketika mode "Semua" diaktifkan */}
            {selectedBulan === "Semua" && transaksi.length >= LIMIT && (
              <div className="mt-6 text-center">
                <Button
                  variant="secondary"
                  size="sm"
                  loading={isLoading}
                  onClick={() => fetchAll(offset + LIMIT)}
                >
                  Muat lebih banyak
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modals Form ── */}
      <Modal isOpen={modal === "pemasukan"} onClose={() => setModal(null)} title="Tambah Pemasukan">
        <PemasukanForm kantong={kantong} kategori={kategoriPemasukan} onSubmit={handlePemasukan} loading={submitting} />
      </Modal>
      <Modal isOpen={modal === "pengeluaran"} onClose={() => setModal(null)} title="Catat Pengeluaran">
        <PengeluaranForm kantong={kantong} kategori={kategoriPengeluaran} onSubmit={handlePengeluaran} loading={submitting} />
      </Modal>
      <Modal isOpen={modal === "transfer"} onClose={() => setModal(null)} title="Transfer Saldo">
        <TransferForm kantong={kantong} onSubmit={handleTransfer} loading={submitting} />
      </Modal>
    </div>
  );
};

export default TransaksiPage;