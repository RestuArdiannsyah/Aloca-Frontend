import { Link } from "react-router-dom";
import { Home, Clock } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 flex flex-col w-64 h-screen bg-white border-r border-gray-100 shadow-xs">
      <div className="p-[15.5px] border-b border-gray-100">
        <h1 className="text-2xl font-bold text-emerald-400">Aloca.id</h1>
      </div>

      <div className="flex-1 py-6 overflow-y-auto">
        <div className="px-4 mb-6">
          <h2 className="px-3 mb-3 text-sm font-semibold">Menu Utama</h2>

          <div className="space-y-1">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <Home />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>

        <div className="px-4">
          <h2 className="px-3 mb-3 text-sm font-semibold">Lainnya</h2>

          <div className="space-y-1">
            <Link
              to="/riwayat-transaksi"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <Clock size={20} />
              <span>Riwayat Transaksi</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
