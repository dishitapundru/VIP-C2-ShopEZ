import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cart, clearCart } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    street: '', city: '', state: '', postalCode: '', country: ''
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);
  const delivery = subtotal > 2000 ? 0 : 150;
  const total = subtotal + (cart.length > 0 ? delivery : 0);

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty.</h2>
        <button onClick={() => navigate('/products')} className="px-6 py-3 bg-[#ff6b00] text-white rounded-full">Go Shopping</button>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    try {
      const orderData = {
        products: cart.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.discountPrice || item.price
        })),
        shippingAddress,
        totalAmount: total
      };

      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      };

      await axios.post('/api/orders', orderData, config);
      toast.success('Order placed successfully');
      alert('Order placed successfully');
      clearCart();
      navigate('/success');
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      console.error(error);
    }
  };

  const handleChange = (e) => setShippingAddress({...shippingAddress, [e.target.name]: e.target.value});

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      {/* Shipping Form */}
      <div className="w-full lg:w-2/3">
        <div className="glass p-8 rounded-3xl">
          <h2 className="text-3xl font-bold text-[#1e293b] mb-8 border-b pb-4">Shipping Details</h2>
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">Street Address</label>
              <input type="text" name="street" value={shippingAddress.street} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3a86ff] transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-2">City</label>
                <input type="text" name="city" value={shippingAddress.city} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3a86ff] transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-2">State</label>
                <input type="text" name="state" value={shippingAddress.state} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3a86ff] transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-2">Postal Code</label>
                <input type="text" name="postalCode" value={shippingAddress.postalCode} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3a86ff] transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-2">Country</label>
                <input type="text" name="country" value={shippingAddress.country} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3a86ff] transition-all" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-[#1e293b] mt-10 mb-4 border-b pb-2">Payment Method</h3>
            <div className="p-4 border-2 border-[#3a86ff] bg-blue-50 rounded-xl flex items-center gap-3">
              <input type="radio" checked readOnly className="w-5 h-5 text-[#3a86ff]" />
              <span className="font-semibold text-[#1e293b]">Cash on Delivery (COD)</span>
            </div>

            <button type="submit" className="w-full py-4 mt-8 bg-[#ff6b00] text-white rounded-full hover-glow-orange font-bold text-lg">
              Place Order
            </button>
          </form>
        </div>
      </div>

      {/* Order Summary */}
      <div className="w-full lg:w-1/3">
        <div className="glass p-8 rounded-3xl sticky top-24">
          <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b pb-4">Order Summary</h3>
          <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
            {cart.map(item => (
              <div key={item._id} className="flex items-center gap-4 border-b pb-4">
                <img src={item.images[0]} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[#1e293b] line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <span className="font-bold text-[#1e293b]">₹{((item.discountPrice || item.price) * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-[#475569]">
              <span>Subtotal</span>
              <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#475569]">
              <span>Delivery</span>
              <span className="font-semibold">{delivery === 0 ? 'Free' : `₹${delivery.toLocaleString('en-IN')}`}</span>
            </div>
          </div>

          <div className="border-t pt-4 flex justify-between items-center">
            <span className="text-lg font-bold text-[#1e293b]">Total</span>
            <span className="text-3xl font-black text-[#3a86ff]">₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
