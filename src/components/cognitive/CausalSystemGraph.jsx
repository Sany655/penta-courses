"use client";
import React, { useState } from 'react';
import { GitBranch, Activity, Zap } from 'lucide-react';

export function CausalSystemGraph({ data = {}, onEvidence }) {
  const nodes = data.nodes || [
    { id: '1', label: 'Primary Cause / Insult', state: 'Active', effect: 'Triggers downstream pathway cascade' },
    { id: '2', label: 'Intermediate Mechanism', state: 'Cascading', effect: 'Amplifies strain in the target domain' },
    { id: '3', label: 'Systemic Endpoint', state: 'Target', effect: 'Clinical decompensation or market equilibrium' }
  ];

  const [activeNode, setActiveNode] = useState(nodes[0]);
  const [perturbed, setPerturbed] = useState(false);

  const handlePerturb = () => {
    setPerturbed(!perturbed);
    if (onEvidence) {
      onEvidence({
        evidenceType: 'PROBLEM_SOLVING',
        score: 1.0,
        telemetry: { perturbed: !perturbed, selected_node: activeNode.id }
      });
    }
  };

  return (
    <div className="w-full rounded-2xl bg-[#090d16] border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl font-sans text-slate-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-purple-400 uppercase tracking-wider">
          <GitBranch className="w-4 h-4 text-purple-400" />
          <span>Causal System Graph</span>
        </div>
        <button
          onClick={handlePerturb}
          className={`px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1.5 transition ${
            perturbed ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <Zap className="w-3 h-3" />
          {perturbed ? 'Perturbation Active' : 'Inject Perturbation'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {nodes.map((node, idx) => {
          const isSelected = activeNode.id === node.id;
          return (
            <div
              key={node.id}
              onClick={() => setActiveNode(node)}
              className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-purple-500/10 border-purple-500 text-purple-100 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-purple-400">Node 0{idx + 1}</span>
                <Activity className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-400' : 'text-slate-600'}`} />
              </div>
              <h4 className="font-bold text-sm text-white mb-2">{node.label}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{node.effect}</p>
            </div>
          );
        })}
      </div>

      <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
        <span className="text-xs font-mono text-purple-400 uppercase">Cascade Details: {activeNode.label}</span>
        <p className="text-sm text-slate-300 mt-2">
          {activeNode.effect} - In a dynamic equilibrium state, modulation of this node triggers reciprocal shifts across downstream nodes.
        </p>
      </div>
    </div>
  );
}
