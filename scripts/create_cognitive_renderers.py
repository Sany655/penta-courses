import os

os.makedirs('src/components/cognitive', exist_ok=True)

files = {}

# 1. SequenceEngine.jsx
files['src/components/cognitive/SequenceEngine.jsx'] = """\"use client\";
import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, ChevronLeft, Sparkles, ShieldCheck } from 'lucide-react';

export function SequenceEngine({ data = {}, onEvidence, isPreview = false }) {
  const steps = data.steps || [
    { action: 'Initial Assessment', rationale: 'Establish baseline parameters and identify critical path items.' },
    { action: 'Execute Intervention', rationale: 'Apply targeted protocol with monitored feedback loops.' },
    { action: 'Validate State Shift', rationale: 'Verify system transition and prevent secondary complications.' }
  ];
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set([0]));
  const [isCompleted, setIsCompleted] = useState(false);
  const [stepStartTime, setStepStartTime] = useState(Date.now());

  const currentStep = steps[activeStep] || { action: 'Initialization', rationale: 'Overview of procedural steps.' };

  const handleNext = () => {
    const nextStep = activeStep + 1;
    const nextCompleted = new Set(completedSteps);
    nextCompleted.add(activeStep);
    setCompletedSteps(nextCompleted);

    if (nextStep < steps.length) {
      setActiveStep(nextStep);
      setStepStartTime(Date.now());
    } else {
      setIsCompleted(true);
      if (onEvidence) {
        onEvidence({
          evidenceType: 'IMPLEMENTATION',
          score: 1.0,
          telemetry: {
            total_steps: steps.length,
            completed_steps: nextCompleted.size,
            time_spent_ms: Date.now() - stepStartTime
          }
        });
      }
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  return (
    <div className="w-full rounded-2xl bg-[#090d16] border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl font-sans text-slate-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Procedural Sequence Engine</span>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          Phase {activeStep + 1} of {steps.length || 1}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
        {steps.map((step, idx) => {
          const isCurrent = idx === activeStep;
          const isDone = completedSteps.has(idx);
          return (
            <div
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                isCurrent
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : isDone
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold">0{idx + 1}</span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <span className="line-clamp-1 font-medium">{typeof step === 'string' ? step : step.action}</span>
            </div>
          );
        })}
      </div>

      <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
        <div className="flex items-start gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 mt-2 shrink-0 animate-ping" />
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white leading-snug">
              {typeof currentStep === 'string' ? currentStep : currentStep.action}
            </h3>
            {currentStep.rationale && (
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                <strong className="text-cyan-400 font-semibold mr-1.5">Mechanism:</strong>
                {currentStep.rationale}
              </p>
            )}
          </div>
        </div>

        {currentStep.codeSnippet && (
          <pre className="p-4 rounded-lg bg-black/60 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
            {currentStep.codeSnippet}
          </pre>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          disabled={activeStep === 0}
          onClick={handlePrev}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-xs rounded-xl transition text-slate-300 flex items-center gap-1 border border-slate-800"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        {!isCompleted ? (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            {activeStep === steps.length - 1 ? 'Verify Sequence' : 'Next Step Execution'}
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl">
            <ShieldCheck className="w-4 h-4" />
            <span>Sequence Competence Verified</span>
          </div>
        )}
      </div>
    </div>
  );
}
"""

# 2. CausalSystemGraph.jsx
files['src/components/cognitive/CausalSystemGraph.jsx'] = """\"use client\";
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
"""

# 3. VariableSandbox.jsx
files['src/components/cognitive/VariableSandbox.jsx'] = """\"use client\";
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
"""

# 4. SpatialCanvas.jsx
files['src/components/cognitive/SpatialCanvas.jsx'] = """\"use client\";
import React, { useState } from 'react';
import { Target, Info } from 'lucide-react';

export function SpatialCanvas({ data = {}, onEvidence }) {
  const pins = data.pins || [
    { id: 'p1', x: 25, y: 35, title: 'Anterior Focus / Inflow Port', desc: 'Primary intake or cranial assessment zone.' },
    { id: 'p2', x: 70, y: 55, title: 'Central Core Node', desc: 'Critical processing or metabolic heart.' },
    { id: 'p3', x: 45, y: 80, title: 'Posterior Exhaust / Outflow', desc: 'Filter boundary or venous return.' }
  ];

  const [selectedPin, setSelectedPin] = useState(pins[0]);
  const [inspectedPins, setInspectedPins] = useState(new Set(['p1']));

  const handleSelect = (pin) => {
    setSelectedPin(pin);
    const updated = new Set(inspectedPins);
    updated.add(pin.id);
    setInspectedPins(updated);

    if (onEvidence && updated.size === pins.length) {
      onEvidence({
        evidenceType: 'RECALL',
        score: 1.0,
        telemetry: { total_pins: pins.length, inspected_all: true }
      });
    }
  };

  return (
    <div className="w-full rounded-2xl bg-[#090d16] border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl font-sans text-slate-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-blue-400 uppercase tracking-wider">
          <Target className="w-4 h-4 text-blue-400" />
          <span>Spatial & Anatomical Canvas</span>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          {inspectedPins.size} / {pins.length} Hotspots Inspected
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 relative h-64 md:h-80 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {pins.map((pin) => {
            const isSelected = selectedPin.id === pin.id;
            const isInspected = inspectedPins.has(pin.id);
            return (
              <button
                key={pin.id}
                onClick={() => handleSelect(pin)}
                style={{ top: `${pin.y}%`, left: `${pin.x}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full border transition-all ${
                  isSelected
                    ? 'bg-blue-500 text-white border-blue-300 scale-125 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10'
                    : isInspected
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-current" />
              </button>
            );
          })}
        </div>

        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase mb-2">
              <Info className="w-3.5 h-3.5" />
              <span>Inspection Telemetry</span>
            </div>
            <h4 className="text-base font-bold text-white leading-snug">{selectedPin.title}</h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">{selectedPin.desc}</p>
          </div>

          <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-500 font-mono">
            Click all target hotspots to complete diagnostic inspection.
          </div>
        </div>
      </div>
    </div>
  );
}
"""

# 5. ComparativeMatrix.jsx
files['src/components/cognitive/ComparativeMatrix.jsx'] = """\"use client\";
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
"""

# 6. DialecticalBuilder.jsx
files['src/components/cognitive/DialecticalBuilder.jsx'] = """\"use client\";
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
"""

# 7. TaxonomySorter.jsx
files['src/components/cognitive/TaxonomySorter.jsx'] = """\"use client\";
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
"""

# 8. CognitiveBlockRegistry.jsx
files['src/components/cognitive/CognitiveBlockRegistry.jsx'] = """\"use client\";
import React from 'react';
import { SequenceEngine } from './SequenceEngine';
import { CausalSystemGraph } from './CausalSystemGraph';
import { VariableSandbox } from './VariableSandbox';
import { SpatialCanvas } from './SpatialCanvas';
import { ComparativeMatrix } from './ComparativeMatrix';
import { DialecticalBuilder } from './DialecticalBuilder';
import { TaxonomySorter } from './TaxonomySorter';

export function CognitiveBlockRegistry({ block, onEvidence, isPreview = false }) {
  if (!block) return null;

  const archetype = block.archetype || block.type;
  const data = block.data || block.data_json || {};

  switch (archetype) {
    case 'sequence_engine':
    case 'code_stepper':
      return <SequenceEngine data={data} onEvidence={onEvidence} isPreview={isPreview} />;
    
    case 'causal_graph':
    case 'network_flow':
      return <CausalSystemGraph data={data} onEvidence={onEvidence} />;
    
    case 'variable_sandbox':
    case 'terminal':
      return <VariableSandbox data={data} onEvidence={onEvidence} />;
    
    case 'spatial_canvas':
      return <SpatialCanvas data={data} onEvidence={onEvidence} />;
    
    case 'comparative_matrix':
      return <ComparativeMatrix data={data} onEvidence={onEvidence} />;
    
    case 'dialectical_builder':
      return <DialecticalBuilder data={data} onEvidence={onEvidence} />;
    
    case 'taxonomy_sorter':
    case 'quiz':
      return <TaxonomySorter data={data} onEvidence={onEvidence} />;
    
    default:
      return <SequenceEngine data={data} onEvidence={onEvidence} isPreview={isPreview} />;
  }
}
"""

for path, code in files.items():
    with open(path, 'w', encoding='utf-8') as f:
        f.write(code)
    print(f'Wrote {path}')

print('All 7 Cognitive Renderers and the Registry successfully created!')
