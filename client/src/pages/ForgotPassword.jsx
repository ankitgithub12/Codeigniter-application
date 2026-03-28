import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send } from 'lucide-react';

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
    <div className="flex justify-center items-center min-h-screen p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass w-full max-w-md p-8 shadow-2xl"
      >
        <Link to="/login" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-6 text-sm gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Recover</h1>
          <p className="text-slate-400">Enter your email for reset instructions</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-200 p-3 rounded-xl mb-6 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleForgot} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Account Email</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
              <input 
                type="email" 
                placeholder="teacher@university.edu" 
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Sending...' : (
              <>
                <Send className="w-5 h-5" />
                Send Reset Link
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
