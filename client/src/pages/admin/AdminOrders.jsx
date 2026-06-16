import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { ShoppingBag, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['Pending','Confirmed','Packed','Shipped','Out for Delivery','Delivered','Cancelled'];

const STATUS_COLORS = {
  'Pending': 'bg-amber-100 text-amber-700',
  'Confirmed': 'bg-blue-100 text-blue-700',
  'Packed': 'bg-indigo-100 text-indigo-700',
  'Shipped': 'bg-purple-100 text-purple-700',
  'Out for Delivery': 'bg-cyan-100 text-cyan-700',
  'Delivered': 'bg-green-100 text-green-700',
  'Cancelled': 'bg-red-100 text-red-600'
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/admin/orders', { headers });
      setOrders(res.data.data);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}/status`, { orderStatus: newStatus }, { headers });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      toast.success(`Status updated to "${newStatus}"`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filtered = orders.filter(o => {
    const matchSearch = (o.userId?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.userId?.email || '').toLowerCase().includes(search.toLowerCase()) ||
      o._id.includes(search);
    const matchStatus = filterStatus === '' || o.orderStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#1e293b] flex items-center gap-2"><ShoppingBag size={24} className="text-[#ff6b00]" />Orders Management</h1>
            <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3a86ff] bg-white w-52" />
            </div>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3a86ff]">
              <option value="">All Status</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48"><div className="animate-spin rounded-full h-10 w-10 border-t-4 border-[#ff6b00]" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Order ID</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Customer</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Items</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Total</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Payment</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Date</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-12 text-gray-400">No orders found</td></tr>
                  ) : filtered.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-gray-500">#{order._id.slice(-8).toUpperCase()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-[#1e293b]">{order.userId?.name || 'N/A'}</p>
                          <p className="text-xs text-gray-400">{order.userId?.email || ''}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {(order.products || []).slice(0, 3).map((item, i) => (
                            <img key={i} src={item.product?.images?.[0]} alt="" className="w-8 h-8 object-cover rounded-lg border border-gray-100" />
                          ))}
                          {order.products?.length > 3 && <span className="text-xs text-gray-400 ml-1">+{order.products.length - 3}</span>}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{order.products?.length || 0} item(s)</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-[#1e293b]">₹{(order.totalAmount || 0).toLocaleString('en-IN')}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-medium">{order.paymentMethod || 'COD'}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.orderStatus}
                          onChange={e => handleStatusChange(order._id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3a86ff] ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
