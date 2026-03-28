import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, Sparkles, BookOpen, Eye, EyeOff, GraduationCap } from 'lucide-react';

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
    <div className="flex min-h-screen bg-[#020617] text-slate-300">
      {/* Decorative Panel - The High-Tech "Why" */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-indigo-600 p-24 flex-col justify-between border-r border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700/80 via-indigo-900/90 to-slate-950 z-10" />
        
        {/* Animated Background Grids/Glows */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[100px] animate-float" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-150" />
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20"
        >
          <div className="flex items-center gap-4 mb-16">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-xl">
               <GraduationCap className="text-white w-8 h-8" />
            </div>
            <span className="text-3xl font-black text-white tracking-widest uppercase italic">Edu<span className="text-cyan-400">Flux</span></span>
          </div>
          
          <h1 className="text-7xl font-black text-white leading-[0.9] tracking-tighter mb-10">
            CONTROL <br /><span className="text-cyan-400">EVERY</span> <br />ENTITY.
          </h1>
          <p className="text-indigo-200/60 text-lg font-bold uppercase tracking-[0.2em] max-w-sm leading-relaxed">
            The next generation of acoustic-grade academic management protocols. 
          </p>
        </motion.div>

        <div className="relative z-20 flex items-center gap-6">
           <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Network Active</span>
           </div>
           <span className="text-[10px] font-black text-indigo-400/40 uppercase tracking-[0.3em]">v4.2.0 // EST. 2026</span>
        </div>
      </div>

      {/* Login Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-24 relative overflow-hidden">
        {/* Mobile Logo */}
        <div className="absolute top-12 lg:hidden">
           <span className="text-2xl font-black text-white tracking-widest uppercase italic">Edu<span className="text-indigo-500">Flux</span></span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-2 h-0.5 bg-indigo-500 rounded-full" />
               <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Authorization Required</span>
            </div>
            <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Identity <span className="text-slate-800">Verification</span></h2>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-red-500/5 border border-red-500/20 text-red-500 p-5 rounded-2xl mb-10 flex items-center gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest leading-loose">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Terminal ID // Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none group-focus-within:text-indigo-500 transition-colors">
                  <Mail className="w-4 h-4 text-slate-600" />
                </div>
                <input 
                  type="email" 
                  placeholder="ADMIN@EDUFLUX.SYS" 
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-xs font-black text-white placeholder-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase tracking-widest"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Access Code // Password</label>
                <Link to="/forgot-password" className="text-[9px] text-indigo-500 hover:text-indigo-400 font-black transition-colors uppercase tracking-[0.2em] border-b border-transparent hover:border-indigo-500/50 pb-0.5">
                  Forgot Code?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none group-focus-within:text-indigo-500 transition-colors">
                  <Lock className="w-4 h-4 text-slate-600" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••••••" 
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-5 pl-16 pr-14 text-xs font-black text-white placeholder-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all tracking-[0.3em]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 hover:text-indigo-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] mt-6 flex items-center justify-center gap-4 shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Initialize Session
                </>
              )}
            </button>
          </form>

          <footer className="mt-14 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">New to the Network?</span>
            <Link to="/register" className="px-6 py-3 rounded-xl bg-white/2 border border-white/5 text-[9px] font-black text-white uppercase tracking-[0.2em] hover:bg-white/5 transition-all">
              Establish Profile
            </Link>
          </footer>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
