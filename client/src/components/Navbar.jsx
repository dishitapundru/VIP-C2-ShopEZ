
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart, wishlist } = useShop();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="glass sticky top-0 z-50 py-4 px-6 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-[#ff6b00]">ShopEZ</Link>
        <div className="flex space-x-6 items-center">
          <Link to="/" className="text-[#475569] hover:text-[#ff6b00] transition-colors font-medium">Home</Link>
          <Link to="/wishlist" className="relative text-[#475569] hover:text-[#ef476f] transition-colors">
            <Heart size={24} />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#ef476f] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative text-[#475569] hover:text-[#3a86ff] transition-colors">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#3a86ff] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex gap-4 items-center pl-4 border-l border-gray-200">
               <span className="text-sm font-medium">Hi, {user.name}</span>
               <button onClick={logout} className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-all font-medium text-sm">Logout</button>
            </div>
          ) : (
            <div className="pl-4 border-l border-gray-200">
              <Link to="/login" className="px-6 py-2.5 bg-gradient-to-r from-[#ff6b00] to-[#ffb703] text-white rounded-full hover-glow-orange transition-all font-medium inline-block">Login</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
