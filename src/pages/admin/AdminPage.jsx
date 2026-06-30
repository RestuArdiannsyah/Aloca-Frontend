import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import {
  TrendingUp, TrendingDown, Plus, Trash2, Upload,
  Image, Users, ArrowLeftRight, Tag,
} from 'lucide-react';
import { formatRupiah } from '../../utils/format';
import toast from 'react-hot-toast';
import { ApiService } from '../../services/Services';

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon: Icon, colorClass, iconColorClass }) => (
  <Card>
    <CardBody className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl ${colorClass} flex items-center justify-center flex-shrink-0`}>
        <Icon size={22} className={iconColorClass} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-gray-900 leading-tight">
          {typeof value === 'number' ? value.toLocaleString('id-ID') : (value ?? '—')}
        </p>
        {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </CardBody>
  </Card>
);

// ── Komponen list kategori ────────────────────────────────────────────────────
const KategoriList = ({ items, onDelete }) => {
  if (items.length === 0) {
    return <p className="py-6 text-sm text-center text-gray-400">Belum ada kategori</p>;
  }
  return (
    <div>
      {items.map((k) => (
        <div key={k.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
          <div className="flex items-center gap-2.5">
            {k.icon_url ? (
              <img
                src={`http://localhost:3000${k.icon_url}`}
                alt={k.nama}
                className="w-8 h-8 rounded-lg object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <Image size={14} className="text-gray-400" />
              </div>
            )}
            <span className="text-sm font-medium text-gray-800">{k.nama}</span>
          </div>
          <button
            onClick={() => onDelete(k.id)}
            className="flex items-center justify-center transition-colors rounded-lg w-7 h-7 bg-red-50 hover:bg-red-100"
            title="Hapus"
          >
            <Trash2 size={13} className="text-red-500" />
          </button>
        </div>
      ))}
    </div>
  );
};

// ── Form tambah kategori (nama + upload icon) ─────────────────────────────────
const KategoriForm = ({ onSubmit, loading, placeholder }) => {
  const [nama, setNama] = useState('');
  const [iconFile, setIconFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIconFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nama.trim()) {
      toast.error('Nama kategori wajib diisi');
      return;
    }
    const fd = new FormData();
    fd.append('nama', nama.trim());
    if (iconFile) fd.append('icon', iconFile);
    onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nama Kategori *"
        placeholder={placeholder}
        value={nama}
        onChange={(e) => setNama(e.target.value)}
      />
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1.5">Icon (opsional)</p>
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-[#00C2A8]/50 hover:bg-[#00C2A8]/5 transition-colors"
        >
          {preview ? (
            <img src={preview} alt="preview" className="w-16 h-16 rounded-xl object-cover" />
          ) : (
            <>
              <Upload size={24} className="text-gray-300" />
              <p className="text-xs text-gray-400">Klik untuk upload icon (PNG/JPG/SVG, maks 2MB)</p>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        {iconFile && <p className="text-xs text-gray-400 mt-1 truncate">📎 {iconFile.name}</p>}
      </div>
      <Button type="submit" size="full" loading={loading}>Simpan Kategori</Button>
    </form>
  );
};

// ── Halaman Admin ─────────────────────────────────────────────────────────────
export const AdminPage = () => {
  const [modalPemasukan, setModalPemasukan]     = useState(false);
  const [modalPengeluaran, setModalPengeluaran] = useState(false);
  const [submitting, setSubmitting]             = useState(false);

  const [stats, setStats]               = useState(null);
  const [katPemasukan, setKatPemasukan] = useState([]);
  const [katPengeluaran, setKatPengeluaran] = useState([]);
  const [isLoading, setIsLoading]       = useState(true);

  // Fetch statistik + kedua list kategori secara paralel
  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsRes, p, pen] = await Promise.all([
        ApiService.getAdminStats(),
        ApiService.getKategoriPemasukan(),
        ApiService.getKategoriPengeluaran(),
      ]);
      setStats(statsRes.data || null);
      setKatPemasukan(p.data || []);
      setKatPengeluaran(pen.data || []);
    } catch (err) {
      toast.error(err.message || 'Gagal memuat data admin');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Handlers kategori ─────────────────────────────────────────────────────
  const handleCreatePemasukan = async (formData) => {
    setSubmitting(true);
    try {
      await ApiService.buatKategoriPemasukan(formData);
      toast.success('Kategori pemasukan dibuat!');
      setModalPemasukan(false);
      fetchAll();
    } catch (err) {
      toast.error(err.message || 'Gagal membuat kategori');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreatePengeluaran = async (formData) => {
    setSubmitting(true);
    try {
      await ApiService.buatKategoriPengeluaran(formData);
      toast.success('Kategori pengeluaran dibuat!');
      setModalPengeluaran(false);
      fetchAll();
    } catch (err) {
      toast.error(err.message || 'Gagal membuat kategori');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePemasukan = async (id) => {
    if (!confirm('Hapus kategori pemasukan ini?')) return;
    try {
      await ApiService.hapusKategoriPemasukan(id);
      toast.success('Kategori pemasukan dihapus');
      setKatPemasukan((prev) => prev.filter((k) => k.id !== id));
      // update counter di stats
      setStats((s) => s ? { ...s, totalKategoriPemasukan: s.totalKategoriPemasukan - 1 } : s);
    } catch (err) {
      toast.error(err.message || 'Gagal menghapus');
    }
  };

  const handleDeletePengeluaran = async (id) => {
    if (!confirm('Hapus kategori pengeluaran ini?')) return;
    try {
      await ApiService.hapusKategoriPengeluaran(id);
      toast.success('Kategori pengeluaran dihapus');
      setKatPengeluaran((prev) => prev.filter((k) => k.id !== id));
      setStats((s) => s ? { ...s, totalKategoriPengeluaran: s.totalKategoriPengeluaran - 1 } : s);
    } catch (err) {
      toast.error(err.message || 'Gagal menghapus');
    }
  };

  // Shorthand untuk data stats dengan fallback 0
  const totalUser       = stats?.totalUser       ?? 0;
  const totalTransaksi  = stats?.totalTransaksi  ?? 0;
  const totalPemasukan  = stats?.transaksiByTipe?.pemasukan    ?? 0;
  const totalPengeluaran = stats?.transaksiByTipe?.pengeluaran ?? 0;
  const nominalPemasukan  = stats?.nominalByTipe?.pemasukan    ?? 0;
  const nominalPengeluaran = stats?.nominalByTipe?.pengeluaran ?? 0;

  return (
    <div className="px-4 pt-6 space-y-6 lg:pt-0 lg:px-0">
      {/* Mobile title */}
      <div className="lg:hidden">
        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-sm text-gray-500">Manajemen Aloca.id</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : (
        <>
          {/* ── Statistik ── */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label="Total User"
              value={totalUser}
              sub="user terdaftar"
              icon={Users}
              colorClass="bg-blue-50"
              iconColorClass="text-blue-600"
            />
            <StatCard
              label="Total Transaksi"
              value={totalTransaksi}
              sub="semua waktu"
              icon={ArrowLeftRight}
              colorClass="bg-purple-50"
              iconColorClass="text-purple-600"
            />
            <StatCard
              label="Pemasukan"
              value={totalPemasukan}
              sub={formatRupiah(nominalPemasukan)}
              icon={TrendingUp}
              colorClass="bg-green-50"
              iconColorClass="text-green-600"
            />
            <StatCard
              label="Pengeluaran"
              value={totalPengeluaran}
              sub={formatRupiah(nominalPengeluaran)}
              icon={TrendingDown}
              colorClass="bg-red-50"
              iconColorClass="text-red-500"
            />
          </div>

          {/* ── Ringkasan kategori (baris kedua) ── */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              label="Kategori Pemasukan"
              value={stats?.totalKategoriPemasukan ?? katPemasukan.length}
              sub="kategori tersedia"
              icon={Tag}
              colorClass="bg-green-50"
              iconColorClass="text-green-600"
            />
            <StatCard
              label="Kategori Pengeluaran"
              value={stats?.totalKategoriPengeluaran ?? katPengeluaran.length}
              sub="kategori tersedia"
              icon={Tag}
              colorClass="bg-red-50"
              iconColorClass="text-red-500"
            />
          </div>

          {/* ── Manajemen Kategori ── */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Kategori Pemasukan */}
            <Card>
              <CardBody>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-50">
                      <TrendingUp size={15} className="text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900">Kategori Pemasukan</h2>
                      <p className="text-xs text-gray-400">{katPemasukan.length} kategori</p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => setModalPemasukan(true)}>
                    <Plus size={14} /> Tambah
                  </Button>
                </div>
                <KategoriList items={katPemasukan} onDelete={handleDeletePemasukan} />
              </CardBody>
            </Card>

            {/* Kategori Pengeluaran */}
            <Card>
              <CardBody>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50">
                      <TrendingDown size={15} className="text-red-500" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900">Kategori Pengeluaran</h2>
                      <p className="text-xs text-gray-400">{katPengeluaran.length} kategori</p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => setModalPengeluaran(true)}>
                    <Plus size={14} /> Tambah
                  </Button>
                </div>
                <KategoriList items={katPengeluaran} onDelete={handleDeletePengeluaran} />
              </CardBody>
            </Card>
          </div>
        </>
      )}

      {/* Modals */}
      <Modal isOpen={modalPemasukan} onClose={() => setModalPemasukan(false)} title="Tambah Kategori Pemasukan">
        <KategoriForm onSubmit={handleCreatePemasukan} loading={submitting} placeholder="Contoh: Gaji" />
      </Modal>
      <Modal isOpen={modalPengeluaran} onClose={() => setModalPengeluaran(false)} title="Tambah Kategori Pengeluaran">
        <KategoriForm onSubmit={handleCreatePengeluaran} loading={submitting} placeholder="Contoh: Makanan" />
      </Modal>
    </div>
  );
};

export default AdminPage;
