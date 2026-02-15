
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Target,
  BrainCircuit,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Star,
  TrendingUp,
  BookOpen,
  Zap,
  ArrowLeft,
  Rocket,
  AlertTriangle
} from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';
import { getCareerRecommendationsAI, generateRoadmapAI } from '../../lib/gemini-service';

const CareerRecommendation: React.FC = () => {
  const [step, setStep] = useState<'form' | 'options' | 'roadmap'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    collegeType: 'tier3',
    cgpa: 7.5,
    interests: '',
    strengths: '',
    knowledgeLevel: 'Beginner'
  });
  const [recommendations, setRecommendations] = useState<any>(null);
  const [selectedCareer, setSelectedCareer] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<any>(null);

  const handleGetRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCareerRecommendationsAI(profile);
      setRecommendations(data);
      setStep('options');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to get recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCareer = async (career: any) => {
    setSelectedCareer(career);
    setLoading(true);
    setError(null);
    try {
      // Reusing roadmap generator logic
      const data = await generateRoadmapAI(career.title, profile.interests + ", " + profile.strengths, 20, 12);
      setRoadmap(data.roadmap);
      setStep('roadmap');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate roadmap.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-8">
        <LoadingSpinner size="lg" text={step === 'form' ? "Analyzing your unique profile DNA..." : "Mapping out your path to success..."} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4 max-w-4xl mx-auto text-center px-4">
        <div className="bg-red-500/10 p-6 rounded-full text-red-400 mb-4">
          <AlertTriangle size={48} />
        </div>
        <h3 className="text-2xl font-bold text-white">Oops! Something went wrong.</h3>
        <p className="text-[#B8C5D6] max-w-md">{error} Please check your connection or API key.</p>
        <button onClick={() => { setError(null); setStep('form'); }} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold transition-all">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 pb-24 px-4">
      {step === 'form' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
          <div className="text-center">
            <h2 className="text-4xl font-black mb-4">Discover Your Future</h2>
            <p className="text-[#B8C5D6] max-w-xl mx-auto">Tell us about yourself, and let our AI predict the career where you'll thrive most.</p>
          </div>

          <div className="bg-[#1A1F3A]/60 backdrop-blur-xl border border-white/10 p-8 lg:p-12 rounded-[40px] shadow-2xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold text-[#6B7A8F] uppercase tracking-widest mb-3">College Tier</label>
                <select
                  value={profile.collegeType}
                  onChange={e => setProfile({ ...profile, collegeType: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-[#02C39A] outline-none text-white appearance-none"
                >
                  <option value="tier1">Tier 1 (IIT/NIT/BITS)</option>
                  <option value="tier2">Tier 2 (Reputed Private/Govt)</option>
                  <option value="tier3">Tier 3 (Local College)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6B7A8F] uppercase tracking-widest mb-3">Academic CGPA</label>
                <input
                  type="number" step="0.1"
                  value={profile.cgpa}
                  onChange={e => setProfile({ ...profile, cgpa: parseFloat(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-[#02C39A] outline-none text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6B7A8F] uppercase tracking-widest mb-3">What interests you?</label>
              <textarea
                placeholder="e.g. Solving puzzles, building apps, analyzing data, talking to people..."
                rows={3}
                value={profile.interests}
                onChange={e => setProfile({ ...profile, interests: e.target.value })}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-[#02C39A] outline-none text-white placeholder:text-white/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6B7A8F] uppercase tracking-widest mb-3">What are your core strengths?</label>
              <textarea
                placeholder="e.g. Logical thinking, communication, design, math, persistence..."
                rows={3}
                value={profile.strengths}
                onChange={e => setProfile({ ...profile, strengths: e.target.value })}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-[#02C39A] outline-none text-white placeholder:text-white/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6B7A8F] uppercase tracking-widest mb-3">Current Knowledge Level</label>
              <div className="grid grid-cols-3 gap-4">
                {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setProfile({ ...profile, knowledgeLevel: lvl })}
                    className={`py-4 rounded-2xl border transition-all font-bold text-sm ${profile.knowledgeLevel === lvl ? 'bg-[#02C39A] border-[#02C39A] text-[#0A0E27]' : 'bg-white/5 border-white/10 text-[#6B7A8F] hover:border-white/20'
                      }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGetRecommendations}
              disabled={!profile.interests || !profile.strengths}
              className="w-full py-6 rounded-3xl bg-gradient-to-r from-[#028090] to-[#02C39A] text-white font-black text-xl hover:shadow-[0_10px_30px_rgba(2,195,154,0.3)] transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              <Sparkles size={24} />
              <span>Generate Recommendations</span>
            </button>
          </div>
        </motion.div>
      )}

      {step === 'options' && recommendations && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
          <div className="flex items-center justify-between">
            <button onClick={() => setStep('form')} className="flex items-center space-x-2 text-[#6B7A8F] hover:text-white transition-colors">
              <ArrowLeft size={18} />
              <span>Back to Profile</span>
            </button>
            <div className="text-right">
              <h2 className="text-3xl font-bold">Top Recommendations</h2>
              <p className="text-[#02C39A] text-xs font-bold uppercase tracking-widest mt-1">Personalized for You</p>
            </div>
          </div>

          <div className="bg-[#02C39A]/10 border border-[#02C39A]/20 p-6 rounded-3xl mb-8">
            <p className="text-white text-lg leading-relaxed">{recommendations.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recommendations.recommendations.map((career: any, i: number) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-[32px] p-8 hover:border-[#02C39A]/40 transition-all flex flex-col group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Target size={120} />
                </div>

                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-[#02C39A] transition-colors">{career.title}</h3>

                <div className="space-y-4 flex-grow mb-8">
                  <p className="text-[#B8C5D6] text-sm leading-relaxed">{career.fitReason}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-3 rounded-xl">
                      <div className="text-[10px] text-[#6B7A8F] font-bold uppercase mb-1">Market Demand</div>
                      <div className="text-sm font-bold text-[#02FFC3]">{career.marketDemand}</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl">
                      <div className="text-[10px] text-[#6B7A8F] font-bold uppercase mb-1">Avg Salary</div>
                      <div className="text-sm font-bold text-white">{career.averageSalary}</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectCareer(career)}
                  className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 font-bold group-hover:bg-[#02C39A] group-hover:text-[#0A0E27] transition-all flex items-center justify-center space-x-2"
                >
                  <span>Select & Get Roadmap</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {step === 'roadmap' && roadmap && selectedCareer && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div>
              <h3 className="text-3xl font-black text-white">{selectedCareer.title} Roadmap</h3>
              <p className="text-[#02C39A] mt-1 uppercase tracking-widest text-xs font-bold">12 Weeks Mastery Path</p>
            </div>
            <button
              onClick={() => setStep('options')}
              className="text-[#6B7A8F] hover:text-white flex items-center space-x-1"
            >
              <ArrowLeft size={16} />
              <span className="text-xs font-bold">Back to Options</span>
            </button>
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
                    <div className="text-[10px] text-[#02C39A] font-bold tracking-widest uppercase">Target Milestones</div>
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
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 bg-gradient-to-r from-[#028090]/20 to-transparent border-l-4 border-[#02C39A] rounded-r-3xl">
                    <div className="flex items-center space-x-2 text-[#02C39A] mb-2">
                      <Rocket size={16} />
                      <span className="text-xs font-bold uppercase tracking-widest">Phase Capstone</span>
                    </div>
                    <p className="text-sm text-white font-medium italic">"{phase.projectIdea}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#1A1F3A] border border-[#02C39A]/30 rounded-[32px] p-10 text-center">
            <div className="w-16 h-16 bg-[#02C39A] rounded-full flex items-center justify-center mx-auto mb-6 text-[#0A0E27]">
              <CheckCircle2 size={32} />
            </div>
            <h4 className="text-2xl font-bold mb-4">You're Ready to Begin!</h4>
            <p className="text-[#B8C5D6] mb-8">This roadmap has been tailored to your specific CGPA, college tier, and strengths.</p>
            <button className="px-10 py-4 rounded-2xl bg-[#02C39A] text-[#0A0E27] font-black hover:shadow-[0_10px_30px_rgba(2,195,154,0.3)] transition-all">
              Save Roadmap to Profile
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CareerRecommendation;
