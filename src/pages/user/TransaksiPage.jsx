import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { addPemasukan, addPengeluaran, transfer, getRiwayat } from '../../api/transaksi';
// import { getKantong } from '../../api/kantong';
// import { getKategoriPemasukan, getKategoriPengeluaran } from '../../api/kategori';
import { Card, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input, Select } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { Badge } from "../../components/ui/Badge";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { formatRupiah, formatDateTime } from "../../utils/format";
import { TrendingUp, TrendingDown, ArrowLeftRight } from "lucide-react";
import toast from "react-hot-toast";

const tipeMap = {
  PEMASUKAN: {
    label: "Pemasukan",
    variant: "success",
    color: "text-green-600",
  },
  PENGELUARAN: {
    label: "Pengeluaran",
    variant: "danger",
    color: "text-red-500",
  },
  TRANSFER: { label: "Transfer", variant: "info", color: "text-blue-600" },
};

const PemasukanForm = ({ kantong, kategori, onSubmit, loading }) => {
  const [form, setForm] = useState({
    kantongId: "",
    kategoriPemasukanId: "",
    nominal: "",
    keterangan: "",
  });
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.kantongId || !form.kategoriPemasukanId || !form.nominal) {
      toast.error("Harap isi semua field yang wajib");
      return;
    }
    onSubmit(form);
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nominal *"
        name="nominal"
        type="number"
        placeholder="0"
        prefix="Rp"
        value={form.nominal}
        onChange={handleChange}
        min="1"
      />
      <Select
        label="Kantong *"
        name="kantongId"
        value={form.kantongId}
        onChange={handleChange}
      >
        <option value="">Pilih kantong</option>
        {kantong.map((k) => (
          <option key={k.id} value={k.id}>
            {k.nama} ({formatRupiah(k.saldo)})
          </option>
        ))}
      </Select>
      <Select
        label="Kategori *"
        name="kategoriPemasukanId"
        value={form.kategoriPemasukanId}
        onChange={handleChange}
      >
        <option value="">Pilih kategori</option>
        {kategori.map((k) => (
          <option key={k.id} value={k.id}>
            {k.icon} {k.nama}
          </option>
        ))}
      </Select>
      <Input
        label="Keterangan (opsional)"
        name="keterangan"
        placeholder="Keterangan transaksi"
        value={form.keterangan}
        onChange={handleChange}
      />
      <Button type="submit" size="full" loading={loading}>
        Tambah Pemasukan
      </Button>
    </form>
  );
};

const PengeluaranForm = ({ kantong, kategori, onSubmit, loading }) => {
  const [form, setForm] = useState({
    kantongId: "",
    kategoriPengeluaranId: "",
    nominal: "",
    keterangan: "",
  });
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.kantongId || !form.kategoriPengeluaranId || !form.nominal) {
      toast.error("Harap isi semua field yang wajib");
      return;
    }
    onSubmit(form);
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nominal *"
        name="nominal"
        type="number"
        placeholder="0"
        prefix="Rp"
        value={form.nominal}
        onChange={handleChange}
        min="1"
      />
      <Select
        label="Kantong *"
        name="kantongId"
        value={form.kantongId}
        onChange={handleChange}
      >
        <option value="">Pilih kantong</option>
        {kantong.map((k) => (
          <option key={k.id} value={k.id}>
            {k.nama} ({formatRupiah(k.saldo)})
          </option>
        ))}
      </Select>
      <Select
        label="Kategori *"
        name="kategoriPengeluaranId"
        value={form.kategoriPengeluaranId}
        onChange={handleChange}
      >
        <option value="">Pilih kategori</option>
        {kategori.map((k) => (
          <option key={k.id} value={k.id}>
            {k.icon} {k.nama}
          </option>
        ))}
      </Select>
      <Input
        label="Keterangan (opsional)"
        name="keterangan"
        placeholder="Keterangan transaksi"
        value={form.keterangan}
        onChange={handleChange}
      />
      <Button type="submit" size="full" loading={loading}>
        Catat Pengeluaran
      </Button>
    </form>
  );
};

const TransferForm = ({ kantong, onSubmit, loading }) => {
  const [form, setForm] = useState({
    kantongAsalId: "",
    kantongTujuanId: "",
    nominal: "",
    keterangan: "",
  });
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.kantongAsalId || !form.kantongTujuanId || !form.nominal) {
      toast.error("Harap isi semua field yang wajib");
      return;
    }
    if (form.kantongAsalId === form.kantongTujuanId) {
      toast.error("Kantong asal dan tujuan tidak boleh sama");
      return;
    }
    onSubmit(form);
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nominal *"
        name="nominal"
        type="number"
        placeholder="0"
        prefix="Rp"
        value={form.nominal}
        onChange={handleChange}
        min="1"
      />
      <Select
        label="Dari Kantong *"
        name="kantongAsalId"
        value={form.kantongAsalId}
        onChange={handleChange}
      >
        <option value="">Pilih kantong asal</option>
        {kantong.map((k) => (
          <option key={k.id} value={k.id}>
            {k.nama} ({formatRupiah(k.saldo)})
          </option>
        ))}
      </Select>
      <Select
        label="Ke Kantong *"
        name="kantongTujuanId"
        value={form.kantongTujuanId}
        onChange={handleChange}
      >
        <option value="">Pilih kantong tujuan</option>
        {kantong
          .filter((k) => k.id !== parseInt(form.kantongAsalId))
          .map((k) => (
            <option key={k.id} value={k.id}>
              {k.nama} ({formatRupiah(k.saldo)})
            </option>
          ))}
      </Select>
      <Input
        label="Keterangan (opsional)"
        name="keterangan"
        placeholder="Keterangan transfer"
        value={form.keterangan}
        onChange={handleChange}
      />
      <Button type="submit" size="full" loading={loading}>
        Transfer Saldo
      </Button>
    </form>
  );
};

const TransaksiRow = ({ t }) => {
  const meta = tipeMap[t.tipe];
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${
          t.tipe === "PEMASUKAN"
            ? "bg-green-50"
            : t.tipe === "TRANSFER"
              ? "bg-blue-50"
              : "bg-red-50"
        }`}
      >
        {t.tipe === "PEMASUKAN"
          ? t.kategoriPemasukan?.icon || "💰"
          : t.tipe === "TRANSFER"
            ? "↔️"
            : t.kategoriPengeluaran?.icon || "💸"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-gray-800 truncate">
            {t.tipe === "PEMASUKAN"
              ? t.kategoriPemasukan?.nama
              : t.tipe === "TRANSFER"
                ? `Transfer → ${t.kantongTujuan?.nama || 'Kantong Tujuan'}`
                : t.kategoriPengeluaran?.nama}
          </p>
          <Badge variant={meta.variant} className="text-[10px] flex-shrink-0">
            {meta.label}
          </Badge>
        </div>
        <p className="text-xs text-gray-400 mt-0.5 truncate">
          {t.kantong?.nama} · {formatDateTime(t.createdAt)}
        </p>
        {t.keterangan && (
          <p className="text-xs italic text-gray-400 truncate">
            "{t.keterangan}"
          </p>
        )}
      </div>
      <span className={`text-sm font-semibold flex-shrink-0 ${meta.color}`}>
        {t.tipe === "PEMASUKAN" ? "+" : "-"}
        {formatRupiah(t.nominal)}
      </span>
    </div>
  );
};

export const TransaksiPage = () => {
  const [modal, setModal] = useState(null);
  const [page, setPage] = useState(1);

  // Deklarasi tiruan riwayatData jika belum di-import/di-fetch agar tidak memicu eror baru
  const riwayatData = undefined; 

  const kantong = [
    { id: 1, nama: "Tabungan", saldo: 2500000 },
    { id: 2, nama: "Dompet", saldo: 500000 },
  ];

  const kategoriPemasukan = [{ id: 1, nama: "Gaji", icon: "💰" }];

  const kategoriPengeluaran = [{ id: 1, nama: "Makan", icon: "🍜" }];

  // Digabungkan langsung menggunakan operator fallback (||)
  const transaksi = riwayatData?.transaksi || [
    {
      id: 1,
      tipe: "PEMASUKAN",
      nominal: 1500000,
      createdAt: new Date(),
      kantong: { nama: "Tabungan" },
      kategoriPemasukan: { nama: "Gaji", icon: "💰" },
      keterangan: "Gaji Bulanan",
    },
  ];

  // Digabungkan langsung menggunakan operator fallback (||)
  const pagination = riwayatData?.pagination || {
    totalPages: 1,
  };

  const isLoading = false;

  const handlePemasukan = () => {
    toast.success("Pemasukan berhasil ditambahkan");
    setModal(null);
  };

  const handlePengeluaran = () => {
    toast.success("Pengeluaran berhasil ditambahkan");
    setModal(null);
  };

  const handleTransfer = () => {
    toast.success("Transfer berhasil");
    setModal(null);
  };

  return (
    <div className="px-4 pt-6 space-y-5 lg:pt-0 lg:px-0">
      {/* Mobile page title */}
      <div className="lg:hidden">
        <h1 className="text-xl font-bold text-gray-900">Transaksi</h1>
        <p className="text-sm text-gray-500">
          Kelola pemasukan &amp; pengeluaran
        </p>
      </div>

      {/* ── Action buttons ── */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setModal("pemasukan")}
          className="flex flex-col items-center gap-2 py-4 transition-colors border border-green-100 bg-green-50 rounded-2xl hover:bg-green-100"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full">
            <TrendingUp size={18} className="text-white" />
          </div>
          <span className="text-xs font-semibold text-green-700">
            Pemasukan
          </span>
        </button>
        <button
          onClick={() => setModal("pengeluaran")}
          className="flex flex-col items-center gap-2 py-4 transition-colors border border-red-100 bg-red-50 rounded-2xl hover:bg-red-100"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-red-500 rounded-full">
            <TrendingDown size={18} className="text-white" />
          </div>
          <span className="text-xs font-semibold text-red-700">
            Pengeluaran
          </span>
        </button>
        <button
          onClick={() => setModal("transfer")}
          className="flex flex-col items-center gap-2 py-4 transition-colors border border-blue-100 bg-blue-50 rounded-2xl hover:bg-blue-100"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full">
            <ArrowLeftRight size={18} className="text-white" />
          </div>
          <span className="text-xs font-semibold text-blue-700">Transfer</span>
        </button>
      </div>

      {/* ── Riwayat ── */}
      <div>
        <h2 className="mb-3 font-semibold text-gray-900">Riwayat Transaksi</h2>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : transaksi.length === 0 ? (
          <Card>
            <CardBody className="py-12 text-center">
              <ArrowLeftRight
                size={32}
                className="mx-auto mb-3 text-gray-300"
              />
              <p className="text-sm text-gray-400">Belum ada transaksi</p>
              <p className="mt-1 text-xs text-gray-400">
                Mulai catat pemasukan atau pengeluaran
              </p>
            </CardBody>
          </Card>
        ) : (
          <>
            <Card>
              <CardBody className="py-2">
                {/* Desktop: 2 column layout */}
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-6">
                  <div>
                    {transaksi
                      .slice(0, Math.ceil(transaksi.length / 2))
                      .map((t) => (
                        <TransaksiRow key={t.id} t={t} />
                      ))}
                  </div>
                  <div className="hidden pl-6 border-l lg:block border-gray-50">
                    {transaksi
                      .slice(Math.ceil(transaksi.length / 2))
                      .map((t) => (
                        <TransaksiRow key={t.id} t={t} />
                      ))}
                  </div>
                  {/* Mobile: rest of items */}
                  <div className="lg:hidden">
                    {transaksi
                      .slice(Math.ceil(transaksi.length / 2))
                      .map((t) => (
                        <TransaksiRow key={t.id} t={t} />
                      ))}
                  </div>
                </div>
              </CardBody>
            </Card>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                >
                  ← Sebelumnya
                </Button>
                <span className="text-xs text-gray-500">
                  Hal. {page} / {pagination.totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= pagination.totalPages}
                >
                  Berikutnya →
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={modal === "pemasukan"}
        onClose={() => setModal(null)}
        title="Tambah Pemasukan"
      >
        <PemasukanForm
          kantong={kantong}
          kategori={kategoriPemasukan}
          onSubmit={handlePemasukan}
          loading={false}
        />
      </Modal>
      <Modal
        isOpen={modal === "pengeluaran"}
        onClose={() => setModal(null)}
        title="Catat Pengeluaran"
      >
        <PengeluaranForm
          kantong={kantong}
          kategori={kategoriPengeluaran}
          onSubmit={handlePengeluaran}
          loading={false}
        />
      </Modal>
      <Modal
        isOpen={modal === "transfer"}
        onClose={() => setModal(null)}
        title="Transfer Saldo"
      >
        <TransferForm
          kantong={kantong}
          onSubmit={handleTransfer}
          loading={false}
        />
      </Modal>
    </div>
  );
};

export default TransaksiPage;