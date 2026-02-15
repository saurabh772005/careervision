
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Zap, CheckCircle, ExternalLink, Calendar, BookOpen, Video, Target, Rocket, Activity, AlertTriangle } from 'lucide-react';
import { generateRoadmapAI } from '../../lib/gemini-service';
import LoadingSpinner from '../ui/LoadingSpinner';

const RoadmapGenerator: React.FC = () => {
  const [role, setRole] = useState('');
  const [weeks, setWeeks] = useState(8);
  const [generating, setGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const user = JSON.parse(localStorage.getItem('career_compass_user') || '{}');
      const skills = user.skills || "JavaScript, HTML, Problem Solving";
      const data = await generateRoadmapAI(role, skills, 20, weeks);
      setRoadmap(data.roadmap);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate roadmap.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 pb-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black mb-4">AI Roadmap Generator</h2>
        <p className="text-[#6B7A8F]">What's your dream career goal? We'll map the exact week-by-week route.</p>
      </div>

      {error && (
        <div className="flex flex-col items-center justify-center py-10 space-y-4 max-w-2xl mx-auto text-center px-4 mb-10">
          <div className="bg-red-500/10 p-4 rounded-full text-red-400">
            <AlertTriangle size={36} />
          </div>
          <h3 className="text-xl font-bold text-white">Roadmap Generation Failed</h3>
          <p className="text-[#B8C5D6]">{error}. Please try again.</p>
        </div>
      )}

      {!roadmap ? (
        <div className="bg-[#1A1F3A]/60 backdrop-blur-xl border border-white/10 p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
          <div className="space-y-8">
            <div>
              <label className="block text-xs font-bold text-[#6B7A8F] uppercase tracking-widest mb-4">Goal: Where do you want to be?</label>
              <div className="relative">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-[#02C39A]" size={24} />
                <input
                  placeholder="e.g. SDE-1 at Amazon, Lead Designer, Full Stack Developer..."
                  className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-14 pr-6 text-xl focus:border-[#02C39A] outline-none placeholder:text-white/20"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6B7A8F] uppercase tracking-widest mb-4">Timeline: How many weeks? ({weeks})</label>
              <input
                type="range" min="4" max="24" step="1"
                value={weeks}
                onChange={e => setWeeks(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#02C39A]"
              />
              <div className="flex justify-between text-[10px] font-bold text-[#6B7A8F] mt-2">
                <span>4 WEEKS (CRASH)</span>
                <span>24 WEEKS (MASTERY)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-teal-400/40 transition-all cursor-pointer group">
                <div className="flex items-center space-x-2 text-teal-400 mb-2">
                  <Zap size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">Efficiency Mode</span>
                </div>
                <p className="text-sm text-[#B8C5D6]">Focus on high-yield interview topics only.</p>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-teal-400/40 transition-all cursor-pointer group">
                <div className="flex items-center space-x-2 text-purple-400 mb-2">
                  <Rocket size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">Career Builder</span>
                </div>
                <p className="text-sm text-[#B8C5D6]">Includes projects and portfolio guidance.</p>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!role || generating}
              className={`w-full py-6 rounded-3xl font-black text-xl transition-all shadow-xl flex items-center justify-center space-x-3 ${generating ? "bg-white/10 animate-pulse text-[#02C39A]" : "bg-gradient-to-r from-[#028090] to-[#02C39A] text-white hover:scale-[1.02]"
                }`}
            >
              {generating ? <Activity className="animate-spin" /> : <Map size={24} />}
              <span>{generating ? "AI Mapping Your Path..." : "Create My Custom Roadmap"}</span>
            </button>
          </div>
          {generating && (
            <div className="absolute inset-0 bg-[#1A1F3A]/95 backdrop-blur-sm flex items-center justify-center z-10 transition-all">
              <LoadingSpinner size="lg" text="AI Mapping Your Path..." />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-12 animate-in fade-in duration-700">
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div>
              <h3 className="text-3xl font-black text-white">{roadmap.targetRole} Roadmap</h3>
              <p className="text-[#6B7A8F] mt-1 uppercase tracking-widest text-xs font-bold">{roadmap.totalWeeks} Weeks • High ROI Path</p>
            </div>
            <button onClick={() => setRoadmap(null)} className="text-[#02C39A] font-bold text-sm bg-[#02C39A]/10 px-4 py-2 rounded-xl border border-[#02C39A]/20 hover:bg-[#02C39A] hover:text-[#0A0E27] transition-all">Change Goal</button>
          </div>

          <div className="space-y-10">
            {roadmap.phases.map((phase: any, pi: number) => (
              <div key={pi} className="relative">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-[#02C39A] flex items-center justify-center font-black text-[#0A0E27] text-xl shadow-[0_0_20px_rgba(2,195,154,0.4)]">
                    {pi + 1}
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white uppercase tracking-tight">{phase.title}</h4>
                    <div className="text-[10px] text-[#02C39A] font-bold tracking-widest uppercase">Phase Objective Defined</div>
                  </div>
                </div>

                <div className="space-y-6 pl-16">
                  <div className="grid grid-cols-1 gap-4">
                    {phase.weeks.map((week: any, wi: number) => (
                      <div key={wi} className="bg-[#1A1F3A]/60 border border-white/5 p-6 rounded-3xl flex items-center justify-between hover:border-[#02C39A]/30 transition-all group">
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className="text-[8px] text-[#6B7A8F] font-bold uppercase mb-1">Week</div>
                            <div className="text-2xl font-black text-white">{week.week}</div>
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              {week.topics.map((t: string, ti: number) => (
                                <span key={ti} className="text-[10px] font-bold text-[#02C39A] bg-[#02C39A]/10 px-2 py-1 rounded-md">{t}</span>
                              ))}
                            </div>
                            <div className="flex items-center space-x-2 text-[10px] text-[#6B7A8F]">
                              <BookOpen size={12} />
                              <span className="font-bold uppercase tracking-tight">{week.resource}</span>
                            </div>
                          </div>
                        </div>
                        <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#B8C5D6] hover:bg-[#02C39A] hover:text-[#0A0E27] transition-all">
                          <ExternalLink size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Phase Project Idea */}
                  <div className="p-6 bg-gradient-to-r from-[#028090]/20 to-transparent border-l-4 border-[#02C39A] rounded-r-3xl">
                    <div className="flex items-center space-x-2 text-[#02C39A] mb-2">
                      <Rocket size={16} />
                      <span className="text-xs font-bold uppercase tracking-widest">Phase Milestone Project</span>
                    </div>
                    <p className="text-sm text-white font-medium italic">"{phase.projectIdea}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapGenerator;
