"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, ROLES } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ServerStatusButton from './ServerStatusButton';
import { 
  Sparkles, ChevronDown, Sun, Moon, LogOut, BookOpen, ExternalLink,
  Menu, X, Brain, FolderGit2, Compass
} from 'lucide-react';

export default function NavigationBar() {
  const { user, isAdmin, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <>
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

      {/* Navigation Links - Desktop */}
      <div className="hidden md:flex items-center space-x-8 text-xs font-mono font-bold">
        <Link href="/domains" className="nav-link">Domains</Link>
        <Link href="/courses" className="nav-link">Courses</Link>
        <Link href="/how-it-works" className="nav-link">How It Works</Link>
        <Link href="/pricing" className="nav-link">Pricing</Link>
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

      {/* Action Items: Theme Toggle + User Profile + Mobile Menu */}
      <div className="flex items-center space-x-3">
        {isAdmin && <ServerStatusButton />}
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition flex items-center justify-center shadow-sm"
          title="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition flex items-center justify-center shadow-sm"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
          ) : (
            <Moon className="w-4 h-4 text-cyan-500" />
          )}
        </button>

        {/* User Authentication Menu */}
        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition shadow-sm"
            >
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                alt={user.name}
                className="w-7 h-7 rounded-lg object-cover border border-slate-300 dark:border-slate-700"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 leading-tight">{user.name}</span>
                <span className={`text-[10px] font-mono leading-none ${isAdmin ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-emerald-600 dark:text-emerald-400 font-semibold'}`}>
                  {isAdmin ? 'Admin' : 'User'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 shadow-2xl p-2 space-y-1 font-sans text-xs z-50 animate-fade-in">
                <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{user.name}</div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs font-mono truncate">{user.email}</div>
                  <div className="mt-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      isAdmin 
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20' 
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {isAdmin ? 'Administrator' : 'Standard User'}
                    </span>
                  </div>
                </div>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-cyan-600 dark:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition font-medium font-mono"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>AI Admin Studio</span>
                  </Link>
                )}

                <Link
                  href="/learner/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-950 dark:hover:text-white transition font-medium"
                >
                  <Brain className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  <span>Cognitive Profile</span>
                </Link>

                <Link
                  href="/missions"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-950 dark:hover:text-white transition font-medium"
                >
                  <Compass className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                  <span>Adaptive Missions</span>
                </Link>

                <Link
                  href="/projects"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-950 dark:hover:text-white transition font-medium"
                >
                  <FolderGit2 className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  <span>Capstone Projects</span>
                </Link>

                <Link
                  href="/courses"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-950 dark:hover:text-white transition font-medium"
                >
                  <BookOpen className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <span>Course Tracks</span>
                </Link>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                    router.push('/auth');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 transition font-medium text-left border-t border-slate-200 dark:border-slate-800/60 mt-1"
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
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition"
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

    {/* Mobile Navigation Drawer */}
    {mobileMenuOpen && (
      <div className="fixed inset-0 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div
          className="absolute top-16 left-0 right-0 bg-white dark:bg-[#090d16] border-b border-slate-200 dark:border-slate-800 shadow-2xl p-4 space-y-1 animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <Link href="/domains" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-mono font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-emerald-500 dark:hover:text-emerald-400 transition">Domains</Link>
          <Link href="/courses" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-mono font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-emerald-500 dark:hover:text-emerald-400 transition">Courses</Link>
          <Link href="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-mono font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-emerald-500 dark:hover:text-emerald-400 transition">How It Works</Link>
          <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-mono font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-emerald-500 dark:hover:text-emerald-400 transition">Pricing</Link>
          <a href="https://pentabrid.com/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-mono font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-cyan-500 dark:hover:text-cyan-400 transition">
            <span>pentabrid.com</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
          </a>
          {isAdmin && (
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-mono font-bold text-cyan-500 dark:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition">
              <Sparkles className="w-4 h-4" />
              <span>AI Admin Studio</span>
            </Link>
          )}
        </div>
      </div>
    )}
    </>
  );
}
