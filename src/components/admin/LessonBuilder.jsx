"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, ArrowUp, ArrowDown, Save, Eye, Terminal,
  Code, Network, FileText, Sparkles, ShieldAlert, CheckCircle2, 
  Layers, X, Edit3, Send, BookOpen, Plus, ExternalLink,
  HelpCircle, RefreshCw, Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  MarkdownBlock, 
  AnimatedTerminal, 
  CodeStepper, 
  NetworkFlow
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

  // Dynamic Course & Module Associations
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Active Curriculum Metadata (Clean slate, zero hardcoded domain bias)
  const [metadata, setMetadata] = useState({
    courseId: '',
    moduleId: '',
    courseName: '',
    moduleName: '',
    lessonTitle: '',
    difficulty: 'Beginner'
  });

  // Staged Blocks (Empty by default for clean authoring)
  const [blocks, setBlocks] = useState([]);

  // Modals & Drawers
  const [showPreview, setShowPreview] = useState(false);
  const [showLLMModal, setShowLLMModal] = useState(false);
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);

  // Single Lesson LLM Prompting
  const [llmPrompt, setLlmPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Syllabus Ingestion State
  const [syllabusText, setSyllabusText] = useState('');
  const [isSynthesizingSyllabus, setIsSynthesizingSyllabus] = useState(false);
  const [synthesizedCourse, setSynthesizedCourse] = useState(null);
  const [isPublishingCourse, setIsPublishingCourse] = useState(false);
  const [publishCourseSuccess, setPublishCourseSuccess] = useState(null);

  // Toast
  const [saveToast, setSaveToast] = useState(false);

  // Fetch available courses for dynamic dropdown linking
  const loadCourses = () => {
    fetch('/api/v1/courses')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          setCourses(data);
          if (data.length > 0 && !selectedCourse) {
            const first = data[0];
            setSelectedCourse(first);
            setMetadata(prev => ({
              ...prev,
              courseId: first.id,
              courseName: first.title,
              moduleId: (first.modules && first.modules[0]?.id) || '',
              moduleName: (first.modules && first.modules[0]?.title) || ''
            }));
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCourseSelect = (courseId) => {
    const c = courses.find(item => item.id === courseId);
    setSelectedCourse(c || null);
    setMetadata(prev => ({
      ...prev,
      courseId: courseId,
      courseName: c ? c.title : '',
      moduleId: (c?.modules && c.modules[0]?.id) || '',
      moduleName: (c?.modules && c.modules[0]?.title) || ''
    }));
  };

  const handleModuleSelect = (moduleId) => {
    const m = selectedCourse?.modules?.find(item => item.id === moduleId);
    setMetadata(prev => ({
      ...prev,
      moduleId: moduleId,
      moduleName: m ? m.title : ''
    }));
  };

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
            The AI Lesson Studio requires <span className="text-emerald-400 font-bold">ADMIN</span> privileges.
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
    if (type === 'markdown') initialData = { content: '### Theory & Principles\nExplain fundamental mechanisms, applications, and core laws here...' };
    if (type === 'terminal_animation') initialData = { command: 'python -m pip --version', expectedOutput: 'pip 24.0 from /usr/local/lib/python3.11/site-packages\n[+] Environment verified.', typingSpeedMs: 30 };
    if (type === 'code_stepper') initialData = { script: '# Example Code\ndef execute_task():\n    return "Status: Operational"', language: 'python', steps: [{ lines: [2], tooltip: 'Define task execution unit' }] };
    if (type === 'network_diagram') initialData = { nodes: ['Input Sensor / Client', 'Processing Node', 'Database Registry'], animationFlow: [{ step: 1, source: 'Input Sensor / Client', target: 'Processing Node', description: 'Data packet transfer' }] };

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

  // Structured AI Lesson Generation (Gemini 2.5 Flash)
  const handleGenerateWithAI = async (customPrompt = null) => {
    const promptToUse = customPrompt || llmPrompt;
    if (!promptToUse.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/v1/admin/lessons/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('penta_access_token')}`
        },
        body: JSON.stringify({ prompt: promptToUse })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to generate lesson from Gemini AI');
      }

      const data = await res.json();
      
      const formattedBlocks = (data.blocks || []).map((b, idx) => ({
        id: b.id || `ai-${Date.now()}-${idx}`,
        type: (b.type || 'markdown').toLowerCase(),
        data: b.content || b.data || {}
      }));

      setBlocks(formattedBlocks);
      setMetadata(prev => ({
        ...prev,
        lessonTitle: data.lessonTitle || promptToUse.slice(0, 50),
        difficulty: data.difficulty || prev.difficulty || 'Intermediate'
      }));

      setLlmPrompt('');
      setShowLLMModal(false);
    } catch (error) {
      console.error(error);
      alert(error.message || 'Error generating lesson. Verify Gemini API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Syllabus Ingestion (Gemini 2.5 Flash)
  const handleSynthesizeSyllabus = async () => {
    if (!syllabusText.trim()) return;
    setIsSynthesizingSyllabus(true);
    setPublishCourseSuccess(null);

    try {
      const res = await fetch('/api/v1/admin/syllabus/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('penta_access_token')}`
        },
        body: JSON.stringify({ syllabus_text: syllabusText })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to synthesize syllabus');
      }

      const data = await res.json();
      setSynthesizedCourse(data.syllabus);
    } catch (error) {
      console.error(error);
      alert(error.message || 'Error synthesizing syllabus.');
    } finally {
      setIsSynthesizingSyllabus(false);
    }
  };

  // Publish Synthesized Course to DB
  const handlePublishCourseToDB = async () => {
    if (!synthesizedCourse) return;
    setIsPublishingCourse(true);
    try {
      const res = await fetch('/api/v1/admin/syllabus/create-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('penta_access_token')}`
        },
        body: JSON.stringify({ syllabus_data: synthesizedCourse })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to publish course to database');
      }

      const data = await res.json();
      setPublishCourseSuccess(`Course '${data.course.title}' published with ${data.course.modules?.length} modules!`);
      loadCourses();
    } catch (error) {
      console.error(error);
      alert(error.message || 'Error publishing course.');
    } finally {
      setIsPublishingCourse(false);
    }
  };

  // Save Staged Lesson to DB
  const handleSaveToDB = async () => {
    if (!metadata.courseId || !metadata.moduleId) {
      alert('Please select a target Course and Module before saving.');
      return;
    }

    if (blocks.length === 0) {
      alert('Cannot save an empty lesson. Add or generate blocks first.');
      return;
    }

    try {
      const res = await fetch('/api/v1/admin/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('penta_access_token')}`
        },
        body: JSON.stringify({
          course_id: metadata.courseId,
          module_id: metadata.moduleId,
          title: metadata.lessonTitle || 'Untitled Interactive Lesson',
          blocks: blocks
        })
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Database save failed');
      }
      
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
    } catch (error) {
      console.error(error);
      alert(error.message || 'Unable to save lesson.');
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 p-4 md:p-8 font-sans pb-24">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header HUD */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#090d16] p-5 rounded-2xl border border-slate-800 gap-4 shadow-xl">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Gemini 2.5 Cognitive Curriculum Studio</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-0.5">
              Interactive Lesson & Course Authoring
            </h1>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={() => setShowSyllabusModal(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 font-semibold text-xs font-mono transition flex items-center gap-1.5 shadow-sm"
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Import Full Syllabus</span>
            </button>

            <button
              onClick={() => setShowLLMModal(true)}
              className="px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-semibold text-xs font-mono transition flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Prompt AI Lesson</span>
            </button>

            <button
              onClick={() => setShowPreview(true)}
              disabled={blocks.length === 0}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-xl text-xs font-mono border border-slate-700 transition flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Preview ({blocks.length})</span>
            </button>

            <button
              onClick={handleSaveToDB}
              disabled={blocks.length === 0}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 rounded-xl text-xs font-mono font-bold transition shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Publish</span>
            </button>
          </div>
        </div>

        {/* Dynamic Metadata & Association Controls */}
        <div className="bg-[#090d16] p-6 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target Course & Module Association</span>
            </div>
            <span className="text-[11px] text-slate-500 lowercase">linked to active database</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            {/* Course Selector */}
            <div className="space-y-1">
              <label className="text-slate-400 text-[11px]">Course Track</label>
              <select
                value={metadata.courseId}
                onChange={(e) => handleCourseSelect(e.target.value)}
                className="w-full p-2.5 bg-[#05070a] border border-slate-800 rounded-xl text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="">-- Select Active Course --</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Module Selector */}
            <div className="space-y-1">
              <label className="text-slate-400 text-[11px]">Course Module / Unit</label>
              <select
                value={metadata.moduleId}
                onChange={(e) => handleModuleSelect(e.target.value)}
                disabled={!selectedCourse || !(selectedCourse.modules || []).length}
                className="w-full p-2.5 bg-[#05070a] border border-slate-800 rounded-xl text-slate-200 focus:border-cyan-500 focus:outline-none disabled:opacity-40"
              >
                <option value="">-- Select Target Module --</option>
                {(selectedCourse?.modules || []).map(m => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-1">
              <label className="text-slate-400 text-[11px]">Difficulty Level</label>
              <select
                value={metadata.difficulty}
                onChange={(e) => setMetadata({ ...metadata, difficulty: e.target.value })}
                className="w-full p-2.5 bg-[#05070a] border border-slate-800 rounded-xl text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          {/* Lesson Title */}
          <div className="space-y-1 text-xs font-mono">
            <label className="text-slate-400 text-[11px]">Lesson Title</label>
            <input
              type="text"
              placeholder="e.g. Principles of Information Processing & ALU Architecture"
              value={metadata.lessonTitle}
              onChange={(e) => setMetadata({ ...metadata, lessonTitle: e.target.value })}
              className="w-full p-2.5 bg-[#05070a] border border-slate-800 rounded-xl text-slate-200 focus:border-cyan-500 focus:outline-none font-bold"
            />
          </div>
        </div>

        {/* Stackable Blocks Canvas */}
        <div className="space-y-4">
          {blocks.length === 0 ? (
            <div className="bg-[#090d16] border-2 border-dashed border-slate-800 rounded-2xl p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Staging Canvas is Empty</h3>
                <p className="text-xs text-slate-400 font-mono mt-1 max-w-md mx-auto">
                  Prompt Gemini 2.5 to generate an interactive lesson, import a full national university syllabus, or add blocks manually.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowLLMModal(true)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Prompt AI Generator</span>
                </button>
                <button
                  onClick={() => setShowSyllabusModal(true)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-xs font-mono transition border border-purple-500/30 flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Import Syllabus</span>
                </button>
              </div>
            </div>
          ) : (
            blocks.map((block, idx) => (
              <div
                key={block.id}
                className="bg-[#090d16] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition group relative space-y-4 shadow-md"
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
                    rows={5}
                    value={block.data.content || ''}
                    onChange={(e) => updateBlock(block.id, { ...block.data, content: e.target.value })}
                    placeholder="### Heading\nTechnical concept theory..."
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
                        rows={5}
                        value={block.data.script || ''}
                        onChange={(e) => updateBlock(block.id, { ...block.data, script: e.target.value })}
                        className="w-full p-2.5 bg-[#05070a] border border-slate-800 rounded-xl text-cyan-200 font-mono"
                      />
                    </div>
                  </div>
                )}

                {block.type === 'network_diagram' && (
                  <div className="space-y-2 font-mono text-xs">
                    <div className="text-[11px] text-slate-400">
                      Nodes: <span className="text-cyan-400">{(block.data.nodes || []).join(' → ')}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Animation Steps: {block.data.animationFlow?.length || 0} active transitions configured.
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {/* Add Block Toolbar */}
          <div className="flex flex-wrap gap-2 justify-center p-5 border-2 border-dashed border-slate-800 rounded-2xl bg-[#090d16]/40 hover:border-slate-700 transition">
            <button
              onClick={() => addBlock('markdown')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" /> + Markdown
            </button>
            <button
              onClick={() => addBlock('terminal_animation')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" /> + Terminal CLI
            </button>
            <button
              onClick={() => addBlock('code_stepper')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <Code className="w-3.5 h-3.5 text-cyan-400" /> + Code Stepper
            </button>
            <button
              onClick={() => addBlock('network_diagram')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <Network className="w-3.5 h-3.5 text-amber-400" /> + Network Flow
            </button>
          </div>
        </div>

      </div>

      {/* Single Lesson AI Generator Modal */}
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
                  <h3 className="text-base font-bold text-white">Gemini 2.5 Lesson Synthesizer</h3>
                </div>
                <button
                  onClick={() => setShowLLMModal(false)}
                  className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                Enter any specific lesson topic or unit concept. Gemini will synthesize alternating theory markdown, code steps, and terminal/network simulations.
              </p>

              <textarea
                rows={4}
                value={llmPrompt}
                onChange={(e) => setLlmPrompt(e.target.value)}
                placeholder="e.g. Unit-6: Denial of Service (DoS & DDoS) Attacks, SYN Floods and Network Defense Protocols"
                className="w-full p-3 bg-[#06080e] border border-slate-800 rounded-xl text-slate-200 text-xs font-mono focus:border-cyan-500 focus:outline-none"
              />

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowLLMModal(false)}
                  className="px-4 py-2 bg-slate-900 text-slate-400 hover:text-white rounded-xl text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleGenerateWithAI()}
                  disabled={isGenerating || !llmPrompt.trim()}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition flex items-center gap-2 shadow-sm disabled:opacity-40"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing Blocks...</span>
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

      {/* Full Course Syllabus Synthesizer Modal */}
      <AnimatePresence>
        {showSyllabusModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0e14] border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl font-sans"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#090d16]">
                <div className="flex items-center space-x-2.5">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  <div>
                    <h3 className="text-base font-bold text-white">Universal Syllabus & Curriculum Ingestion</h3>
                    <p className="text-xs text-slate-400 font-mono">Convert raw textbook/OCR scraps into structured course modules</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSyllabusModal(false)}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar font-mono text-xs">
                {!synthesizedCourse ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-300 font-bold">Paste Raw Syllabus / Curriculum Text</label>
                      <span className="text-[11px] text-slate-500">Supports OCR text from books, PDFs, and Copilot</span>
                    </div>

                    <textarea
                      rows={12}
                      value={syllabusText}
                      onChange={(e) => setSyllabusText(e.target.value)}
                      placeholder="Paste Course Contents, Units, Course Code, Objectives, etc..."
                      className="w-full p-4 bg-[#05070a] border border-slate-800 rounded-2xl text-slate-200 text-xs focus:border-purple-500 focus:outline-none"
                    />

                    <div className="flex justify-end">
                      <button
                        onClick={handleSynthesizeSyllabus}
                        disabled={isSynthesizingSyllabus || !syllabusText.trim()}
                        className="px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-40"
                      >
                        {isSynthesizingSyllabus ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Synthesizing Full Course Structure...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Synthesize Universal Curriculum</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Course Header Info Card */}
                    <div className="p-5 rounded-2xl bg-[#090d16] border border-purple-500/30 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-purple-400 font-bold">
                            Course Code: {synthesizedCourse.courseCode || 'N/A'} • {synthesizedCourse.difficulty}
                          </span>
                          <h2 className="text-lg font-bold text-white mt-0.5">{synthesizedCourse.title}</h2>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[11px]">
                          {synthesizedCourse.modules?.length || 0} Modules Extracted
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs">{synthesizedCourse.description}</p>
                      
                      {publishCourseSuccess && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                          <Check className="w-4 h-4 shrink-0" />
                          <span>{publishCourseSuccess}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => setSynthesizedCourse(null)}
                          className="text-xs text-slate-400 hover:text-white underline"
                        >
                          &larr; Re-paste / Edit Syllabus Text
                        </button>

                        <button
                          onClick={handlePublishCourseToDB}
                          disabled={isPublishingCourse || Boolean(publishCourseSuccess)}
                          className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-40"
                        >
                          {isPublishingCourse ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Publishing to Database...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5" />
                              <span>{publishCourseSuccess ? 'Published to DB' : 'Publish Entire Course to Database'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Extracted Modules Tree */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Extracted Units & Interactive Lesson Blueprints:
                      </h4>

                      {synthesizedCourse.modules?.map((mod, mIdx) => (
                        <div key={mIdx} className="p-4 rounded-xl bg-[#05070a] border border-slate-800 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-cyan-400 text-xs">{mod.title}</span>
                            <span className="text-[10px] text-slate-500">{mod.suggestedLessons?.length || 0} lessons</span>
                          </div>
                          <p className="text-[11px] text-slate-400">{mod.summary}</p>

                          <div className="space-y-1.5 pt-1 border-t border-slate-900">
                            {mod.suggestedLessons?.map((les, lIdx) => (
                              <div key={lIdx} className="flex items-center justify-between p-2 rounded-lg bg-[#090d16] border border-slate-800/80 hover:border-cyan-500/40 transition">
                                <span className="text-[11px] text-slate-200">{les.title}</span>
                                <button
                                  onClick={() => {
                                    setShowSyllabusModal(false);
                                    handleGenerateWithAI(les.prompt || les.title);
                                  }}
                                  className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-bold transition flex items-center gap-1"
                                >
                                  <Sparkles className="w-3 h-3" />
                                  <span>Generate Lesson</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
              className="bg-[#07090e] border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl font-sans"
            >
              <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-[#0b0e14]">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-xs font-bold text-slate-200">
                    STAGING CANVAS: {metadata.lessonTitle || 'Interactive Lesson Preview'}
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
            <span>Lesson successfully saved and published to database!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
