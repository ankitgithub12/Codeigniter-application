import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, UserPlus, ArrowLeft, Sparkles, BookOpen, Eye, EyeOff, ShieldCheck, CheckCircle2, XCircle, GraduationCap } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState({ score: 0, label: 'Very Weak', color: 'bg-slate-800' });
  const navigate = useNavigate();

  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-emerald-500'];
    
    setStrength({
      score: score,
      label: labels[Math.min(score, 4)],
      color: colors[Math.min(score, 4)]
    });
  };

  const validateForm = () => {
    if (formData.first_name.length < 2) return "First name must be at least 2 characters";
    if (formData.last_name.length < 2) return "Last name must be at least 2 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Invalid email format";
    if (formData.password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(formData.password)) return "Password needs an uppercase letter";
    if (!/[0-9]/.test(formData.password)) return "Password needs a number";
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', formData);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 md:p-12 bg-[#020617] text-slate-300">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glass w-full max-w-5xl flex flex-col lg:flex-row shadow-2xl overflow-hidden rounded-[40px] border border-white/5"
      >
        {/* Left Branding panel */}
        <div className="hidden lg:flex lg:w-2/5 bg-indigo-600 p-16 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-700/80 via-indigo-900/90 to-slate-950 z-10" />
          
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-[80px]" />
          </div>

          <div className="z-20">
            <Link to="/login" className="inline-flex items-center text-slate-400 hover:text-white transition-all mb-24 text-[9px] font-black tracking-[0.4em] uppercase group">
              <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" />
              Return to Terminal
            </Link>
            
            <div className="flex items-center gap-4 mb-10">
              <div className="bg-white/10 p-3 rounded-xl border border-white/20 backdrop-blur-xl">
                 <GraduationCap className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white tracking-widest uppercase italic">Edu<span className="text-cyan-400">Flux</span></span>
            </div>

            <h1 className="text-6xl font-black text-white mb-6 leading-[0.9] tracking-tighter">
              JOIN THE <br /><span className="text-cyan-400">ACTIVE</span> <br />NETWORK.
            </h1>
            <p className="text-indigo-200/60 text-base font-bold uppercase tracking-[0.2em] leading-relaxed max-w-xs">
              Establish your administrative node within the EduFlux ecosystem.
            </p>
          </div>
          
          <div className="z-20 flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Registry v2.4 Open</span>
          </div>
        </div>

        {/* Form panel */}
        <div className="w-full lg:w-3/5 p-8 md:p-16 lg:p-20 bg-slate-950 relative overflow-hidden">
          <div className="mb-14 relative z-10">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-2 h-0.5 bg-indigo-500 rounded-full" />
               <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Node Initialization</span>
            </div>
            <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Profile <span className="text-slate-800">Establishment</span></h2>
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

          <form onSubmit={handleRegister} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Identity // First Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none group-focus-within:text-indigo-500 transition-colors">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="FIRST_NAME" 
                    className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-xs font-black text-white placeholder-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase tracking-widest"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Identity // Last Name</label>
                <input 
                  type="text" 
                  placeholder="LAST_NAME" 
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-5 px-8 text-xs font-black text-white placeholder-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase tracking-widest"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  required
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Encryption Code // Password</label>
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${strength.score > 2 ? 'text-emerald-500' : 'text-slate-600'}`}>
                  {strength.label}
                </span>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none group-focus-within:text-indigo-500 transition-colors">
                  <Lock className="w-4 h-4 text-slate-600" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••••••" 
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-5 pl-16 pr-14 text-xs font-black text-white placeholder-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all tracking-[0.3em]"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({...formData, password: e.target.value});
                    calculateStrength(e.target.value);
                  }}
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
              
              {/* Strength Meter */}
              <div className="flex gap-2 px-1 mt-3">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 flex-grow rounded-full transition-all duration-700 ${i < strength.score ? strength.color : 'bg-slate-900'}`} 
                  />
                ))}
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
                  <UserPlus className="w-4 h-4" />
                  Establish Node
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">
            Linked to the Network? {' '}
            <Link to="/login" className="text-indigo-400 font-black hover:text-indigo-300 transition-all pb-1 border-b border-white/5 hover:border-indigo-400 ml-2">
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
