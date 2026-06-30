import { useAuth } from '../../context/AuthContext';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DesktopHeader = ({ title, subtitle }) => {
  const { user } = useAuth();

  return (
    <header className="hidden lg:flex items-center justify-between h-16 px-6 bg-white border-b border-gray-100 sticky top-0 z-30 flex-shrink-0">
      {/* Page title */}
      <div>
        <h1 className="text-lg font-bold text-gray-900 leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notification placeholder */}
        <button className="relative w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <Bell size={17} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00C2A8] rounded-full" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00C2A8] to-[#009F8A] flex items-center justify-center">
            <span className="text-sm font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div className="hidden xl:block">
            <p className="text-sm font-medium text-gray-900 leading-tight">{user?.name || 'Pengguna'}</p>
            <p className="text-[10px] text-gray-400 leading-tight capitalize">{user?.role?.toLowerCase()}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
