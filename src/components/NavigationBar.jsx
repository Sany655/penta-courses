"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, ROLES } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { signOut } from 'next-auth/react';
import { 
  Terminal, Shield, Sparkles, User, ChevronDown, 
  Sun, Moon, LogOut, BookOpen, UserCheck, LayoutDashboard, ExternalLink 
} from 'lucide-react';

export default function NavigationBar() {
  const { user, isAdmin } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);
  
  const isWorkspace = pathname && pathname.startsWith('/learn');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isWorkspace) {
    // LearningWorkspace has its own specialized HUD
    return null;
  }

  return (
    <nav className="penta-navbar fixed top-0 left-0 right-0 h-16 backdrop-blur-md border-b px-6 flex items-center justify-between z-40 transition-colors shadow-md">
      {/* Brand Logo */}
      <div className="flex items-center space-x-3">
        <Link href="/" className="flex items-center space-x-2 font-mono font-bold text-sm tracking-wide">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-sm font-bold">
            ▲
          </div>
          <span className="flex items-center gap-1.5">
            <span className="brand-name font-extrabold text-base tracking-tight text-white">PENTABRID</span>
            <span className="text-emerald-400 font-extrabold text-base tracking-tight">ENGINE</span>
          </span>
        </Link>
      </div>

      {/* Navigation Links - Crisp & High Contrast in Both Modes */}
      <div className="hidden md:flex items-center space-x-8 text-xs font-mono font-bold">
        <a href="/#courses" className="nav-link">Curriculum Tracks</a>
        <a href="/#faq" className="nav-link">FAQ</a>
        <a href="/#contact" className="nav-link">Custom Tracks</a>
        <a 
          href="https://pentabrid.com/" 
          target="_blank" 
          rel="noreferrer" 
          className="nav-link flex items-center gap-1.5"
        >
          <span>pentabrid.com</span>
          <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
        </a>
        
        {isAdmin && (
          <Link 
            href="/admin" 
            className="text-cyan-300 hover:text-cyan-200 transition flex items-center gap-1.5 font-bold bg-cyan-500/20 px-3 py-1.5 rounded-xl border border-cyan-500/40 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Admin Studio</span>
          </Link>
        )}
      </div>

      {/* Action Items: Theme Toggle + User Profile */}
      <div className="flex items-center space-x-3">
        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 hover:bg-slate-800 transition flex items-center justify-center shadow-sm"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
          ) : (
            <Moon className="w-4 h-4 text-cyan-400" />
          )}
        </button>

        {/* User Authentication Menu */}
        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 hover:bg-slate-800 transition shadow-sm"
            >
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                alt={user.name}
                className="w-7 h-7 rounded-lg object-cover border border-slate-700"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-white line-clamp-1 leading-tight">{user.name}</span>
                <span className={`text-[10px] font-mono leading-none ${user.role === ROLES.ADMIN ? 'text-purple-400 font-bold' : 'text-emerald-400 font-semibold'}`}>
                  {user.role === ROLES.ADMIN ? 'Administrator' : 'Student'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#090d16] border border-slate-800 shadow-2xl p-2 space-y-1 font-sans text-xs z-50 animate-fade-in">
                <div className="p-3 border-b border-slate-800/80 mb-1">
                  <div className="font-bold text-white text-sm">{user.name}</div>
                  <div className="text-slate-400 text-xs font-mono truncate">{user.email}</div>
                  <div className="mt-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      user.role === ROLES.ADMIN 
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {user.role === ROLES.ADMIN ? 'Root Administrator' : 'Enrolled Student'}
                    </span>
                  </div>
                </div>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-cyan-400 hover:bg-slate-800/80 transition font-medium font-mono"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>AI Admin Studio</span>
                  </Link>
                )}

                <a
                  href="/#courses"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800/80 hover:text-white transition font-medium"
                >
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Curriculum Tracks</span>
                </a>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    signOut();
                    router.push('/auth');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition font-medium text-left border-t border-slate-800/60 mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold text-slate-200 hover:text-white transition"
            >
              Sign In
            </Link>
            <Link
              href="/auth"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono transition shadow-sm"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
