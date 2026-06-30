import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // BARU: Tambah useNavigate
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // BARU: Import useAuth dari context

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // BARU: State loading biar user ga klik berkali-kali

  const { register } = useAuth(); // BARU: Ambil fungsi register asli
  const navigate = useNavigate(); // BARU: Ambil fungsi redirect halaman

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: '',
    });
  };

  const validate = () => {
    const errs = {};

    if (!form.name) errs.name = 'Nama wajib diisi';
    if (!form.email) errs.email = 'Email wajib diisi';

    if (!form.password) {
      errs.password = 'Password wajib diisi';
    } else if (form.password.length < 6) {
      errs.password = 'Password minimal 6 karakter';
    }

    return errs;
  };

  // DIUBAH: Menjadi fungsi async karena menembak API backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    try {
      // Kirim form.name sebagai username ke backend
      const success = await register(form.name, form.email, form.password);
      if (success) {
        navigate('/login');
      }
    } catch (error) {
      // Error API sudah ditangani di AuthContext (toast), tapi
      // jika ada error tak terduga tampilkan juga di form
      setErrors({ general: error.message || 'Terjadi kesalahan, coba lagi.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex min-h-screen">

      {/* Left Panel */}
      <div className="hidden lg:flex lg:flex-1 flex-col items-center justify-center p-16 bg-gradient-to-br from-[#00C2A8] to-[#009F8A] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-24 -translate-y-24" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-32 translate-y-32" />

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <span className="text-4xl">👝</span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-3">
            Aloca.id
          </h1>

          <p className="text-white/80 text-lg max-w-xs">
            Bergabunglah dan mulai kelola keuanganmu lebih cerdas.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-3 text-left">
            {[
              {
                emoji: '💼',
                title: 'Gratis Selamanya',
                desc: 'Tidak ada biaya tersembunyi',
              },
              {
                emoji: '🔒',
                title: 'Data Aman',
                desc: 'Enkripsi end-to-end',
              },
              {
                emoji: '📱',
                title: 'Mobile Friendly',
                desc: 'Akses dari mana saja',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm"
              >
                <span className="text-2xl">{f.emoji}</span>

                <div>
                  <p className="text-white font-semibold text-sm">
                    {f.title}
                  </p>

                  <p className="text-white/70 text-xs">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 lg:max-w-md flex flex-col items-center justify-center p-8 bg-white">

        <div className="lg:hidden text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#00C2A8] to-[#009F8A] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👝</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Aloca.id
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Mulai kelola keuanganmu
          </p>
        </div>

        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Buat akun baru
          </h2>

          <p className="text-sm text-gray-500 mb-8">
            Gratis selamanya, tanpa kartu kredit
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Nama Lengkap"
              name="name"
              placeholder="Nama kamu"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              disabled={isSubmitting} // BARU: Kunci input saat loading
            />

            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="nama@email.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              disabled={isSubmitting} // BARU: Kunci input saat loading
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Min. 6 karakter"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                disabled={isSubmitting} // BARU: Kunci input saat loading
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <Button
              type="submit"
              size="full"
              className="mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Mendaftarkan...' : 'Buat Akun'}
            </Button>

            {errors.general && (
              <p className="text-sm text-red-500 text-center -mt-1">
                {errors.general}
              </p>
            )}
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Sudah punya akun?{' '}
            <Link
              to="/login"
              className="text-[#00C2A8] font-semibold hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;