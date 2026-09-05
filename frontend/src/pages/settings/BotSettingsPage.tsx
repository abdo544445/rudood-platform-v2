import React, { useEffect, useState } from 'react';
import { 
  Bot, 
  Save, 
  Key, 
  Shield, 
  Power, 
  RefreshCw, 
  Sliders, 
  Sparkles, 
  Share2, 
  Eye, 
  EyeOff
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import { useAuthStore } from '../../store/useAuthStore';

export const BotSettingsPage: React.FC = () => {
  const { bot, fetchUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    bot_tone: 'friendly',
    welcome_message: '',
    system_prompt: '',
    ai_provider: 'gemini',
    model_type: 'gemini-1.5-flash',
    api_base_url: '',
    max_tokens: 1500,
    temperature: 0.7,
    is_active: true,
  });

  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  useEffect(() => {
    if (bot) {
      setFormData({
        name: bot.name || '',
        bot_tone: bot.bot_tone || 'friendly',
        welcome_message: bot.welcome_message || '',
        system_prompt: (bot as any).system_prompt || '',
        ai_provider: bot.ai_provider || 'gemini',
        model_type: bot.model_type || 'gemini-1.5-flash',
        api_base_url: (bot as any).api_base_url || '',
        max_tokens: (bot as any).max_tokens || 1500,
        temperature: (bot as any).temperature !== undefined ? (bot as any).temperature : 0.7,
        is_active: bot.is_active !== undefined ? bot.is_active : true,
      });
    }
  }, [bot]);

  const handleToggleActive = async () => {
    try {
      const nextState = !formData.is_active;
      setFormData({ ...formData, is_active: nextState });
      const res = await apiClient.post('/bot/toggle', { is_active: nextState });
      if (res.data.success) {
        fetchUser();
      }
    } catch (e) {
      alert('تعذر تبديل حالة تشغيل البوت');
      setFormData({ ...formData, is_active: !formData.is_active });
    }
  };

  const handleFetchModels = async () => {
    setIsFetchingModels(true);
    try {
      const res = await apiClient.get('/bot/models', {
        params: { provider: formData.ai_provider },
      });
      if (res.data.success && Array.isArray(res.data.data)) {
        setAvailableModels(res.data.data);
        if (res.data.data.length > 0) {
          setFormData({ ...formData, model_type: res.data.data[0] });
        }
      }
    } catch (e) {
      // Fallback sensible models
      if (formData.ai_provider === 'gemini') {
        setAvailableModels(['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro']);
      } else if (formData.ai_provider === 'openai') {
        setAvailableModels(['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo']);
      } else if (formData.ai_provider === 'anthropic') {
        setAvailableModels(['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307']);
      } else {
        setAvailableModels(['custom-model-v1', 'mistral-7b', 'llama-3-8b']);
      }
    } finally {
      setIsFetchingModels(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await apiClient.put('/bot/settings', formData);
      if (res.data.success) {
        alert('تم حفظ وتحديث كافة إعدادات البوت بنجاح ✓');
        fetchUser();
      }
    } catch (e) {
      alert('تعذر حفظ الإعدادات');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    setIsSavingKey(true);
    try {
      const res = await apiClient.post('/bot/api-key', {
        api_key: apiKey,
        ai_provider: formData.ai_provider,
        model_type: formData.model_type,
      });
      if (res.data.success) {
        alert('تم تشفير وحفظ مفتاح الـ API بنجاح في قاعدة البيانات ✓');
        setApiKey('');
        fetchUser();
      }
    } catch (e) {
      alert('تعذر حفظ مفتاح الـ API');
    } finally {
      setIsSavingKey(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl font-['Cairo',sans-serif] pb-12">
      
      {/* ── Page Header & Instant Bot Toggle ─────────────────────────────── */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase tracking-wider">
              BOT ENGINE SETTINGS
            </span>
            <span className="text-xs text-slate-400">تخصيص الهوية والسياسات</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <Bot className="w-6 h-6 text-amber-400" />
            <span>إعدادات وتخصيص المساعد الذكي</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">التحكم بسياسات الرد ونبرة المحادثة ومزود الذكاء الاصطناعي</p>
        </div>

        {/* Master Power Switch */}
        <div className="flex items-center gap-3 bg-slate-950/80 p-2.5 px-4 rounded-2xl border border-white/10 shadow-inner">
          <div className="text-right">
            <div className="text-xs font-black text-white">حالة البوت</div>
            <div className="text-[10px] text-slate-400">
              {formData.is_active ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> مفعّل ونشط للعملاء
                </span>
              ) : (
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> إيقاف مؤقت (معطّل)
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleActive}
            className={`p-2.5 rounded-xl font-bold transition-all flex items-center gap-2 text-xs ${
              formData.is_active
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{formData.is_active ? 'تعطيل البوت' : 'تفعيل البوت'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── Left 2 Cols: Main Bot Persona & Behavior Form ──────────────── */}
        <form onSubmit={handleSaveSettings} className="lg:col-span-2 p-8 rounded-3xl bg-slate-900/80 border border-white/5 space-y-6 shadow-xl backdrop-blur-xl">
          <h3 className="text-base font-black text-white flex items-center gap-2 pb-4 border-b border-white/5">
            <Sliders className="w-5 h-5 text-amber-400" />
            <span>تخصيص سلوك وهوية البوت</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">اسم البوت (المساعد الذكي)</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">نبرة الحديث والأسلوب (Bot Tone)</label>
              <select
                value={formData.bot_tone}
                onChange={(e) => setFormData({ ...formData, bot_tone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="friendly">ودودة ومرحبة (Friendly) ⭐</option>
                <option value="formal">احترافية ورسمية (Formal)</option>
                <option value="sales">تسويقية ومحفزة للشراء (Sales)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">رسالة الترحيب الأولى للعميل</label>
            <textarea
              rows={2}
              required
              value={formData.welcome_message}
              onChange={(e) => setFormData({ ...formData, welcome_message: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              التوجيه الأساسي للشخصية (System Persona Prompt)
            </label>
            <textarea
              rows={4}
              value={formData.system_prompt}
              onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
              placeholder="حدد شخصية البوت، مجال عمله، سياسات الإرجاع، وسلوكه مع العملاء..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Sliders: Max Tokens & Temperature */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-2xl bg-slate-950/60 border border-white/5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-300">حد الرد (Max Tokens)</label>
                <span className="text-xs font-black text-amber-400 font-mono">{formData.max_tokens}</span>
              </div>
              <input
                type="range"
                min="200"
                max="4000"
                step="100"
                value={formData.max_tokens}
                onChange={(e) => setFormData({ ...formData, max_tokens: parseInt(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>200 (قصير)</span>
                <span>4000 (شامل)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-300">الإبداع والحرية (Temperature)</label>
                <span className="text-xs font-black text-amber-400 font-mono">{formData.temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0.0 (دقيق وحرفي)</span>
                <span>1.0 (إبداعي)</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={isSaving} className="px-6 py-3 rounded-xl gold-btn text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20">
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'جاري الحفظ...' : 'حفظ إعدادات البوت ✓'}</span>
            </button>
          </div>
        </form>

        {/* ── Right Col: AI Provider, Model Selection & Encrypted API Key ── */}
        <div className="space-y-6">
          
          {/* AI Provider & Model Card */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 space-y-4 shadow-xl backdrop-blur-xl">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>مزود ونموذج الذكاء الاصطناعي</span>
            </h4>

            {/* Provider Radio Pills */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'gemini', label: 'Google Gemini' },
                { id: 'openai', label: 'OpenAI GPT-4o' },
                { id: 'anthropic', label: 'Claude 3.5' },
                { id: 'openai_compatible', label: 'Custom Endpoint' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, ai_provider: p.id })}
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all text-center border ${
                    formData.ai_provider === p.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Model Input with Fetch Button */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">اسم النموذج (Model)</label>
                <button
                  type="button"
                  onClick={handleFetchModels}
                  disabled={isFetchingModels}
                  className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold"
                >
                  <RefreshCw className={`w-3 h-3 ${isFetchingModels ? 'animate-spin' : ''}`} />
                  <span>جلب النماذج المتاحة</span>
                </button>
              </div>

              {availableModels.length > 0 ? (
                <select
                  value={formData.model_type}
                  onChange={(e) => setFormData({ ...formData, model_type: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  {availableModels.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={formData.model_type}
                  onChange={(e) => setFormData({ ...formData, model_type: e.target.value })}
                  placeholder="مثال: gemini-1.5-flash, gpt-4o-mini"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              )}
            </div>

            {/* Base URL for Custom Endpoint */}
            {formData.ai_provider === 'openai_compatible' && (
              <div className="animate-fadeIn">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Base URL (API Base)</label>
                <input
                  type="url"
                  value={formData.api_base_url}
                  onChange={(e) => setFormData({ ...formData, api_base_url: e.target.value })}
                  placeholder="https://api.your-provider.com/v1"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            )}
          </div>

          {/* Encrypted API Key Card */}
          <form onSubmit={handleSaveApiKey} className="p-6 rounded-3xl bg-slate-900/80 border border-amber-500/20 space-y-4 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>مفتاح الـ API المشفّر (AES-256)</span>
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 flex items-center gap-1">
                <Shield className="w-3 h-3" /> مشفّر
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              يتم تشفير مفتاحك فورياً داخل قاعدة البيانات. املأ الحقل أدناه لتحديث المفتاح الخاص بمزودك المختار.
            </p>

            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="•••••••••••••••• (املأ هنا للتحديث)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 pr-10 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isSavingKey || !apiKey.trim()}
              className="w-full py-2.5 rounded-xl gold-btn text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              <Shield className="w-4 h-4" />
              <span>{isSavingKey ? 'جاري التشفير والحفظ...' : 'تحديث وتشفير المفتاح ✓'}</span>
            </button>
          </form>

          {/* Omni-Channel Hub Banner (Matching settings.blade.php) */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 space-y-3 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>مركز ربط القنوات والتكاملات</span>
              </span>
              <Link to="/channels" className="text-[11px] text-amber-400 hover:text-amber-300 font-bold">
                إدارة القنوات ←
              </Link>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              تحكم بجميع قنوات التواصل لمتجرك مع مفاتيح تشغيل وإيقاف الردود بضغطة زر.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2 rounded-xl bg-slate-950 border border-white/5 flex items-center gap-2">
                <span className="text-emerald-400 text-base">🟢</span>
                <span className="text-xs font-bold text-slate-200">WhatsApp</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-white/5 flex items-center gap-2">
                <span className="text-sky-400 text-base">✈️</span>
                <span className="text-xs font-bold text-slate-200">Telegram</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-white/5 flex items-center gap-2">
                <span className="text-amber-400 text-base">🌐</span>
                <span className="text-xs font-bold text-slate-200">Web Widget</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-white/5 flex items-center gap-2">
                <span className="text-pink-400 text-base">📷</span>
                <span className="text-xs font-bold text-slate-200">Instagram</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
