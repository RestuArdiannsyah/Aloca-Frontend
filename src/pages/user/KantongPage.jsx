import { useState, useEffect, useCallback } from 'react';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { formatRupiah } from '../../utils/format';
import { Plus, Wallet, Target, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { ApiService } from '../../services/Services';

// ── Form buat/edit kantong ────────────────────────────────────────────────────
const KantongForm = ({ initial = {}, onSubmit, loading }) => {
  const [form, setForm] = useState({
    nama: initial.nama || '',
    deskripsi: initial.deskripsi || '',
    goal: initial.goal || '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nama.trim()) {
      setErrors({ nama: 'Nama kantong wajib diisi' });
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nama Kantong *"
        name="nama"
        placeholder="Contoh: Uang Makan"
        value={form.nama}
        onChange={handleChange}
        error={errors.nama}
      />
      <Input
        label="Deskripsi (opsional)"
        name="deskripsi"
        placeholder="Deskripsi singkat kantong ini..."
        value={form.deskripsi}
        onChange={handleChange}
      />
      <Input
        label="Target Tabungan (opsional)"
        name="goal"
        type="number"
        placeholder="Contoh: 5000000"
        prefix="Rp"
        value={form.goal}
        onChange={handleChange}
        min="0"
      />
      <Button type="submit" size="full" loading={loading}>
        {initial.id ? 'Simpan Perubahan' : 'Buat Kantong'}
      </Button>
    </form>
  );
};

// ── Halaman utama ─────────────────────────────────────────────────────────────
export const KantongPage = () => {
  const [kantong, setKantong] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editKantong, setEditKantong] = useState(null);

  // Fetch semua kantong dari backend
  const fetchKantong = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await ApiService.getSemuaKantong();
      setKantong(res.data || []);
    } catch (err) {
      toast.error(err.message || 'Gagal memuat kantong');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchKantong(); }, [fetchKantong]);

  // Buat kantong baru → POST /api/kantong
  const handleCreate = async (formData) => {
    setSubmitting(true);
    try {
      await ApiService.buatKantong({
        nama: formData.nama,
        deskripsi: formData.deskripsi || null,
        goal: formData.goal ? parseFloat(formData.goal) : 0,
      });
      toast.success('Kantong berhasil dibuat!');
      setShowCreate(false);
      fetchKantong(); // Refresh list
    } catch (err) {
      toast.error(err.message || 'Gagal membuat kantong');
    } finally {
      setSubmitting(false);
    }
  };

  // Edit kantong → PUT /api/kantong/:id
  const handleUpdate = async (formData) => {
    setSubmitting(true);
    try {
      await ApiService.editKantong(editKantong.id, {
        nama: formData.nama,
        deskripsi: formData.deskripsi || null,
        goal: formData.goal ? parseFloat(formData.goal) : null,
      });
      toast.success('Kantong berhasil diperbarui!');
      setEditKantong(null);
      fetchKantong();
    } catch (err) {
      toast.error(err.message || 'Gagal memperbarui kantong');
    } finally {
      setSubmitting(false);
    }
  };

  // Hapus kantong → DELETE /api/kantong/:id
  const handleDelete = async (k) => {
    if (!confirm(`Hapus kantong "${k.nama}"? Seluruh data transaksi terkait juga akan terhapus.`)) return;
    try {
      await ApiService.hapusKantong(k.id);
      toast.success('Kantong berhasil dihapus');
      fetchKantong();
    } catch (err) {
      toast.error(err.message || 'Gagal menghapus kantong');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 lg:pt-0 lg:px-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 lg:hidden">Kantong</h1>
          <p className="text-sm text-gray-500">{kantong.length} kantong aktif</p>
        </div>
        <Button onClick={() => setShowCreate(true)} size="sm">
          <Plus size={16} /> Buat Kantong
        </Button>
      </div>

      {/* Empty state */}
      {kantong.length === 0 ? (
        <div className="py-20 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
            <Wallet size={24} className="text-gray-400" />
          </div>
          <p className="font-medium text-gray-500">Belum ada kantong</p>
          <p className="mt-1 text-sm text-gray-400">Buat kantong untuk mulai mengelola uangmu</p>
          <Button onClick={() => setShowCreate(true)} className="mt-4">
            <Plus size={16} /> Buat Kantong Pertama
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {kantong.map((k) => (
            <Card key={k.id}>
              <CardBody>
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#00C2A8]/10 flex items-center justify-center flex-shrink-0">
                    <Wallet size={20} className="text-[#00C2A8]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="pr-2 font-semibold text-gray-900 truncate">{k.nama}</h3>
                      <div className="flex flex-shrink-0 gap-1">
                        <button
                          onClick={() => setEditKantong(k)}
                          className="flex items-center justify-center transition-colors bg-gray-100 rounded-lg w-7 h-7 hover:bg-gray-200"
                          title="Edit"
                          disabled={k.is_default === 1}
                        >
                          <Pencil size={13} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(k)}
                          className="flex items-center justify-center transition-colors rounded-lg w-7 h-7 bg-red-50 hover:bg-red-100 disabled:opacity-30"
                          title={k.is_default ? 'Kantong utama tidak bisa dihapus' : 'Hapus'}
                          disabled={k.is_default === 1}
                        >
                          <Trash2 size={13} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                    {k.deskripsi && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{k.deskripsi}</p>
                    )}
                    {k.is_default === 1 && (
                      <span className="inline-block text-[10px] font-semibold text-[#00C2A8] bg-[#00C2A8]/10 px-2 py-0.5 rounded-full mt-1">
                        Kantong Utama
                      </span>
                    )}
                    <p className="mt-2 text-lg font-bold text-gray-900">{formatRupiah(k.saldo)}</p>
                    {k.goal > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1 text-xs text-gray-500">
                          <Target size={11} className="text-[#00C2A8]" />
                          <span>
                            {Math.round((k.saldo / k.goal) * 100)}% · Target {formatRupiah(k.goal)}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full">
                          <div
                            className="h-full bg-[#00C2A8] rounded-full transition-all"
                            style={{ width: `${Math.min((k.saldo / k.goal) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Buat */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Buat Kantong Baru">
        <KantongForm onSubmit={handleCreate} loading={submitting} />
      </Modal>

      {/* Modal Edit */}
      <Modal isOpen={!!editKantong} onClose={() => setEditKantong(null)} title="Edit Kantong">
        {editKantong && (
          <KantongForm initial={editKantong} onSubmit={handleUpdate} loading={submitting} />
        )}
      </Modal>
    </div>
  );
};

export default KantongPage;
