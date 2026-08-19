import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import CourseOverview from './pages/CourseOverview';
import LearningWorkspace from './components/student/LearningWorkspace';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider, useAuth, ROLES } from './context/AuthContext';
import { Terminal, Shield, Sparkles, User, ChevronDown } from 'lucide-react';
import './App.css';

function NavigationBar() {
  const { user, switchRole } = useAuth();
  const location = useLocation();
  const isWorkspace = location.pathname.startsWith('/learn');

  if (isWorkspace) {
    // LearningWorkspace has its own specialized HUD
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#05070a]/90 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between z-40">
      {/* Brand Logo */}
      <div className="flex items-center space-x-3">
        <Link to="/" className="flex items-center space-x-2 text-white font-mono font-bold text-sm tracking-wide">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            ▲
          </div>
          <span>
            PENTABRID <span className="text-emerald-400">ENGINE</span>
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center space-x-8 text-xs font-mono text-slate-400">
        <a href="/#courses" className="hover:text-white transition">Curriculum Tracks</a>
        <Link to="/admin" className="hover:text-cyan-400 transition flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI Admin Studio</span>
        </Link>
      </div>

      {/* Interactive RBAC Switcher */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl p-1 px-2.5 text-xs font-mono">
          <span className="text-slate-500 text-[11px]">Role:</span>
          <select
            value={user.role}
            onChange={(e) => switchRole(e.target.value)}
            className="bg-transparent text-emerald-400 font-bold focus:outline-none cursor-pointer"
          >
            <option value={ROLES.STUDENT} className="bg-[#0b0e14] text-slate-200">STUDENT</option>
            <option value={ROLES.INSTRUCTOR} className="bg-[#0b0e14] text-cyan-400">INSTRUCTOR</option>
            <option value={ROLES.ADMIN} className="bg-[#0b0e14] text-purple-400">ADMIN</option>
          </select>
        </div>

        <Link
          to="/auth"
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
          title="User Account"
        >
          <User className="w-4 h-4" />
        </Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#05070a] text-slate-100 flex flex-col font-sans">
          <NavigationBar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/course/:courseId/overview" element={<CourseOverview />} />
              <Route path="/learn/:courseId/:moduleId/:lessonId" element={<LearningWorkspace />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Routes>
          </div>
          <footer className="py-8 bg-[#030508] border-t border-slate-900 text-center text-xs font-mono text-slate-500">
            <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>© 2026 Pentabrid Technical Engine. Architectural RBAC & Telemetry Labs.</div>
              <div className="flex space-x-4">
                <span className="text-emerald-400">● 4 Node Clusters Online</span>
                <span>MySQL + Prisma Engine</span>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
