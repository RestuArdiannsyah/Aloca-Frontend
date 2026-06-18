import { useState } from 'react';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { formatRupiah } from '../../utils/format';
import { Plus, Wallet, Target, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

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
        label="Nama Kantong"
        name="nama"
        placeholder="Contoh: Uang Makan"
        value={form.nama}
        onChange={handleChange}
        error={errors.nama}
      />
      <Textarea
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

export const KantongPage = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [editKantong, setEditKantong] = useState(null);
  
  // Simulasi loading state
  const [isLoading] = useState(false);

  // Menggunakan local state sebagai pengganti data dari backend / useQuery
  const [data, setData] = useState([
    { id: 1, nama: 'Tabungan Utama', deskripsi: 'Untuk dana darurat', saldo: 2500000, goal: 10000000 },
    { id: 2, nama: 'Dompet Harian', deskripsi: 'Jajan & makan siang', saldo: 500000, goal: null },
  ]);

  // Handler Buat Kantong (Simulasi POST)
  const handleCreate = (formData) => {
    const newKantong = {
      id: Date.now(), // Generate id unik menggunakan timestamp
      nama: formData.nama,
      deskripsi: formData.deskripsi,
      saldo: 0, // Kantong baru otomatis dimulai dari Rp 0
      goal: formData.goal ? parseFloat(formData.goal) : null,
    };

    setData([...data, newKantong]);
    setShowCreate(false);
    toast.success('Kantong berhasil dibuat!');
  };

  // Handler Edit Kantong (Simulasi PUT/PATCH)
  const handleUpdate = (formData) => {
    const updatedData = data.map((item) => {
      if (item.id === editKantong.id) {
        return {
          ...item,
          nama: formData.nama,
          deskripsi: formData.deskripsi,
          goal: formData.goal ? parseFloat(formData.goal) : null,
        };
      }
      return item;
    });

    setData(updatedData);
    setEditKantong(null);
    toast.success('Kantong berhasil diperbarui!');
  };

  // Handler Hapus Kantong (Simulasi DELETE)
  const handleDelete = (k) => {
    if (confirm(`Hapus kantong "${k.nama}"? Seluruh data transaksi terkait juga akan terhapus.`)) {
      const filteredData = data.filter((item) => item.id !== k.id);
      setData(filteredData);
      toast.success('Kantong berhasil dihapus');
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
          <p className="text-sm text-gray-500">{data?.length || 0} kantong aktif</p>
        </div>
        <Button onClick={() => setShowCreate(true)} size="sm">
          <Plus size={16} /> Buat Kantong
        </Button>
      </div>

      {/* Empty state */}
      {(!data || data.length === 0) ? (
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
        /* Responsive grid */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.map((k) => (
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
                        >
                          <Pencil size={13} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(k)}
                          className="flex items-center justify-center transition-colors rounded-lg w-7 h-7 bg-red-50 hover:bg-red-100"
                          title="Hapus"
                        >
                          <Trash2 size={13} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                    {k.deskripsi && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{k.deskripsi}</p>
                    )}
                    <p className="mt-2 text-lg font-bold text-gray-900">{formatRupiah(k.saldo)}</p>
                    {k.goal && (
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

      {/* Modal Create */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Buat Kantong Baru">
        <KantongForm
          onSubmit={handleCreate}
          loading={false}
        />
      </Modal>

      {/* Modal Edit */}
      <Modal isOpen={!!editKantong} onClose={() => setEditKantong(null)} title="Edit Kantong">
        {editKantong && (
          <KantongForm
            initial={editKantong}
            onSubmit={handleUpdate}
            loading={false}
          />
        )}
      </Modal>
    </div>
  );
};

export default KantongPage;