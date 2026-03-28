import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, UserPlus, ArrowLeft, Sparkles, BookOpen, Eye, EyeOff, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

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
    <div className="flex justify-center items-center min-h-screen p-6 bg-[#020617] text-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass w-full max-w-4xl flex flex-col md:flex-row shadow-2xl overflow-hidden rounded-[24px]"
      >
        {/* Left Branding panel */}
        <div className="hidden md:flex md:w-2/5 bg-indigo-600 p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
          
          <div className="z-10">
            <Link to="/login" className="inline-flex items-center text-indigo-100 hover:text-white transition-colors mb-20 text-xs gap-2 font-black tracking-widest uppercase">
              <ArrowLeft className="w-4 h-4" />
              BACK TO LOGIN
            </Link>
            <BookOpen className="w-12 h-12 text-white mb-6" />
            <h1 className="text-4xl font-black text-white mb-4 leading-tight tracking-tighter">
              Join the <br />
              Circle of <br />
              <span className="text-cyan-300">Scholars</span>
            </h1>
            <p className="text-indigo-100/70 text-lg font-light leading-relaxed">
              Create your account to start managing your academic journeys with ease and elegance.
            </p>
          </div>
          
          <div className="flex gap-3 text-indigo-200">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">EduPortal v2.0</span>
          </div>
        </div>

        {/* Form panel */}
        <div className="w-full md:w-3/5 p-8 lg:p-12 bg-slate-900/40">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Registration</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Start your professional management today</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-8 flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest">Error:</span>
                <span className="text-sm font-medium">{error}</span>
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-2xl mb-8 flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-widest">{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 transition-colors group-focus-within:text-indigo-500" />
                  <input 
                    type="text" 
                    placeholder="John" 
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-12 text-lg text-white hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-light"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                <input 
                  type="text" 
                  placeholder="Doe" 
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-6 text-lg text-white hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-light"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 transition-colors group-focus-within:text-indigo-500" />
                <input 
                  type="email" 
                  placeholder="teacher@univ.edu" 
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-12 text-lg text-white hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-light"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Secure Password</label>
                <span className={`text-[10px] font-black uppercase tracking-widest ${strength.score > 2 ? 'text-emerald-500' : 'text-slate-500'}`}>
                  {strength.label}
                </span>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 transition-colors group-focus-within:text-indigo-500" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-12 text-lg text-white hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-light"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-indigo-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Strength Meter */}
              <div className="flex gap-1.5 px-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 flex-grow rounded-full transition-all duration-500 ${i < strength.score ? strength.color : 'bg-slate-800'}`} 
                  />
                ))}
              </div>
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tight mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Min 8 chars, uppercase & numbers recommended
              </p>
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
                  <UserPlus className="w-6 h-6" />
                  Create Profile
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-slate-500 text-[10px] font-black uppercase tracking-widest">
            Already have an account? {' '}
            <Link to="/login" className="text-indigo-400 font-black hover:text-indigo-300 transition-colors pb-1 border-b-2 border-transparent hover:border-indigo-400/50 ml-1">
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
