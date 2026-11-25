import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  Bot,
  Loader2,
  Mail,
  MessageCircle,
  Send,
  X,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export const SUGGESTED_QUESTIONS = [
  'What are his core AI/ML skills & notice period?',
  'Can he build a WhatsApp bot for my business?',
  'What projects has he built & how do I hire him?',
] as const;

interface AskMyAiPanelProps {
  messages: ChatMessage[];
  input: string;
  isLoading: boolean;
  error: string | null;
  onInputChange: (val: string) => void;
  onSend: (question?: string) => void;
  whatsappUrl: string;
  email: string;
  compact?: boolean;
  onClose?: () => void;
}

export function AskMyAiPanel({
  messages,
  input,
  isLoading,
  error,
  onInputChange,
  onSend,
  whatsappUrl,
  email,
  compact = false,
  onClose,
}: AskMyAiPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend();
  };

  return (
    <div className="flex flex-col h-full bg-[#090B14] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between gap-3 bg-[#0C0F1C]/90">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl border border-violet-500/35 bg-violet-500/10 flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 text-violet-400" aria-hidden="true" />
          </div>
          <div>
            <p className="font-display text-sm font-semibold text-white">
              Ask My AI
            </p>
            <p className="text-xs text-slate-400">
              Grounded in Abhinandan&apos;s verified portfolio &amp; resume
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Ask My AI chat"
            className="w-8 h-8 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto px-5 py-4 space-y-4 ${
          compact ? 'max-h-[300px] min-h-[220px]' : 'max-h-[360px] min-h-[250px]'
        }`}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-violet-600 text-white font-medium'
                  : 'border border-white/[0.08] bg-white/[0.04] text-slate-200'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs text-slate-300">
              <Loader2 className="w-3.5 h-3.5 text-violet-400 animate-spin" aria-hidden="true" />
              Checking portfolio context...
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-200 space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{error}</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/35 text-emerald-200 hover:bg-emerald-500/30 transition-colors"
              >
                <MessageCircle className="w-3 h-3" aria-hidden="true" />
                WhatsApp
              </a>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-slate-200 hover:bg-white/15 transition-colors"
              >
                <Mail className="w-3 h-3" aria-hidden="true" />
                Email
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Question Chips + Input */}
      <div className="px-5 py-4 border-t border-white/[0.08] bg-[#070912]/90 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              disabled={isLoading}
              onClick={() => onSend(q)}
              className="px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/[0.08] hover:bg-violet-500/20 hover:border-violet-400/50 text-xs text-violet-200 transition-colors disabled:opacity-50 cursor-pointer text-left"
            >
              {q}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Ask about projects, WhatsApp bots, or hiring..."
            maxLength={500}
            aria-label="Ask a question about Abhinandan"
            className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-400/60 transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/30 disabled:text-slate-400 text-white font-medium transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
}

interface FloatingAskAiWidgetProps {
  messages: ChatMessage[];
  input: string;
  isLoading: boolean;
  error: string | null;
  onInputChange: (val: string) => void;
  onSend: (question?: string) => void;
  whatsappUrl: string;
  email: string;
}

export function FloatingAskAiWidget(props: FloatingAskAiWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-[calc(100vw-2.5rem)] sm:w-[390px] animated-gradient-border shadow-2xl shadow-black/70"
          >
            <AskMyAiPanel
              {...props}
              compact
              onClose={() => setIsOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold shadow-xl shadow-violet-600/30 transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
      >
        <Bot className="w-4 h-4" aria-hidden="true" />
        <span>{isOpen ? 'Close AI' : 'Ask My AI'}</span>
      </button>
    </div>
  );
}
