import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
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
      await axios.post('http://localhost:5000/api/teachers/register-teacher', formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to sync teacher record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] p-6 md:p-12 flex flex-col items-center text-white">
      <div className="w-full max-w-4xl">
        <header className="flex items-center justify-between mb-12">
          <Link to="/dashboard" className="group flex items-center gap-3 text-slate-500 hover:text-white transition-all">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-800 group-hover:border-indigo-500/50 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Directory</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'} transition-all`} />
            <span className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-slate-800'} transition-all`} />
          </div>
        </header>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass p-1 md:p-1.5 shadow-2xl overflow-hidden rounded-[24px]">
          <div className="bg-slate-950/40 p-8 md:p-12 rounded-[22px]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Single API Enrollment</span>
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter">New <span className="text-indigo-500">Registry</span> Entry</h1>
                <p className="text-slate-500 text-lg mt-2 font-medium">Create a linked user-faculty profile in one step.</p>
              </div>
              <div className="bg-indigo-600/10 px-4 py-2 rounded-xl border border-indigo-500/20 text-indigo-400 text-[10px] font-black tracking-widest uppercase">
                Step {step} of 2
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-10 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-sm font-bold uppercase tracking-widest italic">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-12">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Identity: First Name</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 transition-colors group-focus-within:text-indigo-500" />
                          <input 
                            type="text" 
                            placeholder="JOHN" 
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-12 text-sm font-black uppercase text-white hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-light"
                            value={formData.first_name}
                            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Identity: Last Name</label>
                        <input 
                          type="text" 
                          placeholder="DOE" 
                          className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-6 text-sm font-black uppercase text-white hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-light"
                          value={formData.last_name}
                          onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Communication: Email</label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 transition-colors group-focus-within:text-indigo-500" />
                          <input 
                            type="email" 
                            placeholder="TEACHER@UNIV.EDU" 
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-12 text-sm font-black text-white hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-light"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Security: Temp Password</label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 transition-colors group-focus-within:text-indigo-500" />
                          <input 
                            type="password" 
                            placeholder="••••••••" 
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-12 text-sm font-black text-white hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-light"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <button 
                        type="button" 
                        onClick={() => setStep(2)}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-indigo-500/10"
                      >
                        Proceed to faculty Details
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Academic Assignment: University</label>
                      <div className="relative group">
                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 transition-colors group-focus-within:text-indigo-500" />
                        <input 
                          type="text" 
                          placeholder="HARVARD UNIVERSITY" 
                          className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-12 text-sm font-black uppercase text-white hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-light"
                          value={formData.university_name}
                          onChange={(e) => setFormData({...formData, university_name: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Bios: Gender</label>
                        <div className="relative flex gap-4">
                          {['male', 'female', 'other'].map(g => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setFormData({...formData, gender: g})}
                              className={`flex-grow py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${formData.gender === g ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700'}`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Cycle Enrollment: Year</label>
                        <div className="relative group">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 transition-colors group-focus-within:text-indigo-500" />
                          <input 
                            type="number" 
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-12 text-sm font-black text-white hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-light"
                            value={formData.year_joined}
                            onChange={(e) => setFormData({...formData, year_joined: parseInt(e.target.value)})}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 flex gap-4">
                      <button 
                        type="button" 
                        onClick={() => setStep(1)}
                        className="px-8 py-5 rounded-2xl bg-slate-900 text-[10px] font-black uppercase tracking-widest border border-slate-800 hover:bg-slate-800 transition-all"
                      >
                        Modify Step 1
                      </button>
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="flex-grow bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                      >
                        {loading ? 'Initializing Sync...' : (
                          <>
                            Finalize Enrollment
                            <CheckCircle2 className="w-5 h-5" />
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

        <p className="mt-12 text-center text-slate-600 font-bold uppercase tracking-[0.2em] text-[10px] opacity-40">
          Security Protocol Enabled • AES-256 Encryption • Transactional Rollback Secure
        </p>
      </div>
    </div>
  );
};

export default AddTeacher;
