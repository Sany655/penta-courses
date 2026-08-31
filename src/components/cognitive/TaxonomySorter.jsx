"use client";
import React, { useState } from 'react';
import { Layers, CheckCircle2 } from 'lucide-react';

export function TaxonomySorter({ data = {}, onEvidence }) {
  const categories = data.categories || ['Immediate Resuscitation (Tier 1)', 'Urgent Stabilisation (Tier 2)', 'Routine Workup (Tier 3)'];
  const items = data.items || [
    { id: 'i1', text: 'Airway / IV Fluid Bolus', cat: 0 },
    { id: 'i2', text: 'Electrolyte & ABG Panel', cat: 1 },
    { id: 'i3', text: 'Discharge Summary Review', cat: 2 }
  ];

  const [allocations, setAllocations] = useState({});

  const handleAllocate = (itemId, catIdx) => {
    setAllocations(prev => ({ ...prev, [itemId]: catIdx }));
  };

  const handleVerify = () => {
    let correctCount = 0;
    items.forEach(item => {
      if (allocations[item.id] === item.cat) correctCount++;
    });
    const score = correctCount / items.length;
    if (onEvidence) {
      onEvidence({
        evidenceType: 'PROBLEM_SOLVING',
        score: score,
        telemetry: { total_items: items.length, correctCount }
      });
    }
  };

  return (
    <div className="w-full rounded-2xl bg-[#090d16] border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl font-sans text-slate-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-rose-400 uppercase tracking-wider">
          <Layers className="w-4 h-4 text-rose-400" />
          <span>Taxonomy & Triage Classifier</span>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          Categorical Triage
        </span>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <span className="text-xs font-bold text-white">{item.text}</span>
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat, catIdx) => (
                <button
                  key={catIdx}
                  onClick={() => handleAllocate(item.id, catIdx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition border ${
                    allocations[item.id] === catIdx
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {cat.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleVerify}
        className="w-full py-3 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
      >
        <CheckCircle2 className="w-4 h-4" /> Submit Triage Allocations
      </button>
    </div>
  );
}
