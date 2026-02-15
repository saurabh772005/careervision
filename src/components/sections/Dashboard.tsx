
import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Target,
  Map,
  Book,
  ShieldCheck,
  TrendingUp,
  Users,
  ChevronRight,
  BrainCircuit,
  ArrowUpRight,
  Clock,
  Compass,
  FileText,
  AlertCircle,
  Zap
} from 'lucide-react';
import { ActiveTool } from '../../App';
import GlassCard from '../ui/GlassCard';

interface DashboardProps {
  user: { name: string; email: string };
  onToolClick: (tool: ActiveTool | 'pricing') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onToolClick }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen pt-32 pb-48 px-6 lg:px-24 bg-[#0A0E27]"
    >
      <div className="max-w-7xl mx-auto">

        {/* Trial Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-3xl bg-gradient-to-r from-[#028090]/20 to-[#02C39A]/20 border border-[#02C39A]/30 flex flex-col sm:row items-center justify-between gap-4"
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-2xl bg-[#02C39A]/20 flex items-center justify-center text-[#02C39A]">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Trial Ending Soon</p>
              <p className="text-xs text-[#B8C5D6]">You have <span className="text-[#02C39A] font-bold">2 days left</span> in your premium trial period.</p>
            </div>
          </div>
          <button
            onClick={() => onToolClick('pricing')}
            className="px-6 py-2.5 rounded-xl bg-[#02C39A] text-[#0A0E27] font-black text-xs hover:shadow-[0_0_20px_rgba(2,195,154,0.4)] transition-all flex items-center space-x-2"
          >
            <Zap size={14} />
            <span>Upgrade to Pro</span>
          </button>
        </motion.div>

        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 mb-4"
            >
              <div className="px-3 py-1 rounded-full bg-[#02C39A]/10 border border-[#02C39A]/20 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#02C39A] animate-pulse" />
                <span className="text-[10px] font-bold text-[#02C39A] uppercase tracking-widest">AI Engine: Online</span>
              </div>
              <span className="text-[#6B7A8F] text-xs">Last sync: 2 mins ago</span>
            </motion.div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Welcome back, <span className="text-[#02C39A]">{user.name.split(' ')[0]}</span>.
            </h1>
            <p className="text-[#B8C5D6] mt-2">Your career intelligence dashboard is ready.</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-[#6B7A8F] font-bold uppercase mb-1">Career Readiness</div>
              <div className="text-2xl font-black text-white">82%</div>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#028090] to-[#02C39A] p-[2px]">
              <div className="w-full h-full bg-[#0A0E27] rounded-[14px] flex items-center justify-center font-black text-2xl text-[#02C39A]">
                82
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Quick Actions */}
          <div className="lg:col-span-9 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: 'recommendation', title: 'Finder', desc: 'AI Recommend', icon: Compass, color: 'text-gold-400' },
                { id: 'simulator', title: 'Simulator', desc: 'Predict ROI', icon: BrainCircuit, color: 'text-teal-400' },
                { id: 'validator', title: 'Validator', desc: 'Verify Courses', icon: ShieldCheck, color: 'text-emerald-400' },
                { id: 'roadmap', title: 'Roadmap', desc: 'Step-by-step', icon: Map, color: 'text-blue-400' },
                { id: 'mentorship', title: 'Mentors', desc: 'Connect', icon: Users, color: 'text-purple-400' },
                { id: 'resources', title: 'Library', desc: 'Free Content', icon: Book, color: 'text-indigo-400' },
              ].map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => onToolClick(tool.id as ActiveTool)}
                  className="group relative p-6 rounded-[32px] bg-[#1A1F3A]/60 border border-white/10 text-left hover:border-[#02C39A]/40 transition-all overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <tool.icon size={60} />
                  </div>
                  <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 w-fit mb-4 ${tool.color}`}>
                    <tool.icon size={20} />
                  </div>
                  <h3 className="text-lg font-bold mb-1">{tool.title}</h3>
                  <p className="text-[10px] text-[#B8C5D6] mb-4">{tool.desc}</p>
                  <div className="flex items-center space-x-2 text-[10px] font-bold text-[#02C39A]">
                    <span>Launch</span>
                    <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>

            {/* AI Insights Card */}
            <div className="bg-gradient-to-br from-[#1A1F3A]/80 to-[#0A0E27] border border-white/10 rounded-[40px] p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#02C39A]/5 blur-[100px] rounded-full pointer-events-none" />
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <Sparkles className="text-[#02C39A]" size={24} />
                  <h3 className="text-2xl font-bold">AI Career Insights</h3>
                </div>
                <button
                  onClick={() => onToolClick('report')}
                  className="px-4 py-2 rounded-xl bg-[#02C39A]/10 border border-[#02C39A]/20 text-[#02C39A] text-xs font-bold flex items-center space-x-2 hover:bg-[#02C39A] hover:text-[#0A0E27] transition-all"
                >
                  <FileText size={14} />
                  <span>Full AI Report</span>
                </button>
              </div>

              <div className="space-y-6">
                {[
                  { label: "Top Recommended Path", value: "FinTech SDE (Off-campus)", meta: "92% Fit Score" },
                  { label: "Skill Gap Alert", value: "System Design (HLD/LLD)", meta: "Medium Priority" },
                  { label: "Market Demand", value: "High (2.4x Growth)", meta: "Trending" }
                ].map((insight, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div>
                      <div className="text-[10px] text-[#6B7A8F] font-bold uppercase mb-1">{insight.label}</div>
                      <div className="text-lg font-bold text-white">{insight.value}</div>
                    </div>
                    <div className="text-right">
                      <div className="px-3 py-1 rounded-lg bg-[#02C39A]/10 text-[#02C39A] text-[10px] font-black uppercase">
                        {insight.meta}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Activity & Mentors */}
          <div className="lg:col-span-3 space-y-8">
            <GlassCard className="h-full">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold">Live Activity</h3>
                <Clock className="text-[#6B7A8F]" size={18} />
              </div>

              <div className="space-y-8 relative">
                {/* Timeline Line */}
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/10" />

                {[
                  { title: "Alumni Match Found", time: "1h ago", desc: "NIT Alum @ Google", icon: Users, color: "bg-blue-500" },
                  { title: "Course Validated", time: "4h ago", desc: "MERN Stack Pro Fit", icon: ShieldCheck, color: "bg-green-500" },
                  { title: "Roadmap Updated", time: "1d ago", desc: "Added Cloud Module", icon: Target, color: "bg-[#02C39A]" },
                  { title: "Career Pulse", time: "2d ago", desc: "Salary Benchmark +15%", icon: TrendingUp, color: "bg-yellow-500" },
                ].map((act, i) => (
                  <div key={i} className="relative flex items-start space-x-6">
                    <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center border-4 border-[#1A1F3A] ${act.color}`}>
                      <act.icon size={12} className="text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-white">{act.title}</span>
                        <span className="text-[10px] text-[#6B7A8F]">{act.time}</span>
                      </div>
                      <p className="text-xs text-[#B8C5D6] mt-1">{act.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-[#02C39A] text-xs font-bold hover:bg-white/10 transition-all">
                View All Activity
              </button>
            </GlassCard>

            {/* Pro Call to Action Tab */}
            <div className="p-8 rounded-[32px] bg-[#02C39A] text-[#0A0E27] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4">
                <Sparkles size={100} />
              </div>
              <h3 className="text-xl font-black mb-2">Upgrade to Pro</h3>
              <p className="text-sm font-medium mb-6 opacity-80">Get 1:1 mentorship and personalized roadmaps starting today.</p>
              <button
                onClick={() => onToolClick('pricing')}
                className="w-full py-4 rounded-2xl bg-[#0A0E27] text-white font-bold text-xs flex items-center justify-center space-x-2 group-hover:shadow-2xl transition-all"
              >
                <span>See Plans</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </motion.section>
  );
};

export default Dashboard;
