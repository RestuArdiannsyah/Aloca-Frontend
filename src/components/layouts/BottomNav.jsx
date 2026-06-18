import { NavLink } from 'react-router-dom';
import { Home, ArrowLeftRight, Wallet, User } from 'lucide-react';

const navItems = [
  { to: '/beranda', icon: Home, label: 'Beranda' },
  { to: '/transaksi', icon: ArrowLeftRight, label: 'Transaksi' },
  { to: '/kantong', icon: Wallet, label: 'Kantong' },
  { to: '/profil', icon: User, label: 'Profil' },
];

export const BottomNav = () => (
  <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40">
    <div className="flex">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors ${
              isActive ? 'text-[#00C2A8]' : 'text-gray-400'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={`text-[10px] font-medium ${isActive ? 'text-[#00C2A8]' : 'text-gray-400'}`}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  </nav>
);
