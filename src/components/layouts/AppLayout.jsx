import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import { DesktopHeader } from './DesktopHeader';
import { PageLoader } from '../ui/LoadingSpinner';

// Map routes to page titles
const pageTitles = {
  '/beranda': { title: 'Dashboard', subtitle: 'Ringkasan keuangan kamu' },
  '/transaksi': { title: 'Transaksi', subtitle: 'Riwayat pemasukan & pengeluaran' },
  '/kantong': { title: 'Kantong', subtitle: 'Kelola kantong keuanganmu' },
  '/profil': { title: 'Profil', subtitle: 'Informasi akun kamu' },
  '/admin': { title: 'Admin Panel', subtitle: 'Manajemen Aloca.id' },
};

export const AppLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  // Gunakan lowercase 'admin' — sesuai nilai di database dan JWT payload
  if (location.pathname.startsWith('/admin') && user?.role !== 'admin') {
    return <Navigate to="/beranda" replace />;
  }
  
  const pageInfo = pageTitles[location.pathname] || { title: 'Aloca.id', subtitle: '' };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar — desktop only */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop header */}
        <DesktopHeader title={pageInfo.title} subtitle={pageInfo.subtitle} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {/* Mobile: full width, pb for bottom nav */}
          {/* Desktop: full width with padding */}
          <div className="lg:p-6 pb-20 lg:pb-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Bottom nav — mobile only */}
      <BottomNav />
    </div>
  );
};

export const AdminLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  // Gunakan lowercase 'admin' — sesuai nilai di database dan JWT payload
  if (user?.role !== 'admin') return <Navigate to="/beranda" replace />;

  const pageInfo = pageTitles[location.pathname] || { title: 'Admin Panel', subtitle: '' };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <DesktopHeader title={pageInfo.title} subtitle={pageInfo.subtitle} />
        <main className="flex-1 overflow-y-auto">
          <div className="lg:p-6 pb-20 lg:pb-6">
            <Outlet />
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

export const AuthLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (user) {
    // Gunakan lowercase 'admin' — sesuai nilai di database dan JWT payload
    return <Navigate to={user.role === 'admin' ? '/admin' : '/beranda'} replace />;
  }

  // Mobile: teal gradient centered. Desktop: pages handle their own split layout.
  return (
    <div className="min-h-screen lg:bg-white bg-gradient-to-br from-[#00C2A8] to-[#009F8A] flex items-center justify-center lg:items-stretch lg:justify-stretch p-4 lg:p-0">
      <Outlet />
    </div>
  );
};
