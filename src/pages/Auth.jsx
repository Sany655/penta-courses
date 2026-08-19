import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Shield, Terminal, ArrowRight } from 'lucide-react';
import { useAuth, ROLES } from '../context/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState(ROLES.STUDENT);
  const navigate = useNavigate();
  const { switchRole } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    switchRole(selectedRole);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 pt-20 font-sans">
      <div className="w-full max-w-md bg-[#090d16] border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto text-lg font-mono font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            ▲
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {isLogin ? 'Access Technical Cluster' : 'Initialize Developer Identity'}
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            {isLogin ? 'Authenticate credentials for RBAC gateway.' : 'Create an engineering profile.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-slate-400 text-[11px]">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Alex Mercer"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#05070a] border border-slate-800 rounded-xl text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-slate-400 text-[11px]">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3 text-slate-500" />
              <input
                type="email"
                defaultValue="alex.mercer@pentabrid.io"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#05070a] border border-slate-800 rounded-xl text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 text-[11px]">Password Hash</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3 text-slate-500" />
              <input
                type="password"
                defaultValue="••••••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#05070a] border border-slate-800 rounded-xl text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <label className="text-slate-400 text-[11px] flex items-center justify-between">
              <span>RBAC Role Permission</span>
              <span className="text-cyan-400">NextAuth Engine</span>
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full p-2.5 bg-[#05070a] border border-slate-800 rounded-xl text-emerald-400 font-bold focus:border-emerald-500 focus:outline-none"
            >
              <option value={ROLES.STUDENT}>STUDENT (Workspace & Progression)</option>
              <option value={ROLES.INSTRUCTOR}>INSTRUCTOR (Course Authoring)</option>
              <option value={ROLES.ADMIN}>ADMIN (Full CMS Studio & System Config)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 mt-4"
          >
            <span>{isLogin ? 'Authenticate & Enter' : 'Register Profile'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-mono text-slate-400 hover:text-emerald-400 transition"
          >
            {isLogin ? "Need a new account? Register here" : "Have existing credentials? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
