import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, Lock, Sparkles, Terminal, 
  BookOpen, Layers, ShieldCheck, ChevronRight, ChevronLeft, Zap 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import coursesData from '../../data/courses.json';
import { 
  MarkdownBlock, 
  AnimatedTerminal, 
  CodeStepper, 
  NetworkFlow, 
  QuizGatekeeper 
} from './BlockRenderers';

export default function LearningWorkspace() {
  const { courseId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user, unlockNextModule, bypassModuleWithPayment, recordQuizSuccess } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [module, setModule] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [splitRatio, setSplitRatio] = useState(48); // Left width percentage
  const [isDragging, setIsDragging] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState('theory');
  const [activeInteractiveBlockIdx, setActiveInteractiveBlockIdx] = useState(0);

  const containerRef = useRef(null);

  useEffect(() => {
    const foundCourse = coursesData.find(c => c.id === courseId || c.slug === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
      const foundModule = foundCourse.modules.find(m => m.id === moduleId) || foundCourse.modules[0];
      if (foundModule) {
        setModule(foundModule);
        const foundLesson = foundModule.lessons.find(l => l.id === lessonId) || foundModule.lessons[0];
        if (foundLesson) {
          setLesson(foundLesson);
        }
      }
    }
  }, [courseId, moduleId, lessonId]);

  // Resizer dragging handlers
  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handlePointerMove = useCallback((e) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const percentage = (currentX / rect.width) * 100;
    const clamped = Math.min(Math.max(percentage, 25), 75);
    setSplitRatio(clamped);
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  if (!course || !module || !lesson) {
    return (
      <div className="min-h-screen bg-[#05070a] text-slate-300 flex items-center justify-center font-mono">
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <span>Synchronizing telemetry with learning cluster...</span>
        </div>
      </div>
    );
  }

  // Check if module is unlocked for current student
  const isModuleUnlocked = user.unlockedModules.includes(module.id);
  const currentModuleIndex = course.modules.findIndex(m => m.id === module.id);
  const nextModule = course.modules[currentModuleIndex + 1];

  const handleQuizPassed = () => {
    if (module.quiz) {
      recordQuizSuccess(module.quiz.id, nextModule ? nextModule.id : module.id);
    }
  };

  const handleBypassPaid = () => {
    bypassModuleWithPayment(nextModule ? nextModule.id : module.id);
  };

  const theoryBlocks = lesson.blocks.filter(b => b.type === 'markdown');
  const interactiveBlocks = lesson.blocks.filter(b => b.type !== 'markdown');

  return (
    <div className="flex flex-col h-screen w-full bg-[#05070a] text-slate-200 select-none overflow-hidden font-sans">
      
      {/* Top HUD / Command Bar */}
      <header className="h-14 border-b border-slate-800 bg-[#090c13]/90 backdrop-blur-md px-4 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/course/${course.id}/overview`)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition flex items-center gap-1.5 text-xs font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Catalog</span>
          </button>
          
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span className="text-slate-500 hidden md:inline">{course.title}</span>
            <span className="hidden md:inline text-slate-600">/</span>
            <span className="text-cyan-400 font-semibold">{module.title}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300">{lesson.metadata?.lessonTitle || lesson.title}</span>
          </div>
        </div>

        {/* Mobile View Toggle */}
        <div className="flex md:hidden bg-slate-900 border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => setActiveMobileTab('theory')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition ${
              activeMobileTab === 'theory'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400'
            }`}
          >
            Theory
          </button>
          <button
            onClick={() => setActiveMobileTab('interactive')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition ${
              activeMobileTab === 'interactive'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400'
            }`}
          >
            Interactive ({interactiveBlocks.length})
          </button>
        </div>

        {/* Status / Role Indicator */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-slate-300 font-medium">{user.role}</span>
          </div>

          {nextModule && (
            <button
              onClick={() => {
                if (user.unlockedModules.includes(nextModule.id)) {
                  navigate(`/learn/${course.id}/${nextModule.id}/${nextModule.lessons[0].id}`);
                } else {
                  alert('Phase locked! Pass the Gatekeeper Assessment or Pay Bypass to unlock.');
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                user.unlockedModules.includes(nextModule.id)
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-slate-900 border border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              <span>Next Phase</span>
              {user.unlockedModules.includes(nextModule.id) ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-amber-500" />
              )}
            </button>
          )}
        </div>
      </header>

      {/* Main Split Layout */}
      <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
        
        {/* Left Pane: Theory & Pedagogy */}
        <div
          style={{ width: `${splitRatio}%` }}
          className={`h-full overflow-y-auto p-6 md:p-10 bg-[#07090e] border-r border-slate-800/80 custom-scrollbar select-text transition-[width] duration-75 ease-out ${
            activeMobileTab === 'interactive' ? 'hidden md:block' : 'w-full'
          }`}
        >
          <div className="max-w-3xl mx-auto space-y-8 pb-16">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <BookOpen className="w-3.5 h-3.5" />
              <span>THEORETICAL DOCTRINE</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {lesson.metadata?.lessonTitle || lesson.title}
            </h1>

            {theoryBlocks.map(block => (
              <div key={block.id} className="pt-2">
                <MarkdownBlock content={block.data.content} />
              </div>
            ))}

            {/* Render Gatekeeper Quiz if Module has one */}
            {module.quiz && (
              <div className="pt-8 mt-12 border-t border-slate-800">
                <QuizGatekeeper 
                  quiz={module.quiz}
                  moduleTitle={module.title}
                  onQuizPass={handleQuizPassed}
                  onBypassPay={handleBypassPaid}
                />
              </div>
            )}
          </div>
        </div>

        {/* Resizable Divider Handle (Hidden on Mobile) */}
        <div
          onPointerDown={handlePointerDown}
          className="hidden md:flex w-1.5 hover:w-2 bg-slate-900 hover:bg-emerald-500/50 cursor-col-resize items-center justify-center transition-all z-10 group"
          title="Drag to resize workspace panes"
        >
          <div className="h-8 w-0.5 rounded-full bg-slate-600 group-hover:bg-emerald-300" />
        </div>

        {/* Right Pane: Interactive Environment */}
        <div
          style={{ width: `${100 - splitRatio}%` }}
          className={`h-full bg-[#030508] flex flex-col overflow-hidden ${
            activeMobileTab === 'theory' ? 'hidden md:flex' : 'w-full'
          }`}
        >
          {/* Interactive Environment Tabs */}
          <div className="h-11 border-b border-slate-800/80 bg-slate-950/80 px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2 overflow-x-auto custom-scrollbar">
              {interactiveBlocks.map((block, idx) => (
                <button
                  key={block.id}
                  onClick={() => setActiveInteractiveBlockIdx(idx)}
                  className={`px-3 py-1 rounded text-xs font-mono flex items-center space-x-1.5 transition ${
                    activeInteractiveBlockIdx === idx
                      ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>
                    {block.type === 'terminal_animation' && 'CLI Simulation'}
                    {block.type === 'code_stepper' && 'Code Stepper'}
                    {block.type === 'network_diagram' && 'Telemetry Node Flow'}
                  </span>
                </button>
              ))}
            </div>

            <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest hidden sm:flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Telemetry
            </div>
          </div>

          {/* Interactive Pane Body */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto flex items-center justify-center custom-scrollbar">
            <div className="w-full max-w-3xl">
              {interactiveBlocks[activeInteractiveBlockIdx] && (
                <>
                  {interactiveBlocks[activeInteractiveBlockIdx].type === 'terminal_animation' && (
                    <AnimatedTerminal
                      command={interactiveBlocks[activeInteractiveBlockIdx].data.command}
                      expectedOutput={interactiveBlocks[activeInteractiveBlockIdx].data.expectedOutput}
                      typingSpeedMs={interactiveBlocks[activeInteractiveBlockIdx].data.typingSpeedMs || 35}
                    />
                  )}
                  {interactiveBlocks[activeInteractiveBlockIdx].type === 'code_stepper' && (
                    <CodeStepper
                      script={interactiveBlocks[activeInteractiveBlockIdx].data.script}
                      language={interactiveBlocks[activeInteractiveBlockIdx].data.language}
                      steps={interactiveBlocks[activeInteractiveBlockIdx].data.steps}
                    />
                  )}
                  {interactiveBlocks[activeInteractiveBlockIdx].type === 'network_diagram' && (
                    <NetworkFlow
                      nodes={interactiveBlocks[activeInteractiveBlockIdx].data.nodes}
                      animationFlow={interactiveBlocks[activeInteractiveBlockIdx].data.animationFlow}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
