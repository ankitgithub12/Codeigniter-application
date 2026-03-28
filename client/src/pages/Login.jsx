import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, Sparkles, BookOpen, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-white">
      {/* Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-indigo-600">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700/80 to-purple-900/90 z-10" />
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-float" />
        </div>
        
        <div className="relative z-20 flex flex-col justify-center items-center h-full p-16 text-center">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="mb-12">
            <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md mb-8 inline-block shadow-2xl border border-white/20">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-6xl font-black text-white mb-6 leading-tight tracking-tighter">
              Empowering <br />
              <span className="text-cyan-300">Educators</span>
            </h1>
            <p className="text-indigo-100 text-lg max-w-md mx-auto font-light leading-relaxed">
              Experience the next generation of academic management with EduPortal. 
              Modern, fast, and beautifully designed.
            </p>
          </motion.div>
          <div className="flex gap-4 mt-8 opacity-40">
            <Sparkles className="w-5 h-5 text-indigo-200" />
            <Sparkles className="w-3 h-3 text-indigo-200" />
            <Sparkles className="w-4 h-4 text-indigo-200" />
          </div>
        </div>
      </div>

      {/* Login Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-950">
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-md px-4">
          <div className="mb-12 lg:hidden text-center">
            <div className="bg-indigo-600/20 p-3 rounded-2xl backdrop-blur-md mb-4 inline-block border border-indigo-500/20">
              <BookOpen className="w-10 h-10 text-indigo-500" />
            </div>
            <h2 className="text-3xl font-black text-white">EduPortal</h2>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-white mb-3 tracking-tight">Sign In</h2>
            <p className="text-slate-400 text-lg font-medium">Access your academic command center</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-8 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-sm font-bold uppercase tracking-widest">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input 
                type="email" 
                placeholder="teacher@univ.edu" 
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-6 text-lg text-white hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-light placeholder:text-slate-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <Link to="/forgot-password" size={20} className="text-[10px] text-indigo-400 hover:text-indigo-300 font-black transition-colors uppercase tracking-widest">
                  FORGOT?
                </Link>
              </div>
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-6 text-lg text-white hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-light placeholder:text-slate-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-indigo-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl text-xl font-black uppercase tracking-widest mt-6 flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-6 h-6" />
                  Enter Portal
                </>
              )}
            </button>
          </form>

          <footer className="mt-12 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">
            New to the portal? {' '}
            <Link to="/register" className="text-indigo-400 font-black hover:text-indigo-300 transition-colors border-b-2 border-transparent hover:border-indigo-400/50 pb-1 ml-1">
              Create Account
            </Link>
          </footer>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
