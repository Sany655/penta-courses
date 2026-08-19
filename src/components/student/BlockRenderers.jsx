import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Play, RotateCcw, Copy, Check, ChevronRight, 
  ChevronLeft, Sparkles, CheckCircle2, XCircle, ShieldCheck, 
  Lock, CreditCard, ArrowRight, Zap 
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Markdown Theory Block ---
export const MarkdownBlock = ({ content }) => {
  return (
    <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-base space-y-4">
      {content.split('\n\n').map((paragraph, idx) => {
        if (paragraph.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-xl font-bold text-emerald-400 mt-4 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-400 rounded-full inline-block" />
              {paragraph.replace('### ', '')}
            </h3>
          );
        }
        if (paragraph.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-2xl font-bold text-white mt-6 mb-3">
              {paragraph.replace('## ', '')}
            </h2>
          );
        }
        return <p key={idx} className="text-slate-300 leading-relaxed">{paragraph}</p>;
      })}
    </div>
  );
};

// --- Animated Terminal Block ---
export const AnimatedTerminal = ({ command, expectedOutput, typingSpeedMs = 35, promptUser = "operator", hostname = "penta-kali" }) => {
  const [displayedCommand, setDisplayedCommand] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [copied, setCopied] = useState(false);

  const startAnimation = () => {
    setDisplayedCommand('');
    setIsExecuting(false);
    setShowOutput(false);
    setIsFinished(false);

    let i = 0;
    const interval = setInterval(() => {
      if (i < command.length) {
        setDisplayedCommand(command.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsExecuting(true);
        setTimeout(() => {
          setIsExecuting(false);
          setShowOutput(true);
          setIsFinished(true);
        }, 500);
      }
    }, typingSpeedMs);
  };

  useEffect(() => {
    startAnimation();
  }, [command]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${command}\n${expectedOutput}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-xl overflow-hidden border border-slate-800 bg-[#06080e] shadow-2xl font-mono text-xs md:text-sm">
      {/* Title Bar */}
      <div className="bg-[#0b0e14] px-4 py-2.5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block border border-rose-600/40" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block border border-amber-600/40" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block border border-emerald-600/40" />
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1.5 ml-2 font-mono">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            bash - {hostname}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={copyToClipboard}
            className="p-1 px-2 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition flex items-center gap-1 text-xs"
            title="Copy command"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={startAnimation}
            className="p-1 px-2 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 border border-slate-800 transition flex items-center gap-1 text-xs"
            title="Replay Execution"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>
        </div>
      </div>

      {/* Terminal Viewport */}
      <div className="p-4 md:p-5 min-h-[200px] max-h-[360px] overflow-y-auto space-y-3 bg-[#06080e] custom-scrollbar">
        <div className="flex flex-wrap items-center">
          <span className="text-emerald-400 font-semibold">{promptUser}@{hostname}</span>
          <span className="text-slate-500 mx-1">:</span>
          <span className="text-cyan-400">~</span>
          <span className="text-slate-500 mr-2">$</span>
          <span className="text-slate-100 font-medium tracking-wide">
            {displayedCommand}
          </span>
          {!showOutput && !isExecuting && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-4 bg-cyan-400 ml-1 translate-y-[2px]"
            />
          )}
        </div>

        {isExecuting && (
          <div className="flex items-center space-x-2 text-cyan-400/80 text-xs py-1">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full"
            />
            <span>Executing containerized process...</span>
          </div>
        )}

        {showOutput && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-2 text-emerald-300 font-mono text-xs whitespace-pre-wrap leading-relaxed border-t border-slate-800/40"
          >
            {expectedOutput}
          </motion.div>
        )}

        {isFinished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center text-slate-500 pt-2 text-xs"
          >
            <span className="text-emerald-400 font-semibold">{promptUser}@{hostname}</span>
            <span className="text-slate-500 mx-1">:</span>
            <span className="text-cyan-400">~</span>
            <span className="text-slate-500 mr-2">$</span>
            <span className="inline-block w-2 h-3.5 bg-slate-600 translate-y-[1px] animate-pulse ml-1" />
          </motion.div>
        )}
      </div>
    </div>
  );
};

// --- Code Stepper Block ---
export const CodeStepper = ({ script, language = 'python', steps = [] }) => {
  const [activeStep, setActiveStep] = useState(0);
  const lines = script.split('\n');
  const currentStep = steps[activeStep] || { lines: [], tooltip: 'Overview of the script structure.' };

  return (
    <div className="flex flex-col space-y-4 w-full">
      {/* Code Container */}
      <div className="bg-[#0b0e14] rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between bg-slate-900/80 px-4 py-2 text-xs text-slate-400 font-mono border-b border-slate-800">
          <span className="flex items-center gap-2 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            {language.toUpperCase()} MODULE EXPLAINER
          </span>
          <span>Step {activeStep + 1} of {steps.length || 1}</span>
        </div>
        
        <div className="p-4 font-mono text-xs md:text-sm overflow-x-auto custom-scrollbar">
          {lines.map((line, idx) => {
            const lineNum = idx + 1;
            const isHighlighted = currentStep.lines.includes(lineNum);
            return (
              <motion.div
                key={idx}
                animate={{
                  backgroundColor: isHighlighted ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                }}
                className={`flex px-2 py-0.5 rounded transition-colors ${
                  isHighlighted ? 'border-l-2 border-cyan-400 text-cyan-100' : 'border-l-2 border-transparent text-slate-400'
                }`}
              >
                <span className="w-8 text-slate-600 select-none text-right pr-3">{lineNum}</span>
                <span className="flex-1 whitespace-pre">{line || ' '}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Step Tooltip HUD */}
      {steps.length > 0 && (
        <div className="bg-slate-900/90 border border-cyan-500/30 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-slate-200 text-xs md:text-sm leading-relaxed">
              <strong className="text-cyan-400 mr-2">Target Mechanics:</strong>
              {currentStep.tooltip}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
            <button
              disabled={activeStep === 0}
              onClick={() => setActiveStep((s) => s - 1)}
              className="p-1.5 px-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs rounded-lg transition text-slate-200 flex items-center gap-1 border border-slate-700"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button
              disabled={activeStep === steps.length - 1}
              onClick={() => setActiveStep((s) => s + 1)}
              className="p-1.5 px-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 text-xs rounded-lg transition text-slate-950 font-bold flex items-center gap-1 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Network Flow / Architecture Diagram Block ---
export const NetworkFlow = ({ nodes = [], animationFlow = [] }) => {
  const [activeStep, setActiveStep] = useState(0);
  const currentFlow = animationFlow[activeStep] || null;

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="bg-[#0b0e14] p-6 md:p-8 rounded-xl border border-slate-800 shadow-2xl flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden">
        {/* Ambient Grid */}
        <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

        {/* Nodes Layout */}
        <div className="flex gap-6 md:gap-10 items-center flex-wrap justify-center w-full z-10">
          {nodes.map((node) => {
            const isSource = currentFlow?.source === node;
            const isTarget = currentFlow?.target === node;
            return (
              <motion.div
                key={node}
                animate={{
                  scale: isSource || isTarget ? 1.08 : 1,
                  boxShadow: isSource
                    ? '0 0 25px rgba(245, 158, 11, 0.4)'
                    : isTarget
                    ? '0 0 25px rgba(16, 185, 129, 0.4)'
                    : '0 4px 6px rgba(0,0,0,0.3)',
                }}
                className={`px-5 py-3 rounded-xl font-mono text-xs md:text-sm font-bold text-center border transition-all ${
                  isSource
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : isTarget
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900/90 border-slate-800 text-slate-300'
                }`}
              >
                {node}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Description HUD */}
      {animationFlow.length > 0 && (
        <div className="bg-slate-900/90 border border-amber-500/30 p-4 rounded-xl flex items-center justify-between">
          <p className="text-slate-200 text-xs md:text-sm">
            <span className="font-mono text-amber-400 font-bold mr-2">
              Phase {activeStep + 1}/{animationFlow.length}:
            </span>
            {currentFlow?.description}
          </p>
          <div className="flex gap-2 shrink-0">
            <button
              disabled={activeStep === 0}
              onClick={() => setActiveStep((s) => s - 1)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs rounded text-white border border-slate-700"
            >
              Prev
            </button>
            <button
              disabled={activeStep === animationFlow.length - 1}
              onClick={() => setActiveStep((s) => s + 1)}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-xs rounded text-slate-950 font-bold"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- The Gatekeeper Quiz Block & Microtransaction Bypass ---
export const QuizGatekeeper = ({ quiz, onQuizPass, onBypassPay, moduleTitle = "Module" }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  const handleSelectOption = (questionId, optionIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    quiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });
    const percentage = Math.round((correctCount / quiz.questions.length) * 100);
    setScore(percentage);
    setIsSubmitted(true);

    if (percentage >= quiz.passingScore) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      if (onQuizPass) onQuizPass();
    }
  };

  const handleSimulatedPayment = () => {
    setIsProcessingPay(true);
    setTimeout(() => {
      setIsProcessingPay(false);
      setShowStripeModal(false);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      if (onBypassPay) onBypassPay();
    }, 1200);
  };

  const passed = isSubmitted && score >= quiz.passingScore;

  return (
    <div className="w-full bg-[#090d16] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            <span>Gatekeeper Assessment</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
            Validate Mastery to Unlock Next Phase
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Passing threshold: <span className="text-emerald-400 font-bold">{quiz.passingScore}%</span>
          </p>
        </div>

        {/* Microtransaction Skip Hook */}
        <button
          onClick={() => setShowStripeModal(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition group shadow-[0_0_15px_rgba(245,158,11,0.15)]"
        >
          <Zap className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          <span>Pay $2.99 to Instant Bypass</span>
        </button>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="p-4 md:p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <h4 className="text-sm md:text-base font-semibold text-slate-200 flex items-start gap-2">
              <span className="text-cyan-400 font-mono">0{idx + 1}.</span>
              {q.question}
            </h4>

            <div className="grid grid-cols-1 gap-2 pt-1">
              {q.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[q.id] === optIdx;
                const isCorrect = q.correctIndex === optIdx;
                let optionStyle = "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-600";

                if (isSubmitted) {
                  if (isCorrect) {
                    optionStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-200 font-medium";
                  } else if (isSelected && !isCorrect) {
                    optionStyle = "bg-rose-500/20 border-rose-500 text-rose-200";
                  }
                } else if (isSelected) {
                  optionStyle = "bg-cyan-500/20 border-cyan-500 text-cyan-200 font-medium";
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(q.id, optIdx)}
                    className={`p-3 rounded-lg border text-left text-xs md:text-sm transition flex items-center justify-between ${optionStyle}`}
                  >
                    <span>{option}</span>
                    {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {isSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                  </button>
                );
              })}
            </div>

            {isSubmitted && (
              <p className="text-xs text-slate-400 pt-2 border-t border-slate-800/50">
                <strong className="text-slate-300">Explanation:</strong> {q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Submission Action & Results */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-800 gap-4">
        {!isSubmitted ? (
          <button
            onClick={calculateScore}
            disabled={Object.keys(selectedAnswers).length < quiz.questions.length}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-sm transition shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Submit Verification Answers
          </button>
        ) : (
          <div className="flex items-center space-x-3">
            <span className={`text-lg font-bold ${passed ? 'text-emerald-400' : 'text-rose-400'}`}>
              Score: {score}% {passed ? '— Verification Passed!' : '— Below Passing Grade'}
            </span>
            {!passed && (
              <button
                onClick={() => { setIsSubmitted(false); setSelectedAnswers({}); }}
                className="px-3 py-1.5 rounded bg-slate-800 text-xs text-slate-300 hover:text-white border border-slate-700"
              >
                Retry Assessment
              </button>
            )}
          </div>
        )}
      </div>

      {/* Stripe Microtransaction Modal */}
      <AnimatePresence>
        {showStripeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0e14] border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">Stripe Micro-Checkout</h3>
                </div>
                <button
                  onClick={() => setShowStripeModal(false)}
                  className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-900 rounded"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-slate-100">Gatekeeper Instant Bypass</div>
                    <div className="text-slate-400 text-[11px]">{moduleTitle}</div>
                  </div>
                  <div className="text-base font-bold text-emerald-400">$2.99 USD</div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-mono text-slate-400">Cardholder Token (Mock)</label>
                  <input
                    type="text"
                    readOnly
                    value="•••• •••• •••• 4242 (Stripe Test Key)"
                    className="w-full p-2.5 bg-[#07090e] border border-slate-800 rounded text-slate-300 font-mono"
                  />
                </div>
              </div>

              <button
                onClick={handleSimulatedPayment}
                disabled={isProcessingPay}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm transition shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2"
              >
                {isProcessingPay ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full"
                    />
                    <span>Verifying with Stripe Webhook...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Authorize $2.99 & Instant Unlock</span>
                  </>
                )}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
