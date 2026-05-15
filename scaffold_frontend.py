import os

client_dir = "c:/Users/Admin/Desktop/Shop E-Com/client/src"
components_dir = os.path.join(client_dir, "components")
pages_dir = os.path.join(client_dir, "pages")
context_dir = os.path.join(client_dir, "context")

os.makedirs(components_dir, exist_ok=True)
os.makedirs(pages_dir, exist_ok=True)
os.makedirs(context_dir, exist_ok=True)

app_jsx = """
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#f8fafc]">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
"""

navbar_jsx = """
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="glass sticky top-0 z-50 py-4 px-6 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-[#ff6b00]">ShopEZ</Link>
        <div className="flex space-x-6 items-center">
          <Link to="/products" className="text-[#475569] hover:text-[#ff6b00] transition-colors">Products</Link>
          <Link to="/wishlist" className="text-[#475569] hover:text-[#ef476f] transition-colors"><Heart size={20} /></Link>
          <Link to="/cart" className="text-[#475569] hover:text-[#3a86ff] transition-colors"><ShoppingCart size={20} /></Link>
          {user ? (
            <div className="flex gap-4 items-center">
               <span className="text-sm font-medium">Hi, {user.name}</span>
               <button onClick={logout} className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-all">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="px-5 py-2 bg-gradient-to-r from-[#ff6b00] to-[#ffb703] text-white rounded-full hover-glow-orange transition-all font-medium">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
"""

home_jsx = """
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-20 text-center glass rounded-3xl mt-8 relative overflow-hidden">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold text-[#1e293b] mb-6"
        >
          Premium Shopping <br/><span className="text-[#ff6b00]">Made Easy</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-[#475569] mb-8 max-w-2xl mx-auto"
        >
          Discover top-tier products with unbeatable quality and seamless experience.
        </motion.p>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
          <Link to="/products" className="px-8 py-4 bg-[#3a86ff] text-white rounded-full hover-glow-blue font-bold text-lg inline-block">
            Shop Now
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
"""

auth_context_jsx = """
import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setUser(res.data.data);
      }).catch(() => {
        localStorage.removeItem('token');
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
"""

login_jsx = """
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 glass p-8 rounded-3xl shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#1e293b]">Welcome Back</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#475569] mb-2">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff6b00] transition-all" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#475569] mb-2">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff6b00] transition-all" required />
        </div>
        <button type="submit" className="w-full py-3 bg-[#ff6b00] text-white rounded-xl hover-glow-orange font-bold text-lg">Login</button>
      </form>
      <p className="mt-6 text-center text-[#475569]">
        Don't have an account? <Link to="/register" className="text-[#3a86ff] hover:underline">Register</Link>
      </p>
    </div>
  );
}
"""

register_jsx = """
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 glass p-8 rounded-3xl shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#1e293b]">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#475569] mb-2">Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff6b00] transition-all" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#475569] mb-2">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff6b00] transition-all" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#475569] mb-2">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff6b00] transition-all" required />
        </div>
        <button type="submit" className="w-full py-3 bg-[#3a86ff] text-white rounded-xl hover-glow-blue font-bold text-lg">Register</button>
      </form>
      <p className="mt-6 text-center text-[#475569]">
        Already have an account? <Link to="/login" className="text-[#ff6b00] hover:underline">Login</Link>
      </p>
    </div>
  );
}
"""

with open(os.path.join(client_dir, "App.jsx"), "w") as f: f.write(app_jsx)
with open(os.path.join(components_dir, "Navbar.jsx"), "w") as f: f.write(navbar_jsx)
with open(os.path.join(pages_dir, "Home.jsx"), "w") as f: f.write(home_jsx)
with open(os.path.join(context_dir, "AuthContext.jsx"), "w") as f: f.write(auth_context_jsx)
with open(os.path.join(pages_dir, "Login.jsx"), "w") as f: f.write(login_jsx)
with open(os.path.join(pages_dir, "Register.jsx"), "w") as f: f.write(register_jsx)

print("Scaffolded basic frontend components.")
