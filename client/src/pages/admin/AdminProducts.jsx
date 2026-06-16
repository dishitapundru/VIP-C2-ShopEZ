import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Trash2, Pencil, PlusCircle, Search, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products?limit=200');
      setProducts(res.data.data);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await axios.delete(`/api/products/${id}`, { headers });
      toast.success('Product deleted');
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#1e293b] flex items-center gap-2"><Package size={24} className="text-[#ff6b00]" />Products Management</h1>
            <p className="text-gray-500 text-sm mt-1">{products.length} total products</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3a86ff] bg-white w-56" />
            </div>
            <Link to="/admin/products/add" className="flex items-center gap-2 px-4 py-2.5 bg-[#ff6b00] text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-md whitespace-nowrap">
              <PlusCircle size={16} /> Add Product
            </Link>
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
                    <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Product</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Category</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Price</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Stock</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Rating</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-gray-400">No products found</td></tr>
                  ) : filtered.map(product => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={product.images[0]} alt={product.title} className="w-12 h-12 object-cover rounded-xl flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-[#1e293b] line-clamp-1 max-w-xs">{product.title}</p>
                            <p className="text-xs text-[#3a86ff] font-semibold">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs font-medium">{product.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-[#1e293b]">₹{(product.discountPrice || product.price).toLocaleString('en-IN')}</p>
                          {product.discountPrice && <p className="text-xs text-gray-400 line-through">₹{product.price.toLocaleString('en-IN')}</p>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold text-xs px-2 py-1 rounded-lg ${product.stock > 10 ? 'bg-green-100 text-green-700' : product.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[#ffb703] font-bold text-sm">⭐ {product.ratings}</span>
                        <span className="text-gray-400 text-xs ml-1">({product.numReviews})</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                            className="p-2 bg-blue-50 text-[#3a86ff] rounded-lg hover:bg-blue-100 transition-all"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id, product.title)}
                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-all"
                            title="Delete"
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
