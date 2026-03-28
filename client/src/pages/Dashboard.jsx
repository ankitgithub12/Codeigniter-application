import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, UserPlus, Search, GraduationCap, Calendar, Users, LayoutDashboard, Settings, Bell, ChevronRight, Download, Sparkles } from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';

const Dashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/teachers');
      setTeachers(data);
    } catch (err) {
      console.error('Error fetching teachers', err);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-[#020617] flex text-slate-300">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-900/30 border-r border-slate-800/40 sticky top-0 h-screen z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-xl shadow-indigo-500/10">
            <GraduationCap className="text-white w-7 h-7" />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter">EduPortal</span>
        </div>

        <nav className="flex-grow px-4 space-y-2 mt-4">
          {[
            { label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
            { label: 'Teachers', icon: Users, path: '/dashboard', active: true },
            { label: 'Settings', icon: Settings, path: '#' },
          ].map((item, i) => (
            <NavLink 
              key={i}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all ${item.active ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <button onClick={logout} className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 hover:bg-red-500/10 transition-all font-black text-[10px] tracking-widest uppercase">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-x-hidden">
        {/* Top Header */}
        <header className="glass-header sticky top-0 z-30 px-8 py-5 flex justify-between items-center w-full">
          <div className="flex items-center gap-6">
            <div className="lg:hidden bg-indigo-600 p-2 rounded-xl">
              <GraduationCap className="text-white w-5 h-5" />
            </div>
            <h1 className="text-sm font-black text-white uppercase tracking-widest hidden sm:block">Faculty Management System</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-slate-950" />
              <Bell className="w-5 h-5 text-slate-400 hover:text-white transition-colors cursor-pointer" />
            </div>
            <div className="h-8 w-px bg-slate-800/60" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-black text-white leading-tight uppercase tracking-widest">{user.first_name || 'Guest'} {user.last_name || 'User'}</p>
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-2xl border-2 border-slate-800 shadow-lg p-0.5 bg-indigo-600">
                <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center font-black text-white text-[10px] uppercase">
                  {(user.first_name?.[0] || 'G')}{(user.last_name?.[0] || 'U')}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
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
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 w-full">
            {[
              { label: 'Total Faculty', value: teachers.length, icon: Users },
              { label: 'Institutions', value: new Set(teachers.map(t => t.university_name)).size, icon: GraduationCap },
              { label: 'System Uptime', value: '99.9%', icon: Calendar },
              { label: 'Security Status', value: 'Protected', icon: Search },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass p-6 rounded-[24px]">
                <div className="p-3 bg-slate-900 rounded-2xl w-fit mb-4">
                  <stat.icon className="w-5 h-5 text-indigo-400" />
                </div>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-white tracking-tighter">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Datatable */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass shadow-2xl overflow-hidden rounded-[24px] w-full">
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
                <button className="px-6 py-4 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                  Show Search Tools
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
              <div className="flex gap-2">
                {[1, 2, 3].map(n => (
                  <button key={n} className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${n === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-500 hover:text-white'}`}>{n}</button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
