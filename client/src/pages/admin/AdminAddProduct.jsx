import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { PlusCircle, X, Save, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Electronics','Mobiles','Laptops','Watches','Footwear','Shoes',
  "Men's Fashion","Women's Fashion","Kids Fashion",
  'Beauty','Home & Kitchen','Gaming','Books','Grocery','Accessories'
];
const GENDERS = ['Men','Women','Kids','Unisex'];

const emptyForm = {
  title: '', brand: '', category: '', gender: 'Unisex',
  price: '', discountPrice: '', stock: '', description: '',
  features: '', specifications: '', images: [], ratings: '4.0', numReviews: '0', isFeatured: false
};

export default function AdminAddProduct() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (isEdit) {
      axios.get(`/api/products/${id}`).then(res => {
        const p = res.data.data;
        const specsString = p.specifications ? Object.entries(p.specifications).map(([k,v]) => `${k}: ${v}`).join('\n') : '';
        setForm({
          title: p.title || '',
          brand: p.brand || '',
          category: p.category || '',
          gender: p.gender || 'Unisex',
          price: p.price || '',
          discountPrice: p.discountPrice || '',
          stock: p.stock || '',
          description: p.description || '',
          features: (p.features || []).join('\n'),
          specifications: specsString,
          images: p.images || [],
          ratings: p.ratings || '4.0',
          numReviews: p.numReviews || '0',
          isFeatured: p.isFeatured || false
        });
      }).catch(() => toast.error('Failed to load product')).finally(() => setFetching(false));
    }
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
    }

    try {
        setLoading(true);
        const res = await axios.post('/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data', ...headers }
        });
        setForm(prev => ({ ...prev, images: [...prev.images, ...res.data.data] }));
        toast.success('Images uploaded successfully');
    } catch (err) {
        toast.error('Image upload failed');
    } finally {
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (indexToRemove) => {
      setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== indexToRemove) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Parse specifications
      const specMap = {};
      form.specifications.split('\n').filter(Boolean).forEach(line => {
          const [key, ...val] = line.split(':');
          if (key && val) specMap[key.trim()] = val.join(':').trim();
      });

      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
        stock: Number(form.stock),
        ratings: Number(form.ratings),
        numReviews: Number(form.numReviews),
        features: form.features.split('\n').filter(Boolean),
        specifications: specMap
      };
      if (!payload.discountPrice) delete payload.discountPrice;

      if (isEdit) {
        await axios.put(`/api/products/${id}`, payload, { headers });
        toast.success('Product updated!');
      } else {
        await axios.post('/api/products', payload, { headers });
        toast.success('Product added!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <AdminLayout><div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#ff6b00]" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-[#1e293b] flex items-center gap-2">
            <PlusCircle size={24} className="text-[#ff6b00]" />
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{isEdit ? 'Update product details' : 'Fill in the details to add a new product'}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#475569] mb-1.5">Product Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3a86ff] text-sm transition-all" placeholder="e.g. Apple iPhone 15 Pro Max 256GB" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-1.5">Brand *</label>
                <input name="brand" value={form.brand} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3a86ff] text-sm transition-all" placeholder="e.g. Apple" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-1.5">Category *</label>
                <select name="category" value={form.category} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3a86ff] text-sm bg-white transition-all">
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-1.5">Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3a86ff] text-sm bg-white transition-all">
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input type="checkbox" id="isFeatured" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4 accent-[#ff6b00]" />
                <label htmlFor="isFeatured" className="text-sm font-medium text-[#475569]">Featured Product (shown in homepage)</label>
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b">Pricing & Inventory</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-1.5">Price (₹) *</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} required min="0" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3a86ff] text-sm transition-all" placeholder="99999" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-1.5">Discount Price (₹)</label>
                <input name="discountPrice" type="number" value={form.discountPrice} onChange={handleChange} min="0" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3a86ff] text-sm transition-all" placeholder="Optional" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-1.5">Stock *</label>
                <input name="stock" type="number" value={form.stock} onChange={handleChange} required min="0" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3a86ff] text-sm transition-all" placeholder="100" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b">Description & Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-1.5">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3a86ff] text-sm transition-all resize-none" placeholder="Detailed product description..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-1.5">Key Features <span className="text-gray-400 font-normal">(one per line)</span></label>
                <textarea name="features" value={form.features} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3a86ff] text-sm transition-all resize-none font-mono" placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-1.5">Specifications <span className="text-gray-400 font-normal">(Format: Key - Value)</span></label>
                <textarea name="specifications" value={form.specifications} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3a86ff] text-sm transition-all resize-none font-mono" placeholder="Color: Black&#10;Weight: 200g&#10;Warranty: 1 Year" />
              </div>
            </div>
          </div>

          {/* Images Upload */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b">Product Images</h3>
            <div>
              <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-[#1e293b] font-semibold rounded-xl hover:bg-gray-200 transition-all border border-dashed border-gray-300">
                  <Upload size={18} /> Upload Images
              </button>
              <p className="text-xs text-gray-400 mt-2">You can upload multiple images at once (JPG, PNG).</p>
            </div>
            
            {form.images.length > 0 && (
              <div className="flex gap-4 mt-4 flex-wrap">
                {form.images.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt={`preview ${i}`} className="w-24 h-24 object-cover rounded-xl border border-gray-200" onError={e => { e.target.src='https://via.placeholder.com/150'; }} />
                    <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                        <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <button type="button" onClick={() => navigate('/admin/products')} className="flex-1 py-4 border-2 border-gray-200 text-gray-500 rounded-xl font-bold hover:border-gray-300 transition-all flex items-center justify-center gap-2">
              <X size={18} /> Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-4 bg-[#ff6b00] text-white rounded-xl font-bold hover:opacity-90 disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-md">
              <Save size={18} /> {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
