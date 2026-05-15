import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, ShoppingBag, ShieldCheck, Zap, Truck, Star, ShoppingCart, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const trendingProducts = products.slice(0, 4);
  const flashSaleProducts = products.filter(p => p.discountPrice).slice(0, 4);

  const categories = [
    { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=400&q=80' },
    { name: 'Watches', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=400&q=80' },
    { name: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80' },
    { name: 'Laptops', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80' }
  ];

  const ProductCard = ({ product }) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group glass rounded-2xl overflow-hidden flex flex-col relative bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full"
    >
      {product.discountPrice && (
        <div className="absolute top-3 left-3 bg-[#ef476f] text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
        </div>
      )}
      
      <button 
        onClick={() => toggleWishlist(product)}
        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full z-10 hover-glow-red transition-all shadow-sm"
      >
        <Heart size={18} className={wishlist.find(w => w._id === product._id) ? "fill-[#ef476f] text-[#ef476f]" : "text-gray-400"} />
      </button>

      <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => navigate(`/products/${product._id}`)}>
        <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs font-bold text-[#ffb703] uppercase tracking-wider mb-1">{product.brand}</p>
        <h3 className="text-md font-bold text-[#1e293b] mb-1 line-clamp-1 cursor-pointer hover:text-[#3a86ff]" onClick={() => navigate(`/products/${product._id}`)}>{product.title}</h3>
        
        <div className="flex items-center text-[#ffb703] text-xs font-bold mb-3">
          <Star size={12} className="fill-[#ffb703] mr-1" />
          {product.ratings} <span className="text-gray-400 ml-1 font-normal">({product.numReviews})</span>
        </div>
        
        <div className="mt-auto flex justify-between items-center">
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
          
          <button 
            onClick={() => addToCart(product)}
            className="p-2.5 bg-[#ff6b00] text-white rounded-full hover-glow-orange transition-all shadow-md"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col space-y-12 pb-12 w-full max-w-full m-0 p-0 overflow-x-hidden">
      
      {/* 1. Hero Banner */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center overflow-hidden bg-gray-900 rounded-3xl mx-auto max-w-[1400px]">
        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80" alt="Hero Background" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        
        <div className="relative z-10 px-8 md:px-16 w-full md:w-2/3">

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight"
          >
            Elevate Your <br/>Lifestyle Today.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-300 mb-10 max-w-xl leading-relaxed"
          >
            Discover the most premium products curated just for you. From high-end electronics to exclusive fashion.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.4 }} 
            className="flex gap-4"
          >
            <Link to="/products" className="px-8 py-4 bg-[#ff6b00] text-white rounded-full hover-glow-orange font-bold text-lg inline-flex items-center gap-2 shadow-[0_0_20px_rgba(255,107,0,0.4)]">
              Shop Now <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Feature Banner */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-[1400px] mx-auto w-full">
        <div className="glass p-6 rounded-2xl flex items-center gap-4 bg-white shadow-sm">
          <Truck size={32} className="text-[#3a86ff]" />
          <div>
            <h4 className="font-bold text-[#1e293b]">Free Shipping</h4>
            <p className="text-xs text-[#475569]">Orders over ₹2,000</p>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center gap-4 bg-white shadow-sm">
          <ShieldCheck size={32} className="text-[#06d6a0]" />
          <div>
            <h4 className="font-bold text-[#1e293b]">Secure Payment</h4>
            <p className="text-xs text-[#475569]">100% Secure</p>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center gap-4 bg-white shadow-sm">
          <Zap size={32} className="text-[#ffb703]" />
          <div>
            <h4 className="font-bold text-[#1e293b]">Fast Delivery</h4>
            <p className="text-xs text-[#475569]">24/7 Delivery</p>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center gap-4 bg-white shadow-sm">
          <ShoppingBag size={32} className="text-[#ef476f]" />
          <div>
            <h4 className="font-bold text-[#1e293b]">30 Days Return</h4>
            <p className="text-xs text-[#475569]">No questions asked</p>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories */}
      <section className="max-w-[1400px] mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-[#1e293b] mb-2">Shop by Category</h2>
            <p className="text-[#475569]">Explore our wide range of premium categories</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <Link to="/products" key={index} className="group relative h-48 md:h-64 rounded-3xl overflow-hidden cursor-pointer shadow-md">
              <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <h3 className="absolute bottom-6 left-6 text-white font-bold text-xl md:text-2xl">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Flash Sales */}
      {flashSaleProducts.length > 0 && (
        <section className="max-w-[1400px] mx-auto w-full bg-[#ffb703]/10 p-8 md:p-12 rounded-[3rem]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-[#ef476f] fill-[#ef476f]" size={24} />
                <h2 className="text-3xl font-extrabold text-[#1e293b]">Flash Sales</h2>
              </div>
              <p className="text-[#475569]">Grab them before they are gone!</p>
            </div>
            <Link to="/products" className="text-[#ff6b00] font-bold hover:underline hidden md:block">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {flashSaleProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Promotional Ad Banner */}
      <section className="max-w-[1400px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-lg group cursor-pointer" onClick={() => navigate('/products')}>
          <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 flex flex-col justify-center p-10">
            <h3 className="text-white font-extrabold text-3xl mb-2">New Arrival Shoes</h3>
            <p className="text-gray-200 mb-6 max-w-xs">Upgrade your style with our latest collection of premium sneakers.</p>
            <span className="text-white font-bold underline decoration-2 underline-offset-4">Shop Collection</span>
          </div>
        </div>
        <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-lg group cursor-pointer" onClick={() => navigate('/products')}>
          <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3a86ff]/80 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-center p-10">
            <h3 className="text-white font-extrabold text-3xl mb-2">Premium Audio</h3>
            <p className="text-gray-200 mb-6 max-w-xs">Immerse yourself with high-fidelity sound systems and headphones.</p>
            <span className="text-white font-bold underline decoration-2 underline-offset-4">Explore Gadgets</span>
          </div>
        </div>
      </section>

      {/* 6. Trending Products */}
      {trendingProducts.length > 0 && (
        <section className="max-w-[1400px] mx-auto w-full">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-[#1e293b] mb-2">Trending Right Now</h2>
              <p className="text-[#475569]">The most loved products by our customers</p>
            </div>
            <Link to="/products" className="text-[#ff6b00] font-bold hover:underline hidden md:block">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {trendingProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}



    </div>
  );
}
