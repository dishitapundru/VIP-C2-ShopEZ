import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { motion } from 'framer-motion';

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useShop();

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="p-6 bg-red-50 rounded-full mb-6">
          <Heart size={48} className="text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-[#1e293b] mb-4">Your Wishlist is Empty</h2>
        <p className="text-[#475569] mb-8">Save items you love here to easily find them later.</p>
        <Link to="/products" className="px-8 py-3 bg-[#3a86ff] text-white rounded-full hover-glow-blue font-bold">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-[#1e293b] mb-8">My Wishlist</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            key={product._id} 
            className="group glass rounded-3xl overflow-hidden flex flex-col relative bg-white shadow-sm"
          >
            <button 
              onClick={() => toggleWishlist(product)}
              className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full z-10 hover:bg-red-50 transition-all shadow-sm"
            >
              <Trash2 size={20} className="text-red-500" />
            </button>

            <div className="h-48 overflow-hidden">
              <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-[#1e293b] mb-1 line-clamp-1">{product.title}</h3>
              <p className="text-sm font-semibold text-[#3a86ff] uppercase tracking-wider mb-4">{product.brand}</p>
              
              <div className="mt-auto flex justify-between items-center mb-4">
                <span className="text-xl font-black text-[#1e293b]">₹{(product.discountPrice || product.price).toLocaleString('en-IN')}</span>
              </div>
              
              <button 
                onClick={() => addToCart(product)}
                className="w-full py-3 bg-[#ff6b00] text-white rounded-full hover-glow-orange font-bold text-sm flex justify-center items-center gap-2"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
