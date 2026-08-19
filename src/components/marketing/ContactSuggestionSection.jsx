import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, Sparkles, Building2, Mail, ExternalLink, Globe, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';

export const ContactSuggestionSection = () => {
  const { submitInquiry, user } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState('Curriculum Suggestion');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    submitInquiry({
      name,
      email,
      company,
      category,
      message
    });

    setSubmitted(true);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });

    setMessage('');
    setTimeout(() => {
      setSubmitted(false);
    }, 6000);
  };

  return (
    <section className="py-20 bg-[#05070a] border-b border-slate-900 transition-colors" id="contact">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Official Pentabrid Ecosystem Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>CO-DESIGN & ENTERPRISE ADVISORY</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Request a Custom Track or Share Suggestions
            </h2>

            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Pentabrid Engine evolves through community feedback and enterprise co-design. Whether proposing a new kernel engineering module or requesting an internal security boot camp for your company, your submission goes directly to our lead instructors.
            </p>

            {/* Official Pentabrid Badge Card */}
            <div className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-base shadow-sm">
                  ▲
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>Pentabrid Ecosystem</span>
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <a
                    href="https://pentabrid.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <span>https://pentabrid.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="text-xs text-slate-400 space-y-2 border-t border-slate-800/80 pt-4 font-mono">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>HQ: Enterprise Cyber & Distributed Systems Lab</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Email: <a href="mailto:admin@pentabrid.com" className="text-slate-200 font-bold hover:underline">admin@pentabrid.com</a></span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Suggestion Form */}
          <div className="lg:col-span-7 bg-[#090d16] border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Direct Advisory Dispatch</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Submissions sync immediately to the AI Admin Studio</p>
              </div>
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20">
                Live Gateway
              </span>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Inquiry Received & Dispatched!</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Thank you, <strong>{name}</strong>. Your suggestion regarding <em>"{category}"</em> has been logged in the Admin Verification Center. Our lead engineers at Pentabrid will review it shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Mercer"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full p-3 bg-[#05070a] border border-slate-800 rounded-xl text-slate-100 text-xs focus:border-emerald-500 focus:outline-none transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full p-3 bg-[#05070a] border border-slate-800 rounded-xl text-slate-100 text-xs focus:border-emerald-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Company / Organization (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. CloudGuard Security"
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      className="w-full p-3 bg-[#05070a] border border-slate-800 rounded-xl text-slate-100 text-xs focus:border-emerald-500 focus:outline-none transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Category / Purpose</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full p-3 bg-[#05070a] border border-slate-800 rounded-xl text-slate-100 text-xs focus:border-emerald-500 focus:outline-none transition cursor-pointer"
                    >
                      <option value="Curriculum Suggestion">Curriculum Suggestion</option>
                      <option value="Enterprise Custom Track">Enterprise Custom Track Cohort</option>
                      <option value="Licensing & Partnership">Platform Licensing & Partnership</option>
                      <option value="Technical Question">Technical / Lab Question</option>
                      <option value="Security & Vulnerability Report">Security & Vulnerability Report</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Details & Objectives</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your suggested track, custom syllabus requirements, or feedback..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full p-3 bg-[#05070a] border border-slate-800 rounded-xl text-slate-100 text-xs focus:border-emerald-500 focus:outline-none transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wide transition shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Suggestion to Pentabrid Admins</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
