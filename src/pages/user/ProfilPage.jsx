import { useAuth } from '../../context/AuthContext';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatDate } from '../../utils/format';
import { User, Mail, Calendar, LogOut, Shield} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
    <div className="flex items-center justify-center flex-shrink-0 bg-gray-100 rounded-lg w-9 h-9">
      <Icon size={16} className="text-gray-600" />
    </div>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  </div>
);

export const ProfilPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Sampai jumpa!');
    navigate('/login');
  };

  return (
    <div className="px-4 pt-6 space-y-5 lg:pt-0 lg:px-0">

      {/* Mobile title */}
      <h1 className="text-xl font-bold text-gray-900 lg:hidden">Profil</h1>

      {/* ── Responsive layout: stacked on mobile, side-by-side on desktop ── */}
      <div className="space-y-5 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">

        {/* Left: Avatar card */}
        <div className="lg:col-span-1">
          <Card>
            <CardBody className="flex flex-col items-center py-8 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00C2A8] to-[#009F8A] flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
              {user?.role === 'ADMIN' && (
                <div className="mt-3 flex items-center gap-1.5 bg-[#00C2A8]/10 px-3 py-1.5 rounded-full">
                  <Shield size={12} className="text-[#00C2A8]" />
                  <span className="text-xs font-semibold text-[#00C2A8]">Administrator</span>
                </div>
              )}
              <Button
                variant="danger"
                size="md"
                onClick={handleLogout}
                className="w-full mt-6"
              >
                <LogOut size={15} /> Keluar
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* Right: Detail cards */}
        <div className="space-y-4 lg:col-span-2">

          {/* Info */}
          <Card>
            <CardBody>
              <h3 className="mb-2 font-semibold text-gray-900">Informasi Akun</h3>
              <InfoRow icon={User} label="Nama Lengkap" value={user?.name} />
              <InfoRow icon={Mail} label="Alamat Email" value={user?.email} />
              <InfoRow
                icon={Calendar}
                label="Bergabung Sejak"
                value={user?.createdAt ? formatDate(user.createdAt) : '-'}
              />
              <InfoRow
                icon={Shield}
                label="Role"
                value={user?.role === 'ADMIN' ? 'Administrator' : 'User'}
              />
            </CardBody>
          </Card>

          {/* Admin shortcut */}
          {user?.role === 'ADMIN' && (
            <Card>
              <CardBody>
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center w-full gap-3 text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#00C2A8]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#00C2A8]/20 transition-colors">
                    <Shield size={18} className="text-[#00C2A8]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Panel Admin</p>
                    <p className="text-xs text-gray-400">Kelola kategori & lihat statistik</p>
                  </div>
                  <span className="text-gray-300 group-hover:text-gray-400">›</span>
                </button>
              </CardBody>
            </Card>
          )}

          {/* App info */}
          <Card>
            <CardBody>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00C2A8]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">👝</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Aloca.id</p>
                  <p className="text-xs text-gray-400">Versi 1.0.0 · Manajemen keuangan kantong</p>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <span className="text-[10px] font-medium text-green-600">Online</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilPage;