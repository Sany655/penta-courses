import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, Cpu, Network, Globe, Clock, 
  BarChart3, Lock, Unlock, ArrowRight, Zap, CheckCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const categoryIcons = {
  CYBERSECURITY: <ShieldAlert className="w-5 h-5 text-emerald-400" />,
  PREDICTIVE_MODELING_ML: <Cpu className="w-5 h-5 text-purple-400" />,
  CLINICAL_MEDICINE: <ShieldAlert className="w-5 h-5 text-rose-400" />,
  NETWORKING: <Network className="w-5 h-5 text-cyan-400" />,
  WEB_DEVELOPMENT: <Globe className="w-5 h-5 text-amber-400" />,
};

const CourseGrid = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/courses')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setCourses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setCourses([]);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-20 bg-slate-50 dark:bg-[#05070a] border-b border-slate-200 dark:border-slate-900 transition-colors" id="courses">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2 font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>PRODUCTION CURRICULUM</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              Specialized Engineering Tracks
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-2 max-w-xl">
              Architected for practitioners seeking low-level depth across Security, Machine Learning, Kernel Networking, and High-Throughput Web.
            </p>
          </div>

          <div className="font-mono text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl self-start md:self-auto flex items-center gap-2 shadow-sm">
            <span>Identity:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{user ? (user.role === 'ADMIN' ? 'Root Admin' : user.name || 'Student') : 'Guest Explorer'}</span>
          </div>
        </div>

        {/* Course Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white dark:bg-[#090d16] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-7 animate-pulse h-64 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                  <div className="h-12 bg-slate-200 dark:bg-slate-800/60 rounded w-full"></div>
                </div>
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 font-mono text-sm">
            No active curriculum tracks available at this moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map((course) => {
              const firstModule = course.modules?.[0];
              const firstLesson = firstModule?.lessons?.[0];
              const isUnlocked = user ? (user.unlockedModules?.includes(firstModule?.id) || user.role === 'ADMIN') : false;
              const stats = course.stats_json || course.stats || {};
              const skills = stats.skills || course.skills || [];

              return (
                <div
                  key={course.id}
                  className="group relative bg-white dark:bg-[#090d16] hover:bg-slate-50 dark:hover:bg-[#0c121e] border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-7 transition-all duration-200 flex flex-col justify-between shadow-md hover:shadow-xl dark:shadow-xl dark:hover:shadow-2xl"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          {categoryIcons[course.category] || <Cpu className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />}
                        </div>
                        <span className="text-xs font-mono text-slate-700 dark:text-slate-300 font-bold">
                          {(course.category || 'TRACK').replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider ${
                          course.difficulty === 'Expert' 
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30' 
                            : course.difficulty === 'Advanced'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
                        }`}>
                          {course.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Course Title & Description */}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition mb-3">
                      {course.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                      {course.description}
                    </p>

                    {/* Skills Badges */}
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[11px] font-mono border border-slate-200 dark:border-slate-800 font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Metrics & Actions */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs font-mono text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        {stats.estimatedHours || 24}h Total
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <BarChart3 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        {course.modules?.length || stats.modules || 2} Phases
                      </span>
                    </div>

                    <Link
                      href={firstLesson ? `/learn/${course.id}/${firstModule.id}/${firstLesson.id}` : `/course/${course.id}/overview`}
                      className="penta-card-btn inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold font-mono shadow-sm"
                    >
                      <span>{isUnlocked ? 'Enter Lab' : 'Preview Phase'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

export default CourseGrid;
