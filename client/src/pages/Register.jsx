import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      toast.success('Registration successful! Welcome to ShopEZ!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      console.error(err);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full flex bg-white rounded-[2rem] shadow-2xl overflow-hidden min-h-[600px] flex-row-reverse">
        
        {/* Left Side - Image/Promo (Reversed for Register) */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-gray-900">
          <img 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80" 
            alt="Fashion Promo" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-0 right-0 p-12 text-white text-right">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold mb-4 ml-auto">
                <ShieldCheck size={16} /> 100% Secure Checkout
              </div>
              <h2 className="text-4xl font-extrabold mb-4 leading-tight">Join the <span className="text-[#3a86ff]">premium</span> <br/>e-commerce club.</h2>
              <p className="text-gray-300 text-lg max-w-md ml-auto">Create an account to track your orders, save to your wishlist, and get exclusive member-only discounts.</p>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#3a86ff]/10 rounded-full filter blur-[80px] -z-10"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#ff6b00]/10 rounded-full filter blur-[80px] -z-10"></div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="mb-10">
              <h2 className="text-3xl font-extrabold text-[#1e293b] mb-2">Create an Account ✨</h2>
              <p className="text-[#475569]">Start your premium shopping journey today.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#1e293b] mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3a86ff] focus:border-transparent bg-gray-50 transition-all outline-none" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1e293b] mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3a86ff] focus:border-transparent bg-gray-50 transition-all outline-none" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1e293b] mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3a86ff] focus:border-transparent bg-gray-50 transition-all outline-none" 
                    placeholder="Create a strong password"
                    minLength="6"
                    required 
                  />
                </div>
              </div>


              <button type="submit" className="w-full py-4 bg-[#3a86ff] hover:bg-[#2563eb] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl group">
                Create Account
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <p className="mt-8 text-center text-[#475569]">
              Already have an account? <Link to="/login" className="font-bold text-[#3a86ff] hover:underline">Sign in instead</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
