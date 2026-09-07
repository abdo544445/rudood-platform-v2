import React, { useEffect, useState } from 'react';
import { Store, Link as LinkIcon, Power, CheckCircle2, ShieldAlert, Key, ShoppingBag } from 'lucide-react';
import { apiClient } from '../../../services/apiClient';

export const IntegrationsTab: React.FC = () => {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingProvider, setSavingProvider] = useState<string | null>(null);

  // Form states for each provider
  const [sallaKey, setSallaKey] = useState('');
  const [zidKey, setZidKey] = useState('');
  const [shopifyKey, setShopifyKey] = useState('');
  const [shopifyUrl, setShopifyUrl] = useState('');

  const fetchIntegrations = async () => {
    try {
      const res = await apiClient.get('/integrations');
      if (res.data.success) {
        setIntegrations(res.data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const getIntegration = (provider: string) => integrations.find(i => i.provider === provider);

  const handleSave = async (provider: string, data: any) => {
    setSavingProvider(provider);
    try {
      const res = await apiClient.post('/integrations', { provider, ...data });
      alert(res.data.message);
      fetchIntegrations();
      
      // Clear forms
      if (provider === 'salla') setSallaKey('');
      if (provider === 'zid') setZidKey('');
      if (provider === 'shopify') {
        setShopifyKey('');
        setShopifyUrl('');
      }
    } catch (e: any) {
      alert(e.response?.data?.message || 'تعذر الحفظ');
    } finally {
      setSavingProvider(null);
    }
  };

  const handleToggle = async (provider: string, currentStatus: boolean) => {
    try {
      await apiClient.post('/integrations', { provider, is_active: !currentStatus });
      fetchIntegrations();
    } catch (e) {
      alert('تعذر تبديل الحالة');
    }
  };

  const handleDisconnect = async (provider: string) => {
    if (!confirm('هل أنت متأكد من إلغاء الربط وحذف مفاتيح الـ API الخاصة بهذا المتجر؟')) return;
    try {
      const res = await apiClient.delete(`/integrations/${provider}`);
      alert(res.data.message);
      fetchIntegrations();
    } catch (e) {
      alert('تعذر إلغاء الربط');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400 text-xs">جاري تحميل بيانات الربط...</div>;
  }

  const salla = getIntegration('salla');
  const zid = getIntegration('zid');
  const shopify = getIntegration('shopify');

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-2 mb-4">
        <Store className="w-5 h-5 text-amber-400" />
        <h2 className="text-lg font-black text-white">الربط مع المتاجر الإلكترونية</h2>
      </div>
      <p className="text-xs text-slate-400 mb-8">
        قم بربط متجرك الإلكتروني للسماح للذكاء الاصطناعي بالبحث عن المنتجات، وتتبع الطلبات، والإجابة الدقيقة على استفسارات العملاء حول المخزون.
      </p>

      {/* Salla Integration */}
      <div className={`p-6 rounded-3xl border transition-all ${salla?.is_active ? 'bg-amber-500/5 border-amber-500/20' : 'bg-slate-900/80 border-white/5'}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                سلة (Salla)
                {salla?.has_api_key && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${salla.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                    {salla.is_active ? 'متصل ونشط' : 'متصل وموقوف'}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">تزامن المنتجات، تتبع الطلبات، وإنشاء السلات المتروكة.</p>
            </div>
          </div>
          
          {salla?.has_api_key && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggle('salla', salla.is_active)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  salla.is_active ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{salla.is_active ? 'إيقاف' : 'تفعيل'}</span>
              </button>
              <button
                onClick={() => handleDisconnect('salla')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all"
              >
                إلغاء الربط
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-white/5">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-300 mb-1.5">Salla Personal Token (Salla App)</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 right-3" />
                <input
                  type="password"
                  value={sallaKey}
                  onChange={(e) => setSallaKey(e.target.value)}
                  placeholder={salla?.has_api_key ? '•••••••••••••••• (محفوظ)' : 'أدخل مفتاح الربط الخاص بتطبيق سلة'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pr-10 pl-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => handleSave('salla', { api_key: sallaKey, is_active: true })}
                disabled={!sallaKey || savingProvider === 'salla'}
                className="px-6 py-2.5 h-[42px] rounded-xl bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 text-xs font-bold border border-teal-500/30 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <LinkIcon className="w-4 h-4" />
                <span>{savingProvider === 'salla' ? 'جاري الحفظ...' : 'حفظ وربط'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Shopify Integration */}
      <div className={`p-6 rounded-3xl border transition-all ${shopify?.is_active ? 'bg-amber-500/5 border-amber-500/20' : 'bg-slate-900/80 border-white/5'}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#96bf48]/10 border border-[#96bf48]/20 flex items-center justify-center">
              <Store className="w-6 h-6 text-[#96bf48]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                شوبيفاي (Shopify)
                {shopify?.has_api_key && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${shopify.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                    {shopify.is_active ? 'متصل ونشط' : 'متصل وموقوف'}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">تزامن المنتجات، تتبع الطلبات من خلال Shopify Storefront API.</p>
            </div>
          </div>
          
          {shopify?.has_api_key && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggle('shopify', shopify.is_active)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  shopify.is_active ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{shopify.is_active ? 'إيقاف' : 'تفعيل'}</span>
              </button>
              <button
                onClick={() => handleDisconnect('shopify')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all"
              >
                إلغاء الربط
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1.5">Store URL (e.g., https://my-store.myshopify.com)</label>
              <input
                type="text"
                value={shopifyUrl}
                onChange={(e) => setShopifyUrl(e.target.value)}
                placeholder={shopify?.store_url || 'https://...'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-100 focus:outline-none focus:border-[#96bf48]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1.5">Shopify Admin Access Token</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 right-3" />
                <input
                  type="password"
                  value={shopifyKey}
                  onChange={(e) => setShopifyKey(e.target.value)}
                  placeholder={shopify?.has_api_key ? '•••••••••••••••• (محفوظ)' : 'shpat_...'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pr-10 pl-3 text-xs text-slate-100 focus:outline-none focus:border-[#96bf48]"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => handleSave('shopify', { api_key: shopifyKey, store_url: shopifyUrl, is_active: true })}
              disabled={(!shopifyKey && !shopifyUrl) || savingProvider === 'shopify'}
              className="px-6 py-2.5 h-[42px] rounded-xl bg-[#96bf48]/20 text-[#96bf48] hover:bg-[#96bf48]/30 text-xs font-bold border border-[#96bf48]/30 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <LinkIcon className="w-4 h-4" />
              <span>{savingProvider === 'shopify' ? 'جاري الحفظ...' : 'حفظ وربط'}</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
