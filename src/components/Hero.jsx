import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Terminal, ShieldCheck, Cpu, ArrowRight, 
  Sparkles, Code2, Layers, Play 
} from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();
  const [terminalText, setTerminalText] = useState('');
  const [commandIndex, setCommandIndex] = useState(0);

  const isHidden = localStorage.getItem('penta_hero_hidden') === 'true';
  const storedTitle = localStorage.getItem('penta_hero_title');
  const renderTitle = storedTitle || 'Mission-Critical <br /> <span class="text-gradient-emerald">Offensive Cyber</span> & <br /> <span class="text-gradient-cyan">Distributed Architecture</span>';
  
  const storedCmds = localStorage.getItem('penta_hero_cmds');
  const commandList = storedCmds 
    ? storedCmds.split(',').map(c => c.trim())
    : [
        'penta-core --track=cybersecurity',
        'python3 train_model.py --explain=tree-shap',
        'clang -O2 -target bpf -c filter.c -o filter.o'
      ];

  useEffect(() => {
    let charIndex = 0;
    const currentCmd = commandList[commandIndex];
    setTerminalText('');

    const typingInterval = setInterval(() => {
      if (charIndex < currentCmd.length) {
        setTerminalText(currentCmd.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setCommandIndex((prev) => (prev + 1) % commandList.length);
        }, 2200);
      }
    }, 45);

    return () => clearInterval(typingInterval);
  }, [commandIndex]);

  if (isHidden) return null;

  return (
    <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-[#05070a] border-b border-slate-900 transition-colors">
      {/* Background Neon Grid Matrix */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-emerald-500/10 via-cyan-500/15 to-purple-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: High Converting Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]" />
              <span>PENTABRID ENGINE v3.4 — DISTRIBUTED LEARNING FOR ELITE DEVS</span>
            </div>

            <h1 
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]"
              dangerouslySetInnerHTML={{ __html: renderTitle }}
            />

            {/* Dynamic CLI Subheadline - Dedicated Sleek Dark Console */}
            <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-3.5 font-mono text-xs md:text-sm text-slate-200 flex items-center space-x-3 shadow-xl">
              <span className="text-emerald-400 font-bold">$</span>
              <span className="text-cyan-300 font-medium">{terminalText}</span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-2 h-4 bg-emerald-400 inline-block"
              />
            </div>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              Zero video filler. Master technical domains through live auto-typing terminals, step-by-step code execution steppers, network packet simulators, and strict gatekeeper tests.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#courses"
                className="px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center gap-2 hover:scale-[1.02] transform duration-150"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => navigate('/admin')}
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>AI Admin Studio</span>
              </button>
            </div>

            {/* Live Stats */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-800/80 font-mono text-xs">
              <div>
                <div className="text-xl font-bold text-white">4 Tracks</div>
                <div className="text-slate-400 font-medium">Web, Net, Cyber, ML</div>
              </div>
              <div>
                <div className="text-xl font-bold text-emerald-400">100% Code</div>
                <div className="text-slate-400 font-medium">Zero Fluff Video</div>
              </div>
              <div>
                <div className="text-xl font-bold text-cyan-400">&lt;2.4s</div>
                <div className="text-slate-400 font-medium">Sub-Second Execution</div>
              </div>
            </div>
          </div>

          {/* Right Column: Cyber HUD Graphic */}
          <div className="lg:col-span-5 relative">
            <div className="bg-[#070b14] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 relative overflow-hidden text-slate-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="font-mono text-xs font-bold text-slate-100">PLATFORM NODE: ACTIVE</span>
                </div>
                <span className="font-mono text-[11px] text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-700/60 font-semibold">
                  SECURE ENVIRONMENT
                </span>
              </div>

              {/* Mini Interactive Preview Graphic */}
              <div className="space-y-2.5 font-mono text-xs">
                <div className="p-3 bg-[#0d1322] rounded-xl border border-slate-800/90 text-slate-300 space-y-1">
                  <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Active Filter Module</div>
                  <div className="text-emerald-400 font-bold text-xs">PACKET FILTERING (ACTIVE)</div>
                </div>
                <div className="p-3 bg-[#0d1322] rounded-xl border border-slate-800/90 text-slate-300 space-y-1">
                  <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Telemetry Interface</div>
                  <div className="text-cyan-400 font-bold text-xs">SENSOR CONNECTION: ESTABLISHED</div>
                </div>
                <div className="p-3 bg-[#0d1322] rounded-xl border border-slate-800/90 text-slate-300 space-y-1">
                  <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Model Feature Analysis</div>
                  <div className="text-amber-400 font-bold text-xs">EXPLAINER MODULE: OPTIMIZED</div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Access Control: <strong className="text-slate-300">Strict</strong></span>
                <span className="text-emerald-400 font-bold">Sequential Lock Enabled</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
