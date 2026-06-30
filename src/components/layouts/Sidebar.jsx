import { NavLink, useNavigate } from 'react-router-dom';
import { Home, ArrowLeftRight, Wallet, User, Shield, Tag, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

const NavItem = ({ to, icon: Icon, label, collapsed }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
        isActive
          ? 'bg-[#00C2A8] text-white shadow-sm shadow-[#00C2A8]/30'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
      } ${collapsed ? 'justify-center' : ''}`
    }
    title={collapsed ? label : undefined}
  >
    {({ isActive }) => (
      <>
        <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} className="flex-shrink-0" />
        {!collapsed && (
          <span className="text-sm font-medium truncate">{label}</span>
        )}
      </>
    )}
  </NavLink>
);

export const Sidebar = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Sampai jumpa!');
    navigate('/login');
  };

  const userNavItems = [
    { to: '/beranda', icon: Home, label: 'Beranda' },
    { to: '/transaksi', icon: ArrowLeftRight, label: 'Transaksi' },
    { to: '/kantong', icon: Wallet, label: 'Kantong' },
    { to: '/profil', icon: User, label: 'Profil' },
  ];

  const adminNavItems = [
    { to: '/admin', icon: Shield, label: 'Dashboard Admin' },
  ];

  return (
    <aside
      className={`
        hidden lg:flex flex-col bg-white border-r border-gray-100 h-screen sticky top-0
        transition-all duration-300 flex-shrink-0
        ${collapsed ? 'w-[72px]' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 border-b border-gray-100 px-4 flex-shrink-0 ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00C2A8] to-[#009F8A] flex items-center justify-center flex-shrink-0">
          <span className="text-lg">👝</span>
        </div>
        {!collapsed && (
          <div>
            <p className="font-bold text-gray-900 text-sm leading-tight">Aloca.id</p>
            <p className="text-[10px] text-gray-400 leading-tight">Kelola keuanganmu</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
        {userNavItems.map((item) => (
          <NavItem key={item.to} {...item} collapsed={collapsed} />
        ))}

        {user?.role === 'admin' && (
          <>
            <div className={`my-3 border-t border-gray-100 ${collapsed ? '' : ''}`} />
            {!collapsed && (
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">
                Admin
              </p>
            )}
            {adminNavItems.map((item) => (
              <NavItem key={item.to} {...item} collapsed={collapsed} />
            ))}
          </>
        )}
      </nav>

      {/* User info + logout */}
      <div className="border-t border-gray-100 p-3 flex-shrink-0">
        {!collapsed ? (
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00C2A8] to-[#009F8A] flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors flex-shrink-0"
              title="Logout"
            >
              <LogOut size={13} className="text-red-500" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center py-2 rounded-xl bg-red-50 hover:bg-red-100 transition-colors"
            title="Logout"
          >
            <LogOut size={16} className="text-red-500" />
          </button>
        )}

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="mt-2 w-full flex items-center justify-center py-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
};
