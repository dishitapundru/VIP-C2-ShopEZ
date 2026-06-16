import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Search, SlidersHorizontal, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const CATEGORIES = [
  'Electronics','Mobiles','Laptops','Watches','Footwear','Shoes',
  "Men's Fashion","Women's Fashion","Kids Fashion",
  'Beauty','Home & Kitchen','Gaming','Books','Grocery','Accessories'
];

const GENDERS = ['Men','Women','Kids','Unisex'];

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'popular', label: '🔥 Popular' },
  { value: 'new-arrivals', label: '🆕 New Arrivals' },
  { value: 'price-low', label: '💰 Price: Low to High' },
  { value: 'price-high', label: '💎 Price: High to Low' },
  { value: 'highest-discount', label: '🏷️ Highest Discount' },
  { value: 'highest-rated', label: '⭐ Highest Rated' },
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [gender, setGender] = useState(searchParams.get('gender') || '');
  const [sort, setSort] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { addToCart, toggleWishlist, wishlist } = useShop();

  useEffect(() => {
    setCategory(searchParams.get('category') || '');
    setGender(searchParams.get('gender') || '');
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products?limit=100');
        setProducts(res.data.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === '' || p.category === category;
      const matchGender = gender === '' || p.gender === gender;
      return matchSearch && matchCategory && matchGender;
    });

    if (sort === 'price-low') filtered = [...filtered].sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    else if (sort === 'price-high') filtered = [...filtered].sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    else if (sort === 'highest-rated') filtered = [...filtered].sort((a, b) => b.ratings - a.ratings);
    else if (sort === 'popular') filtered = [...filtered].sort((a, b) => b.numReviews - a.numReviews);
    else if (sort === 'highest-discount') filtered = [...filtered].sort((a, b) => {
      const discA = a.discountPrice ? (a.price - a.discountPrice) / a.price : 0;
      const discB = b.discountPrice ? (b.price - b.discountPrice) / b.price : 0;
      return discB - discA;
    });
    else if (sort === 'new-arrivals') filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return filtered;
  }, [products, search, category, gender, sort]);

  const clearAllFilters = () => { setCategory(''); setGender(''); setSearch(''); setSort(''); };

  const activeFiltersCount = [category, gender, sort, search].filter(Boolean).length;

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#ff6b00]"></div>
    </div>
  );

  const FilterSidebar = () => (
    <div className="glass p-6 rounded-3xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-[#1e293b]">Filters</h3>
        {activeFiltersCount > 0 && (
          <button onClick={clearAllFilters} className="text-xs text-[#ff6b00] font-bold flex items-center gap-1 hover:underline">
            <X size={12} /> Clear All ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3a86ff] transition-all bg-white text-sm"
        />
        <Search className="absolute left-3 top-3.5 text-gray-400" size={16} />
        {search && <button onClick={() => setSearch('')} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"><X size={14} /></button>}
      </div>

      {/* Sort */}
      <div className="mb-6">
        <h4 className="font-semibold text-[#475569] mb-3 text-sm uppercase tracking-wider">Sort By</h4>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3a86ff] bg-white text-[#475569] text-sm"
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Gender */}
      <div className="mb-6">
        <h4 className="font-semibold text-[#475569] mb-3 text-sm uppercase tracking-wider">Gender</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setGender('')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${gender === '' ? 'bg-[#3a86ff] text-white border-[#3a86ff]' : 'border-gray-200 text-[#475569] hover:border-[#3a86ff]'}`}
          >All</button>
          {GENDERS.map(g => (
            <button key={g} onClick={() => setGender(gender === g ? '' : g)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${gender === g ? 'bg-[#3a86ff] text-white border-[#3a86ff]' : 'border-gray-200 text-[#475569] hover:border-[#3a86ff]'}`}
            >{g}</button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <h4 className="font-semibold text-[#475569] mb-3 text-sm uppercase tracking-wider">Category</h4>
        <div className="space-y-1 max-h-80 overflow-y-auto">
          <button
            onClick={() => setCategory('')}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${category === '' ? 'bg-[#ff6b00] text-white font-semibold' : 'hover:bg-gray-100 text-[#475569]'}`}
          >All Categories</button>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(category === cat ? '' : cat)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${category === cat ? 'bg-[#ff6b00] text-white font-semibold' : 'hover:bg-gray-100 text-[#475569]'}`}
            >{cat}</button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-[#1e293b]">Products</h2>
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-[#ff6b00] text-white rounded-full text-sm font-bold"
        >
          <SlidersHorizontal size={16} />
          Filters {activeFiltersCount > 0 && <span className="bg-white text-[#ff6b00] rounded-full w-5 h-5 flex items-center justify-center text-xs font-black">{activeFiltersCount}</span>}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`w-full md:w-1/4 space-y-6 ${mobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
        <FilterSidebar />
      </div>

      {/* Product Grid */}
      <div className="w-full md:w-3/4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#1e293b]">
            {category || 'All Products'}
            {gender && <span className="text-[#3a86ff] ml-2 text-lg">— {gender}</span>}
          </h2>
          <span className="text-[#475569] font-medium text-sm">{filteredProducts.length} items</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="glass p-12 text-center rounded-3xl">
            <p className="text-xl text-[#475569] mb-4">No products found matching your criteria.</p>
            <button onClick={clearAllFilters} className="px-6 py-2 bg-[#ff6b00] text-white rounded-full font-bold text-sm">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.04, 0.5) }}
                key={product._id}
                className="group glass rounded-3xl overflow-hidden flex flex-col relative bg-white shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                {product.discountPrice && (
                  <div className="absolute top-4 left-4 bg-[#ef476f] text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                  </div>
                )}
                {product.gender && product.gender !== 'Unisex' && (
                  <div className="absolute top-4 left-4 mt-7 bg-[#3a86ff]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10" style={{ top: product.discountPrice ? '52px' : '16px' }}>
                    {product.gender}
                  </div>
                )}

                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full z-10 hover-glow-red transition-all shadow-sm"
                >
                  <Heart size={20} className={wishlist.find(w => w._id === product._id) ? "fill-[#ef476f] text-[#ef476f]" : "text-gray-400"} />
                </button>

                <div className="relative h-56 overflow-hidden">
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link to={`/products/${product._id}`} className="px-6 py-2 bg-white text-[#1e293b] font-bold rounded-full hover:bg-gray-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                      View Details
                    </Link>
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-semibold text-[#3a86ff] uppercase tracking-wider">{product.brand}</p>
                    <div className="flex items-center text-[#ffb703] text-xs font-bold">
                      <Star size={12} className="fill-[#ffb703] mr-0.5" />
                      {product.ratings} <span className="text-gray-400 ml-1 font-normal">({product.numReviews})</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-[#1e293b] mb-1 line-clamp-2 leading-snug">{product.title}</h3>
                  <div className="mt-auto flex justify-between items-center pt-3">
                    <div className="flex flex-col">
                      {product.discountPrice ? (
                        <>
                          <span className="text-lg font-black text-[#1e293b]">₹{product.discountPrice.toLocaleString('en-IN')}</span>
                          <span className="text-xs text-gray-400 line-through">₹{product.price.toLocaleString('en-IN')}</span>
                        </>
                      ) : (
                        <span className="text-lg font-black text-[#1e293b]">₹{product.price.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    <button onClick={() => addToCart(product)} className="p-3 bg-[#ff6b00] text-white rounded-full hover-glow-orange transition-all shadow-md">
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
