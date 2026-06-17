import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Layout = () => {
  return (
    <div>
      <Sidebar />
      <Navbar />

      <main className="min-h-screen pt-20 pl-20 lg:ml-64 bg-gray-50">
        <Outlet className="" />
      </main>
    </div>
  );
};

export default Layout;
