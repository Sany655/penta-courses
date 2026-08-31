"use client";
import React, { useState } from 'react';
import { MessageSquare, CheckCircle2 } from 'lucide-react';

export function DialecticalBuilder({ data = {}, onEvidence }) {
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [selectedWarrant, setSelectedWarrant] = useState(null);

  const claims = data.claims || [
    'Primary Hypothesis: Metabolic acidemia derives from unmeasured anions (DKA).',
    'Alternative: Respiratory alkalosis with hyperventilation compensatory shift.'
  ];

  const warrants = data.warrants || [
    'Warrant: High Anion Gap (> 12) strictly indicates fixed organic acid accumulation.',
    'Warrant: Normal Anion Gap with hyperchloremia indicates renal tubular loss.'
  ];

  const isMatched = selectedClaim === 0 && selectedWarrant === 0;

  const handleSubmit = () => {
    if (onEvidence) {
      onEvidence({
        evidenceType: 'TEACHING',
        score: isMatched ? 1.0 : 0.3,
        telemetry: { selectedClaim, selectedWarrant, isMatched }
      });
    }
  };

  return (
    <div className="w-full rounded-2xl bg-[#090d16] border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl font-sans text-slate-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <span>Dialectical & Argument Builder</span>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          Socratic Reasoning
        </span>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase">Step 1: Select Thesis Claim</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {claims.map((c, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedClaim(idx)}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition ${
                  selectedClaim === idx ? 'bg-amber-500/10 border-amber-500 text-amber-200 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {c}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <span className="text-xs font-mono text-slate-400 uppercase">Step 2: Connect Foundational Warrant</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {warrants.map((w, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedWarrant(idx)}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition ${
                  selectedWarrant === idx ? 'bg-amber-500/10 border-amber-500 text-amber-200 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {w}
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        disabled={selectedClaim === null || selectedWarrant === null}
        onClick={handleSubmit}
        className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
      >
        <CheckCircle2 className="w-4 h-4" /> Validate Argument Linkage
      </button>
    </div>
  );
}
