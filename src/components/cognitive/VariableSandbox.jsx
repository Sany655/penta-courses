"use client";
import React, { useState } from 'react';
import { Sliders, CheckCircle } from 'lucide-react';

export function VariableSandbox({ data = {}, onEvidence }) {
  const [valA, setValA] = useState(data.initialA || 50);
  const [valB, setValB] = useState(data.initialB || 25);
  const targetOutput = data.targetOutput || 75;

  const currentOutput = Math.round((valA * 0.6) + (valB * 1.8));
  const isOptimal = Math.abs(currentOutput - targetOutput) <= 5;

  const handleVerify = () => {
    if (onEvidence) {
      onEvidence({
        evidenceType: 'PROBLEM_SOLVING',
        score: isOptimal ? 1.0 : 0.4,
        telemetry: { valA, valB, currentOutput, targetOutput, isOptimal }
      });
    }
  };

  return (
    <div className="w-full rounded-2xl bg-[#090d16] border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl font-sans text-slate-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>Variable Parameter Sandbox</span>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          Interactive Simulation
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1.5">
              <span>{data.labelA || 'Parameter Alpha (Intensity)'}</span>
              <span className="text-emerald-400 font-bold">{valA}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={valA}
              onChange={(e) => setValA(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1.5">
              <span>{data.labelB || 'Parameter Beta (Dampening)'}</span>
              <span className="text-emerald-400 font-bold">{valB}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={valB}
              onChange={(e) => setValB(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">Computed Output Metric</span>
            <div className="text-4xl font-extrabold font-mono text-white mt-2 flex items-baseline gap-2">
              {currentOutput}
              <span className="text-xs font-normal text-slate-400">Target: ~{targetOutput}</span>
            </div>
            <p className={`text-xs mt-3 ${isOptimal ? 'text-emerald-400 font-semibold' : 'text-amber-400'}`}>
              {isOptimal ? 'Optimal equilibrium state reached within target tolerance.' : 'Tune sliders to align with expected steady state.'}
            </p>
          </div>

          <button
            onClick={handleVerify}
            className="mt-4 w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" /> Submit Parameter Set
          </button>
        </div>
      </div>
    </div>
  );
}
