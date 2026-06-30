import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

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

    if (!form.email) errs.email = 'Email wajib diisi';
    if (!form.password) errs.password = 'Password wajib diisi';

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await login(form.email, form.password);
      if (success) {
  navigate('/beranda'); 
}
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
        <div className="absolute top-1/2 right-8 w-40 h-40 bg-white/10 rounded-full" />

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <span className="text-4xl">👝</span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-3">
            Aloca.id
          </h1>

          <p className="text-white/80 text-lg max-w-xs">
            Kelola keuanganmu dengan sistem kantong yang simpel dan intuitif.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 text-left">
            {[
              {
                emoji: '🎯',
                title: 'Target Tabungan',
                desc: 'Set goal per kantong',
              },
              {
                emoji: '📊',
                title: 'Pantau Keuangan',
                desc: 'Dashboard real-time',
              },
              {
                emoji: '↔️',
                title: 'Transfer Mudah',
                desc: 'Pindah saldo antar kantong',
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
            Kelola keuanganmu dengan kantong
          </p>
        </div>

        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Selamat Datang
          </h2>

          <p className="text-sm text-gray-500 mb-8">
            Masuk ke akun Aloca.id kamu
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="nama@email.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              disabled={isSubmitting}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Masukkan password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                disabled={isSubmitting}
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
              {isSubmitting ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Belum punya akun?{' '}
            <Link
              to="/register"
              className="text-[#00C2A8] font-semibold hover:underline"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;