import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Database, LayoutGrid, Bell, Settings, LogOut, 
  Search, User, Shield, Activity, Cpu, GraduationCap,
  ArrowRight, Globe, Layers, BarChart3, Clock, Mail, Send, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [teachers, setTeachers] = useState([]);
  const [users, setUsers] = useState([]);
  const [lastSync, setLastSync] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [broadcast, setBroadcast] = useState({ to: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [broadcastStatus, setBroadcastStatus] = useState('');

  // Multi-Node Synchronization Logic
  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const [teachersRes, usersRes] = await Promise.all([
        api.get('/teachers'),
        api.get('/auth/users')
      ]);
      setTeachers(teachersRes.data);
      setUsers(usersRes.data);
      setLastSync(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Core sync failure:', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; // Use location for full state clear
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await api.post('/auth/broadcast', broadcast);
      setBroadcastStatus('TRANSMISSION_SUCCESSFUL');
      setBroadcast({ to: '', subject: '', message: '' });
      setTimeout(() => setBroadcastStatus(''), 3000);
    } catch (err) {
      setBroadcastStatus('TRANSMISSION_FAILURE');
      setTimeout(() => setBroadcastStatus(''), 3000);
    } finally {
      setIsSending(false);
    }
  };

  // --- VIEW: Command Center (Overview) ---
  const OverviewView = () => (
    <div className="space-y-10">
      {/* Hyper-Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Educators', value: teachers.length, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/5', sub: 'Verified Nodes' },
          { label: 'Identity Registry', value: users.length, icon: Database, color: 'text-cyan-400', bg: 'bg-cyan-500/5', sub: 'Active auth_user' },
          { label: 'Global Latency', value: '4ms', icon: Cpu, color: 'text-emerald-400', bg: 'bg-emerald-500/5', sub: 'Protocol Stability' },
          { label: 'Network Uptime', value: '99.9%', icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500/5', sub: 'Operational' },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-[36px] border-white/5 relative group overflow-hidden"
          >
            <div className={`absolute -right-4 -top-4 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 ${stat.color}`}>
              <stat.icon className="w-24 h-24" />
            </div>
            <div className={`p-4 ${stat.bg} rounded-2xl w-fit mb-6 border border-white/5`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">{stat.label}</h3>
            <div className="flex items-end gap-2">
              <p className="text-4xl font-black text-white tracking-tighter italic">{stat.value}</p>
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">{stat.sub}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time Sequence Stream */}
        <div className="lg:col-span-2 glass p-10 rounded-[44px] border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-2">Sequence Stream</h3>
              <h4 className="text-3xl font-black text-white italic tracking-tighter">Educator Activity</h4>
            </div>
            <button onClick={fetchData} className={`p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all ${isRefreshing ? 'animate-spin' : ''}`}>
              <Activity className="w-4 h-4 text-indigo-400" />
            </button>
          </div>
          
          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-4 custom-scrollbar">
            {teachers.map((teacher, i) => (
              <motion.div 
                key={teacher.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-6 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-600 transition-colors">
                  <span className="text-indigo-400 font-black text-xs group-hover:text-white uppercase transition-colors">{teacher.User?.first_name?.[0]}</span>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[11px] font-black text-white uppercase tracking-widest">{teacher.User?.first_name} {teacher.User?.last_name}</p>
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {new Date(teacher.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{teacher.university_name} // {teacher.gender}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Visual Matrix */}
        <div className="space-y-8">
          <div className="glass p-10 rounded-[44px] border-white/5 flex flex-col items-center text-center">
            <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-10 pt-4">Capacity Status</h3>
            <div className="relative w-40 h-40 flex items-center justify-center mb-10">
              <svg className="w-full h-full -rotate-90">
                <circle cx="80" cy="80" r="70" className="fill-none stroke-white/5 stroke-[8]" />
                <motion.circle 
                  cx="80" cy="80" r="70" 
                  className="fill-none stroke-cyan-500 stroke-[8]" 
                  initial={{ strokeDasharray: "0 440" }}
                  animate={{ strokeDasharray: "320 440" }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white italic tracking-tighter">72%</span>
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Load</span>
              </div>
            </div>
            <div className="w-full space-y-4">
               <div className="flex justify-between items-center text-[9px] font-black px-4">
                  <span className="text-slate-500 uppercase tracking-widest">Database Sync</span>
                  <span className="text-emerald-500">OPTIMAL</span>
               </div>
               <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                 <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 2.5 }} className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
               </div>
            </div>
          </div>

          {/* Quick Broadcast Matrix */}
          <div className="glass p-10 rounded-[44px] border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
              <Terminal className="w-3 h-3" />
              Quick Broadcast
            </h3>

            <form onSubmit={handleBroadcast} className="space-y-4 relative z-10">
              <input 
                type="email" 
                placeholder="TARGET_NODE_EMAIL" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-[10px] font-black text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500/50 transition-all uppercase tracking-widest"
                value={broadcast.to}
                onChange={(e) => setBroadcast({...broadcast, to: e.target.value})}
                required
              />
              <input 
                type="text" 
                placeholder="SIGNAL_SUBJECT" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-[10px] font-black text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500/50 transition-all uppercase tracking-widest"
                value={broadcast.subject}
                onChange={(e) => setBroadcast({...broadcast, subject: e.target.value})}
                required
              />
              <textarea 
                placeholder="ENTER_MESSAGE_SEQUENCE..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-[10px] font-black text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500/50 transition-all uppercase tracking-widest min-h-[100px] resize-none"
                value={broadcast.message}
                onChange={(e) => setBroadcast({...broadcast, message: e.target.value})}
                required
              />
              
              <button 
                type="submit" 
                disabled={isSending}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-indigo-600/20"
              >
                {isSending ? 'DISPATCHING...' : broadcastStatus || 'DISPATCH_SIGNAL'}
                {!isSending && !broadcastStatus && <Send className="w-3 h-3" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  // --- VIEW: Educator Node (Teachers Registry) ---
  const EducatorsView = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-[48px] border-white/5 overflow-hidden">
      <div className="p-12 border-b border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-2">Educator Node</h3>
          <h4 className="text-4xl font-black text-white italic tracking-tighter">Centralized Repository</h4>
        </div>
        <div className="relative group max-w-md w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text" 
            placeholder="SCAN REGISTRY..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-[10px] font-black text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all tracking-[0.2em] uppercase"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01]">
              <th className="px-12 py-10 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Node Identity</th>
              <th className="px-12 py-10 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Institution Node</th>
              <th className="px-12 py-10 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Allocation</th>
              <th className="px-12 py-10 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Integrity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-12 py-10">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-white/5 overflow-hidden flex items-center justify-center p-0.5">
                       <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center text-indigo-500 font-black text-lg">
                          {teacher.User?.first_name?.[0]}
                       </div>
                    </div>
                    <div>
                      <p className="text-base font-black text-white tracking-widest uppercase italic">{teacher.User?.first_name} {teacher.User?.last_name}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">{teacher.User?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-12 py-10">
                  <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest leading-relaxed mb-1">{teacher.university_name}</p>
                  <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Layers className="w-3 h-3" />
                    ENROLLED // EST. {teacher.year_joined}
                  </p>
                </td>
                <td className="px-12 py-10">
                  <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] inline-flex items-center gap-3">
                    <Shield className="w-3.5 h-3.5 text-indigo-500" />
                    {teacher.gender}
                  </div>
                </td>
                <td className="px-12 py-10">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] italic">Sequence Valid</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  // --- VIEW: Identity Node (Auth Registry) ---
  const IdentityView = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-[48px] border-white/5 overflow-hidden">
      <div className="p-12 border-b border-white/5">
        <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-2">Identity Registry (auth_user)</h3>
        <h4 className="text-4xl font-black text-white italic tracking-tighter">Core Authentication Matrix</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01]">
              <th className="px-12 py-10 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Node ID</th>
              <th className="px-12 py-10 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Network Identity</th>
              <th className="px-12 py-10 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Hash Status</th>
              <th className="px-12 py-10 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Authorization</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-12 py-10 font-mono text-[11px] text-cyan-500 tracking-[0.2em] font-black">
                  #00{u.id}
                </td>
                <td className="px-12 py-10">
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                       <User className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white tracking-widest uppercase italic">{u.first_name} {u.last_name}</p>
                      <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em] mt-1">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-12 py-10">
                  <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 uppercase tracking-[0.3em]">
                    Bcrypt_v24: OK
                  </span>
                </td>
                <td className="px-12 py-10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(u.created_at).toLocaleDateString()}</p>
                  <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-1">Full Internal Clearance</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return <OverviewView />;
      case 'teachers': return <EducatorsView />;
      case 'identity': return <IdentityView />;
      default: return <OverviewView />;
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-300 overflow-hidden selection:bg-indigo-500/30">
      {/* Detached Glass Sidebar */}
      <aside className="w-[340px] p-8 hidden xl:flex flex-col gap-10">
        <div className="glass h-full rounded-[48px] border-white/5 flex flex-col p-10 relative overflow-hidden">
          {/* Logo Section */}
          <div className="flex items-center gap-5 mb-20 px-4">
            <div className="p-4 bg-indigo-600 rounded-3xl shadow-2xl shadow-indigo-600/30">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white tracking-widest uppercase italic leading-none">Edu<span className="text-cyan-400">Flux</span></span>
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.5em] mt-2">Command Node v4.0</span>
            </div>
          </div>

          <nav className="flex-grow space-y-6">
            {[
              { id: 'overview', icon: LayoutGrid, label: 'Command Center', color: 'text-indigo-500' },
              { id: 'teachers', icon: Users, label: 'Educator Node', color: 'text-cyan-500' },
              { id: 'identity', icon: Database, label: 'Identity Node', color: 'text-emerald-500' },
              { id: 'notifications', icon: Bell, label: 'Security Feed', color: 'text-blue-500' },
              { id: 'settings', icon: Settings, label: 'Core Config', color: 'text-slate-500' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-6 px-8 py-6 rounded-[28px] transition-all duration-700 relative group overflow-hidden ${
                  activeTab === item.id ? 'text-white' : 'text-slate-600 hover:text-slate-300'
                }`}
              >
                {activeTab === item.id && (
                  <motion.div layoutId="nav-bg" className="absolute inset-0 bg-white/[0.03] border border-white/5 rounded-[28px]" transition={{ type: 'spring', bounce: 0.1, duration: 0.8 }} />
                )}
                <item.icon className={`w-6 h-6 relative z-10 transition-colors duration-500 ${activeTab === item.id ? item.color : 'group-hover:text-white'}`} />
                <span className="text-[11px] font-black uppercase tracking-[0.4em] relative z-10">{item.label}</span>
                {activeTab === item.id && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`absolute right-8 w-2 h-2 rounded-full ${item.color.replace('text-', 'bg-')}`} />
                )}
              </button>
            ))}
          </nav>

          <footer className="pt-10 border-t border-white/5 flex flex-col gap-6">
            <div className="flex items-center gap-4 px-4">
               <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-indigo-400 italic">
                  {user.first_name?.[0]}{user.last_name?.[0]}
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{user.first_name} {user.last_name}</span>
                  <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">Admin Node</span>
               </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-6 px-8 py-5 rounded-[24px] text-slate-600 hover:text-red-500 transition-all group hover:bg-red-500/5"
            >
              <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Terminate Session</span>
            </button>
          </footer>
        </div>
      </aside>

      {/* Primary Interface */}
      <main className="flex-grow flex flex-col p-8 lg:p-10 overflow-hidden">
        <header className="mb-14 flex justify-between items-center px-6">
          <div className="flex flex-col">
            <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.6em] mb-4">Unified Network OS</h2>
            <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
              {activeTab === 'overview' ? 'Command' : activeTab === 'identity' ? 'Identity' : 'Registry'} <span className="text-slate-800 tracking-[-0.1em]">{activeTab === 'overview' ? 'Matrix' : 'Registry'}</span>
            </h1>
          </div>
          <div className="flex items-center gap-12">
             <div className="hidden lg:flex flex-col items-end">
                <span className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-2">Node Sync Status</span>
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                   <span className="text-xs font-black text-white uppercase tracking-widest italic">{lastSync}</span>
                </div>
             </div>
              <div className="flex gap-4">
                <button className="w-14 h-14 rounded-2xl glass border-white/5 flex items-center justify-center hover:bg-white/5 transition-all">
                   <Bell className="w-5 h-5 text-slate-500" />
                </button>
                <button 
                  onClick={logout}
                  className="w-14 h-14 rounded-2xl glass border-red-500/20 flex items-center justify-center hover:bg-red-500/10 transition-all group lg:hidden"
                  title="Terminate Session"
                >
                   <LogOut className="w-5 h-5 text-red-500/60 group-hover:rotate-12 transition-transform" />
                </button>
                <button 
                  onClick={logout}
                  className="hidden lg:flex px-6 h-14 rounded-2xl glass border-red-500/20 items-center justify-center hover:bg-red-500/10 transition-all group gap-3 text-red-500/60 hover:text-red-500"
                >
                   <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                   <span className="text-[9px] font-black uppercase tracking-[0.3em]">Logout</span>
                </button>
                <button 
                  onClick={() => navigate('/add-teacher')}
                  className="px-8 h-14 rounded-2xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-4 group"
                >
                   <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
                   Add Node
                </button>
             </div>
          </div>
        </header>

        <section className="flex-grow overflow-y-auto px-6 custom-scrollbar pb-10">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
