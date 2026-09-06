import React, { useEffect, useState } from 'react';
import { 
  Share2, 
  MessageCircle, 
  Send, 
  Camera, 
  Globe, 
  Save,
  Smartphone
} from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '../../services/apiClient';
import { soundEngine } from '../../services/soundEngine';
import { SpotlightCard } from '../../components/common/SpotlightCard';
import { PhoneSimulator, type ChannelPlatform } from '../../components/common/PhoneSimulator';

export const ChannelsPage: React.FC = () => {
  const [channels, setChannels] = useState<any>({});
  const [showSimulator, setShowSimulator] = useState(false);
  const [selectedSimulatorPlatform] = useState<ChannelPlatform>('whatsapp');
  const [widgetConfig, setWidgetConfig] = useState<any>({
    widget_color: '#d4af37',
    widget_position: 'right',
    widget_greeting: 'أهلاً بك في متجرنا! كيف أقدر أساعدك اليوم؟',
    workspace_id: 1,
  });

  // Forms state
  const [waForm, setWaForm] = useState({ access_token: '', phone_number_id: '', verify_token: 'rudood_whatsapp_secret' });
  const [tgForm, setTgForm] = useState({ bot_token: '', bot_username: '' });
  const [igForm, setIgForm] = useState({ instagram_account_id: '', page_access_token: '', verify_token: 'rudood_ig_secret', auto_reply_comments: true });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchChannels = async () => {
    try {
      const [chRes, wRes] = await Promise.all([
        apiClient.get('/channels'),
        apiClient.get('/channels/widget/config'),
      ]);
      if (chRes.data.success) {
        setChannels(chRes.data.data || {});
        if (chRes.data.data?.whatsapp) {
          setWaForm({
            access_token: chRes.data.data.whatsapp.access_token || '',
            phone_number_id: chRes.data.data.whatsapp.phone_number_id || '',
            verify_token: chRes.data.data.whatsapp.verify_token || 'rudood_whatsapp_secret',
          });
        }
        if (chRes.data.data?.telegram) {
          setTgForm({
            bot_token: chRes.data.data.telegram.bot_token || '',
            bot_username: chRes.data.data.telegram.bot_username || '',
          });
        }
        if (chRes.data.data?.instagram) {
          setIgForm({
            instagram_account_id: chRes.data.data.instagram.instagram_account_id || '',
            page_access_token: chRes.data.data.instagram.page_access_token || '',
            verify_token: chRes.data.data.instagram.verify_token || 'rudood_ig_secret',
            auto_reply_comments: Boolean(chRes.data.data.instagram.auto_reply_comments),
          });
        }
      }
      if (wRes.data.success) {
        setWidgetConfig(wRes.data.data || {});
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const handleToggle = async (platform: string) => {
    // Optimistic toggle in local state for instant feedback
    setChannels((prev: any) => {
      const current = prev[platform] || {};
      return {
        ...prev,
        [platform]: {
          ...current,
          is_active: !current.is_active,
        },
      };
    });

    try {
      soundEngine.playClick();
      const res = await apiClient.post(`/channels/${platform}/toggle`);
      if (res.data.success) {
        soundEngine.playSuccess();
        toast.success(res.data.message || 'تم تحديث حالة القناة بنجاح ✓');
        fetchChannels();
      }
    } catch (e) {
      toast.error('تعذر تبديل حالة القناة');
      fetchChannels(); // Revert back on error
    }
  };

  const handleSaveConnect = async (platform: string, payload: any) => {
    setIsSaving(true);
    try {
      soundEngine.playClick();
      const res = await apiClient.post(`/channels/${platform}/connect`, payload);
      if (res.data.success) {
        soundEngine.playSuccess();
        toast.success(res.data.message || 'تم حفظ وربط بيانات القناة بنجاح ✓');
        fetchChannels();
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'تعذر حفظ إعدادات القناة');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveWidget = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      soundEngine.playClick();
      const res = await apiClient.post('/channels/widget/config', widgetConfig);
      if (res.data.success) {
        soundEngine.playSuccess();
        toast.success('تم حفظ وتحديث تخصيص الويدجت بنجاح ✓');
        fetchChannels();
      }
    } catch (e) {
      toast.error('تعذر حفظ إعدادات الويدجت');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    soundEngine.playClick();
    toast.success('تم نسخ الرمز إلى الحافظة بنجاح ✓');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const widgetEmbedCode = `<script src="http://localhost:8000/widget.js" data-workspace="${widgetConfig?.workspace_id || 1}" data-color="${widgetConfig?.widget_color || '#d4af37'}" data-position="${widgetConfig?.widget_position || 'right'}"></script>`;

  return (
    <div className="space-y-8 font-['Cairo',sans-serif] pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-400" />
            <span>مركز قنوات التواصل الموحد (Omni-Channel Hub)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            أدر كافة قنوات التواصل لمتجرك وفعل أو عطل الردود الآلية لكل قناة مع معاينة حية على الهاتف
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setShowSimulator(!showSimulator);
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer self-start sm:self-auto ${
            showSimulator
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/10'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4 text-amber-400" />
          <span>{showSimulator ? 'إخفاء شاشة الهاتف ✕' : 'معاينة القنوات على الهاتف 📱'}</span>
        </button>
      </div>

      {/* Optional Interactive Phone Simulator Drawer */}
      {showSimulator && (
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-amber-500/20 flex flex-col items-center justify-center animate-fadeIn">
          <div className="text-center mb-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>المعاينة الحية لقنوات التواصل</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">اختر القناة من أعلى شاشة الهاتف وجرّب إرسال رسائل حية</p>
          </div>
          <PhoneSimulator
            initialPlatform={selectedSimulatorPlatform}
            widgetColor={widgetConfig?.widget_color || '#d4af37'}
            welcomeMessage={widgetConfig?.widget_greeting}
          />
        </div>
      )}

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 🟢 1. WhatsApp Cloud API Card */}
        <SpotlightCard className="p-6 bg-slate-900/80 border border-white/5 space-y-4" spotlightColor="rgba(37, 211, 102, 0.14)">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">واتساب كلاود (WhatsApp Cloud API)</h4>
                <p className="text-[11px] text-slate-400">الربط الرسمي المباشر مع منصة Meta للأعمال</p>
              </div>
            </div>

            <button
              onClick={() => handleToggle('whatsapp')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                channels.whatsapp?.is_active
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {channels.whatsapp?.is_active ? '✓ مفعل (ON)' : '✕ معطل (OFF)'}
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveConnect('whatsapp', waForm);
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-[11px] text-slate-300 font-bold mb-1">Permanent Access Token (رمز الوصول الدائم)</label>
              <input
                type="password"
                value={waForm.access_token}
                onChange={(e) => setWaForm({ ...waForm, access_token: e.target.value })}
                placeholder="EAA..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-300 font-bold mb-1">Phone Number ID (معرف الرقم)</label>
                <input
                  type="text"
                  value={waForm.phone_number_id}
                  onChange={(e) => setWaForm({ ...waForm, phone_number_id: e.target.value })}
                  placeholder="1029384756..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 font-bold mb-1">Verify Token (رمز التحقق)</label>
                <input
                  type="text"
                  value={waForm.verify_token}
                  onChange={(e) => setWaForm({ ...waForm, verify_token: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Webhook Copy Box */}
            <div className="p-3 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-300 block font-bold">رابط الـ Webhook للإدخال في Meta:</span>
                <span className="text-[11px] font-mono text-slate-400">http://localhost:8000/api/webhook/whatsapp</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('http://localhost:8000/api/webhook/whatsapp', 'wa')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 text-[10px] font-bold border border-white/5 cursor-pointer"
              >
                {copiedKey === 'wa' ? 'تم النسخ ✓' : 'نسخ'}
              </button>
            </div>

            <div className="flex justify-end pt-1">
              <button type="submit" disabled={isSaving} className="px-5 py-2.5 rounded-xl gold-btn text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                <Save className="w-3.5 h-3.5" />
                <span>حفظ إعدادات واتساب</span>
              </button>
            </div>
          </form>
        </SpotlightCard>

        {/* 🔵 2. Telegram Bot Card */}
        <SpotlightCard className="p-6 bg-slate-900/80 border border-white/5 space-y-4" spotlightColor="rgba(36, 129, 204, 0.14)">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">بوت تليجرام (Telegram Bot)</h4>
                <p className="text-[11px] text-slate-400">ربط مباشر وسريع عبر توكن BotFather</p>
              </div>
            </div>

            <button
              onClick={() => handleToggle('telegram')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                channels.telegram?.is_active
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {channels.telegram?.is_active ? '✓ مفعل (ON)' : '✕ معطل (OFF)'}
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveConnect('telegram', tgForm);
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-[11px] text-slate-300 font-bold mb-1">Bot Token (توكن البوت من @BotFather)</label>
              <input
                type="password"
                value={tgForm.bot_token}
                onChange={(e) => setTgForm({ ...tgForm, bot_token: e.target.value })}
                placeholder="8698938459:AAEnsn9z..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 font-bold mb-1">معرف البوت (Bot Username)</label>
              <input
                type="text"
                value={tgForm.bot_username}
                onChange={(e) => setTgForm({ ...tgForm, bot_username: e.target.value })}
                placeholder="@MyStoreBot"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-white/5 text-[11px] text-slate-400">
              ⚡ الاستماع الحي (Polling) مفعل تلقائياً على السيرفر للاستجابة الفورية
            </div>

            <div className="flex justify-end pt-1">
              <button type="submit" disabled={isSaving} className="px-5 py-2.5 rounded-xl gold-btn text-xs font-bold flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5" />
                <span>حفظ إعدادات تليجرام</span>
              </button>
            </div>
          </form>
        </SpotlightCard>

        {/* 🟡 3. Web Live Chat Widget Card */}
        <SpotlightCard className="p-6 bg-slate-900/80 border border-white/5 space-y-4" spotlightColor="rgba(212, 175, 55, 0.14)">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">ودجت المحادثة المباشرة (Web Widget)</h4>
                <p className="text-[11px] text-slate-400">ودجت عائم يضاف لمتاجر سلة، زد، وشوبيفاي</p>
              </div>
            </div>

            <button
              onClick={() => handleToggle('web')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                channels.web?.is_active
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {channels.web?.is_active ? '✓ مفعل (ON)' : '✕ معطل (OFF)'}
            </button>
          </div>

          {/* 1-Line Embed Code */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/20 space-y-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-amber-300 font-bold">كود التضمين في متجرك (سطر واحد فقط):</span>
              <button
                type="button"
                onClick={() => handleCopy(widgetEmbedCode, 'script')}
                className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-bold"
              >
                {copiedKey === 'script' ? 'تم النسخ ✓' : 'نسخ الكود'}
              </button>
            </div>
            <code className="text-[10px] text-slate-300 font-mono block overflow-x-auto p-2 rounded-xl bg-slate-900">
              {widgetEmbedCode}
            </code>
          </div>

          <form onSubmit={handleSaveWidget} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-300 font-bold mb-1">لون الودجت الأساسي</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={widgetConfig.widget_color || '#d4af37'}
                    onChange={(e) => setWidgetConfig({ ...widgetConfig, widget_color: e.target.value })}
                    className="w-10 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono text-slate-300">{widgetConfig.widget_color}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 font-bold mb-1">موقع ظهور الودجت</label>
                <select
                  value={widgetConfig.widget_position || 'right'}
                  onChange={(e) => setWidgetConfig({ ...widgetConfig, widget_position: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100"
                >
                  <option value="right">أسفل اليمين (Right)</option>
                  <option value="left">أسفل اليسار (Left)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 font-bold mb-1">رسالة الترحيب الأولى للزائر</label>
              <input
                type="text"
                value={widgetConfig.widget_greeting || ''}
                onChange={(e) => setWidgetConfig({ ...widgetConfig, widget_greeting: e.target.value })}
                placeholder="أهلاً بك في متجرنا! كيف أقدر أساعدك اليوم؟"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button type="submit" disabled={isSaving} className="px-5 py-2.5 rounded-xl gold-btn text-xs font-bold flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5" />
                <span>حفظ تخصيص الودجت</span>
              </button>
            </div>
          </form>
        </SpotlightCard>

        {/* 🟣 4. Instagram Direct Card */}
        <SpotlightCard className="p-6 bg-slate-900/80 border border-white/5 space-y-4" spotlightColor="rgba(225, 48, 108, 0.14)">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">إنستغرام دايركت والتعليقات (Instagram)</h4>
                <p className="text-[11px] text-slate-400">الرد الآلي على رسائل الخاص والتعليقات</p>
              </div>
            </div>

            <button
              onClick={() => handleToggle('instagram')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                channels.instagram?.is_active
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {channels.instagram?.is_active ? '✓ مفعل (ON)' : '✕ معطل (OFF)'}
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveConnect('instagram', igForm);
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-[11px] text-slate-300 font-bold mb-1">Instagram Business Account ID</label>
              <input
                type="text"
                value={igForm.instagram_account_id}
                onChange={(e) => setIgForm({ ...igForm, instagram_account_id: e.target.value })}
                placeholder="17841400..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-300 font-bold mb-1">Page Access Token</label>
                <input
                  type="password"
                  value={igForm.page_access_token}
                  onChange={(e) => setIgForm({ ...igForm, page_access_token: e.target.value })}
                  placeholder="EAA..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 font-bold mb-1">Verify Token</label>
                <input
                  type="text"
                  value={igForm.verify_token}
                  onChange={(e) => setIgForm({ ...igForm, verify_token: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>
            </div>

            {/* Auto Comments Switch */}
            <div className="p-3 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-between">
              <span className="text-xs text-white font-bold">أتمتة الرد على التعليقات في المنشورات</span>
              <input
                type="checkbox"
                checked={igForm.auto_reply_comments}
                onChange={(e) => setIgForm({ ...igForm, auto_reply_comments: e.target.checked })}
                className="accent-amber-500 w-4 h-4"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button type="submit" disabled={isSaving} className="px-5 py-2.5 rounded-xl gold-btn text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                <Save className="w-3.5 h-3.5" />
                <span>حفظ إعدادات إنستغرام</span>
              </button>
            </div>
          </form>
        </SpotlightCard>

      </div>
    </div>
  );
};
