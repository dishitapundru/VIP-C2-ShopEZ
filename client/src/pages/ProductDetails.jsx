import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  
  const { addToCart, toggleWishlist, wishlist } = useShop();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data.data);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#3a86ff]"></div>
    </div>
  );

  if (!product) return <div className="text-center text-xl mt-20">Product not found.</div>;

  const isWishlisted = wishlist.find(w => w._id === product._id);

  return (
    <div className="max-w-6xl mx-auto glass rounded-3xl p-6 md:p-10">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Images Section */}
        <div className="w-full md:w-1/2 flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-4 overflow-x-auto md:w-24">
            {product.images.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                onClick={() => setActiveImg(idx)}
                className={`w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl cursor-pointer border-2 transition-all ${activeImg === idx ? 'border-[#3a86ff] scale-105 shadow-md' : 'border-transparent hover:border-gray-300'}`}
                alt="thumbnail"
              />
            ))}
          </div>
          <div className="flex-1 relative overflow-hidden rounded-2xl bg-white shadow-sm group">
            <img 
              src={product.images[activeImg]} 
              alt={product.title} 
              className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-500 group-hover:scale-125 origin-center cursor-zoom-in"
            />
            {product.discountPrice && (
              <div className="absolute top-4 left-4 bg-[#ef476f] text-white text-sm font-bold px-4 py-1.5 rounded-full z-10 shadow-lg">
                {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
              </div>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 flex flex-col">
          <p className="text-sm font-bold text-[#ffb703] tracking-widest uppercase mb-2">{product.brand}</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1e293b] mb-4 leading-tight">{product.title}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center bg-[#ffb703]/10 px-3 py-1 rounded-full">
              <Star size={16} className="fill-[#ffb703] text-[#ffb703] mr-1" />
              <span className="font-bold text-[#ffb703]">{product.ratings}</span>
            </div>
            <span className="text-[#475569] font-medium underline cursor-pointer">{product.numReviews} verified reviews</span>
          </div>

          <div className="flex items-end gap-4 mb-8">
            {product.discountPrice ? (
              <>
                <span className="text-4xl font-black text-[#1e293b]">₹{product.discountPrice.toLocaleString('en-IN')}</span>
                <span className="text-xl text-gray-400 line-through mb-1">₹{product.price.toLocaleString('en-IN')}</span>
              </>
            ) : (
              <span className="text-4xl font-black text-[#1e293b]">₹{product.price.toLocaleString('en-IN')}</span>
            )}
          </div>

          <p className="text-[#475569] text-lg leading-relaxed mb-8">{product.description}</p>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="mb-8">
              <h3 className="font-bold text-[#1e293b] mb-3">Key Features:</h3>
              <ul className="list-disc pl-5 space-y-2 text-[#475569]">
                {product.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-auto space-y-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-xl font-bold text-[#475569] hover:text-[#ff6b00] px-2">-</button>
                <span className="text-lg font-bold w-8 text-center text-[#1e293b]">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="text-xl font-bold text-[#475569] hover:text-[#3a86ff] px-2">+</button>
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">In Stock ({product.stock})</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => addToCart(product, qty)}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#ff6b00] text-white rounded-full hover-glow-orange font-bold text-lg shadow-lg"
              >
                <ShoppingCart size={22} /> Add to Cart
              </button>
              
              <button 
                onClick={() => {
                  const success = addToCart(product, qty);
                  if (success) {
                    navigate('/checkout');
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#3a86ff] text-white rounded-full hover-glow-blue font-bold text-lg shadow-lg"
              >
                Buy Now
              </button>
              
              <button 
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-full border-2 transition-all shadow-md hover-glow-red ${isWishlisted ? 'border-[#ef476f] bg-[#ef476f]/10' : 'border-gray-200 bg-white hover:border-[#ef476f]'}`}
              >
                <Heart size={24} className={isWishlisted ? "fill-[#ef476f] text-[#ef476f]" : "text-[#475569]"} />
              </button>
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-gray-200">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-blue-50 text-[#3a86ff] rounded-full"><Truck size={24} /></div>
              <span className="text-xs font-bold text-[#475569]">Free Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-orange-50 text-[#ff6b00] rounded-full"><RotateCcw size={24} /></div>
              <span className="text-xs font-bold text-[#475569]">30 Days Return</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-green-50 text-green-500 rounded-full"><ShieldCheck size={24} /></div>
              <span className="text-xs font-bold text-[#475569]">Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
