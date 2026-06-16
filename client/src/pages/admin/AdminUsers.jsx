import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { Trash2, ShieldOff, ShieldCheck, Search, Users, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users', { headers });
      setUsers(res.data.data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`/api/admin/users/${id}`, { headers });
      toast.success('User deleted');
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleBlock = async (id, isBlocked) => {
    try {
      const res = await axios.put(`/api/admin/users/${id}/block`, {}, { headers });
      toast.success(res.data.message);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u));
    } catch (err) {
      toast.error('Failed to update user');
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-[#1e293b] flex items-center gap-2"><Users size={24} className="text-[#ff6b00]" />Users Management</h1>
            <p className="text-gray-500 text-sm mt-1">{users.length} registered users</p>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3a86ff] bg-white" />
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
                    <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">User</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Orders</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Joined</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-gray-400">No users found</td></tr>
                  ) : filtered.map(user => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3a86ff] to-[#ff6b00] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {user.name[0].toUpperCase()}
                          </div>
                          <span className="font-semibold text-[#1e293b]">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-50 text-[#3a86ff] font-bold px-3 py-1 rounded-full text-xs">{user.orderCount} orders</span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs">{new Date(user.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.isBlocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => alert(`View details for ${user.name}\nEmail: ${user.email}\nJoined: ${new Date(user.createdAt).toLocaleDateString()}`)}
                            className="p-2 bg-indigo-50 text-indigo-500 rounded-lg hover:bg-indigo-100 transition-all"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleBlock(user._id, user.isBlocked)}
                            className={`p-2 rounded-lg transition-all ${user.isBlocked ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}
                            title={user.isBlocked ? 'Unblock' : 'Block'}
                          >
                            {user.isBlocked ? <ShieldCheck size={16} /> : <ShieldOff size={16} />}
                          </button>
                          <button
                            onClick={() => handleDelete(user._id, user.name)}
                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-all"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
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
