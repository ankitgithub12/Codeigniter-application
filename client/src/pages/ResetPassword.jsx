import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, CheckCircle2, XCircle, ArrowLeft, RefreshCcw, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Access codes do not match');
      return;
    }
    if (password.length < 8) {
      setError('New access code must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess('Identity override successful. Access code updated.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Access override failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 md:p-8 bg-[#020617] text-slate-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass w-full max-w-lg rounded-[40px] border-white/5 p-10 md:p-16 relative overflow-hidden group shadow-2xl"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000">
          <RefreshCcw className="w-64 h-64 -mr-24 -mt-24 rotate-45" />
        </div>
        
        <Link to="/login" className="inline-flex items-center gap-3 text-[10px] font-black text-slate-500 hover:text-indigo-400 transition-all uppercase tracking-[0.3em] mb-12 relative z-10">
          <ArrowLeft className="w-4 h-4" />
          Abort Protocol
        </Link>

        <div className="relative z-10 mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Identity Override
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none mb-4">
            Access <span className="text-indigo-500">Restore</span>
          </h1>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-sm">
            Temporal link verified. Overwrite your current encryption code to re-establish network clearance.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-red-500/5 border border-red-500/20 text-red-500 p-5 rounded-2xl mb-10 flex items-center gap-4 relative z-10">
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-widest leading-loose">{error}</span>
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 p-5 rounded-2xl mb-10 flex items-center gap-4 relative z-10">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-widest leading-loose">{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {!success && (
          <form onSubmit={handleReset} className="space-y-8 relative z-10">
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">New Access Code // Encryption</label>
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

            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Re-verify Code // Confirmation</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none group-focus-within:text-indigo-500 transition-colors">
                  <Lock className="w-4 h-4 text-slate-600" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••••••" 
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-5 pl-16 pr-14 text-xs font-black text-white placeholder-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all tracking-[0.3em]"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-xl shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <RefreshCcw className="w-4 h-4" />
                  Apply Identity Override
                </>
              )}
            </button>
          </form>
        )}

        {success && (
          <div className="text-center mt-8 relative z-10">
             <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] animate-pulse">Redirecting to Login Sequence...</p>
          </div>
        )}

        <div className="mt-12 flex items-center justify-center gap-4 border-t border-white/5 pt-8 opacity-40">
           <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
           <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em]">Secure Link Transmission v4 // Complete</span>
           <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
