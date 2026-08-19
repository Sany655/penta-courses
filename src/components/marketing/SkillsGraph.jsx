import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Terminal, Network, ShieldCheck, Zap } from 'lucide-react';

const trackSkills = {
  CYBERSECURITY: [
    { name: 'Packet Dissection', level: 95, color: '#10b981' },
    { name: 'Kernel Hooking & ETW-Ti', level: 90, color: '#10b981' },
    { name: 'C2 Tunneling & Pivoting', level: 85, color: '#06b6d4' },
    { name: 'HTTP Request Smuggling', level: 80, color: '#f59e0b' }
  ],
  PREDICTIVE_ML: [
    { name: 'TreeSHAP Biomarker Attribution', level: 92, color: '#a855f7' },
    { name: 'Gradient Boosting (XGBoost)', level: 96, color: '#a855f7' },
    { name: 'Tabular Deep Learning', level: 84, color: '#06b6d4' },
    { name: 'Drift Detection (KS-Test)', level: 88, color: '#10b981' }
  ],
  NETWORKING: [
    { name: 'eBPF / XDP High-Rate Filters', level: 94, color: '#06b6d4' },
    { name: 'BGP Route Leak Prevention', level: 86, color: '#06b6d4' },
    { name: 'QUIC / HTTP3 Protocol Tuning', level: 89, color: '#10b981' },
    { name: 'TCP BBRv3 Congestion Analysis', level: 82, color: '#f59e0b' }
  ],
  WEB_ARCHITECTURE: [
    { name: 'Distributed Mutex (Redlock)', level: 95, color: '#f59e0b' },
    { name: 'Event-Driven CQRS & Kafka', level: 88, color: '#f59e0b' },
    { name: 'Edge Runtime SSR & Caching', level: 92, color: '#06b6d4' },
    { name: 'Optimistic State Sync', level: 85, color: '#10b981' }
  ]
};

export const SkillsGraph = () => {
  const [activeDomain, setActiveDomain] = useState('CYBERSECURITY');

  return (
    <section className="py-20 bg-[#05070a] border-b border-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-400 text-xs font-mono font-bold mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>PROGRESSIVE CAPABILITY ACQUISITION</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            Skills You Will Master In The Sandbox
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-2">
            Every lesson validates discrete system engineering competencies with tangible telemetry.
          </p>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex justify-center gap-2.5 mb-10 flex-wrap">
          {Object.keys(trackSkills).map((domain) => {
            const isActive = activeDomain === domain;
            return (
              <button
                key={domain}
                onClick={() => setActiveDomain(domain)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition shadow-sm ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-cyan-400 border border-slate-800 dark:border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 dark:bg-slate-900/60 dark:text-slate-400 dark:border-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {domain.replace('_', ' ')}
              </button>
            );
          })}
        </div>

        {/* Skills Telemetry Bars */}
        <div className="max-w-3xl mx-auto bg-[#090d16] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
          {trackSkills[activeDomain].map((skill, idx) => (
            <div key={idx} className="space-y-2 font-mono">
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-slate-900 dark:text-slate-200 font-semibold">{skill.name}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{skill.level}% Mastery Index</span>
              </div>
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-300 dark:border-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  style={{ backgroundColor: skill.color }}
                  className="h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
