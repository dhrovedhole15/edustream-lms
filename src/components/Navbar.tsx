import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth, signInWithPopup, googleProvider } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Menu, 
  X,
  ShoppingCart,
  ShieldCheck,
  PlusCircle
} from 'lucide-react';

export default function Navbar({ user, userData }: { user: any, userData: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  const navLinks = [
    { name: 'Courses', path: '/courses' },
    { name: 'Categories', path: '/courses?category=all' },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">EduStream</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="relative group">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search courses..." 
                  className="bg-transparent border-none focus:ring-0 text-sm w-48"
                />
              </div>
            </div>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                  <LayoutDashboard className="w-5 h-5" />
                </Link>
                
                {userData?.role === 'instructor' && (
                  <Link to="/instructor" className="text-gray-600 hover:text-blue-600 transition-colors">
                    <PlusCircle className="w-5 h-5" />
                  </Link>
                )}

                {userData?.role === 'admin' && (
                  <Link to="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">
                    <ShieldCheck className="w-5 h-5" />
                  </Link>
                )}

                <div className="relative group">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <img 
                      src={userData?.profilePic || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full border border-gray-200"
                    />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 z-50">
                    <div className="p-4 border-b border-gray-50">
                      <p className="text-sm font-semibold text-gray-900 truncate">{userData?.displayName}</p>
                      <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link to="/profile" className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <User className="w-4 h-4 mr-3" /> Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                  Login
                </Link>
                <Link to="/login" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-sm">
                  Join for Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-50 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-3 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-50 space-y-2">
                {user ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center px-3 py-3 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg"
                    >
                      <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 py-3 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                    >
                      <LogOut className="w-5 h-5 mr-3" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-3 text-center text-base font-medium text-gray-600 hover:text-blue-600"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/login" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-3 text-center text-base font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Join for Free
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
