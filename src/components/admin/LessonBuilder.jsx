"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, ArrowUp, ArrowDown, Save, Eye, Terminal, 
  Code, Network, FileText, Sparkles, ShieldAlert, CheckCircle2, 
  RotateCcw, Play, Layers, X, Edit3, Send 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  MarkdownBlock, 
  AnimatedTerminal, 
  CodeStepper, 
  NetworkFlow, 
  QuizGatekeeper 
} from '../student/BlockRenderers';

const blockIcons = {
  markdown: <FileText className="w-4 h-4 text-blue-400" />,
  terminal_animation: <Terminal className="w-4 h-4 text-emerald-400" />,
  code_stepper: <Code className="w-4 h-4 text-cyan-400" />,
  network_diagram: <Network className="w-4 h-4 text-amber-400" />,
};

export default function LessonBuilder() {
  const router = useRouter();
  const { user, isStaff } = useAuth();

  const [metadata, setMetadata] = useState({
    courseName: 'Offensive Cybersecurity & Kernel Tradecraft',
    moduleName: 'Phase 3: Kernel Exploitation',
    lessonTitle: 'Arbitrary Read/Write via DKOM',
    difficulty: 'Advanced'
  });

  const [blocks, setBlocks] = useState([
    {
      id: 'b-1',
      type: 'markdown',
      data: {
        content: '### Direct Kernel Object Manipulation (DKOM)\nBy manipulating internal Windows executive structures (such as `_EPROCESS.ActiveProcessLinks`), an elevated payload can unlink its process token from the active list to achieve invisibility from standard task managers and system enumerators.'
      }
    },
    {
      id: 'b-2',
      type: 'code_stepper',
      data: {
        script: '#include <windows.h>\n#include <winternl.h>\n\n// Traverse ActiveProcessLinks doubly-linked list\nPLIST_ENTRY CurrentEntry = &TargetEprocess->ActiveProcessLinks;\nPLIST_ENTRY PrevEntry = CurrentEntry->Blink;\nPLIST_ENTRY NextEntry = CurrentEntry->Flink;\n\n// Unlink process from circular ring\nPrevEntry->Flink = NextEntry;\nNextEntry->Blink = PrevEntry;',
        language: 'c',
        steps: [
          { lines: [1, 2], tooltip: 'Include low-level Windows Native API headers.' },
          { lines: [5, 6, 7], tooltip: 'Retrieve forward and backward pointers from target _EPROCESS token.' },
          { lines: [10, 11], tooltip: 'Rewire adjacent pointers to remove process node while preserving list continuity.' }
        ]
      }
    },
    {
      id: 'b-3',
      type: 'terminal_animation',
      data: {
        command: 'windbg.exe -k net:port=50000,key=1.2.3.4 -c "!process 0 0 malware.exe"',
        expectedOutput: "PROCESS ffffd08123456080\n    SessionId: 1  Cid: 0e44    Peb: 00412000  ParentCid: 0420\n    DirBase: 1a23b000  ObjectTable: ffffc101234\n    Image: malware.exe\n[+] Successfully unlinked ActiveProcessLinks node (DKOM applied)",
        typingSpeedMs: 30
      }
    }
  ]);

  const [showPreview, setShowPreview] = useState(false);
  const [showLLMModal, setShowLLMModal] = useState(false);
  const [llmPrompt, setLlmPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // RBAC Guard
  if (!isStaff) {
    return (
      <div className="min-h-screen bg-[#05070a] text-slate-200 flex flex-col items-center justify-center p-6 font-mono">
        <div className="max-w-md w-full bg-[#090d16] border border-rose-500/40 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">403: Role Access Restricted</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            The AI Lesson Studio & Staging Canvas requires <span className="text-emerald-400 font-bold">ADMIN</span> or <span className="text-cyan-400 font-bold">INSTRUCTOR</span> privileges. Your current role is <span className="text-rose-400 font-bold">{user.role}</span>.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition border border-slate-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const addBlock = (type) => {
    let initialData = {};
    if (type === 'markdown') initialData = { content: '### New Section\nDetail your technical theory here...' };
    if (type === 'terminal_animation') initialData = { command: 'cargo build --release', expectedOutput: '   Compiling penta-kernel v0.1.0\n    Finished release [optimized] target(s) in 2.14s', typingSpeedMs: 35 };
    if (type === 'code_stepper') initialData = { script: '// Sample code\nfunction compute() {\n  return 42;\n}', language: 'javascript', steps: [{ lines: [2], tooltip: 'Return computation output' }] };
    if (type === 'network_diagram') initialData = { nodes: ['Client', 'Reverse Proxy', 'Microservice'], animationFlow: [{ step: 1, source: 'Client', target: 'Reverse Proxy', description: 'HTTP/2 multiplexed stream' }] };

    setBlocks([...blocks, { id: `b-${Date.now()}`, type, data: initialData }]);
  };

  const updateBlock = (id, newData) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, data: newData } : b));
  };

  const removeBlock = (id) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (index, direction) => {
    if (direction === 'up' && index > 0) {
      const newBlocks = [...blocks];
      [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
      setBlocks(newBlocks);
    } else if (direction === 'down' && index < blocks.length - 1) {
      const newBlocks = [...blocks];
      [newBlocks[index + 1], newBlocks[index]] = [newBlocks[index], newBlocks[index + 1]];
      setBlocks(newBlocks);
    }
  };

  // Structured AI Lesson Generation (Human-in-the-Loop)
  const handleGenerateWithAI = async () => {
    if (!llmPrompt.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/admin/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: llmPrompt })
      });

      if (!res.ok) {
        throw new Error('Failed to generate lesson from server');
      }

      const data = await res.json();
      
      const formattedBlocks = data.blocks.map(b => ({
        id: b.id || `ai-${Math.random()}-${Date.now()}`,
        type: b.type.toLowerCase(),
        data: b.content
      }));

      setBlocks([...blocks, ...formattedBlocks]);
      setMetadata(prev => ({
        ...prev,
        lessonTitle: llmPrompt.slice(0, 48)
      }));
      setLlmPrompt('');
      setShowLLMModal(false);
    } catch (error) {
      console.error(error);
      alert('Error generating lesson. Please check server logs.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToDB = async () => {
    const payload = {
      metadata: {
        lessonTitle: metadata.lessonTitle || 'Untitled Lesson',
        courseId: 'cuid_course_placeholder', // Hardcoded mock for now
        moduleId: 'cuid_module_placeholder',
      },
      blocks,
      savedBy: user.email,
    };
    
    try {
      const res = await fetch('/api/admin/save-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Database save failed');
      
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Note: Database save failed because Prisma is not connected to a MySQL instance yet.');
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 p-6 md:p-10 font-sans pb-24">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header HUD */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#090d16] p-5 rounded-2xl border border-slate-800 gap-4 shadow-2xl">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Block-Based CMS & Staging Canvas</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-1">
              Curriculum Authoring Studio
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLLMModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600/30 to-cyan-600/30 hover:from-purple-600/40 hover:to-cyan-600/40 border border-cyan-500/40 text-cyan-300 font-semibold text-xs transition flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Prompt AI Generator</span>
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Staging Preview</span>
            </button>
            <button
              onClick={handleSaveToDB}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Accept & Publish</span>
            </button>
          </div>
        </div>

        {/* Metadata Controls */}
        <div className="bg-[#090d16] p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-cyan-400" />
            <span>Curriculum Metadata</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <input
              type="text"
              placeholder="Course Title"
              value={metadata.courseName}
              onChange={(e) => setMetadata({ ...metadata, courseName: e.target.value })}
              className="p-3 bg-[#05070a] border border-slate-800 rounded-xl text-slate-200 focus:border-cyan-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Module Name"
              value={metadata.moduleName}
              onChange={(e) => setMetadata({ ...metadata, moduleName: e.target.value })}
              className="p-3 bg-[#05070a] border border-slate-800 rounded-xl text-slate-200 focus:border-cyan-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Lesson Title"
              value={metadata.lessonTitle}
              onChange={(e) => setMetadata({ ...metadata, lessonTitle: e.target.value })}
              className="p-3 bg-[#05070a] border border-slate-800 rounded-xl text-slate-200 focus:border-cyan-500 focus:outline-none"
            />
            <select
              value={metadata.difficulty}
              onChange={(e) => setMetadata({ ...metadata, difficulty: e.target.value })}
              className="p-3 bg-[#05070a] border border-slate-800 rounded-xl text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
        </div>

        {/* Stackable Blocks Canvas */}
        <div className="space-y-4">
          {blocks.map((block, idx) => (
            <div
              key={block.id}
              className="bg-[#090d16] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition group relative space-y-4 shadow-xl"
            >
              {/* Block Header & Reordering */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-2 font-mono text-xs text-slate-300">
                  {blockIcons[block.type] || <Layers className="w-4 h-4" />}
                  <span className="font-bold uppercase tracking-wider text-cyan-400">
                    {block.type.replace('_', ' ')}
                  </span>
                  <span className="text-slate-600">#{idx + 1}</span>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveBlock(idx, 'up')}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-400 hover:text-white transition"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === blocks.length - 1}
                    onClick={() => moveBlock(idx, 'down')}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-400 hover:text-white transition"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeBlock(block.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition ml-2"
                    title="Delete Block"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Block Editors */}
              {block.type === 'markdown' && (
                <textarea
                  rows={4}
                  value={block.data.content || ''}
                  onChange={(e) => updateBlock(block.id, { ...block.data, content: e.target.value })}
                  placeholder="### Heading\nTheory description..."
                  className="w-full p-3 bg-[#05070a] border border-slate-800 rounded-xl text-slate-200 font-mono text-xs focus:border-cyan-500 focus:outline-none"
                />
              )}

              {block.type === 'terminal_animation' && (
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <label className="text-slate-400 text-[11px] block mb-1">Execution Command</label>
                    <input
                      type="text"
                      value={block.data.command || ''}
                      onChange={(e) => updateBlock(block.id, { ...block.data, command: e.target.value })}
                      className="w-full p-2.5 bg-[#05070a] border border-slate-800 rounded-xl text-emerald-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-[11px] block mb-1">Standard Output (Stdout)</label>
                    <textarea
                      rows={3}
                      value={block.data.expectedOutput || ''}
                      onChange={(e) => updateBlock(block.id, { ...block.data, expectedOutput: e.target.value })}
                      className="w-full p-2.5 bg-[#05070a] border border-slate-800 rounded-xl text-slate-300 font-mono"
                    />
                  </div>
                </div>
              )}

              {block.type === 'code_stepper' && (
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <label className="text-slate-400 text-[11px] block mb-1">Code Script</label>
                    <textarea
                      rows={4}
                      value={block.data.script || ''}
                      onChange={(e) => updateBlock(block.id, { ...block.data, script: e.target.value })}
                      className="w-full p-2.5 bg-[#05070a] border border-slate-800 rounded-xl text-cyan-200 font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add Block Toolbar */}
          <div className="flex flex-wrap gap-2 justify-center p-6 border-2 border-dashed border-slate-800 rounded-2xl bg-[#090d16]/40 hover:border-slate-700 transition">
            <button
              onClick={() => addBlock('markdown')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" /> + Markdown Block
            </button>
            <button
              onClick={() => addBlock('terminal_animation')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" /> + Terminal CLI
            </button>
            <button
              onClick={() => addBlock('code_stepper')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <Code className="w-3.5 h-3.5 text-cyan-400" /> + Code Stepper
            </button>
            <button
              onClick={() => addBlock('network_diagram')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <Network className="w-3.5 h-3.5 text-amber-400" /> + Network Diagram
            </button>
          </div>
        </div>

      </div>

      {/* LLM Generation Modal */}
      <AnimatePresence>
        {showLLMModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0e14] border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-5 shadow-2xl font-sans"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">AI Structured Lesson Synthesizer</h3>
                </div>
                <button
                  onClick={() => setShowLLMModal(false)}
                  className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Prompt Gemini to generate a lesson adhering strictly to the <span className="text-cyan-400 font-mono">draft-07 block schema</span> with interleaved theoretical markdown, terminal simulation, and code stepper.
              </p>

              <textarea
                rows={4}
                value={llmPrompt}
                onChange={(e) => setLlmPrompt(e.target.value)}
                placeholder="e.g. Reverse engineering Windows kernel pool overflows and calculating pool header offsets in x64 assembly..."
                className="w-full p-3 bg-[#06080e] border border-slate-800 rounded-xl text-slate-200 text-xs font-mono focus:border-cyan-500 focus:outline-none"
              />

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowLLMModal(false)}
                  className="px-4 py-2 bg-slate-900 text-slate-400 hover:text-white rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateWithAI}
                  disabled={isGenerating || !llmPrompt.trim()}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-40"
                >
                  {isGenerating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Synthesizing Schema...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Generate & Stage Blocks</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Staging Live Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-[#07090e] border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-[#0b0e14]">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-xs font-bold text-slate-200">
                    STAGING CANVAS: {metadata.lessonTitle}
                  </span>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-mono border border-slate-800"
                >
                  Close Preview
                </button>
              </div>

              <div className="p-8 overflow-y-auto space-y-8 flex-1 custom-scrollbar">
                {blocks.map((b) => (
                  <div key={b.id} className="p-6 bg-[#090d16] rounded-2xl border border-slate-800 space-y-3">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                      Rendered {b.type.replace('_', ' ')}
                    </span>
                    {b.type === 'markdown' && <MarkdownBlock content={b.data.content} />}
                    {b.type === 'terminal_animation' && (
                      <AnimatedTerminal
                        command={b.data.command}
                        expectedOutput={b.data.expectedOutput}
                        typingSpeedMs={b.data.typingSpeedMs}
                      />
                    )}
                    {b.type === 'code_stepper' && (
                      <CodeStepper
                        script={b.data.script}
                        language={b.data.language}
                        steps={b.data.steps}
                      />
                    )}
                    {b.type === 'network_diagram' && (
                      <NetworkFlow
                        nodes={b.data.nodes}
                        animationFlow={b.data.animationFlow}
                      />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Save Notification Toast */}
      <AnimatePresence>
        {saveToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 bg-emerald-500 text-slate-950 px-5 py-3 rounded-xl font-mono text-xs font-bold flex items-center space-x-2 shadow-2xl z-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Lesson schema validated & published to MySQL database!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
