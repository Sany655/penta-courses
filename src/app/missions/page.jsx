'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Compass, Target, ArrowRight, CheckCircle2, 
  AlertTriangle, RefreshCw, Layers, Brain, Zap, HelpCircle 
} from 'lucide-react';
import { InteractiveBlock } from '@/components/student/BlockRenderers';

export default function AdaptiveMissionsPage() {
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [masteryGain, setMasteryGain] = useState(0);
  const [showExplainability, setShowExplainability] = useState(false);

  useEffect(() => {
    startNewMission();
  }, []);

  const startNewMission = async () => {
    setLoading(true);
    setFeedback(null);
    setMasteryGain(0);

    setTimeout(() => {
      setMission({
        activity_id: 'act-med-101',
        title: 'DKA Causal Pathway & Electrolyte Cascades',
        activity_type: 'PRACTICE',
        archetype: 'causal_graph',
        difficulty: 0.8,
        concept: {
          id: 'c-dka',
          name: 'Diabetic Ketoacidosis (DKA) Pathogenesis',
          domain: 'Clinical Medicine & Differential Pathophysiology'
        },
        explainability: {
          primary_reason: 'Highest-impact knowledge frontier concept required for Acute Resuscitation goal.',
          formula_factors: {
            goal_relevance: '95%',
            knowledge_gap: '80%',
            prereq_readiness: '100%',
            retention_urgency: 'Low'
          }
        },
        data_json: {
          nodes: [
            { id: '1', label: 'Absolute Insulin Deficiency', state: 'Active', effect: 'Unchecked lipolysis and hepatic gluconeogenesis' },
            { id: '2', label: 'Accumulation of Acetoacetate & Beta-Hydroxybutyrate', state: 'Cascading', effect: 'HAGMA consumption of bicarbonate buffer' },
            { id: '3', label: 'Osmotic Diuresis & Total-Body Potassium Depletion', state: 'Critical', effect: 'Dehydration and shift-dependent cardiac arrhythmia' }
          ]
        }
      });
      setLoading(false);
    }, 400);
  };

  const handleEvidence = (evidence) => {
    const isSuccess = (evidence.score || 1.0) >= 0.7;
    setMasteryGain(isSuccess ? 0.12 : -0.04);
    setFeedback({
      success: isSuccess,
      message: isSuccess 
        ? 'Hypothesis verified! Concept application strength increased by +12%.'
        : 'Causal instability detected. Prerequisite repair loop activated.',
      score: evidence.score || 1.0
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" /> Self-Directed Adaptive Mission Mode
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              {mission?.concept?.domain || 'Autonomous Frontier Exploration'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExplainability(!showExplainability)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              Why this mission?
            </button>
            <button
              onClick={startNewMission}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Next Adaptive Step
            </button>
          </div>
        </header>

        {/* Explainability Drawer */}
        <AnimatePresence>
          {showExplainability && mission?.explainability && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-5 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl space-y-3"
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
                <Brain className="w-4 h-4 text-indigo-400" />
                Adaptive Decision Engine Rationale
              </div>
              <p className="text-sm text-slate-200">{mission.explainability.primary_reason}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {Object.entries(mission.explainability.formula_factors).map(([k, v]) => (
                  <div key={k} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                    <div className="text-slate-400 capitalize">{k.replace('_', ' ')}</div>
                    <div className="text-indigo-400 font-bold text-sm mt-0.5">{String(v)}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Viewport */}
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center space-y-4 rounded-2xl bg-slate-900/50 border border-slate-800">
            <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
            <p className="text-sm text-slate-400 font-medium">Calibrating Knowledge Frontier & Cognitive Archetype...</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Target Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                    {mission?.activity_type}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                    Difficulty: {Math.round((mission?.difficulty || 0.5) * 100)}%
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">{mission?.title}</h2>
                <p className="text-xs text-slate-400">Target Concept: <span className="text-slate-200 font-medium">{mission?.concept?.name}</span></p>
              </div>

              {masteryGain !== 0 && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`px-4 py-3 rounded-xl border flex items-center gap-3 ${
                    masteryGain > 0 
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                  }`}
                >
                  <Zap className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-[11px] uppercase font-bold tracking-wider">Mastery Vector Delta</div>
                    <div className="text-sm font-bold">
                      {masteryGain > 0 ? `+${Math.round(masteryGain * 100)}% Mastery Gained` : `${Math.round(masteryGain * 100)}% Delta Recorded`}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Cognitive Block */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
              <InteractiveBlock
                block={{
                  type: mission.archetype,
                  title: mission.title,
                  data: mission.data_json
                }}
                onEvidence={handleEvidence}
              />
            </div>

            {/* Feedback Banner */}
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl border flex items-start gap-4 ${
                  feedback.success
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                    : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                }`}
              >
                {feedback.success ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="text-sm font-bold">{feedback.message}</div>
                  <p className="text-xs opacity-80">
                    Telemetry and multi-dimensional mastery vectors updated in real-time.
                  </p>
                </div>
              </motion.div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
