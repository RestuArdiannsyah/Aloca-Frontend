import { useState, useEffect, useCallback } from "react";
import { Card, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input, Select } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { Badge } from "../../components/ui/Badge";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { formatRupiah, formatDateTime } from "../../utils/format";
import { TrendingUp, TrendingDown, ArrowLeftRight } from "lucide-react";
import toast from "react-hot-toast";
import { ApiService } from "../../services/Services";

// ── Helpers ───────────────────────────────────────────────────────────────────
const tipeMap = {
  pemasukan:    { label: "Pemasukan",  variant: "success", color: "text-green-600", sign: "+" },
  pengeluaran:  { label: "Pengeluaran",variant: "danger",  color: "text-red-500",   sign: "-" },
  pindah_saldo: { label: "Transfer",   variant: "info",    color: "text-blue-600",  sign: "-" },
};

// Tanggal hari ini dalam format YYYY-MM-DD (untuk input type=date)
const today = () => new Date().toISOString().split("T")[0];

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
          <option key={k.id} value={k.id}>{k.icon_url ? "" : ""}{k.nama}</option>
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

// ── Baris riwayat transaksi ───────────────────────────────────────────────────
const TransaksiRow = ({ t }) => {
  const meta = tipeMap[t.tipe] || tipeMap.pengeluaran;
  const label =
    t.tipe === "pemasukan"
      ? t.kategori_pemasukan || "Pemasukan"
      : t.tipe === "pindah_saldo"
        ? `Transfer → ${t.kantong_tujuan_nama || "Kantong Tujuan"}`
        : t.kategori_pengeluaran || "Pengeluaran";

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${
        t.tipe === "pemasukan" ? "bg-green-50" : t.tipe === "pindah_saldo" ? "bg-blue-50" : "bg-red-50"
      }`}>
        {t.tipe === "pemasukan" ? "💰" : t.tipe === "pindah_saldo" ? "↔️" : "💸"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-gray-800 truncate">{label}</p>
          <Badge variant={meta.variant} className="text-[10px] flex-shrink-0">
            {meta.label}
          </Badge>
        </div>
        <p className="text-xs text-gray-400 mt-0.5 truncate">
          {t.kantong_nama} · {t.tanggal}
        </p>
        {t.catatan && (
          <p className="text-xs italic text-gray-400 truncate">"{t.catatan}"</p>
        )}
      </div>
      <span className={`text-sm font-semibold flex-shrink-0 ${meta.color}`}>
        {meta.sign}{formatRupiah(t.jumlah)}
      </span>
    </div>
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

  // offset/limit sederhana
  const [offset, setOffset] = useState(0);
  const LIMIT = 20;

  // Fetch semua data yang dibutuhkan
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

  // Refresh kantong saja setelah transaksi (saldo berubah)
  const refreshKantong = async () => {
    try {
      const res = await ApiService.getSemuaKantong();
      setKantong(res.data || []);
    } catch (_) {}
  };

  // ── Handler submit ──────────────────────────────────────────────────────────
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

  return (
    <div className="px-4 pt-6 space-y-5 lg:pt-0 lg:px-0">
      {/* Mobile title */}
      <div className="lg:hidden">
        <h1 className="text-xl font-bold text-gray-900">Transaksi</h1>
        <p className="text-sm text-gray-500">Kelola pemasukan &amp; pengeluaran</p>
      </div>

      {/* ── Tombol aksi ── */}
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

      {/* ── Riwayat ── */}
      <div>
        <h2 className="mb-3 font-semibold text-gray-900">Riwayat Transaksi</h2>

        {isLoading && transaksi.length === 0 ? (
          <div className="flex justify-center py-12"><LoadingSpinner /></div>
        ) : transaksi.length === 0 ? (
          <Card>
            <CardBody className="py-12 text-center">
              <ArrowLeftRight size={32} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-400">Belum ada transaksi</p>
              <p className="mt-1 text-xs text-gray-400">Mulai catat pemasukan atau pengeluaran</p>
            </CardBody>
          </Card>
        ) : (
          <>
            <Card>
              <CardBody className="py-2">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-6">
                  <div>
                    {transaksi.slice(0, Math.ceil(transaksi.length / 2)).map((t) => (
                      <TransaksiRow key={t.id} t={t} />
                    ))}
                  </div>
                  <div className="hidden pl-6 border-l lg:block border-gray-50">
                    {transaksi.slice(Math.ceil(transaksi.length / 2)).map((t) => (
                      <TransaksiRow key={t.id} t={t} />
                    ))}
                  </div>
                  <div className="lg:hidden">
                    {transaksi.slice(Math.ceil(transaksi.length / 2)).map((t) => (
                      <TransaksiRow key={t.id} t={t} />
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Load more */}
            {transaksi.length >= LIMIT && (
              <div className="mt-4 text-center">
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

      {/* ── Modals ── */}
      <Modal isOpen={modal === "pemasukan"} onClose={() => setModal(null)} title="Tambah Pemasukan">
        <PemasukanForm
          kantong={kantong}
          kategori={kategoriPemasukan}
          onSubmit={handlePemasukan}
          loading={submitting}
        />
      </Modal>
      <Modal isOpen={modal === "pengeluaran"} onClose={() => setModal(null)} title="Catat Pengeluaran">
        <PengeluaranForm
          kantong={kantong}
          kategori={kategoriPengeluaran}
          onSubmit={handlePengeluaran}
          loading={submitting}
        />
      </Modal>
      <Modal isOpen={modal === "transfer"} onClose={() => setModal(null)} title="Transfer Saldo">
        <TransferForm
          kantong={kantong}
          onSubmit={handleTransfer}
          loading={submitting}
        />
      </Modal>
    </div>
  );
};

export default TransaksiPage;
