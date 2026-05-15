import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Success() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="p-6 bg-green-50 rounded-full mb-8"
      >
        <CheckCircle size={80} className="text-[#06d6a0]" />
      </motion.div>
      <h1 className="text-4xl font-extrabold text-[#1e293b] mb-4">Order placed successfully</h1>
      <p className="text-[#475569] text-lg mb-8 max-w-lg">
        Thank you for your purchase. We've received your order and are getting it ready to be shipped.
      </p>
      <div className="flex gap-4">
        <Link to="/products" className="px-8 py-3 bg-[#ff6b00] text-white rounded-full hover-glow-orange font-bold text-lg shadow-lg">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
