import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CreditCard, ClipboardList, CheckCircle, ChevronRight, ChevronLeft, Smartphone, Wallet, Building2, Banknote } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Shipping', icon: MapPin },
  { id: 2, label: 'Payment', icon: CreditCard },
  { id: 3, label: 'Review', icon: ClipboardList },
];

const PAYMENT_METHODS = [
  { id: 'COD', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when your order arrives', color: 'text-green-600' },
  { id: 'UPI', label: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm', color: 'text-[#3a86ff]' },
  { id: 'Credit Card', label: 'Credit Card', icon: CreditCard, desc: 'Visa, Mastercard, Amex', color: 'text-purple-600' },
  { id: 'Debit Card', label: 'Debit Card', icon: CreditCard, desc: 'All major bank debit cards', color: 'text-[#ff6b00]' },
  { id: 'Net Banking', label: 'Net Banking', icon: Building2, desc: 'All Indian banks supported', color: 'text-teal-600' },
  { id: 'Wallet', label: 'Wallet', icon: Wallet, desc: 'Paytm, Amazon Pay, Mobikwik', color: 'text-pink-600' },
];

export default function Checkout() {
  const { cart, clearCart } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placing, setPlacing] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    street: '', city: '', state: '', postalCode: '', country: 'India'
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);
  const delivery = subtotal > 2000 ? 0 : 150;
  const total = subtotal + (cart.length > 0 ? delivery : 0);

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty.</h2>
        <button onClick={() => navigate('/products')} className="px-6 py-3 bg-[#ff6b00] text-white rounded-full font-bold">Go Shopping</button>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!user) { toast.error('Please login to place an order'); navigate('/login'); return; }
    setPlacing(true);
    try {
      const orderData = {
        products: cart.map(item => ({ product: item._id, quantity: item.quantity, price: item.discountPrice || item.price })),
        shippingAddress,
        totalAmount: total,
        paymentMethod
      };
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      await axios.post('/api/orders', orderData, config);
      toast.success('Order placed successfully');
      clearCart();
      navigate('/success');
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      console.error(error);
    } finally {
      setPlacing(false);
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const isAddressComplete = shippingAddress.street && shippingAddress.city && shippingAddress.state && shippingAddress.postalCode && shippingAddress.country;

  const OrderSummaryCard = () => (
    <div className="glass p-6 rounded-3xl sticky top-24">
      <h3 className="text-lg font-bold text-[#1e293b] mb-4 border-b pb-3">Order Summary</h3>
      <div className="space-y-3 mb-4 max-h-52 overflow-y-auto">
        {cart.map(item => (
          <div key={item._id} className="flex items-center gap-3 border-b pb-3">
            <img src={item.images[0]} alt={item.title} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-[#1e293b] line-clamp-1">{item.title}</h4>
              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
            </div>
            <span className="text-xs font-bold text-[#1e293b] flex-shrink-0">₹{((item.discountPrice || item.price) * item.quantity).toLocaleString('en-IN')}</span>
          </div>
        ))}
      </div>
      <div className="space-y-2 text-sm text-[#475569]">
        <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span></div>
        <div className="flex justify-between"><span>Delivery</span><span className="font-semibold">{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
      </div>
      <div className="border-t mt-3 pt-3 flex justify-between items-center">
        <span className="text-base font-bold text-[#1e293b]">Total</span>
        <span className="text-2xl font-black text-[#3a86ff]">₹{total.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Step Progress */}
      <div className="flex items-center justify-center mb-10">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${step >= s.id ? 'bg-[#ff6b00] text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
              <s.icon size={16} />
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-8 sm:w-16 mx-1 transition-all ${step > s.id ? 'bg-[#ff6b00]' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            {/* STEP 1: Shipping */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="glass p-8 rounded-3xl">
                  <h2 className="text-2xl font-bold text-[#1e293b] mb-6 flex items-center gap-2">
                    <MapPin className="text-[#ff6b00]" size={24} /> Shipping Details
                  </h2>
                  <form onSubmit={handleAddressSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-[#475569] mb-2">Street Address *</label>
                      <input type="text" value={shippingAddress.street} onChange={e => setShippingAddress({...shippingAddress, street: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3a86ff] transition-all text-sm" placeholder="House no., Street, Area" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#475569] mb-2">City *</label>
                        <input type="text" value={shippingAddress.city} onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3a86ff] transition-all text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#475569] mb-2">State *</label>
                        <input type="text" value={shippingAddress.state} onChange={e => setShippingAddress({...shippingAddress, state: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3a86ff] transition-all text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#475569] mb-2">Postal Code *</label>
                        <input type="text" value={shippingAddress.postalCode} onChange={e => setShippingAddress({...shippingAddress, postalCode: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3a86ff] transition-all text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#475569] mb-2">Country</label>
                        <input type="text" value={shippingAddress.country} onChange={e => setShippingAddress({...shippingAddress, country: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3a86ff] transition-all text-sm" />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-4 mt-2 bg-[#ff6b00] text-white rounded-full font-bold text-lg hover-glow-orange flex items-center justify-center gap-2">
                      Continue to Payment <ChevronRight size={20} />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Payment */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="glass p-8 rounded-3xl">
                  <h2 className="text-2xl font-bold text-[#1e293b] mb-6 flex items-center gap-2">
                    <CreditCard className="text-[#ff6b00]" size={24} /> Select Payment Method
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {PAYMENT_METHODS.map(pm => (
                      <button key={pm.id} onClick={() => setPaymentMethod(pm.id)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${paymentMethod === pm.id ? 'border-[#ff6b00] bg-orange-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                      >
                        <div className={`p-2 rounded-full bg-gray-100 ${pm.color}`}><pm.icon size={20} /></div>
                        <div>
                          <p className="font-bold text-[#1e293b] text-sm">{pm.label}</p>
                          <p className="text-xs text-gray-400">{pm.desc}</p>
                        </div>
                        {paymentMethod === pm.id && <div className="ml-auto w-5 h-5 bg-[#ff6b00] rounded-full flex items-center justify-center"><CheckCircle size={14} className="text-white fill-white" /></div>}
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'UPI' && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <label className="block text-sm font-medium text-[#475569] mb-2">Enter UPI ID</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3a86ff] text-sm" placeholder="yourname@upi" />
                    </div>
                  )}
                  {(paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') && (
                    <div className="mb-6 p-4 bg-purple-50 rounded-2xl border border-purple-100 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#475569] mb-2">Card Number</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3a86ff] text-sm" placeholder="1234 5678 9012 3456" maxLength={19} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#475569] mb-2">Expiry</label>
                          <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3a86ff] text-sm" placeholder="MM/YY" maxLength={5} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#475569] mb-2">CVV</label>
                          <input type="password" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3a86ff] text-sm" placeholder="•••" maxLength={3} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="flex-1 py-4 border-2 border-gray-200 text-[#475569] rounded-full font-bold flex items-center justify-center gap-2 hover:border-[#ff6b00] transition-all">
                      <ChevronLeft size={18} /> Back
                    </button>
                    <button onClick={() => setStep(3)} className="flex-1 py-4 bg-[#ff6b00] text-white rounded-full font-bold hover-glow-orange flex items-center justify-center gap-2">
                      Review Order <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Review */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="glass p-8 rounded-3xl space-y-6">
                  <h2 className="text-2xl font-bold text-[#1e293b] flex items-center gap-2">
                    <ClipboardList className="text-[#ff6b00]" size={24} /> Review Your Order
                  </h2>

                  {/* Shipping Summary */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-[#1e293b] text-sm flex items-center gap-1"><MapPin size={14} className="text-[#ff6b00]" /> Shipping To</h4>
                      <button onClick={() => setStep(1)} className="text-xs text-[#3a86ff] font-semibold hover:underline">Edit</button>
                    </div>
                    <p className="text-sm text-[#475569]">{shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}, {shippingAddress.country}</p>
                  </div>

                  {/* Payment Summary */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-[#1e293b] text-sm flex items-center gap-1"><CreditCard size={14} className="text-[#ff6b00]" /> Payment</h4>
                      <button onClick={() => setStep(2)} className="text-xs text-[#3a86ff] font-semibold hover:underline">Edit</button>
                    </div>
                    <p className="text-sm text-[#475569] mt-1">{paymentMethod}</p>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStep(2)} className="flex-1 py-4 border-2 border-gray-200 text-[#475569] rounded-full font-bold flex items-center justify-center gap-2 hover:border-[#ff6b00] transition-all">
                      <ChevronLeft size={18} /> Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={placing}
                      className="flex-1 py-4 bg-[#ff6b00] text-white rounded-full font-bold text-lg hover-glow-orange disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {placing ? <><span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5" />Placing...</> : <><CheckCircle size={20} /> Place Order</>}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-1/3">
            <OrderSummaryCard />
          </div>
        </div>
      </AnimatePresence>
    </div>
  );
}
