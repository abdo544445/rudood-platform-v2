import React, { useEffect, useState } from 'react';
import { 
  Bot, 
  Save, 
  Key, 
  ShieldCheck, 
  Power, 
  RefreshCw, 
  Sliders, 
  Sparkles, 
  Share2, 
  Eye, 
  EyeOff,
  Smartphone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { apiClient } from '../../services/apiClient';
import { useAuthStore } from '../../store/useAuthStore';
import { soundEngine } from '../../services/soundEngine';
import { PhoneSimulator } from '../../components/common/PhoneSimulator';
import { TokenMetrics } from '../../components/common/TokenMetrics';

export const BotSettingsPage: React.FC = () => {
  const { bot, fetchUser } = useAuthStore();
  const [showSimulator, setShowSimulator] = useState(false);
  
  // Bot Persona Settings
  const [formData, setFormData] = useState({
    name: '',
    bot_tone: 'friendly',
    welcome_message: '',
    system_prompt: '',
    is_active: true,
  });

  // AI Provider & Advanced Settings
  const [aiData, setAiData] = useState({
    ai_provider: 'gemini',
    model_type: 'gemini-1.5-flash',
    api_base_url: '',
    max_tokens: 1500,
    temperature: 0.7,
    api_key: '',
  });

  const [hasEncryptedKey, setHasEncryptedKey] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSavingBot, setIsSavingBot] = useState(false);
  const [isSavingAi, setIsSavingAi] = useState(false);
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  useEffect(() => {
    if (bot) {
      setFormData({
        name: bot.name || '',
        bot_tone: bot.bot_tone || 'friendly',
        welcome_message: bot.welcome_message || '',
        system_prompt: (bot as any).system_prompt || '',
        is_active: bot.is_active !== undefined ? bot.is_active : true,
      });

      setAiData({
        ai_provider: bot.ai_provider || 'gemini',
        model_type: bot.model_type || 'gemini-1.5-flash',
        api_base_url: (bot as any).api_base_url || '',
        max_tokens: (bot as any).max_tokens || 1500,
        temperature: (bot as any).temperature !== undefined ? Number((bot as any).temperature) : 0.7,
        api_key: '',
      });

      setHasEncryptedKey(Boolean((bot as any).api_key_encrypted || (bot as any).has_custom_key));
    }
  }, [bot]);

  const handleToggleActive = async () => {
    try {
      soundEngine.playClick();
      const nextState = !formData.is_active;
      setFormData((prev) => ({ ...prev, is_active: nextState }));
      const res = await apiClient.post('/bot/toggle', { is_active: nextState });
      if (res.data.success) {
        fetchUser();
        if (nextState) {
          toast.success('تم تفعيل المساعد الذكي بنجاح 🟢');
        } else {
          toast.info('تم إيقاف المساعد الذكي مؤقتاً ⏸');
        }
      }
    } catch {
      toast.error('تعذر تبديل حالة تشغيل البوت');
      setFormData((prev) => ({ ...prev, is_active: !prev.is_active }));
    }
  };

  const handleFetchModels = async () => {
    setIsFetchingModels(true);
    soundEngine.playClick();
    try {
      const res = await apiClient.get('/bot/models', {
        params: { provider: aiData.ai_provider },
      });
      if (res.data.success && Array.isArray(res.data.data)) {
        setAvailableModels(res.data.data);
        if (res.data.data.length > 0) {
          setAiData((prev) => ({ ...prev, model_type: res.data.data[0] }));
        }
        toast.success(`تم جلب ${res.data.data.length} نموذج متاح بنجاح`);
      }
    } catch {
      if (aiData.ai_provider === 'gemini') {
        setAvailableModels(['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash']);
      } else if (aiData.ai_provider === 'openai') {
        setAvailableModels(['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo']);
      } else if (aiData.ai_provider === 'anthropic') {
        setAvailableModels(['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307']);
      } else {
        setAvailableModels(['custom-model-v1', 'mistral-7b', 'llama-3.1-8b']);
      }
      toast.info('تم تحميل قائمة النماذج الموصى بها');
    } finally {
      setIsFetchingModels(false);
    }
  };

  const handleSaveBotPersona = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBot(true);
    try {
      soundEngine.playClick();
      const res = await apiClient.put('/bot/settings', {
        ...formData,
        ai_provider: aiData.ai_provider,
        model_type: aiData.model_type,
        api_base_url: aiData.api_base_url || undefined,
        max_tokens: aiData.max_tokens,
        temperature: aiData.temperature,
      });
      if (res.data.success) {
        soundEngine.playSuccess();
        toast.success('تم حفظ إعدادات وسلوك البوت بنجاح ✓');
        fetchUser();
      }
    } catch {
      toast.error('تعذر حفظ إعدادات البوت');
    } finally {
      setIsSavingBot(false);
    }
  };

  const handleSaveAiSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAi(true);
    try {
      soundEngine.playClick();
      
      const payload: any = {
        name: formData.name || 'مساعد ردود الذكي',
        bot_tone: formData.bot_tone || 'friendly',
        welcome_message: formData.welcome_message || 'أهلاً بك! كيف أقدر أساعدك؟',
        system_prompt: formData.system_prompt || '',
        ai_provider: aiData.ai_provider,
        model_type: aiData.model_type,
        api_base_url: aiData.api_base_url || undefined,
        max_tokens: aiData.max_tokens,
        temperature: aiData.temperature,
      };

      if (aiData.api_key && aiData.api_key.trim()) {
        payload.api_key = aiData.api_key.trim();
      }

      const res = await apiClient.put('/bot/settings', payload);
      if (res.data.success) {
        soundEngine.playSuccess();
        toast.success('تم حفظ إعدادات مزود الذكاء الاصطناعي وتشفير المفتاح بنجاح ✓');
        if (aiData.api_key.trim()) {
          setHasEncryptedKey(true);
          setAiData((prev) => ({ ...prev, api_key: '' }));
        }
        fetchUser();
      }
    } catch {
      toast.error('تعذر حفظ إعدادات الذكاء الاصطناعي ومفتاح الـ API');
    } finally {
      setIsSavingAi(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl font-['Cairo',sans-serif] pb-12">
      
      {/* ── Top Header Banner ────────────────────────────────────────────── */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase tracking-wider">
              AI ENGINE & BOT SETTINGS
            </span>
            <span className="text-xs text-slate-400">تخصيص الهوية وسياسات الرد والمزود</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <Bot className="w-6 h-6 text-amber-400" />
            <span>الإعدادات وتخصيص البوت</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">التحكم بسياسات الرد ونبرة المحادثة ومزود الذكاء الاصطناعي</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setShowSimulator(!showSimulator);
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
              showSimulator
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span>{showSimulator ? 'إخفاء شاشة الهاتف ✕' : 'معاينة حية على الهاتف 📱'}</span>
          </button>
        </div>
      </div>

      {/* ── Main Settings Grid (2 Cards: Persona & AI Provider) ──────────── */}
      <div className={`grid grid-cols-1 ${showSimulator ? 'xl:grid-cols-12' : 'lg:grid-cols-12'} gap-6 items-start`}>
        
        {/* ── Left Card (7 Cols): Bot Persona & Behavior ───────────────────── */}
        <div className={`${showSimulator ? 'xl:col-span-5' : 'lg:col-span-7'} p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-white/5 space-y-6 shadow-xl backdrop-blur-xl`}>
          
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <span>تخصيص سلوك البوت</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">تحكم بهوية المساعد ونصوص الترحيب وتفعيل الردود الذكية</p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                formData.is_active
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${formData.is_active ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                <span>{formData.is_active ? 'البوت مفعّل ونشط' : 'البوت معطّل'}</span>
              </span>

              <button
                type="button"
                onClick={handleToggleActive}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                title="تبديل تفعيل / إيقاف البوت فوراً"
              >
                <Power className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveBotPersona} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">اسم البوت (المساعد الذكي)</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">نبرة الحديث والتفاعل (Bot Tone)</label>
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

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">رسالة الترحيب الآلية الأوليّة</label>
              <textarea
                rows={3}
                required
                value={formData.welcome_message}
                onChange={(e) => setFormData({ ...formData, welcome_message: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">النظام الموجّه (System Prompt)</label>
              <textarea
                rows={4}
                value={formData.system_prompt}
                onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
                placeholder="حدد شخصية البوت، مجال عمله، سياسات الإرجاع، وسلوكه مع العملاء..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSavingBot}
                className="px-6 py-2.5 rounded-xl gold-btn text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingBot ? 'جاري الحفظ...' : 'حفظ إعدادات البوت ✓'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* ── Right Card (5 Cols): AI Provider & Model (Exact Replica of Design) ─ */}
        <div className={`${showSimulator ? 'xl:col-span-5' : 'lg:col-span-5'} space-y-6`}>
          
          {/* ── 1. مزود ونموذج الذكاء الاصطناعي Card ── */}
          <div className="p-6 md:p-7 rounded-3xl bg-[#0c1324]/90 border border-slate-800/80 shadow-2xl backdrop-blur-xl">
            
            {/* Card Header */}
            <div className="flex items-center justify-end gap-2.5 pb-4 border-b border-slate-800/60">
              <h3 className="text-base md:text-lg font-black text-white tracking-wide">
                مزود ونموذج الذكاء الاصطناعي
              </h3>
              <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400/20" />
            </div>

            {/* Provider Grid (2x2 Buttons) */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              {[
                { id: 'openai', label: 'OpenAI GPT-4o' },
                { id: 'gemini', label: 'Google Gemini' },
                { id: 'openai_compatible', label: 'Custom Endpoint' },
                { id: 'anthropic', label: 'Claude 3.5' },
              ].map((item) => {
                const isSelected = aiData.ai_provider === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      let defaultModel = 'gemini-1.5-flash';
                      if (item.id === 'openai') defaultModel = 'gpt-4o';
                      else if (item.id === 'anthropic') defaultModel = 'claude-3-5-sonnet-20241022';
                      else if (item.id === 'openai_compatible') defaultModel = 'custom-model-v1';

                      setAiData((prev) => ({
                        ...prev,
                        ai_provider: item.id,
                        model_type: defaultModel,
                      }));
                    }}
                    className={`py-3.5 px-4 rounded-2xl text-xs md:text-sm font-bold transition-all cursor-pointer text-center ${
                      isSelected
                        ? 'bg-[#f59e0b] text-slate-950 font-black shadow-lg shadow-amber-500/25 scale-[1.02]'
                        : 'bg-[#0a0f1d] hover:bg-[#11182d] border border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Model Name & Fetch Models Header */}
            <div className="flex items-center justify-between mt-6 mb-2">
              <button
                type="button"
                onClick={handleFetchModels}
                disabled={isFetchingModels}
                className="text-xs md:text-sm font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>جلب النماذج المتاحة</span>
                <RefreshCw className={`w-3.5 h-3.5 ${isFetchingModels ? 'animate-spin' : ''}`} />
              </button>

              <label className="text-xs md:text-sm font-bold text-slate-200">
                اسم النموذج (Model)
              </label>
            </div>

            {/* Model Input Container */}
            <div className="relative">
              {availableModels.length > 0 ? (
                <select
                  value={aiData.model_type}
                  onChange={(e) => setAiData((prev) => ({ ...prev, model_type: e.target.value }))}
                  className="w-full bg-[#080c18] border-2 border-amber-500 rounded-2xl p-3.5 text-sm md:text-base font-mono text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-left"
                  dir="ltr"
                >
                  {availableModels.map((m) => (
                    <option key={m} value={m} className="bg-slate-900 text-white">
                      {m}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  value={aiData.model_type}
                  onChange={(e) => setAiData((prev) => ({ ...prev, model_type: e.target.value }))}
                  placeholder="gemini-1.5-flash"
                  className="w-full bg-[#080c18] border-2 border-amber-500 rounded-2xl p-3.5 text-sm md:text-base font-mono text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-left placeholder:text-slate-500"
                  dir="ltr"
                />
              )}
            </div>

            {/* Base URL (when Custom Endpoint is selected) */}
            {aiData.ai_provider === 'openai_compatible' && (
              <div className="mt-4 pt-4 border-t border-slate-800/60 animate-fadeIn">
                <label className="block text-xs font-bold text-slate-300 mb-1.5 text-right">
                  Base URL للمزود (Custom API Base)
                </label>
                <input
                  type="url"
                  value={aiData.api_base_url}
                  onChange={(e) => setAiData((prev) => ({ ...prev, api_base_url: e.target.value }))}
                  placeholder="https://api.your-provider.com/v1"
                  className="w-full bg-[#080c18] border border-slate-800 rounded-2xl p-3 text-xs md:text-sm font-mono text-white focus:outline-none focus:border-amber-500 text-left"
                  dir="ltr"
                />
              </div>
            )}

            {/* Advanced Settings Accordion (Tokens & Temperature) */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800/60">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1 text-right">حد الرد (Max Tokens)</label>
                <input
                  type="number"
                  min="100"
                  max="8000"
                  step="100"
                  value={aiData.max_tokens}
                  onChange={(e) => setAiData((prev) => ({ ...prev, max_tokens: parseInt(e.target.value) || 1500 }))}
                  className="w-full bg-[#080c18] border border-slate-800 rounded-xl p-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500 text-center"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1 text-right">الإبداع (Temperature)</label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.05"
                  value={aiData.temperature}
                  onChange={(e) => setAiData((prev) => ({ ...prev, temperature: parseFloat(e.target.value) || 0.7 }))}
                  className="w-full bg-[#080c18] border border-slate-800 rounded-xl p-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500 text-center"
                />
              </div>
            </div>

            {/* Token Metrics Estimator */}
            <div className="mt-3">
              <TokenMetrics
                promptText={formData.system_prompt}
                replyText={formData.welcome_message}
                provider={aiData.ai_provider}
                model={aiData.model_type}
              />
            </div>

          </div>

          {/* ── 2. مفتاح الـ API المشفر (AES-256) Card ── */}
          <div className="p-6 md:p-7 rounded-3xl bg-[#0c1324]/90 border border-slate-800/80 shadow-2xl backdrop-blur-xl">
            
            {/* Card Header */}
            <div className="flex items-center justify-between pb-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>مشفّر</span>
              </span>

              <h3 className="text-base md:text-lg font-black text-amber-400 flex items-center gap-2">
                <span>مفتاح الـ API المشفر (AES-256)</span>
                <Key className="w-5 h-5 text-amber-400" />
              </h3>
            </div>

            {/* Description */}
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed text-right mt-1">
              يتم تشفير مفتاحك فورياً داخل قاعدة البيانات. املأ الحقل أدناه لتحديث المفتاح الخاص بمزودك المختار.
            </p>

            {/* API Key Input Field */}
            <div className="mt-4 bg-[#080c18] border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between gap-3 focus-within:border-amber-500 transition-colors">
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                title={showApiKey ? 'إخفاء المفتاح' : 'إظهار المفتاح'}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>

              <input
                type={showApiKey ? 'text' : 'password'}
                value={aiData.api_key}
                onChange={(e) => setAiData((prev) => ({ ...prev, api_key: e.target.value }))}
                placeholder={hasEncryptedKey ? '••••••••••••••••••••••••• ( املأ هنا للتحديث )' : '( املأ هنا لإدخال المفتاح وتشفيره )'}
                autoComplete="new-password"
                className="w-full bg-transparent border-none p-0 text-xs md:text-sm font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none text-right"
                dir="ltr"
              />
            </div>

            {/* Update and Encrypt Key Button */}
            <button
              type="button"
              onClick={handleSaveAiSettings}
              disabled={isSavingAi}
              className="w-full mt-4 py-3.5 rounded-2xl bg-[#7c5e28] hover:bg-[#926f30] text-amber-100 font-bold text-sm md:text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 border border-amber-600/30 cursor-pointer transition-all active:scale-[0.99]"
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>{isSavingAi ? 'جاري التحديث والتشفير...' : '✓ تحديث وتشفير المفتاح 🛡'}</span>
            </button>

          </div>

        </div>

        {/* ── 3rd Col: Optional Live Phone Simulator ── */}
        {showSimulator && (
          <div className="xl:col-span-3 flex flex-col items-center sticky top-24 self-start">
            <div className="w-full text-center mb-3">
              <span className="text-xs font-bold text-amber-300">📱 المعاينة التفاعلية المباشرة</span>
              <p className="text-[10px] text-slate-400">تحديث فوري لاسم المساعد والنبرة والرسائل</p>
            </div>
            <PhoneSimulator
              botName={formData.name || 'مساعد المتجر الذكي'}
              botTone={formData.bot_tone}
              welcomeMessage={formData.welcome_message}
            />
          </div>
        )}

      </div>

      {/* ── Omni-Channel Hub Banner (Exact Replica from settings.blade.php) ── */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-white/5 space-y-4 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xl shrink-0">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-white">مركز ربط القنوات والتكاملات (Omni-Channel Hub)</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                تم تخصيص صفحة مستقلة متكاملة لإدارة كافة قنوات التواصل لمتجرك مع مفاتيح تشغيل وإيقاف الردود بضغطة زر وفحص الاتصال.
              </p>
            </div>
          </div>

          <Link
            to="/channels"
            className="px-5 py-2.5 rounded-full gold-btn text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 shrink-0 self-start md:self-auto"
          >
            <span>إدارة وضبط كافة القنوات</span>
            <Share2 className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 text-base">🟢</span>
              <span className="text-xs font-bold text-slate-200">WhatsApp Cloud</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">جاهز</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sky-400 text-base">✈️</span>
              <span className="text-xs font-bold text-slate-200">Telegram Bot</span>
            </div>
            <span className="text-[10px] text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded-md">نشط</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-base">🌐</span>
              <span className="text-xs font-bold text-slate-200">Web Widget</span>
            </div>
            <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">مدمج</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-pink-400 text-base">📷</span>
              <span className="text-xs font-bold text-slate-200">Instagram Direct</span>
            </div>
            <span className="text-[10px] text-slate-400 font-bold bg-slate-800 px-2 py-0.5 rounded-md">إعداد</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default BotSettingsPage;

