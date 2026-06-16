import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Store, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      if (loggedUser?.role !== 'ADMIN') {
        toast.error('Access denied. Admin accounts only.');
        setLoading(false);
        return;
      }
      toast.success('Welcome back, Admin!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e293b] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(255,107,0,0.4)]">
            <Store size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-1">ShopEZ Admin</h1>
          <p className="text-gray-400 text-sm">Sign in to access the dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <ShieldCheck size={16} className="text-orange-400" />
            <p className="text-orange-300 text-xs font-medium">Admin access only. Unauthorized access is prohibited.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6b00] transition-all text-sm"
                placeholder="admin@shopez.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6b00] transition-all text-sm"
                  placeholder="Enter admin password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-3.5 text-gray-400 hover:text-white">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-60 shadow-[0_0_20px_rgba(255,107,0,0.3)]"
            >
              {loading ? 'Signing in...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            Not an admin? <a href="/" className="text-[#ff6b00] hover:underline">Go to Store</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
