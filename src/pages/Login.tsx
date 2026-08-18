import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithPopup, googleProvider } from '../firebase';
import { motion } from 'motion/react';
import { BookOpen, Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { toast } from 'sonner';

export default function Login({ user }: { user: any }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2rem] shadow-xl shadow-blue-100/50 border border-gray-100 p-8 lg:p-12"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-blue-600 p-3 rounded-2xl mb-6 shadow-lg shadow-blue-200">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-500">
            {isLogin ? 'Start learning where you left off.' : 'Join thousands of students today.'}
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-200 py-3.5 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            <span>Continue with Google</span>
          </button>
          <button className="w-full flex items-center justify-center space-x-3 bg-gray-900 py-3.5 rounded-xl font-bold text-white hover:bg-gray-800 transition-all shadow-sm">
            <Github className="w-5 h-5" />
            <span>Continue with Github</span>
          </button>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-400 font-medium uppercase tracking-widest text-[10px]">Or continue with email</span>
          </div>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                placeholder="name@example.com"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm"
              />
            </div>
          </div>

          {isLogin && (
            <div className="flex justify-end">
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">Forgot Password?</button>
            </div>
          )}

          <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center group">
            {isLogin ? 'Login' : 'Sign Up'}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isLogin ? 'Create one' : 'Login here'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
