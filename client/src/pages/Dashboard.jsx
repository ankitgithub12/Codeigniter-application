import React, { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, UserPlus, Search, GraduationCap, Calendar, Users, 
  LayoutDashboard, Settings, Bell, ChevronRight, Download, 
  Sparkles, CheckCircle2, Clock, Shield, Database, Trash2,
  Activity, Zap, Globe
} from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';

const Dashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [latency, setLatency] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const notifications = [
    { id: 1, title: 'Network Synchronization Initialized', time: 'Just now', type: 'success' },
    { id: 2, title: 'Periodic Database Sync Complete', time: '1h ago', type: 'info' },
    { id: 3, title: 'Server Protocol v2.1 Verified', time: '2h ago', type: 'system' },
  ];

  useEffect(() => {
    fetchTeachers();
    
    // Set up 10-second polling for real-time feel
    const interval = setInterval(fetchTeachers, 10000);
    
    // Close notifications when clicking outside
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchTeachers = async () => {
    const startTime = Date.now();
    setIsRefreshing(true);
    try {
      const { data } = await api.get('/teachers');
      setTeachers(data);
      setLatency(Date.now() - startTime);
    } catch (err) {
      console.error('Error fetching teachers', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const filteredTeachers = teachers.filter(t => 
    (t.User?.first_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.User?.last_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.university_name || '').toLowerCase().includes(search.toLowerCase())
  );

  // Derive metrics for real-time view
  const teachersCount = teachers.length;
  const institutionsCount = new Set(teachers.map(t => t.university_name)).size;
  const joinedToday = teachers.filter(t => {
    const today = new Date().toISOString().split('T')[0];
    return t.created_at && t.created_at.startsWith(today);
  }).length;

  // --- Sub-Views ---

  const OverviewView = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="relative">
          <p className="text-indigo-500 font-black uppercase tracking-[0.2em] text-[10px] mb-2 flex items-center gap-2">
            <Zap className={`w-4 h-4 ${isRefreshing ? 'animate-bounce text-amber-400' : 'text-indigo-400'}`} />
            Live Intelligence Stream
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Command <span className="text-slate-700">Center</span></h2>
        </div>
        <div className="bg-slate-900/40 p-5 rounded-[24px] border border-slate-800/60 backdrop-blur-xl">
          <div className="flex items-center gap-4">
             <div className="text-right border-r border-slate-800 pr-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Response Time</p>
                <p className="text-xl font-black text-indigo-400 tracking-tighter">{latency}ms</p>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Auto-Sync</p>
                <div className="flex items-center gap-2 justify-end">
                  <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'} shadow-[0_0_8px_rgba(16,185,129,0.3)]`} />
                  <span className="text-sm font-black text-white uppercase tracking-tighter">Active</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Real Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Faculty', value: teachersCount, icon: Users, color: 'text-indigo-400', sub: 'Indexed Entries' },
          { label: 'Institutions', value: institutionsCount, icon: GraduationCap, color: 'text-cyan-400', sub: 'Verified Sites' },
          { label: 'Registered Today', value: joinedToday, icon: Activity, color: 'text-emerald-400', sub: 'New Sequences' },
          { label: 'Network Latency', value: `${latency}ms`, icon: Database, color: 'text-amber-400', sub: 'API Performance' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-[24px] border border-slate-800/20 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon className="w-20 h-20 -mr-6 -mt-6" />
            </div>
            <div className="p-3 bg-slate-900 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-white tracking-tighter mb-1">{stat.value}</p>
            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Real-time Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass rounded-[32px] p-8">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
              <Activity className="w-5 h-5 text-indigo-500" />
              Live Sequence Log
            </h3>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Showing Last 5 Entries</span>
          </div>
          
          <div className="space-y-4">
            {teachers.slice(0, 5).map((teacher, i) => (
              <div key={teacher.id || i} className="flex items-center gap-4 p-5 rounded-3xl bg-slate-900/40 border border-slate-800/30 hover:border-indigo-500/20 transition-all cursor-default group relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 rounded-[18px] bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center font-black text-indigo-400 uppercase text-xs">
                    {teacher.User?.first_name?.[0]}{teacher.User?.last_name?.[0]}
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-black text-white uppercase tracking-wide group-hover:text-indigo-400 transition-colors">
                    {teacher.User?.first_name} {teacher.User?.last_name}
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{teacher.university_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(teacher.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-[10px] text-indigo-500/60 font-black uppercase tracking-widest">SYNCED</p>
                </div>
              </div>
            ))}
            {!loading && teachers.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                <p className="text-slate-600 font-black uppercase tracking-widest text-xs">No entries found in registry</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="glass rounded-[32px] p-8 bg-indigo-600/5 border-indigo-500/10 flex flex-col">
          <h3 className="text-lg font-black text-white uppercase tracking-widest mb-10 flex items-center gap-3">
             <Globe className="w-5 h-5 text-indigo-500" />
             Metric Distribution
          </h3>
          <div className="space-y-8 flex-grow">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/60">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Institution Density</p>
                <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(teachers.map(t => t.university_name))).slice(0, 4).map((uni, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black text-indigo-400 uppercase">
                            {uni}
                        </span>
                    ))}
                    {institutionsCount > 4 && <span className="text-[9px] font-black text-slate-600 px-2">+{institutionsCount - 4} MORE</span>}
                </div>
            </div>
            
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/60">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Gender Distribution</p>
                <div className="space-y-4">
                    {['Male', 'Female'].map(gender => {
                        const count = teachers.filter(t => t.gender?.toLowerCase() === gender.toLowerCase()).length;
                        const percent = teachersCount > 0 ? (count / teachersCount) * 100 : 0;
                        return (
                            <div key={gender} className="space-y-2">
                                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                    <span className="text-slate-400">{gender}</span>
                                    <span className="text-white">{Math.round(percent)}%</span>
                                </div>
                                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]" style={{ width: `${percent}%` }} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
          </div>
          
          <div className="mt-8 p-6 rounded-2xl bg-indigo-600/10 border border-indigo-500/20">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">Registry Health</p>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">All database nodes are synchronized. Your view is updated in real-time every 10s.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const TeachersView = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {/* Existing Teachers View Implementation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-indigo-500 font-black uppercase tracking-[0.2em] text-[10px] mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Live Faculty Repository
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Academic <span className="text-slate-700">Database</span></h2>
        </div>
        <button 
          onClick={() => navigate('/add-teacher')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 self-start md:self-auto"
        >
          <UserPlus className="w-5 h-5" />
          Add New Educator
        </button>
      </div>

      <div className="glass shadow-2xl overflow-hidden rounded-[24px] w-full">
        <div className="p-6 md:p-8 border-b border-slate-800/40 flex flex-col md:flex-row justify-between gap-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="FILTER REPOSITORY..." 
              className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-black tracking-widest text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all uppercase"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0">
            <button className="px-6 py-4 bg-slate-900 hover:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 text-slate-300">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-900/40 text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-800/20">
                <th className="px-8 py-6">Faculty Identity</th>
                <th className="px-8 py-6">Institution</th>
                <th className="px-8 py-6">Gender</th>
                <th className="px-8 py-6">Joined</th>
                <th className="px-8 py-6 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/10 font-medium">
              {filteredTeachers.map((teacher, i) => (
                <tr key={teacher.id} className="hover:bg-indigo-500/[0.03] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-indigo-400 group-hover:scale-105 transition-transform uppercase text-xs">
                        {teacher.User?.first_name?.[0] || '?'}{teacher.User?.last_name?.[0] || '?'}
                      </div>
                      <div>
                        <p className="text-white font-black uppercase tracking-tight group-hover:text-indigo-400 transition-colors text-sm">
                          {teacher.User?.first_name} {teacher.User?.last_name}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{teacher.User?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-slate-300 uppercase tracking-tighter">{teacher.university_name}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-900 border border-slate-800 text-slate-500 group-hover:border-indigo-500/40 transition-colors">
                      {teacher.gender}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-slate-500">'{String(teacher.year_joined).slice(-2)}</td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 hover:bg-slate-800 rounded-xl transition-all">
                      <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && filteredTeachers.length === 0 && (
            <div className="py-24 text-center">
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-widest">No Matches Found</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Adjust your search or add a new entry.</p>
            </div>
          )}
        </div>
        
        <div className="p-8 border-t border-slate-800/20 bg-slate-900/10 flex items-center justify-between overflow-x-auto gap-4">
          <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] whitespace-nowrap">Registry Entry Count: {filteredTeachers.length}</p>
        </div>
      </div>
    </motion.div>
  );

  const SettingsView = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
      <div className="mb-12">
        <p className="text-indigo-500 font-black uppercase tracking-[0.2em] text-[10px] mb-2 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Account Parameters
        </p>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">System <span className="text-slate-700">Settings</span></h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="glass p-8 rounded-[32px]">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 pb-4 border-b border-slate-800/50">Personal Profile</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                  <input readOnly value={user.first_name || 'N/A'} className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-6 text-sm font-black text-white opacity-60 cursor-not-allowed uppercase" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                  <input readOnly value={user.last_name || 'N/A'} className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-6 text-sm font-black text-white opacity-60 cursor-not-allowed uppercase" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <input readOnly value={user.email || 'N/A'} className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-6 text-sm font-black text-white opacity-60 cursor-not-allowed" />
              </div>
              <button className="bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all w-full md:w-auto">
                Request Profile Modification
              </button>
            </div>
          </div>

          <div className="glass p-8 rounded-[32px] border-red-500/10">
            <h3 className="text-sm font-black text-red-400 uppercase tracking-widest mb-8 pb-4 border-b border-red-500/10">Danger Zone</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-white font-black uppercase tracking-wide text-sm mb-1">Clear Local Workspace</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">This will sign you out and purge cached data.</p>
              </div>
              <button onClick={logout} className="flex items-center gap-2 px-6 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all whitespace-nowrap">
                <Trash2 className="w-4 h-4" />
                Purge Cache & Exit
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass p-8 rounded-[32px] bg-indigo-600/5">
            <div className="w-20 h-20 rounded-[28px] bg-indigo-600 mx-auto mb-6 p-1">
              <div className="w-full h-full rounded-[24px] bg-slate-950 flex items-center justify-center text-2xl font-black text-white uppercase">
                {(user.first_name?.[0] || 'G')}{(user.last_name?.[0] || 'U')}
              </div>
            </div>
            <div className="text-center mb-8">
              <p className="text-lg font-black text-white uppercase tracking-tighter leading-none mb-1">{user.first_name} {user.last_name}</p>
              <p className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.2em]">System Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#020617] flex text-slate-300">
      <aside className="hidden lg:flex flex-col w-72 bg-slate-900/30 border-r border-slate-800/40 sticky top-0 h-screen z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-xl shadow-indigo-500/10">
            <GraduationCap className="text-white w-7 h-7" />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter">EduPortal</span>
        </div>

        <nav className="flex-grow px-4 space-y-2 mt-4">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'teachers', label: 'Teachers', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all ${activeTab === item.id ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <button onClick={logout} className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 hover:bg-red-500/10 transition-all font-black text-[10px] tracking-widest uppercase">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-grow overflow-x-hidden">
        <header className="glass-header sticky top-0 z-30 px-8 py-5 flex justify-between items-center w-full">
          <div className="flex items-center gap-6">
            <div className="lg:hidden bg-indigo-600 p-2 rounded-xl">
              <GraduationCap className="text-white w-5 h-5" />
            </div>
            <h1 className="text-sm font-black text-white uppercase tracking-widest hidden sm:block">Faculty Management System</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative" ref={notificationRef}>
              <div 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative cursor-pointer group"
              >
                <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-slate-950 transition-all ${isRefreshing ? 'bg-amber-400 animate-ping' : 'bg-indigo-500 group-hover:scale-110'}`} />
                <Bell className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </div>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-6 w-80 glass rounded-[24px] p-2 shadow-2xl z-50 border border-slate-800"
                  >
                    <div className="p-4 border-b border-slate-800/50 mb-2">
                      <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Notification Stream</p>
                    </div>
                    <div className="space-y-1">
                      {notifications.map(n => (
                        <div key={n.id} className="p-4 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer group">
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-xs font-black text-slate-200 uppercase tracking-wide group-hover:text-indigo-400">{n.title}</p>
                            <span className="text-[8px] text-slate-600 font-bold uppercase whitespace-nowrap">{n.time}</span>
                          </div>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Protocol Success</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="h-8 w-px bg-slate-800/60" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-black text-white leading-tight uppercase tracking-widest">{user.first_name || 'Guest'} {user.last_name || 'User'}</p>
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">Administrator</p>
              </div>
              <div 
                onClick={() => setActiveTab('settings')}
                className="w-10 h-10 rounded-2xl border-2 border-slate-800 shadow-lg p-0.5 bg-indigo-600 cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center font-black text-white text-[10px] uppercase">
                  {(user.first_name?.[0] || 'G')}{(user.last_name?.[0] || 'U')}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && <OverviewView key="overview" />}
            {activeTab === 'teachers' && <TeachersView key="teachers" />}
            {activeTab === 'settings' && <SettingsView key="settings" />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
