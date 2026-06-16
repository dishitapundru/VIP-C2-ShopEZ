import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { Users, Package, ShoppingBag, Clock, CheckCircle, XCircle } from 'lucide-react';

const STATUS_COLORS = {
  'Pending': '#f59e0b',
  'Confirmed': '#3b82f6',
  'Packed': '#6366f1',
  'Shipped': '#8b5cf6',
  'Out for Delivery': '#06b6d4',
  'Delivered': '#10b981',
  'Cancelled': '#ef4444',
};

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner ${color}`}>
      <Icon size={26} className="text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-black text-[#1e293b] leading-tight">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } });
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#ff6b00]" />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-black text-[#1e293b]">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening with ShopEZ.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <StatCard icon={ShoppingBag} label="Total Orders" value={stats?.totalOrders || 0} sub={`${stats?.pendingOrders || 0} pending`} color="bg-gradient-to-br from-blue-400 to-blue-600" />
          <StatCard icon={Users} label="Total Users" value={stats?.totalUsers || 0} color="bg-gradient-to-br from-emerald-400 to-emerald-600" />
          <StatCard icon={Package} label="Total Products" value={stats?.totalProducts || 0} sub={`${stats?.totalCategories || 0} categories`} color="bg-gradient-to-br from-violet-400 to-violet-600" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard icon={Clock} label="Pending Orders" value={stats?.pendingOrders || 0} color="bg-gradient-to-br from-amber-400 to-amber-600" />
          <StatCard icon={CheckCircle} label="Delivered" value={stats?.deliveredOrders || 0} color="bg-gradient-to-br from-teal-400 to-teal-600" />
          <StatCard icon={XCircle} label="Cancelled" value={stats?.cancelledOrders || 0} color="bg-gradient-to-br from-red-400 to-red-600" />
        </div>
      </div>
    </AdminLayout>
  );
}
