import { useState } from 'react';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import {
  Users, ArrowLeftRight, TrendingUp, TrendingDown,
  Plus, Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';

const StatCard = ({ label, value, icon: Icon, colorClass, iconColorClass, suffix = '' }) => (
  <Card>
    <CardBody className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl ${colorClass} flex items-center justify-center flex-shrink-0`}>
        <Icon size={22} className={iconColorClass} />
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
          {suffix && <span className="ml-1 text-sm font-normal text-gray-400">{suffix}</span>}
        </p>
      </div>
    </CardBody>
  </Card>
);

const KategoriList = ({ items, onDelete }) => (
  <div>
    {items.length === 0 ? (
      <p className="py-6 text-sm text-center text-gray-400">Belum ada kategori</p>
    ) : (
      items.map((k) => (
        <div
          key={k.id}
          className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-8 text-xl text-center">{k.icon || '📁'}</span>
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
      ))
    )}
  </div>
);

const KategoriForm = ({ onSubmit, loading, placeholder, iconPlaceholder }) => {
  const [form, setForm] = useState({ nama: '', icon: '' });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nama.trim()) {
      toast.error('Nama kategori wajib diisi');
      return;
    }
    onSubmit(form);
    setForm({ nama: '', icon: '' }); // Reset form setelah submit
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nama Kategori *"
        placeholder={placeholder}
        value={form.nama}
        onChange={(e) => setForm({ ...form, nama: e.target.value })}
      />
      <Input
        label="Icon (emoji)"
        placeholder={iconPlaceholder}
        value={form.icon}
        onChange={(e) => setForm({ ...form, icon: e.target.value })}
      />
      <Button type="submit" size="full" loading={loading}>Simpan Kategori</Button>
    </form>
  );
};

export const AdminPage = () => {
  const [modalPemasukan, setModalPemasukan] = useState(false);
  const [modalPengeluaran, setModalPengeluaran] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 1. State Mock Data untuk Statistik Dashboard Admin
  const [stats, setStats] = useState({
    totalUser: 142,
    totalTransaksi: 1250,
    transaksiByTipe: [
      { tipe: 'PEMASUKAN', _count: { id: 680 } },
      { tipe: 'PENGELUARAN', _count: { id: 520 } },
      { tipe: 'TRANSFER', _count: { id: 50 } }
    ]
  });

  // 2. State Mock Data untuk List Kategori Pemasukan
  const [katPemasukan, setKatPemasukan] = useState([
    { id: 1, nama: 'Gaji Bulanan', icon: '💰' },
    { id: 2, nama: 'Investasi', icon: '📈' },
    { id: 3, nama: 'Freelance', icon: '💻' },
  ]);

  // 3. State Mock Data untuk List Kategori Pengeluaran
  const [katPengeluaran, setKatPengeluaran] = useState([
    { id: 1, nama: 'Makanan & Minuman', icon: '🍜' },
    { id: 2, nama: 'Transportasi', icon: '🚗' },
    { id: 3, nama: 'Tagihan Bulanan', icon: '💵' },
  ]);

  // Handler Tambah Kategori Pemasukan
  const handleCreatePemasukan = (formData) => {
    const newKategori = {
      id: Date.now(),
      nama: formData.nama,
      icon: formData.icon || '💰'
    };
    setKatPemasukan([...katPemasukan, newKategori]);
    setModalPemasukan(false);
    toast.success('Kategori pemasukan dibuat!');
  };

  // Handler Tambah Kategori Pengeluaran
  const handleCreatePengeluaran = (formData) => {
    const newKategori = {
      id: Date.now(),
      nama: formData.nama,
      icon: formData.icon || '💸'
    };
    setKatPengeluaran([...katPengeluaran, newKategori]);
    setModalPengeluaran(false);
    toast.success('Kategori pengeluaran dibuat!');
  };

  // Handler Hapus Kategori Pemasukan
  const handleDeletePemasukan = (id) => {
    if (confirm('Hapus kategori pemasukan ini?')) {
      setKatPemasukan(katPemasukan.filter((k) => k.id !== id));
      toast.success('Kategori pemasukan dihapus');
    }
  };

  // Handler Hapus Kategori Pengeluaran
  const handleDeletePengeluaran = (id) => {
    if (confirm('Hapus kategori pengeluaran ini?')) {
      setKatPengeluaran(katPengeluaran.filter((k) => k.id !== id));
      toast.success('Kategori pengeluaran dihapus');
    }
  };

  const transaksiByTipe = stats?.transaksiByTipe || [];
  const pemasukanStat = transaksiByTipe.find((t) => t.tipe === 'PEMASUKAN');
  const pengeluaranStat = transaksiByTipe.find((t) => t.tipe === 'PENGELUARAN');

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
          {/* ── Stats grid ── */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label="Total User"
              value={stats?.totalUser || 0}
              icon={Users}
              colorClass="bg-blue-50"
              iconColorClass="text-blue-600"
              suffix="user"
            />
            <StatCard
              label="Total Transaksi"
              value={stats?.totalTransaksi || 0}
              icon={ArrowLeftRight}
              colorClass="bg-purple-50"
              iconColorClass="text-purple-600"
              suffix="transaksi"
            />
            <StatCard
              label="Pemasukan"
              value={pemasukanStat?._count?.id || 0}
              icon={TrendingUp}
              colorClass="bg-green-50"
              iconColorClass="text-green-600"
              suffix="transaksi"
            />
            <StatCard
              label="Pengeluaran"
              value={pengeluaranStat?._count?.id || 0}
              icon={TrendingDown}
              colorClass="bg-red-50"
              iconColorClass="text-red-500"
              suffix="transaksi"
            />
          </div>

          {/* ── Kategori management ── */}
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
      <Modal
        isOpen={modalPemasukan}
        onClose={() => setModalPemasukan(false)}
        title="Tambah Kategori Pemasukan"
      >
        <KategoriForm
          onSubmit={handleCreatePemasukan}
          loading={false}
          placeholder="Contoh: Gaji"
          iconPlaceholder="💰"
        />
      </Modal>

      <Modal
        isOpen={modalPengeluaran}
        onClose={() => setModalPengeluaran(false)}
        title="Tambah Kategori Pengeluaran"
      >
        <KategoriForm
          onSubmit={handleCreatePengeluaran}
          loading={false}
          placeholder="Contoh: Makanan"
          iconPlaceholder="💸"
        />
      </Modal>
    </div>
  );
};

export default AdminPage;