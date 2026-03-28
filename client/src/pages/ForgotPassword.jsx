import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Send, ShieldCheck, XCircle, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess('Reset link sent! Check your inbox.');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
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
          <Mail className="w-64 h-64 -mr-24 -mt-24 rotate-12" />
        </div>
        
        <Link to="/login" className="inline-flex items-center gap-3 text-[10px] font-black text-slate-500 hover:text-indigo-400 transition-all uppercase tracking-[0.3em] mb-12 relative z-10">
          <ArrowLeft className="w-4 h-4" />
          Return to Terminal
        </Link>

        <div className="relative z-10 mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Protocol: Recovery
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none mb-4">
            Identity <span className="text-indigo-500">Restore</span>
          </h1>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-sm">
            Initialize sequential recovery protocols. Enter your verified email node to transmit a secure reset link.
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
              <span className="text-[10px] font-black uppercase tracking-widest">{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleForgot} className="space-y-8 relative z-10">
          <div className="space-y-3">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Network Identity // Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none transition-transform group-hover:scale-110">
                <Mail className="w-4 h-4 text-slate-600 group-focus-within:text-indigo-400" />
              </div>
              <input 
                type="email" 
                placeholder="ADMIN@VERIFIED.HOST" 
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-xs font-black text-white placeholder-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase tracking-widest"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                <Send className="w-4 h-4" />
                Transmit Link
              </>
            )}
          </button>
        </form>

        <div className="mt-12 flex items-center justify-center gap-4 border-t border-white/5 pt-8 opacity-40">
           <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
           <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em]">Secure Link Transmission v4 // Active</span>
           <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
