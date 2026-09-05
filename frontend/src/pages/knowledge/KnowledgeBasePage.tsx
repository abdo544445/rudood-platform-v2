import React, { useEffect, useState } from 'react';
import { 
  BookOpen, 
  Upload, 
  Trash2, 
  RefreshCw, 
  FileText, 
  Layers, 
  Plus, 
  Zap, 
  Sparkles, 
  ArrowUpRight, 
  HelpCircle, 
  MessageSquare,
  Bot
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';

export const KnowledgeBasePage: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [totalChunks, setTotalChunks] = useState(0);
  const [autoRules, setAutoRules] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'documents' | 'rules'>('documents');

  const [isUploading, setIsUploading] = useState(false);
  const [isReindexing, setIsReindexing] = useState(false);
  const [generatingFaqId, setGeneratingFaqId] = useState<number | null>(null);

  // New Rule Form
  const [newQuestion, setNewQuestion] = useState('');
  const [newKeywords, setNewKeywords] = useState('');
  const [newReply, setNewReply] = useState('');

  const fetchDocuments = async () => {
    try {
      const res = await apiClient.get('/knowledge-base/documents');
      if (res.data.success) {
        setDocuments(res.data.data.documents || []);
        setTotalChunks(res.data.data.total_chunks || 0);
      }
    } catch (e) {}
  };

  const fetchAutoRules = async () => {
    try {
      const res = await apiClient.get('/auto-rules');
      if (res.data.success) {
        setAutoRules(res.data.data || []);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchDocuments();
    fetchAutoRules();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const res = await apiClient.post('/knowledge-base/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        alert(res.data.message);
        fetchDocuments();
      }
    } catch (e: any) {
      alert(e.response?.data?.message || 'فشل رفع المستند وتدريب البوت');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDoc = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستند وكافة مقاطعه المتجهة؟')) return;
    try {
      await apiClient.delete(`/knowledge-base/documents/${id}`);
      fetchDocuments();
    } catch (e) {
      alert('تعذر حذف المستند');
    }
  };

  const handleReindex = async () => {
    setIsReindexing(true);
    try {
      const res = await apiClient.post('/knowledge-base/reindex');
      alert(res.data.message);
      fetchDocuments();
    } catch (e) {
      alert('تعذر إعادة الفهرسة');
    } finally {
      setIsReindexing(false);
    }
  };

  const handleGenerateFaq = async (docId: number) => {
    setGeneratingFaqId(docId);
    try {
      const res = await apiClient.post(`/knowledge-base/faq/${docId}`);
      if (res.data.success) {
        const faqs = res.data.data.faqs || [];
        alert(`تم بنجاح استخراج (${faqs.length}) سؤال وجواب بالذكاء الاصطناعي من المستند! سيتم تحديث القواعد تلقائياً.`);
        fetchAutoRules();
        setActiveTab('rules');
      }
    } catch (e) {
      alert('تعذر استخراج الأسئلة الشائعة من الملف');
    } finally {
      setGeneratingFaqId(null);
    }
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    try {
      await apiClient.post('/auto-rules', {
        question: newQuestion,
        keywords: newKeywords || newQuestion,
        reply: newReply,
      });
      setNewQuestion('');
      setNewKeywords('');
      setNewReply('');
      fetchAutoRules();
      alert('تمت إضافة وحفظ قاعدة الرد بنجاح ✓');
    } catch (e) {
      alert('تعذر إضافة القاعدة');
    }
  };

  const handleDeleteRule = async (id: number) => {
    if (!confirm('هل تريد حذف هذه القاعدة من قاعدة المعرفة؟')) return;
    try {
      await apiClient.delete(`/auto-rules/${id}`);
      fetchAutoRules();
    } catch (e) {
      alert('تعذر حذف القاعدة');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl font-['Cairo',sans-serif] pb-12">
      
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase tracking-wider">
              KNOWLEDGE BASE & RAG
            </span>
            <span className="text-xs text-slate-400">تدريب المتجهات وقواعد الرد</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <span>قاعدة المعرفة وتدريب الذكاء الاصطناعي</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">زود مساعدك ببيانات متجرك وكتالوج المنتجات للإجابة الدقيقة دون هلوسة</p>
        </div>

        <button
          onClick={handleReindex}
          disabled={isReindexing}
          className="px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 hover:border-amber-500/30 text-xs font-bold text-slate-200 flex items-center gap-2 transition-all shadow-md"
        >
          <RefreshCw className={`w-4 h-4 text-amber-400 ${isReindexing ? 'animate-spin' : ''}`} />
          <span>{isReindexing ? 'جاري الفهرسة...' : 'إعادة فهرسة المتجهات (Reindex)'}</span>
        </button>
      </div>

      {/* ── AI Playground Banner (Matching ai-manage.blade.php) ──────────── */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-slate-900/90 to-slate-900/80 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-2xl flex-shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-black text-white flex items-center gap-2">
              <span>مختبر الذكاء الاصطناعي المتطور (AI Playground Workbench)</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">PRO</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              اختبر ردود المساعد الذكي، عاين استرجاع المقاطع (RAG) مباشرة، واضبط المعاملات ونبرة الرد في بيئة تفاعلية.
            </p>
          </div>
        </div>
        <Link
          to="/playground"
          className="px-5 py-2.5 rounded-full gold-btn text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 flex-shrink-0"
        >
          <span>فتح المختبر الكامل</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ── Tabs Navigator ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'documents'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>المستندات والكتالوجات ({documents.length})</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-black/20">
            {totalChunks} مقطع
          </span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'rules'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>قواعد الرد والأسئلة الشائعة ({autoRules.length})</span>
        </button>
      </div>

      {/* ── Tab 1: Documents & Vector RAG ─────────────────────────────────── */}
      {activeTab === 'documents' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Upload Zone */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border-2 border-dashed border-amber-500/30 hover:border-amber-500/60 transition-all text-center group cursor-pointer relative shadow-xl backdrop-blur-xl">
            <input
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="max-w-md mx-auto space-y-3 pointer-events-none">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
              <h3 className="text-sm md:text-base font-bold text-white">
                {isUploading ? 'جاري رفع الملف وتدريب المتجهات...' : 'اضغط هنا لرفع الملف أو اسحبه إلى هنا'}
              </h3>
              <p className="text-xs text-slate-400">
                يدعم صيغ (PDF, DOCX, TXT) بحد أقصى 15 ميجابايت. يتم التقطيع والتضمين الدلالي تلقائياً.
              </p>
            </div>
          </div>

          {/* Uploaded Documents List */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 space-y-4 shadow-xl backdrop-blur-xl">
            <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>الملفات والمستندات المدربة حالياً ({documents.length})</span>
            </h4>

            {documents.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                لم يتم رفع أي مستندات تدريبية بعد. ارفع كتالوج منتجاتك لبدء التعلم الذكي.
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-amber-500/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-xs">
                        PDF
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{doc.file_name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{doc.created_at ? new Date(doc.created_at).toLocaleDateString('ar-EG') : 'حديثاً'}</span>
                          <span>•</span>
                          <span className="text-amber-400 font-bold">{(doc.chunks || []).length || 5} مقطع دلالي</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      {/* AI FAQ Button */}
                      <button
                        onClick={() => handleGenerateFaq(doc.id)}
                        disabled={generatingFaqId === doc.id}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        title="استخراج 5 أسئلة وأجوبة شائعة بالذكاء الاصطناعي"
                      >
                        <Sparkles className={`w-3.5 h-3.5 text-amber-400 ${generatingFaqId === doc.id ? 'animate-spin' : ''}`} />
                        <span>{generatingFaqId === doc.id ? 'جاري الاستخراج بالـ AI...' : 'استخراج أسئلة بالـ AI'}</span>
                      </button>

                      {/* Delete Doc Button */}
                      <button
                        onClick={() => handleDeleteDoc(doc.id)}
                        className="p-2 rounded-lg bg-slate-900 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-white/5 transition-colors"
                        title="حذف المستند"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ── Tab 2: Direct Q&A Rules Engine ─────────────────────────────────── */}
      {activeTab === 'rules' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Create Rule Form (Matching ai-manage.blade.php) */}
          <form onSubmit={handleCreateRule} className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-white/5 space-y-4 shadow-xl backdrop-blur-xl">
            <h3 className="text-sm md:text-base font-black text-white flex items-center gap-2 pb-3 border-b border-white/5">
              <Plus className="w-5 h-5 text-amber-400" />
              <span>إضافة سؤال وجواب مباشر لقاعدة المعرفة</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">السؤال المتوقع من العميل</label>
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="مثال: ما هي أوقات ومواعيد التوصيل لديكم؟"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  الكلمات المفتاحية للمطابقة الفورية <span className="text-slate-400 text-[10px]">(مفصولة بفاصلة)</span>
                </label>
                <input
                  type="text"
                  value={newKeywords}
                  onChange={(e) => setNewKeywords(e.target.value)}
                  placeholder="توصيل, مدة, شحن, اوقات, متى يوصل"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">الإجابة النموذجية للبوت</label>
              <textarea
                rows={3}
                required
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder="اكتب الإجابة الدقيقة التي سيرسلها المساعد للعميل مباشرة..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit" className="px-6 py-2.5 rounded-xl gold-btn text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20">
                <Plus className="w-4 h-4" />
                <span>حفظ السؤال وتحديث قاعدة المعرفة ✓</span>
              </button>
            </div>
          </form>

          {/* Rules List */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 space-y-4 shadow-xl backdrop-blur-xl">
            <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>القواعد والأسئلة الشائعة المحفوظة ({autoRules.length})</span>
            </h4>

            {autoRules.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                لا توجد قواعد رد محفوظة حالياً. أضف أسئلة متكررة بالأعلى أو استخرجها بالذكاء الاصطناعي من الكتالوج.
              </div>
            ) : (
              <div className="space-y-3">
                {autoRules.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 flex items-start justify-between gap-4 hover:border-amber-500/20 transition-all"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span className="text-xs font-bold text-white">
                          {r.question || r.keywords || 'قاعدة رد مباشر'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                          مفعّلة
                        </span>
                      </div>
                      
                      {r.keywords && (
                        <div className="flex flex-wrap gap-1 pr-6">
                          {String(r.keywords).split(',').map((kw: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 text-[10px] border border-white/5 font-mono">
                              {kw.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-slate-300 pr-6 leading-relaxed">
                        {r.reply || r.reply_template}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteRule(r.id)}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-white/5 transition-colors flex-shrink-0"
                      title="حذف القاعدة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
