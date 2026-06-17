import { Menu } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-30 h-16 bg-white border-b border-gray-100 lg:left-64">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg lg:hidden hover:bg-gray-100">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          <h1 className="text-xl font-bold text-blue-600 lg:hidden">
            Toko Restu
          </h1>
        </div>

        <div>
          <span className="text-sm font-medium text-gray-500">Dashboard</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
