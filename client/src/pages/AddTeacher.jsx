import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, UserPlus, GraduationCap, Calendar, User, Mail, Lock, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';

const AddTeacher = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    university_name: '',
    gender: 'male',
    year_joined: new Date().getFullYear()
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/teachers/register-teacher', formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to sync teacher record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-300 overflow-hidden selection:bg-indigo-500/30">
      {/* Detached Sidebar - Nav only */}
      <aside className="w-[340px] p-8 hidden xl:flex flex-col gap-10 opacity-40 hover:opacity-100 transition-opacity">
        <div className="glass h-full rounded-[48px] border-white/5 flex flex-col p-10 relative overflow-hidden">
          <Link to="/dashboard" className="flex items-center gap-5 mb-20 px-4 group">
            <div className="p-4 bg-slate-900 rounded-3xl border border-white/5 group-hover:border-indigo-500/50 transition-all">
              <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-1">Return To</span>
              <span className="text-xl font-black text-white tracking-widest uppercase italic leading-none group-hover:text-indigo-400">Command</span>
            </div>
          </Link>

          <footer className="mt-auto pt-10 border-t border-white/5">
             <div className="px-4">
               <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] leading-relaxed mb-4">Registry Node // Admin Enrollment Sequence Activated</p>
               <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-500 w-1/4 animate-pulse" />
               </div>
             </div>
          </footer>
        </div>
      </aside>

      <main className="flex-grow flex flex-col p-8 lg:p-10 overflow-hidden">
        <header className="mb-14 flex justify-between items-center px-6">
          <div className="flex flex-col">
            <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.6em] mb-4">Single API Node Enrollment</h2>
            <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
              New <span className="text-slate-800 tracking-[-0.1em]">Registry</span> Node
            </h1>
          </div>
          <div className="bg-indigo-600/10 px-6 py-3 rounded-2xl border border-indigo-500/20 text-indigo-400 text-[10px] font-black tracking-widest uppercase italic">
            Sequence Step: {step} // 02
          </div>
        </header>

        <section className="flex-grow overflow-y-auto px-6 custom-scrollbar pb-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass max-w-4xl p-1.5 rounded-[48px] border-white/5 shadow-2xl relative overflow-hidden group">
            
            <div className="p-16 md:p-20 bg-slate-950/40 rounded-[44px]">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-red-500/5 border border-red-500/20 text-red-500 p-6 rounded-3xl mb-12 flex items-center gap-6">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="text-[11px] font-black text-red-500 uppercase tracking-widest">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-16">
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-12">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Identity // First Name</label>
                          <div className="relative group/field">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none group-focus-within/field:text-indigo-500 transition-colors">
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
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Identity // Last Name</label>
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Terminal ID // Email</label>
                          <div className="relative group/field">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none group-focus-within/field:text-indigo-500 transition-colors">
                              <Mail className="w-4 h-4 text-slate-600" />
                            </div>
                            <input 
                              type="email" 
                              placeholder="NODE@EDUFLUX.SYS" 
                              className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-xs font-black text-white placeholder-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase tracking-widest"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Encryption // Password</label>
                          <div className="relative group/field">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none group-focus-within/field:text-indigo-500 transition-colors">
                              <Lock className="w-4 h-4 text-slate-600" />
                            </div>
                            <input 
                              type="password" 
                              placeholder="••••••••••••" 
                              className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-xs font-black text-white hover:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all tracking-[0.3em]"
                              value={formData.password}
                              onChange={(e) => setFormData({...formData, password: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-8">
                        <button 
                          type="button" 
                          onClick={() => setStep(2)}
                          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 active:scale-95 transition-all shadow-xl shadow-indigo-600/20 group"
                        >
                          Initialize Step 02
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-12">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Institutional Allocation // Node</label>
                        <div className="relative group/field">
                          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none group-focus-within/field:text-indigo-500 transition-colors">
                            <GraduationCap className="w-4 h-4 text-slate-600" />
                          </div>
                          <input 
                            type="text" 
                            placeholder="HARVARD_UNIVERSITY_OS" 
                            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-xs font-black text-white placeholder-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase tracking-widest"
                            value={formData.university_name}
                            onChange={(e) => setFormData({...formData, university_name: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Bio Profile // Gender</label>
                          <div className="flex gap-3">
                            {['male', 'female', 'other'].map(g => (
                              <button
                                key={g}
                                type="button"
                                onClick={() => setFormData({...formData, gender: g})}
                                className={`flex-grow py-5 rounded-2xl text-[9px] font-black text-center uppercase tracking-[0.2em] transition-all border ${formData.gender === g ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-600/20' : 'bg-slate-900/50 text-slate-600 border-white/5 hover:border-white/10'}`}
                              >
                                {g}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Network Entry // Year</label>
                          <div className="relative group/field">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none group-focus-within/field:text-indigo-500 transition-colors">
                              <Calendar className="w-4 h-4 text-slate-600" />
                            </div>
                            <input 
                              type="number" 
                              className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-xs font-black text-white hover:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all tracking-widest"
                              value={formData.year_joined}
                              onChange={(e) => setFormData({...formData, year_joined: parseInt(e.target.value)})}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-8 flex gap-5">
                        <button 
                          type="button" 
                          onClick={() => setStep(1)}
                          className="px-10 py-5 rounded-2xl bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest border border-white/5 hover:bg-white/10 transition-all"
                        >
                          Modify Step 01
                        </button>
                        <button 
                          type="submit" 
                          disabled={loading}
                          className="flex-grow bg-indigo-600 hover:bg-indigo-500 text-white p-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 active:scale-95 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50"
                        >
                          {loading ? (
                             <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              Finalize Enrollment
                              <CheckCircle2 className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default AddTeacher;
