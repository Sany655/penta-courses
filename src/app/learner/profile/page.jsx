'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Brain, Compass, Sparkles, Target, Zap, Clock, 
  CheckCircle2, Flame, ArrowUpRight, Award, Layers, ShieldCheck, Inbox
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LearnerProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [curiositySignals, setCuriositySignals] = useState([]);
  const [reviewQueue, setReviewQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('penta_access_token') : null;
    if (!token && !user) {
      router.push('/auth');
      return;
    }

    if (!token) {
      setLoading(false);
      return;
    }

    Promise.all([
      fetch('/api/v1/learner/profile', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.ok ? res.json() : null),
      fetch('/api/v1/curiosity/radar', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.ok ? res.json() : [])
    ]).then(([profileData, radarData]) => {
      if (profileData) setProfile(profileData);
      if (Array.isArray(radarData)) {
        setCuriositySignals(radarData);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [user, router]);

  const handlePromoteToGoal = async (item) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('penta_access_token') : null;
    if (!token) return;

    try {
      const res = await fetch('/api/v1/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: item.title,
          domain_id: item.domain_id || item.domain || 'general',
          description: `Goal promoted from curiosity radar: ${item.title}`,
          target_level: 'L1'
        })
      });

      if (res.ok) {
        setNotice(`Goal activated: "${item.title}" added to mission queue.`);
        setTimeout(() => setNotice(''), 4000);
      }
    } catch (err) {
      console.error('Goal promotion error:', err);
    }
  };

  const displayName = user?.name || user?.full_name || 'Learner';
  const userInitials = displayName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'LR';
  const learningMode = profile?.learning_mode || 'BALANCED';
  const challengeLevel = profile ? Math.round((profile.challenge_preference || 0.5) * 100) : 50;

  // Dynamic 5-D vectors from profile traits or empty initial baseline
  const vectors = profile?.traits_json?.vectors || [
    { dim: 'Recall (15% weight)', val: 0, color: 'bg-emerald-500' },
    { dim: 'Explanation (20% weight)', val: 0, color: 'bg-blue-500' },
    { dim: 'Application (35% weight)', val: 0, color: 'bg-indigo-500' },
    { dim: 'Implementation (20% weight)', val: 0, color: 'bg-cyan-500' },
    { dim: 'Applied Creation (10% weight)', val: 0, color: 'bg-purple-500' }
  ];
  const overallMastery = Math.round(vectors.reduce((acc, v) => acc + (v.val || 0), 0) / (vectors.length || 1));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 pt-20">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {notice && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notice}</span>
          </div>
        )}

        {/* Profile Card */}
        <header className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-2xl font-mono">
              {userInitials}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">{displayName}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase font-mono">
                  {learningMode} Explorer
                </span>
              </div>
              <p className="text-xs text-slate-400">Adaptive Decision Matrix connected to cognitive state graph</p>
            </div>
          </div>

          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
            <div>
              <div className="text-xs text-slate-500 uppercase font-semibold font-mono">Challenge Bias</div>
              <div className="text-2xl font-bold text-white">{challengeLevel}%</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase font-semibold font-mono">Frontier Velocity</div>
              <div className="text-2xl font-bold text-emerald-400">+{overallMastery}%</div>
            </div>
          </div>
        </header>

        {/* 5-Dimensional Mastery Vectors Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Cognitive Mastery Breakdown */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                <Brain className="w-4 h-4" /> Multi-Dimensional Mastery Vectors
              </div>
              <span className="text-xs font-mono text-slate-400">Overall: {overallMastery}%</span>
            </div>

            {overallMastery === 0 && (
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
                Initial Baseline — Complete interactive lessons and challenges to calibrate your cognitive vectors.
              </div>
            )}

            <div className="space-y-4">
              {vectors.map(d => (
                <div key={d.dim} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{d.dim}</span>
                    <span className="font-mono text-slate-400">{d.val}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className={`h-full ${d.color} rounded-full transition-all duration-500`} style={{ width: `${Math.max(d.val, 2)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Retention & Spaced Review Queue */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Clock className="w-4 h-4" /> Ebbinghaus Spaced Review Due
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {reviewQueue.length} Pending
              </span>
            </div>

            {reviewQueue.length === 0 ? (
              <div className="py-10 px-4 text-center border border-dashed border-slate-800 rounded-2xl space-y-3">
                <ShieldCheck className="w-10 h-10 text-emerald-500/60 mx-auto" />
                <div className="text-sm font-semibold text-slate-200">All Memory Traces Consolidated</div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto font-mono">
                  No spaced reviews due today. Active concepts will automatically appear here as memory decay thresholds approach.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviewQueue.map(r => (
                  <div key={r.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-white">{r.concept}</div>
                      <div className="text-xs text-slate-400">{r.domain} • <span className="text-amber-400 font-semibold">{r.decay}</span></div>
                    </div>
                    <Link
                      href="/missions"
                      className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Exploration Radar & Curiosity Signals */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
              <Compass className="w-4 h-4" /> Exploration Radar & Curiosity Signals
            </div>
            <span className="text-xs text-slate-500">Autonomous Interest Tracking</span>
          </div>

          {curiositySignals.length === 0 ? (
            <div className="py-10 px-4 text-center border border-dashed border-slate-800 rounded-2xl space-y-3">
              <Inbox className="w-10 h-10 text-indigo-400/50 mx-auto" />
              <div className="text-sm font-semibold text-slate-200">Curiosity Radar Calibrating</div>
              <p className="text-xs text-slate-400 max-w-md mx-auto font-mono">
                No autonomous curiosity signals detected yet. Explore tracks, domains, and missions to establish your cognitive interest profile.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {curiositySignals.map(c => (
                <div key={c.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>{c.domain || 'Multi-Domain'}</span>
                      <span className="text-indigo-400 font-bold font-mono">Interest: {Math.round((c.interest_score || 0.7) * 100)}%</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-200">{c.title}</h3>
                  </div>

                  <button
                    onClick={() => handlePromoteToGoal(c)}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold hover:bg-indigo-600/20 transition"
                  >
                    <Target className="w-3.5 h-3.5" /> Promote to Goal
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
