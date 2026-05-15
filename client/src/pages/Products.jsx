import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Search } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering and Search states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  
  const { addToCart, toggleWishlist, wishlist } = useShop();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => 
      p.title.toLowerCase().includes(search.toLowerCase()) &&
      (category === '' || p.category === category)
    );

    if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
    if (sort === 'rating') filtered.sort((a, b) => b.ratings - a.ratings);
    
    return filtered;
  }, [products, search, category, sort]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#ff6b00]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar / Filters */}
      <div className="w-full md:w-1/4 space-y-6">
        <div className="glass p-6 rounded-3xl shadow-sm">
          <h3 className="text-xl font-bold text-[#1e293b] mb-4">Filters</h3>
          
          <div className="relative mb-6">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3a86ff] transition-all bg-white"
            />
            <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-[#475569] mb-3">Category</h4>
            <div className="space-y-2">
              <button 
                onClick={() => setCategory('')} 
                className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${category === '' ? 'bg-[#ff6b00] text-white' : 'hover:bg-gray-100 text-[#475569]'}`}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setCategory(cat)} 
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${category === cat ? 'bg-[#ff6b00] text-white' : 'hover:bg-gray-100 text-[#475569]'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[#475569] mb-3">Sort By</h4>
            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3a86ff] bg-white text-[#475569]"
            >
              <option value="">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="w-full md:w-3/4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#1e293b]">Our Products</h2>
          <span className="text-[#475569] font-medium">{filteredProducts.length} items found</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="glass p-12 text-center rounded-3xl">
            <p className="text-xl text-[#475569]">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={product._id} 
                className="group glass rounded-3xl overflow-hidden flex flex-col relative bg-white"
              >
                {/* Discount Badge */}
                {product.discountPrice && (
                  <div className="absolute top-4 left-4 bg-[#ef476f] text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                  </div>
                )}
                
                {/* Wishlist Button */}
                <button 
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full z-10 hover-glow-red transition-all shadow-sm"
                >
                  <Heart 
                    size={20} 
                    className={wishlist.find(w => w._id === product._id) ? "fill-[#ef476f] text-[#ef476f]" : "text-gray-400"} 
                  />
                </button>

                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={product.images[0]} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  {/* Overlay action buttons */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <Link to={`/products/${product._id}`} className="px-6 py-2 bg-white text-[#1e293b] font-bold rounded-full hover:bg-gray-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                      View Details
                    </Link>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-semibold text-[#3a86ff] uppercase tracking-wider">{product.brand}</p>
                    <div className="flex items-center text-[#ffb703] text-sm font-bold">
                      <Star size={14} className="fill-[#ffb703] mr-1" />
                      {product.ratings} <span className="text-gray-400 ml-1 font-normal">({product.numReviews})</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-[#1e293b] mb-1 line-clamp-1">{product.title}</h3>
                  <p className="text-[#475569] text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="mt-auto flex justify-between items-center">
                    <div className="flex flex-col">
                      {product.discountPrice ? (
                        <>
                          <span className="text-xl font-black text-[#1e293b]">₹{product.discountPrice.toLocaleString('en-IN')}</span>
                          <span className="text-sm text-gray-400 line-through">₹{product.price.toLocaleString('en-IN')}</span>
                        </>
                      ) : (
                        <span className="text-xl font-black text-[#1e293b]">₹{product.price.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => addToCart(product)}
                      className="p-3 bg-[#ff6b00] text-white rounded-full hover-glow-orange transition-all shadow-md"
                    >
                      <ShoppingCart size={20} />
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
