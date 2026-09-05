import React, { useState } from 'react';
import { 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Share2, 
  Check, 
  Sparkles, 
  Calendar, 
  Tag, 
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { AmbientCanvas } from '../../components/common/AmbientCanvas';

interface ArticleItem {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  content: string[];
}

export const BlogPage: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const articles: ArticleItem[] = [
    {
      id: 1,
      title: 'كيف ترفع مبيعات متجرك بنسبة 35% عبر الردود التفاعلية في واتساب؟',
      excerpt: 'دليل عملي لكيفية استخدام الأزرار الذكية وكتالوج المنتجات لاسترجاع السلات المتروكة وإتمام الدفع السريع.',
      category: 'استراتيجيات التجارة',
      readTime: '4 دقائق',
      date: '1 سبتمبر 2026',
      content: [
        'يعتبر تطبيق واتساب أكثر قنوات التواصل استخداماً وقرباً من العميل في منطقتنا العربية. وعندما يقترن هذا القرب بالأتمتة التفاعلية الذكية (Interactive WhatsApp Automation)، تصبح النتائج مضاعفة لمبيعات المتاجر الإلكترونية.',
        'أولاً: أزرار الرد السريع (Quick Reply Buttons): تظهر الدراسات أن إعطاء العميل خيارات محددة مثل "🛒 إتمام الطلب الآن" أو "🚚 تتبع شحنتي" يرفع معدل التحويل بمقدار 3 أضعاف مقارنة بطلب كتابة نص حر.',
        'ثانياً: استرجاع السلات المتروكة فورياً: بمجرد مغادرة العميل للمتجر دون إتمام الدفع، يتم تفعيل تنبيه مخصص على واتساب بعد 30 دقيقة يحمل زر مباشر للدفع بخصم ترحيبي.',
        'ثالثاً: كتالوج المنتجات التفاعلي: تصفح المنتجات وصورها وقوائم الأسعار مباشرة داخل نافذة المحادثة دون الحاجة للخروج من التطبيق، مما يقلل الاحتكاك الشرائي إلى الصفر.'
      ],
    },
    {
      id: 2,
      title: 'ما هي تقنية Vector RAG ولماذا هي مستقبل خدمة العملاء بالذكاء الاصطناعي؟',
      excerpt: 'شرح مبسط لكيفية تدريب البوت على كتالوج متجرك بدون أي أخطاء أو اختلاق إجابات خارج نطاق المنتجات.',
      category: 'تقنية وذكاء اصطناعي',
      readTime: '6 دقائق',
      date: '28 أغسطس 2026',
      content: [
        'تعتمد أنظمة خدمة العملاء التقليدية على الكلمات المفتاحية الثابتة (Rule-based)، مما يؤدي إلى فشلها عند صياغة العميل لسؤاله بطريقة غير متوقعة. هنا يأتي دور تقنية استرجاع البيانات المعززة بالمتجهات (Retrieval-Augmented Generation).',
        'كيف تعمل التقنية داخل منصة ردود؟ عند رفع ملفات متجرك أو كتالوج منتجاتك (PDF أو DOCX)، يتم تقطيع المستند إلى مقاطع دلالية (Chunks) وتحويلها إلى متجهات رياضية عبر نماذج التضمين (Embeddings).',
        'عندما يطرح العميل سؤالاً مثل: "هل الشحن يشمل ضواحي الرياض؟"، يقوم النظام بالبحث الدلالي عالي السرعة باستخدام تشابه جيب التمام (Cosine Similarity)، واستخراج الإجابة الحصرية من كتالوج متجرك وتمريرها للنموذج اللغوي لصياغتها بلهجة ودودة ومرحبة.',
        'النتيجة: إجابات دقيقة بنسبة 100% مستندة حصراً إلى سياسات متجرك دون أي هلوسة (Hallucination) أو اختلاق لمعلومات غير صحيحة.'
      ],
    },
    {
      id: 3,
      title: 'أفضل الممارسات لربط WhatsApp Cloud API الرسمي وتجنب حظر الأرقام',
      excerpt: 'كل ما تحتاج معرفته عن سياسات Meta المعتمدة، قوالب الرسائل، وتأمين رقم متجرك للأعمال التجارية.',
      category: 'أدلة التشغيل',
      readTime: '5 دقائق',
      date: '24 أغسطس 2026',
      content: [
        'إن استخدام روبوتات غير رسمية أو غير معتمدة على واتساب يعرّض رقم متجرك للحظر الفوري وفقدان التواصل مع عملائك. تضمن لك منصة ردود الربط الرسمي بنسبة 100% عبر Meta Cloud API.',
        'أهم إرشادات حماية رقم متجرك التجاري:',
        '1. التحقق من مدير الأعمال (Meta Business Manager): تأكد من توثيق علامتك التجارية وربط السجل التجاري للحصول على علامة التوثيق الخضراء.',
        '2. اعتماد قوالب الرسائل التسويقية: لا ترسل رسائل تسويقية للعملاء دون استخدام القوالب المعتمدة رسمياً (Approved Meta Message Templates).',
        '3. الحفاظ على تقييم الجودة (Quality Rating): راقب مؤشر الجودة في لوحة تحكم ردود وتأكد من بقائه باللون الأخضر (High Quality) عبر تجنب الإرسال العشوائي.'
      ],
    },
  ];

  const handleShare = (platform: 'whatsapp' | 'twitter' | 'copy', article: ArticleItem) => {
    const url = window.location.href;
    const text = `${article.title} - عبر مدونة منصة ردود`;
    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d19] text-slate-100 relative font-['Cairo',sans-serif]">
      <AmbientCanvas />
      <PublicNavbar />

      <main className="relative pt-36 pb-20 px-6 max-w-7xl mx-auto z-10">
        
        {/* ── Single Article View (Matching articlel.blade.php) ──────────── */}
        {selectedArticle ? (
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            {/* Back Button */}
            <button
              onClick={() => setSelectedArticle(null)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-slate-800 transition-all shadow-lg"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لجميع المقالات</span>
            </button>

            {/* Article Header Card */}
            <div className="p-8 md:p-12 rounded-3xl bg-slate-900/90 border border-white/5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-4">
                <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  {selectedArticle.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  {selectedArticle.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {selectedArticle.readTime}
                </span>
              </div>

              <h1 className="text-2xl md:text-4xl font-black text-white leading-tight mb-6">
                {selectedArticle.title}
              </h1>

              {/* Decorative Banner */}
              <div className="w-full py-12 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 text-center my-6">
                <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-2 animate-pulse" />
                <span className="text-xs text-slate-400 font-bold">منصة ردود للذكاء الاصطناعي وخدمة العملاء المؤتمتة</span>
              </div>

              {/* Article Content Paragraphs */}
              <div className="space-y-4 text-sm md:text-base text-slate-300 leading-relaxed pt-4 border-t border-white/5">
                {selectedArticle.content.map((p, idx) => (
                  <p key={idx} className="leading-loose">{p}</p>
                ))}
              </div>

              {/* Share & Actions Toolbar */}
              <div className="pt-8 mt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-amber-400" />
                    مشاركة المقال:
                  </span>
                  <button
                    onClick={() => handleShare('whatsapp', selectedArticle)}
                    className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-colors flex items-center gap-1"
                    title="مشاركة عبر واتساب"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>واتساب</span>
                  </button>
                  <button
                    onClick={() => handleShare('twitter', selectedArticle)}
                    className="p-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 text-xs font-bold transition-colors flex items-center gap-1"
                    title="مشاركة على منصة X"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>منصة X</span>
                  </button>
                  <button
                    onClick={() => handleShare('copy', selectedArticle)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors flex items-center gap-1"
                    title="نسخ رابط المقال"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                    <span>{copiedLink ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                  </button>
                </div>

                <a
                  href="/demo"
                  className="px-5 py-2.5 rounded-full gold-btn text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>جرب منصة ردود مجاناً</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* ── Articles Grid List ─────────────────────────────────────────── */
          <>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>مدونة منصة ردود ومكتبة المعرفة</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                أحدث مقالات <span className="gold-gradient-text">الأتمتة والذكاء الاصطناعي</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-400 mt-2">
                استكشف أفضل الاستراتيجيات لزيادة مبيعات متجرك وتحسين رضا العملاء عبر الذكاء الاصطناعي
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10 transition-all flex flex-col justify-between group cursor-pointer backdrop-blur-sm"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                        {art.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" /> {art.readTime}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2.5 leading-relaxed line-clamp-3">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-between text-xs font-bold text-amber-400">
                    <span>قراءة المقال كاملاً</span>
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </main>

      <PublicFooter />
    </div>
  );
};
