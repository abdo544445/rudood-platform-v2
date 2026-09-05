import React, { useState, useEffect } from 'react';
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
  ExternalLink,
  Search
} from 'lucide-react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { AmbientCanvas } from '../../components/common/AmbientCanvas';
import { apiClient } from '../../services/apiClient';

interface ArticleItem {
  id: number;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  read_time: string;
  is_featured?: boolean;
  published_at?: string;
  created_at?: string;
}

export const BlogPage: React.FC = () => {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/articles');
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        setArticles(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch articles from API, using fallback data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique categories
  const categories = ['الكل', ...Array.from(new Set(articles.map((a) => a.category).filter(Boolean)))];

  // Filter articles based on category and search query
  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === 'الكل' || art.category === selectedCategory;
    const matchesSearch = 
      !searchQuery.trim() ||
      art.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'مقال حديث';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-[#080d19] text-slate-100 relative font-['Cairo',sans-serif]">
      <AmbientCanvas />
      <PublicNavbar />

      <main className="relative pt-36 pb-20 px-6 max-w-7xl mx-auto z-10">
        
        {/* ── Single Article View ────────────────────────────────────────── */}
        {selectedArticle ? (
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            {/* Back Button */}
            <button
              onClick={() => {
                setSelectedArticle(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-slate-800 transition-all shadow-lg cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لجميع المقالات ({articles.length})</span>
            </button>

            {/* Article Header Card */}
            <article className="p-8 md:p-12 rounded-3xl bg-slate-900/90 border border-white/5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-4">
                <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  {selectedArticle.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  {formatDate(selectedArticle.published_at || selectedArticle.created_at)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {selectedArticle.read_time || '5 دقائق'}
                </span>
              </div>

              <h1 className="text-2xl md:text-4xl font-black text-white leading-tight mb-6">
                {selectedArticle.title}
              </h1>

              {selectedArticle.summary && (
                <p className="text-base text-slate-300 font-medium leading-relaxed mb-6 bg-slate-950/40 p-4 rounded-2xl border-r-4 border-amber-400">
                  {selectedArticle.summary}
                </p>
              )}

              {/* Decorative Banner */}
              <div className="w-full py-10 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 text-center my-6">
                <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-2 animate-pulse" />
                <span className="text-xs text-slate-400 font-bold">منصة ردود للذكاء الاصطناعي وخدمة العملاء المؤتمتة</span>
              </div>

              {/* Article Content Render */}
              <div 
                className="space-y-4 text-sm md:text-base text-slate-200 leading-loose pt-4 border-t border-white/5 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              />

              {/* Share & Actions Toolbar */}
              <div className="pt-8 mt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-amber-400" />
                    مشاركة المقال:
                  </span>
                  <button
                    onClick={() => handleShare('whatsapp', selectedArticle)}
                    className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    title="مشاركة عبر واتساب"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>واتساب</span>
                  </button>
                  <button
                    onClick={() => handleShare('twitter', selectedArticle)}
                    className="p-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    title="مشاركة على منصة X"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>منصة X</span>
                  </button>
                  <button
                    onClick={() => handleShare('copy', selectedArticle)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    title="نسخ رابط المقال"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                    <span>{copiedLink ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                  </button>
                </div>

                <a
                  href="/register"
                  className="px-5 py-2.5 rounded-full gold-btn text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>ابدأ تجربة ردود لمتجرك مجاناً</span>
                </a>
              </div>
            </article>

            {/* Related Articles Preview */}
            <div className="pt-6">
              <h3 className="text-lg font-bold text-white mb-4">مقالات أخرى قد تهمك:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {articles
                  .filter((a) => a.id !== selectedArticle.id)
                  .slice(0, 2)
                  .map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => {
                        setSelectedArticle(rel);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-amber-500/30 transition-all cursor-pointer group"
                    >
                      <span className="text-[10px] text-amber-400 font-bold">{rel.category}</span>
                      <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors mt-1">
                        {rel.title}
                      </h4>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── Articles Grid List ─────────────────────────────────────────── */
          <>
            {/* Header Title */}
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>مدونة منصة ردود ومكتبة المعرفة ({articles.length} مقال)</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                أحدث مقالات <span className="gold-gradient-text">الأتمتة والذكاء الاصطناعي</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-400 mt-2">
                دليلك المعرفي الشامل لزيادة مبيعات متجرك، خفض تكاليف خدمة العملاء، وبناء تجارب تسوق استثنائية
              </p>
            </div>

            {/* Search & Category Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                        : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في المقالات والمواضيع..."
                  className="w-full bg-slate-900/80 border border-white/10 rounded-full pr-10 pl-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 space-y-4 animate-pulse">
                    <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                    <div className="h-6 bg-slate-800 rounded w-3/4"></div>
                    <div className="h-16 bg-slate-800/60 rounded"></div>
                    <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-white/5">
                <p className="text-sm text-slate-400">لا توجد مقالات تطابق بحثك حالياً.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('الكل');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/20 hover:bg-amber-500/20"
                >
                  إعادة ضبط التصفية
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredArticles.map((art) => (
                  <article
                    key={art.id}
                    onClick={() => {
                      setSelectedArticle(art);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10 transition-all flex flex-col justify-between group cursor-pointer backdrop-blur-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                          {art.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" /> {art.read_time || '5 دقائق'}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                        {art.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2.5 leading-relaxed line-clamp-3">
                        {art.summary}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-between text-xs font-bold text-amber-400">
                      <span>قراءة المقال كاملاً</span>
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

      </main>

      <PublicFooter />
    </div>
  );
};
