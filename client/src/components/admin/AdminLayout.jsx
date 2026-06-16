import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, Package, ShoppingBag,
  PlusCircle, LogOut, Store, BarChart2
} from 'lucide-react';

const NAV = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/admin/products/add', icon: PlusCircle, label: 'Add Product' },
  { to: '/admin/dashboard', icon: BarChart2, label: 'Analytics' }, // Analytics currently maps to dashboard
];

const TOP_NAV = [
  { to: '/', label: 'Home' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/products/add', label: 'New Product' },
];

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] text-white flex flex-col fixed h-full z-40 shadow-2xl">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
              <Store size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-black text-lg leading-none">ShopEZ</h1>
              <p className="text-orange-400 text-xs font-semibold">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {NAV.map(({ to, icon: Icon, label }, idx) => (
            <NavLink key={`${to}-${idx}`} to={to} end={to === '/admin/dashboard' && label === 'Dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  isActive ? 'bg-[#ff6b00] text-white shadow-md shadow-orange-500/30' : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-6 text-sm">
            {TOP_NAV.map(({ to, label }) => (
                <NavLink key={label} to={to} className={({ isActive }) => `font-semibold transition-colors ${isActive ? 'text-[#ff6b00]' : 'text-gray-500 hover:text-[#1e293b]'}`}>
                  {label}
                </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleLogout} className="text-xs text-red-500 hover:underline font-medium">Logout</button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow text-white text-sm font-bold">A</div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
