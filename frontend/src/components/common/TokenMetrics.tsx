import React from 'react';
import { Cpu, Zap, Coins, Clock } from 'lucide-react';

interface TokenMetricsProps {
  promptText?: string;
  replyText?: string;
  latencyMs?: number | null;
  provider?: string;
  model?: string;
}

export const TokenMetrics: React.FC<TokenMetricsProps> = ({
  promptText = '',
  replyText = '',
  latencyMs = null,
  provider = 'gemini',
  model = 'gemini-1.5-flash',
}) => {
  // Approximate tokens: Arabic words ~1.5 tokens per word; English ~1.3 tokens
  const countTokens = (text: string) => {
    if (!text) return 0;
    const words = text.trim().split(/\s+/).length;
    return Math.round(words * 1.4);
  };

  const promptTokens = countTokens(promptText);
  const replyTokens = countTokens(replyText);
  const totalTokens = promptTokens + replyTokens;

  // Approximate cost per 1M tokens (Gemini Flash ~$0.075 / 1M, GPT-4o ~$2.50 / 1M)
  const isGpt = provider.includes('openai') || model.includes('gpt-4');
  const costPerToken = isGpt ? 0.000003 : 0.0000001;
  const estimatedCost = (totalTokens * costPerToken * 3.75).toFixed(5); // In SAR

  return (
    <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 flex flex-wrap items-center justify-between gap-3 text-[11px]">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
          <Cpu className="w-3.5 h-3.5" />
          <span>النموذج: <span className="text-slate-200 font-mono">{model}</span></span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-300">
          <Zap className="w-3.5 h-3.5 text-sky-400" />
          <span>الرموز (Tokens): <span className="text-amber-300 font-mono font-bold">{totalTokens}</span></span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {latencyMs !== null && (
          <div className="flex items-center gap-1 text-emerald-400 font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>{latencyMs} ms</span>
          </div>
        )}

        <div className="flex items-center gap-1 text-slate-400">
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span>التكلفة التقديرية: <span className="text-white font-mono font-bold">~{estimatedCost} ر.س</span></span>
        </div>
      </div>
    </div>
  );
};
