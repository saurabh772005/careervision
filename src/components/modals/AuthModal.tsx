
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, GraduationCap, Briefcase, Users } from 'lucide-react';
import Logo from '../ui/Logo';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    type: 'student' as 'student' | 'counsellor' | 'mentor'
  });

  const handleRoleSelect = (role: 'student' | 'counsellor' | 'mentor') => {
    setForm({ ...form, type: role });
    setStep('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onSuccess({
        name: form.name || 'Demo User',
        email: form.email,
        uid: Math.random().toString(36).substr(2, 9),
        role: form.type // Pass the role to the app
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0A0E27]/80 backdrop-blur-xl flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#1A1F3A] border border-white/10 w-full max-w-md rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(2,195,154,0.1)] relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-[#6B7A8F] z-10">
          <X size={20} />
        </button>

        <div className="p-10">
          <div className="flex flex-col items-center mb-8">
            <Logo showText={false} size="lg" className="mb-4" />
            <h2 className="text-2xl font-bold">
              {step === 'role' ? 'Who are you?' : (mode === 'signup' ? 'Join CareerVision' : 'Welcome Back')}
            </h2>
            <p className="text-[#6B7A8F] text-sm text-center mt-2">
              {step === 'role' ? 'Select your profile type to continue.' : 'Data-backed guidance is just a few clicks away.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 'role' ? (
              <motion.div
                key="role-selection"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {[
                  { id: 'student', label: 'Student', icon: GraduationCap, desc: 'Seeking guidance & career paths' },
                  { id: 'counsellor', label: 'Counsellor', icon: Users, desc: 'Guiding students professionally' },
                  { id: 'mentor', label: 'Mentor', icon: Briefcase, desc: 'Industry expert sharing knowledge' },
                ].map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id as any)}
                    className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#02C39A] hover:bg-white/10 transition-all text-left flex items-center space-x-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#02C39A]/10 flex items-center justify-center text-[#02C39A] group-hover:bg-[#02C39A] group-hover:text-[#0A0E27] transition-colors">
                      <role.icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{role.label}</h3>
                      <p className="text-xs text-[#6B7A8F]">{role.desc}</p>
                    </div>
                    <ArrowRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-[#02C39A]" size={20} />
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.form
                key="auth-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Back Button for Role Selection */}
                <button
                  type="button"
                  onClick={() => setStep('role')}
                  className="text-xs text-[#6B7A8F] hover:text-white mb-2 flex items-center space-x-1"
                >
                  <span>← Change Role</span>
                </button>

                {mode === 'signup' && (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7A8F]" size={18} />
                    <input
                      placeholder="Full Name"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-[#02C39A] outline-none"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7A8F]" size={18} />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-[#02C39A] outline-none"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7A8F]" size={18} />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-[#02C39A] outline-none"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                  />
                </div>

                <div className="text-xs text-center text-[#6B7A8F] mb-4">
                  Logging in as <span className="text-[#02C39A] font-bold capitalize">{form.type}</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all flex items-center justify-center space-x-2 ${loading ? "bg-white/10 animate-pulse" : "bg-[#02C39A] text-[#0A0E27] hover:shadow-[0_10px_30px_rgba(2,195,154,0.3)]"
                    }`}
                >
                  <span>{loading ? 'Processing...' : (mode === 'signup' ? 'Create Account' : 'Sign In')}</span>
                  {!loading && <ArrowRight size={20} />}
                </button>

                <div className="mt-8 text-center text-sm">
                  <span className="text-[#6B7A8F]">{mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}</span>
                  <button
                    type="button"
                    onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                    className="ml-2 text-[#02C39A] font-bold hover:underline"
                  >
                    {mode === 'signup' ? 'Log In' : 'Sign Up'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
