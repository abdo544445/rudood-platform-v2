import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Sliders, 
  Layers, 
  Bot, 
  Clock, 
  RotateCcw
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';

export const PlaygroundPage: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Inspector States
  const [lastChunks, setLastChunks] = useState<any[]>([]);
  const [lastLatency, setLastLatency] = useState<number | null>(null);
  const [systemPromptUsed, setSystemPromptUsed] = useState<string>('');

  // Overrides
  const [params, setParams] = useState({
    ai_provider: 'gemini',
    model_type: 'gemini-1.5-flash',
    temperature: 0.7,
    max_tokens: 500,
    bot_tone: 'friendly',
    system_prompt: 'أنت مساعد ذكاء اصطناعي محترف للمتجر يجيب بدقة ولطف.',
  });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    const newHistory = [...messages, { role: 'user', content: userText }];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const res = await apiClient.post('/playground/simulate', {
        message: userText,
        history: messages,
        enable_rag: true,
        overrides: params,
      });

      if (res.data.success) {
        const data = res.data.data;
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply, latency: data.latency_ms }]);
        setLastChunks(data.chunks || []);
        setLastLatency(data.latency_ms);
        setSystemPromptUsed(data.system_prompt_used || '');
      }
    } catch (e) {
      alert('حدث خطأ أثناء الاتصال بنموذج الذكاء الاصطناعي');
    } finally {
      setIsLoading(false);
    }
  };

  const resetSession = () => {
    setMessages([]);
    setLastChunks([]);
    setLastLatency(null);
    setSystemPromptUsed('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* ── 1. Center Simulator Chat Area ──────────────────────────────── */}
      <div className="flex-1 bg-slate-950/60 border border-white/5 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="h-14 px-6 border-b border-white/5 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>مختبر المحاكاة التفاعلي (AI Playground)</span>
          </div>

          <button
            onClick={resetSession}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>مسح الجلسة</span>
          </button>
        </div>

        {/* Simulator Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs text-center">
              <Bot className="w-12 h-12 text-slate-700 mb-3" />
              <p className="font-bold text-slate-400">ابدأ باختبار ذكاء البوت الآن</p>
              <p className="text-[11px] text-slate-600 mt-1 max-w-sm">
                اطرح أسئلة عن منتجات متجرك وسياسات الشحن لملاحظة استرجاع المعرفة بالـ RAG
              </p>
            </div>
          ) : (
            messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-end gap-2.5 ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                {m.role !== 'user' && (
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[10px] text-amber-400 order-2">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-slate-900 border border-slate-800 text-slate-100 rounded-br-none'
                      : 'bg-gradient-to-r from-amber-500/20 to-amber-600/15 border border-amber-500/30 text-amber-100 rounded-bl-none shadow-lg'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.content}</p>
                  {m.latency && (
                    <span className="block text-[9px] text-amber-400/70 mt-1.5 font-bold flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {m.latency}ms
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-amber-400 p-3">
              <div className="w-4 h-4 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
              <span>البوت يقوم بتحليل السؤال واسترجاع المعرفة...</span>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-slate-900/60 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب سؤالاً لاختبار البوت..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
          <button type="submit" disabled={isLoading} className="p-3 rounded-2xl gold-btn cursor-pointer">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* ── 2. Right Parameters & Inspector ─────────────────────────────── */}
      <div className="w-88 flex flex-col gap-4 overflow-y-auto">
        {/* Tuning Parameters Card */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/5 space-y-4">
          <h4 className="text-xs font-bold text-amber-300 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>ضبط معايير الذكاء الاصطناعي</span>
          </h4>

          {/* Provider & Model */}
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] text-slate-400 font-bold mb-1">مزود الخدمة</label>
              <select
                value={params.ai_provider}
                onChange={(e) => setParams({ ...params, ai_provider: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200"
              >
                <option value="gemini">Google Gemini 2.0</option>
                <option value="openai">OpenAI ChatGPT</option>
                <option value="anthropic">Anthropic Claude 3.5</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 font-bold mb-1">نبرة البوت (Tone)</label>
              <select
                value={params.bot_tone}
                onChange={(e) => setParams({ ...params, bot_tone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200"
              >
                <option value="friendly">ودودة ومرحبة (Friendly)</option>
                <option value="formal">رسمية واحترافية (Formal)</option>
                <option value="sales">تسويقية وإقناعية (Sales)</option>
              </select>
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 font-bold mb-1">
                <span>الإبداع (Temperature)</span>
                <span className="text-amber-400">{params.temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.1"
                value={params.temperature}
                onChange={(e) => setParams({ ...params, temperature: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* RAG Chunks Inspector Card */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/5 space-y-3 flex-1 flex flex-col">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-amber-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>مقاطع المعرفة المسترجعة (RAG Chunks)</span>
            </h4>
            {lastLatency && (
              <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                ⚡ {lastLatency}ms
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 max-h-60">
            {systemPromptUsed && (
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] text-slate-400">
                <span className="font-bold text-amber-400 block mb-1">الـ Prompt المستخدم:</span>
                <p className="line-clamp-2">{systemPromptUsed}</p>
              </div>
            )}
            {lastChunks.length === 0 ? (
              <p className="text-[11px] text-slate-500 text-center py-6">
                ستظهر هنا المقاطع المستخرجة من مستندات المعرفة مع نسبة التطابق
              </p>
            ) : (
              lastChunks.map((chunk, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-amber-500/20 text-[11px] space-y-1.5">
                  <div className="flex justify-between items-center text-amber-400 font-bold">
                    <span className="truncate max-w-[150px]">{chunk.file_name || 'مستند'}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      تطابق: {chunk.similarity_pct ?? 90}%
                    </span>
                  </div>
                  <p className="text-slate-300 line-clamp-3 leading-relaxed">{chunk.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
