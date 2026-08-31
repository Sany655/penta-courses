"use client";
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
