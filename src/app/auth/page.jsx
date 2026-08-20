"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, User, Shield, ArrowRight, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { ROLES } from '../../context/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (isLogin) {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push('/');
        router.refresh();
      }
    } else {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        
        if (res.ok) {
          setSuccessMsg('Account registered successfully! Redirecting...');
          // Auto login after register
          await signIn('credentials', { redirect: false, email, password });
          setTimeout(() => {
            router.push('/');
            router.refresh();
          }, 1200);
        } else {
          setError(data.message || 'Registration failed.');
        }
      } catch (err) {
        setError('Network error occurred.');
      }
    }
  };

  const handleQuickFill = (type) => {
    if (type === 'admin') {
      setEmail('admin@pentabrid.com');
      setPassword('Password');
      setIsLogin(true);
    } else {
      setEmail('alex.mercer@pentabrid.io');
      setPassword('Password');
      setIsLogin(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 pt-24 pb-16 font-sans">
      <div className="w-full max-w-md bg-[#090d16] border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-2 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto text-lg font-mono font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            ▲
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {isLogin ? 'Sign In to Your Account' : 'Create Student Profile'}
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            {isLogin ? 'Access your curriculum, assessments, and telemetry.' : 'Join the engineering and security learning cluster.'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 rounded-lg font-bold transition ${
              isLogin 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 rounded-lg font-bold transition ${
              !isLogin 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono relative z-10">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-slate-300 text-xs">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. Alex Mercer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#05070a] border border-slate-800 rounded-xl text-slate-200 focus:border-emerald-500 focus:outline-none text-xs"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-slate-300 text-xs">Email Address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-[#05070a] border border-slate-800 rounded-xl text-slate-200 focus:border-emerald-500 focus:outline-none text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 text-xs">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-[#05070a] border border-slate-800 rounded-xl text-slate-200 focus:border-emerald-500 focus:outline-none text-xs"
              />
            </div>
          </div>
          
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs p-3 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wide transition shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 mt-2"
          >
            <span>{isLogin ? 'Sign In & Access Platform' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Fill Pill (Non-intrusive) */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Quick Demo Fill:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20 transition"
            >
              Root Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('student')}
              className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition"
            >
              Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
