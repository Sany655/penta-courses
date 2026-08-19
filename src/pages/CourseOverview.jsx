import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Clock, Award, CheckCircle, ArrowLeft, Terminal, 
  ShieldCheck, ArrowRight, Lock, BookOpen, Layers, Zap 
} from 'lucide-react';
import coursesData from '../data/courses.json';
import { useAuth } from '../context/AuthContext';
import { BkashPaymentModal } from '../components/payment/BkashPaymentModal';

const CourseOverview = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { user, bkashSettings } = useAuth();
  const [course, setCourse] = useState(null);
  const [selectedModuleForPay, setSelectedModuleForPay] = useState(null);
  const [showFullCoursePay, setShowFullCoursePay] = useState(false);

  useEffect(() => {
    const found = coursesData.find(c => c.id === courseId || c.slug === courseId) || coursesData[0];
    setCourse(found);
  }, [courseId]);

  if (!course) return null;

  const firstModule = course.modules[0];
  const firstLesson = firstModule?.lessons[0];
  const allModuleIds = course.modules.map(m => m.id);
  const isFullCourseUnlocked = allModuleIds.every(id => user.unlockedModules.includes(id)) || user.role !== 'STUDENT';

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 pt-24 pb-20 font-sans">
      <div className="max-w-5xl mx-auto px-6 space-y-10">
        
        {/* Back Link */}
        <Link to="/#courses" className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-emerald-400 transition">
          <ArrowLeft size={14} /> Back to Track Catalog
        </Link>
        
        {/* Course Header Banner */}
        <div className="bg-[#090d16] border border-slate-800 rounded-3xl p-8 md:p-10 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
              {course.category.replace('_', ' ')}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
              {course.difficulty}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            {course.title}
          </h1>

          <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-3xl">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" /> {course.stats?.estimatedHours || 24} Hours
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-400" /> {course.modules.length} Progressive Modules
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Sequential Gatekeeper
            </span>
          </div>

          <div className="pt-4 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-xs text-slate-500 font-mono">Full Track Admission</div>
              <div className="text-2xl font-bold text-white font-mono">
                ৳{course.price * 85 || 1500} BDT <span className="text-xs text-slate-400 font-normal">or Free Phase 01 Preview</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {!isFullCourseUnlocked && (
                <button
                  onClick={() => setShowFullCoursePay(true)}
                  className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#e2136e] via-pink-600 to-[#e2136e] hover:from-[#d01063] hover:to-pink-500 text-white font-bold text-xs font-mono transition shadow-[0_0_20px_rgba(226,19,110,0.3)] flex items-center gap-2"
                >
                  <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center font-bold">৳</span>
                  <span>Unlock Full Track (bKash)</span>
                </button>
              )}

              {firstLesson && (
                <button
                  onClick={() => navigate(`/learn/${course.id}/${firstModule.id}/${firstLesson.id}`)}
                  className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center gap-2"
                >
                  <span>Launch Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modules Syllabus Breakdown */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 font-mono">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Curriculum Structure & Gatekeepers
          </h2>

          <div className="space-y-4">
            {course.modules.map((mod, idx) => {
              const isUnlocked = user.unlockedModules.includes(mod.id) || user.role !== 'STUDENT';
              const isPending = (user.pendingModules || []).includes(mod.id);

              return (
                <div
                  key={mod.id}
                  className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono text-cyan-400 font-bold">PHASE 0{idx + 1}</span>
                      {isUnlocked ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">Unlocked</span>
                      ) : isPending ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 text-[10px] font-mono border border-amber-500/30 flex items-center gap-1 font-bold animate-pulse">
                          ● Admin Verification Pending
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-mono border border-amber-500/20">Requires Assessment / bKash Bypass</span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white">{mod.title}</h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {mod.lessons.length} Interactive Lessons &bull; Gatekeeper Passing Grade: 80%
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 self-end md:self-center">
                    {!isUnlocked && !isPending && (
                      <button
                        onClick={() => setSelectedModuleForPay(mod)}
                        className="px-3.5 py-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/30 text-xs font-mono font-bold transition flex items-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5 text-pink-400" />
                        <span>bKash Bypass</span>
                      </button>
                    )}

                    {isPending ? (
                      <button
                        onClick={() => alert('Your bKash transaction is currently pending admin verification. Access will be unlocked once approved.')}
                        className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1.5"
                      >
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Awaiting Approval</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (isUnlocked) {
                            navigate(`/learn/${course.id}/${mod.id}/${mod.lessons[0].id}`);
                          } else {
                            setSelectedModuleForPay(mod);
                          }
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                          isUnlocked
                            ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {isUnlocked ? (
                          <>
                            <span>Enter Phase</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5 text-amber-500" />
                            <span>Locked (Unlock)</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Module Level bKash Modal */}
      {selectedModuleForPay && (
        <BkashPaymentModal
          isOpen={!!selectedModuleForPay}
          onClose={() => setSelectedModuleForPay(null)}
          itemTitle={`Phase Bypass: ${selectedModuleForPay.title}`}
          itemId={selectedModuleForPay.id}
          itemType="module"
          amountBdt={bkashSettings?.defaultFeeBdt || '250'}
          onSuccess={() => setSelectedModuleForPay(null)}
        />
      )}

      {/* Full Course bKash Modal */}
      {showFullCoursePay && (
        <BkashPaymentModal
          isOpen={showFullCoursePay}
          onClose={() => setShowFullCoursePay(false)}
          itemTitle={`Full Track Enrollment: ${course.title}`}
          itemId={allModuleIds}
          itemType="course"
          amountBdt={(course.price * 85 || 1500).toString()}
          onSuccess={() => setShowFullCoursePay(false)}
        />
      )}
    </div>
  );
};

export default CourseOverview;

