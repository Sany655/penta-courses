import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Sparkles, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

const faqs = [
  {
    category: 'Ecosystem & Pentabrid',
    question: 'What is Pentabrid Engine and how does it connect to Pentabrid.com?',
    answer: 'Pentabrid Engine is the official mission-critical engineering education platform by Pentabrid (https://pentabrid.com/). While Pentabrid delivers enterprise cybersecurity and scalable cloud architecture solutions, the Engine trains practitioners and teams using real-world terminal simulations, kernel telemetry, and distributed architectures.'
  },
  {
    category: 'Pedagogy & Methodology',
    question: 'Why does Pentabrid Engine use "Zero-Video" interactive blocks?',
    answer: 'Traditional video tutorials encourage passive watching without muscle memory. Pentabrid Engine replaces video with auto-typing terminal simulations, interactive code steppers with line-by-line explanatory mechanics, and network packet flow visualizers that require active analysis and code comprehension.'
  },
  {
    category: 'Access & bKash Gateway',
    question: 'How does bKash manual transaction verification work for course access?',
    answer: 'Students can bypass individual gatekeeper phases or enroll in entire tracks via bKash. Upon sending money to the official Pentabrid bKash number, you submit your Transaction ID (TrxID). Our administrative team verifies the transaction in the ledger and manually unlocks curriculum access within minutes.'
  },
  {
    category: 'Enterprise & Licensing',
    question: 'Can companies or security teams license Pentabrid Engine for employee upskilling?',
    answer: 'Yes! Pentabrid offers custom Enterprise Cohorts with private sandbox telemetry, tailored threat models (e.g. Fintech, Healthcare, Cloud Infra), and centralized progress analytics. Contact our enterprise team via the suggestion/contact form below.'
  },
  {
    category: 'Assessments & Progression',
    question: 'What happens if I score below 80% on a Gatekeeper Quiz?',
    answer: 'Gatekeeper quizzes test genuine mastery. If you score below 80%, detailed algorithmic explanations are provided for every question. You can review the theoretical doctrine and code steppers, then retry the assessment at any time.'
  },
  {
    category: 'Curriculum Suggestions',
    question: 'Can I suggest new technical tracks or frameworks?',
    answer: 'Absolutely. We actively build tracks requested by our community. Use the Contact & Suggestion form below to submit ideas for specialized tracks (e.g. Web3 Security, High-Speed FPGA, LLM Guardrails) directly to our engineering instructors.'
  }
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-[#05070a] border-b border-slate-900 transition-colors" id="faq">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold shadow-sm">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>PENTABRID KNOWLEDGE BASE</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
            Everything you need to know about the platform, curriculum methodology, and the{' '}
            <a 
              href="https://pentabrid.com/" 
              target="_blank" 
              rel="noreferrer" 
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline inline-flex items-center gap-1"
            >
              official Pentabrid ecosystem <ExternalLink className="w-3 h-3" />
            </a>.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`bg-[#090d16] border rounded-2xl transition-all duration-200 overflow-hidden shadow-md ${
                  isOpen 
                    ? 'border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                    : 'border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 transition"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {faq.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  <div className={`p-2 rounded-xl border shrink-0 transition-transform duration-200 ${
                    isOpen 
                      ? 'rotate-180 bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-2 text-slate-600 dark:text-slate-300 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800/50 font-normal">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Support Callout */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
          <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
            Have a custom requirement?
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-sm">
            Need dedicated mentoring or custom lab environments? Drop a message below and our technical leads at Pentabrid will reach out.
          </p>
        </div>

      </div>
    </section>
  );
};
