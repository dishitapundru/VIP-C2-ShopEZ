import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useShop();

  const subtotal = cart.reduce((acc, item) => {
    const price = item.discountPrice || item.price;
    return acc + price * item.quantity;
  }, 0);

  const delivery = subtotal > 2000 ? 0 : 150;
  const total = subtotal + (cart.length > 0 ? delivery : 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="p-6 bg-gray-100 rounded-full mb-6">
          <ShoppingBag size={48} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-[#1e293b] mb-4">Your Cart is Empty</h2>
        <p className="text-[#475569] mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="px-8 py-3 bg-[#ff6b00] text-white rounded-full hover-glow-orange font-bold">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-2/3">
        <h2 className="text-3xl font-bold text-[#1e293b] mb-8">Shopping Cart</h2>
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item._id} className="glass p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-6 shadow-sm relative">
              <img src={item.images[0]} alt={item.title} className="w-24 h-24 object-cover rounded-xl" />
              
              <div className="flex-1 flex flex-col text-center sm:text-left">
                <Link to={`/products/${item._id}`} className="text-lg font-bold text-[#1e293b] hover:text-[#3a86ff] transition-colors">{item.title}</Link>
                <p className="text-sm text-gray-400 mb-2">{item.brand}</p>
                <span className="text-xl font-black text-[#1e293b]">₹{(item.discountPrice || item.price).toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="text-lg font-bold text-[#475569] hover:text-[#ff6b00] px-2">-</button>
                  <span className="text-md font-bold w-6 text-center text-[#1e293b]">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="text-lg font-bold text-[#475569] hover:text-[#3a86ff] px-2">+</button>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item._id)} 
                  className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-1/3">
        <div className="glass p-8 rounded-3xl sticky top-24 shadow-sm">
          <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b pb-4">Order Summary</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-[#475569]">
              <span>Subtotal</span>
              <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#475569]">
              <span>Delivery</span>
              <span className="font-semibold">{delivery === 0 ? 'Free' : `₹${delivery.toLocaleString('en-IN')}`}</span>
            </div>
            {delivery > 0 && (
              <p className="text-xs text-[#ffb703] bg-orange-50 p-2 rounded">Add ₹{(2000 - subtotal).toLocaleString('en-IN')} more to get free delivery!</p>
            )}
          </div>

          <div className="border-t pt-4 mb-8 flex justify-between items-center">
            <span className="text-lg font-bold text-[#1e293b]">Total</span>
            <span className="text-3xl font-black text-[#3a86ff]">₹{total.toLocaleString('en-IN')}</span>
          </div>

          <Link to="/checkout" className="w-full py-4 bg-[#ff6b00] text-white rounded-full hover-glow-orange font-bold text-lg flex justify-center items-center gap-2">
            Proceed to Checkout <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
