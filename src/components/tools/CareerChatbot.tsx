
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, Bot, Sparkles } from 'lucide-react';
import { chatWithCareerMentor } from '../../lib/gemini-service';
import LoadingSpinner from '../ui/LoadingSpinner';

const CareerChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'model'; parts: { text: string }[] }[]>([
        { role: 'model', parts: [{ text: "Hi there! I'm your AI Career Mentor. I can help you with study schedules, career advice, or just clearing your doubts. What's on your mind today?" }] }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user' as const, parts: [{ text: input }] };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // NEW: Filter out the initial welcome message (or any leading model messages)
            // The API requires the conversation to start with a 'user' message.
            const historyForApi = messages
                .filter((_, index) => index > 0 || messages[0].role !== 'model')
                .map(m => ({ role: m.role, parts: m.parts }));

            const responseText = await chatWithCareerMentor(historyForApi, input);

            setMessages(prev => [...prev, { role: 'model', parts: [{ text: responseText }] }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', parts: [{ text: "I'm having trouble connecting right now. Please try again later." }] }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-[#028090] to-[#02C39A] rounded-full shadow-[0_0_30px_rgba(2,195,154,0.4)] flex items-center justify-center text-white"
            >
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-28 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-[#0A0E27] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-[#028090]/20 to-[#02C39A]/20 border-b border-white/10 flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-[#02C39A]/20 flex items-center justify-center text-[#02C39A]">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">AI Career Mentor</h3>
                                <p className="text-[10px] text-[#02C39A] font-bold uppercase tracking-widest flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-[#02C39A] mr-1 animate-pulse" />
                                    Online
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-grow overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user'
                                        ? 'bg-[#02C39A] text-[#0A0E27] rounded-br-none'
                                        : 'bg-white/5 text-white rounded-bl-none border border-white/10'
                                        }`}>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.parts[0].text}</p>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 rounded-2xl p-4 rounded-bl-none border border-white/10">
                                        <div className="flex space-x-2">
                                            <div className="w-2 h-2 bg-[#6B7A8F] rounded-full animate-bounce" />
                                            <div className="w-2 h-2 bg-[#6B7A8F] rounded-full animate-bounce delay-75" />
                                            <div className="w-2 h-2 bg-[#6B7A8F] rounded-full animate-bounce delay-150" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/10 bg-[#0A0E27]">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Ask for advice..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-12 text-white placeholder:text-white/20 focus:border-[#02C39A] outline-none"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || loading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[#02C39A] text-[#0A0E27] disabled:opacity-50 hover:opacity-90 transition-opacity"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CareerChatbot;
