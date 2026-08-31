"use client";
import React, { useState } from 'react';
import { Columns } from 'lucide-react';

export function ComparativeMatrix({ data = {}, onEvidence }) {
  const options = data.options || ['Option A: Protocol Alpha', 'Option B: Protocol Beta'];
  const criteria = data.criteria || [
    { trait: 'Latency / Speed of Action', optA: 'High (Immediate)', optB: 'Moderate (Delayed)' },
    { trait: 'System Overhead & Risk', optA: 'Low', optB: 'High Risk' },
    { trait: 'Long-Term Durability', optA: 'Sustainable', optB: 'Requires Continuous Override' }
  ];

  const [selectedOpt, setSelectedOpt] = useState(0);

  const handleSelect = (idx) => {
    setSelectedOpt(idx);
    if (onEvidence) {
      onEvidence({
        evidenceType: 'EXPLANATION',
        score: 1.0,
        telemetry: { selected_option: options[idx] }
      });
    }
  };

  return (
    <div className="w-full rounded-2xl bg-[#090d16] border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl font-sans text-slate-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-indigo-400 uppercase tracking-wider">
          <Columns className="w-4 h-4 text-indigo-400" />
          <span>Comparative Matrix & Trade-Off Analysis</span>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          Differential Evaluation
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono">
              <th className="py-3 px-4">Evaluation Dimension</th>
              <th className={`py-3 px-4 cursor-pointer ${selectedOpt === 0 ? 'text-indigo-400 font-bold' : ''}`} onClick={() => handleSelect(0)}>
                {options[0]}
              </th>
              <th className={`py-3 px-4 cursor-pointer ${selectedOpt === 1 ? 'text-indigo-400 font-bold' : ''}`} onClick={() => handleSelect(1)}>
                {options[1]}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {criteria.map((c, idx) => (
              <tr key={idx} className="hover:bg-slate-900/30 transition">
                <td className="py-3.5 px-4 font-semibold text-slate-200">{c.trait}</td>
                <td className={`py-3.5 px-4 ${selectedOpt === 0 ? 'bg-indigo-500/5 text-indigo-200' : 'text-slate-400'}`}>
                  {c.optA}
                </td>
                <td className={`py-3.5 px-4 ${selectedOpt === 1 ? 'bg-indigo-500/5 text-indigo-200' : 'text-slate-400'}`}>
                  {c.optB}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
