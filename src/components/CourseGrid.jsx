import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, Cpu, Network, Globe, Clock, 
  BarChart3, Lock, Unlock, ArrowRight, Zap, CheckCircle 
} from 'lucide-react';
import coursesData from '../data/courses.json';
import { useAuth } from '../context/AuthContext';

const categoryIcons = {
  CYBERSECURITY: <ShieldAlert className="w-5 h-5 text-emerald-400" />,
  PREDICTIVE_MODELING_ML: <Cpu className="w-5 h-5 text-purple-400" />,
  NETWORKING: <Network className="w-5 h-5 text-cyan-400" />,
  WEB_DEVELOPMENT: <Globe className="w-5 h-5 text-amber-400" />,
};

const CourseGrid = () => {
  const { user } = useAuth();

  return (
    <section className="py-20 bg-[#05070a] border-b border-slate-900" id="courses">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              <span>PRODUCTION CURRICULUM</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Specialized Engineering Tracks
            </h2>
            <p className="text-slate-400 text-sm md:text-base mt-2 max-w-xl">
              Architected for practitioners seeking low-level depth across Security, Machine Learning, Kernel Networking, and High-Throughput Web.
            </p>
          </div>

          <div className="font-mono text-xs text-slate-400 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl self-start md:self-auto flex items-center gap-2">
            <span>Identity:</span>
            <span className="text-emerald-400 font-bold">{user ? (user.role === 'ADMIN' ? 'Root Admin' : user.name || 'Student') : 'Guest Explorer'}</span>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {coursesData.map((course) => {
            const firstModule = course.modules[0];
            const firstLesson = firstModule?.lessons[0];
            const isUnlocked = user ? (user.unlockedModules.includes(firstModule?.id) || user.role === 'ADMIN') : false;

            return (
              <div
                key={course.id}
                className="group relative bg-[#090d16] hover:bg-[#0c121e] border border-slate-800/80 hover:border-slate-700 rounded-2xl p-7 transition-all duration-200 flex flex-col justify-between shadow-xl hover:shadow-2xl"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        {categoryIcons[course.category] || <Cpu className="w-5 h-5 text-cyan-400" />}
                      </div>
                      <span className="text-xs font-mono text-slate-400 font-medium">
                        {course.category.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider ${
                        course.difficulty === 'Expert' 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' 
                          : course.difficulty === 'Advanced'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      }`}>
                        {course.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Course Title & Description */}
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition mb-3">
                    {course.title}
                  </h3>

                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {course.description}
                  </p>

                  {/* Skills Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {course.skills?.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 text-[11px] font-mono border border-slate-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Metrics & Actions */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {course.stats?.estimatedHours || 24}h Total
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                      {course.stats?.modules || 4} Phases
                    </span>
                  </div>

                  <Link
                    to={firstLesson ? `/learn/${course.id}/${firstModule.id}/${firstLesson.id}` : `/course/${course.id}/overview`}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-emerald-500 text-slate-200 hover:text-slate-950 text-xs font-bold font-mono transition border border-slate-700 hover:border-emerald-400"
                  >
                    <span>{isUnlocked ? 'Enter Lab' : 'Preview Phase'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CourseGrid;
