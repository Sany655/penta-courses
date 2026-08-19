import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Shield, Terminal, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth, ROLES } from '../context/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('alex.mercer@pentabrid.io');
  const [password, setPassword] = useState('Password');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { switchRole, login, adminEmail } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (email === adminEmail) {
      const success = login(email, password);
      if (success) {
        navigate('/admin/builder');
      } else {
        setError('Invalid admin credentials.');
      }
    } else {
      switchRole(ROLES.STUDENT);
      navigate('/');
    }
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
              <label className="text-slate-400 text-sm">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Alex Mercer"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#05070a] border border-slate-800 rounded-xl text-slate-200 focus:border-emerald-500 focus:outline-none text-sm"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-slate-400 text-sm">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-[#05070a] border border-slate-800 rounded-xl text-slate-200 focus:border-emerald-500 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 text-sm">Password Hash</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-[#05070a] border border-slate-800 rounded-xl text-slate-200 focus:border-emerald-500 focus:outline-none text-sm"
              />
            </div>
          </div>
          
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm p-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 mt-4"
          >
            <span>{isLogin ? 'Authenticate & Enter' : 'Register Profile'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-mono text-slate-400 hover:text-emerald-400 transition"
          >
            {isLogin ? "Need a new account? Register here" : "Have existing credentials? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
