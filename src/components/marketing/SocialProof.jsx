import React from 'react';
import { Terminal, Shield, Cpu, Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Devin K.',
    role: 'Lead Security Engineer at CloudGuard',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    quote: 'The Scapy raw socket dissection and EDR kernel bypass labs are closer to real red-team operations than anything on Coursera or Udemy. Zero fluff, 100% executable CLI.',
    track: 'Offensive Cybersecurity'
  },
  {
    name: 'Dr. Ryan Sterling',
    role: 'Staff ML Architect at BioMed AI',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    quote: 'The step-by-step CodeStepper for TreeSHAP and tabular gradient boosting gave our new engineers an intuitive grasp of clinical explainability in 48 hours.',
    track: 'Predictive Modeling on Clinical Data'
  },
  {
    name: 'Yuki Takahashi',
    role: 'Infrastructure Principal at EdgeScale',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    quote: 'Being able to test eBPF/XDP drop filters in an auto-typing simulated sandbox without crashing our test cluster is gold standard pedagogical engineering.',
    track: 'Protocol Engineering'
  }
];

export const SocialProof = () => {
  return (
    <section className="py-20 bg-[#05070a] border-b border-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 font-bold">
            PRACTITIONER VALIDATION
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Trusted By Senior Engineers & Red Teams
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl relative group hover:border-slate-700 transition"
            >
              <Quote className="w-8 h-8 text-slate-300 dark:text-slate-800 absolute top-6 right-6 pointer-events-none opacity-50" />

              <div className="space-y-4">
                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex items-center space-x-3 mt-6">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700 object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">{t.role}</div>
                  <div className="text-[11px] font-mono text-cyan-700 dark:text-cyan-400 font-bold mt-0.5">{t.track}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
