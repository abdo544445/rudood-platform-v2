import React, { useEffect, useState, useRef } from 'react';
import { 
  Search, 
  Send, 
  User as UserIcon, 
  Bot, 
  UserCheck, 
  CheckCircle2, 
  Tag, 
  FileText, 
  Phone, 
  Mail, 
  MessageSquare,
  Sparkles,
  Download,
  Volume2,
  VolumeX,
  PlusCircle,
  X
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';

export const LiveChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [filterCounts, setFilterCounts] = useState<any>({});
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);

  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [customer, setCustomer] = useState<any>(null);

  const [inputMessage, setInputMessage] = useState('');
  const [cannedReplies, setCannedReplies] = useState<any[]>([]);
  const [showCannedMenu, setShowCannedMenu] = useState(false);

  // CRM state
  const [internalNotes, setInternalNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isSavingCrm, setIsSavingCrm] = useState(false);

  // Sound settings
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modals state
  const [interactiveModalOpen, setInteractiveModalOpen] = useState(false);
  const [interactiveType, setInteractiveType] = useState<'buttons' | 'list' | 'product'>('buttons');

  // Interactive Form States
  const [buttonLabels, setButtonLabels] = useState(['🛒 إتمام الطلب الآن', '🚚 تتبع شحنتي', '📞 محادثة موظف']);
  const [productCard, setProductCard] = useState({
    title: 'ساعة رويال كلاسيك جلد أصلي',
    price: '340 ريال',
    description: 'ضمان لمدة سنتين شامل الشحن المجاني اليوم.',
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Synthesize notification sound
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {}
  };

  // 1. Fetch Conversations List
  const fetchConversations = async (filter = activeFilter, search = searchQuery) => {
    try {
      const res = await apiClient.get('/conversations', {
        params: { filter, search },
      });
      if (res.data.success) {
        const list = res.data.data.conversations || [];
        setConversations(list);
        setFilterCounts(res.data.data.filter_counts || {});
        if (!activeConversationId && list.length > 0) {
          setActiveConversationId(list[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to load conversations', e);
    }
  };

  // 2. Fetch Active Conversation Details
  const fetchConversationDetails = async (id: number) => {
    try {
      const res = await apiClient.get(`/conversations/${id}`);
      if (res.data.success) {
        setActiveChat(res.data.data.conversation);
        setCustomer(res.data.data.customer);
        setMessages(res.data.data.messages || []);
        setInternalNotes(res.data.data.conversation.internal_notes || '');
        setTagsInput((res.data.data.customer?.tags || []).join(', '));
      }
    } catch (e) {
      console.error('Failed to load conversation details', e);
    }
  };

  // 3. Fetch Canned Replies
  const fetchCannedReplies = async () => {
    try {
      const res = await apiClient.get('/canned-replies');
      if (res.data.success) {
        setCannedReplies(res.data.data || []);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchConversations();
    fetchCannedReplies();
  }, []);

  useEffect(() => {
    if (activeConversationId) {
      fetchConversationDetails(activeConversationId);
    }
  }, [activeConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !activeConversationId) return;

    const text = inputMessage;
    setInputMessage('');
    setShowCannedMenu(false);

    try {
      const res = await apiClient.post(`/conversations/${activeConversationId}/messages`, {
        content: text,
      });
      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.data]);
        playChime();
      }
    } catch (e) {
      alert('تعذر إرسال الرسالة');
    }
  };

  // Send Interactive Message (WhatsApp Quick Reply / Product Card)
  const handleSendInteractive = async () => {
    if (!activeConversationId) return;

    let payload: any = {};
    if (interactiveType === 'buttons') {
      payload = {
        content: 'يرجى اختيار أحد الخيارات التالية للمتابعة:',
        interactive_type: 'button',
        interactive_data: { buttons: buttonLabels },
      };
    } else if (interactiveType === 'product') {
      payload = {
        content: `🛍️ ${productCard.title}\nالسعر: ${productCard.price}\n${productCard.description}`,
        media_url: productCard.imageUrl,
        media_type: 'image',
        interactive_type: 'carousel',
        interactive_data: productCard,
      };
    }

    try {
      const res = await apiClient.post(`/conversations/${activeConversationId}/messages`, payload);
      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.data]);
        setInteractiveModalOpen(false);
        playChime();
      }
    } catch (e) {
      alert('تعذر إرسال العنصر التفاعلي');
    }
  };

  // Toggle Human Takeover
  const handleToggleTakeover = async () => {
    if (!activeConversationId) return;
    try {
      const res = await apiClient.post(`/conversations/${activeConversationId}/toggle-bot`);
      if (res.data.success) {
        setActiveChat((prev: any) => ({
          ...prev,
          is_bot_paused: res.data.data.is_bot_paused,
          status: res.data.data.status,
        }));
        fetchConversations();
      }
    } catch (e) {
      alert('تعذر تبديل حالة الاستلام');
    }
  };

  // Resolve Conversation
  const handleResolve = async () => {
    if (!activeConversationId) return;
    try {
      const res = await apiClient.post(`/conversations/${activeConversationId}/resolve`);
      if (res.data.success) {
        setActiveChat((prev: any) => ({ ...prev, status: 'resolved', is_bot_paused: false }));
        fetchConversations();
      }
    } catch (e) {
      alert('تعذر إنهاء المحادثة');
    }
  };

  // Save CRM Info
  const handleSaveCrm = async () => {
    if (!activeConversationId) return;
    setIsSavingCrm(true);
    try {
      const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
      await apiClient.post(`/conversations/${activeConversationId}/crm`, {
        internal_notes: internalNotes,
        tags,
      });
      alert('تم حفظ بيانات العميل والملاحظات بنجاح ✓');
    } catch (e) {
      alert('تعذر حفظ بيانات العميل');
    } finally {
      setIsSavingCrm(false);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    const rows = [
      ['ID', 'Customer', 'Platform', 'Status', 'Escalated', 'Last Message', 'Date'],
      ...conversations.map((c) => [
        c.id,
        c.customer?.name || 'Customer',
        c.customer?.platform || 'web',
        c.status,
        c.is_escalated ? 'Yes' : 'No',
        `"${(c.messages?.[0]?.content || '').replace(/"/g, '""')}"`,
        c.updated_at,
      ]),
    ];

    const csvContent = '\uFEFF' + rows.map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rudood_conversations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInputChange = (val: string) => {
    setInputMessage(val);
    setShowCannedMenu(val.startsWith('/'));
  };

  const applyCannedReply = (content: string) => {
    setInputMessage(content);
    setShowCannedMenu(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-slate-950/60 border border-white/5 rounded-3xl overflow-hidden flex shadow-2xl relative font-['Cairo',sans-serif]">
      {/* ── 1. Left Column: Conversations List & Filters ────────────────── */}
      <div className="w-84 border-l border-white/5 bg-[#0b0f19] flex flex-col shrink-0">
        {/* Search & Header */}
        <div className="p-4 border-b border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>صندوق الوارد الموحد</span>
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                title={soundEnabled ? 'كتم التنبيهات الصوتية' : 'تفعيل التنبيهات'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={handleExportCsv}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                title="تصدير CSV"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                fetchConversations(activeFilter, e.target.value);
              }}
              placeholder="🔍 بحث بالاسم، الهاتف، أو المعرف..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1 overflow-x-auto pb-1 text-[11px]">
            {[
              { id: 'all', label: 'الكل', count: filterCounts.all ?? conversations.length },
              { id: 'unhandled', label: 'غير معالجة', count: filterCounts.unhandled ?? 0 },
              { id: 'escalated', label: 'تدخل بشري', count: filterCounts.escalated ?? 0 },
              { id: 'resolved', label: 'مكتملة', count: filterCounts.resolved ?? 0 },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setActiveFilter(f.id);
                  fetchConversations(f.id);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {conversations.map((conv) => {
            const isSelected = activeConversationId === conv.id;
            return (
              <button
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`w-full p-4 flex items-start gap-3 text-right transition-all cursor-pointer ${
                  isSelected ? 'bg-amber-500/10 border-r-4 border-amber-500' : 'hover:bg-slate-900/50'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-amber-400 shrink-0 text-xs">
                  {conv.customer?.name?.charAt(0) || 'ع'}
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate max-w-[120px]">
                      {conv.customer?.name || 'عميل'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 truncate mt-1">
                    {conv.messages?.[0]?.content || 'لا توجد رسائل'}
                  </p>

                  <div className="flex items-center gap-1.5 mt-2">
                    {conv.is_escalated && (
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[9px] font-bold">
                        متصعدة 🚨
                      </span>
                    )}
                    {conv.is_bot_paused && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                        وكيل بشري
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px] font-medium">
                      {conv.customer?.platform || 'WhatsApp'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. Center Column: Active Chat Stream ────────────────────────── */}
      <div className="flex-1 flex flex-col bg-[#080d19] border-l border-white/5">
        {activeChat ? (
          <>
            {/* Top Chat Bar */}
            <div className="h-16 px-6 border-b border-white/5 bg-slate-900/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 font-bold text-xs">
                  {customer?.name?.charAt(0) || 'ع'}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <span>{customer?.name || 'عميل'}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                      {customer?.platform || 'WhatsApp'}
                    </span>
                  </h3>
                  <span className="text-[10px] text-slate-400">{customer?.phone || customer?.email}</span>
                </div>
              </div>

              {/* Action Buttons: Takeover & Resolve */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInteractiveModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>إرسال عنصر تفاعلي</span>
                </button>

                <button
                  onClick={handleToggleTakeover}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                    activeChat.is_bot_paused
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>{activeChat.is_bot_paused ? 'استلمتها كبشري (استئناف البوت؟)' : 'استلام المحادثة'}</span>
                </button>

                <button
                  onClick={handleResolve}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>تم الحل</span>
                </button>
              </div>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => {
                const isUser = msg.sender_type === 'customer';
                const isBot = msg.sender_type === 'bot';

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2.5 ${isUser ? 'justify-start' : 'justify-end'}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-full bg-slate-800 border border-amber-500/30 flex items-center justify-center text-[10px] text-amber-400 order-2">
                        {isBot ? <Bot className="w-3.5 h-3.5" /> : <UserIcon className="w-3.5 h-3.5" />}
                      </div>
                    )}

                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-lg ${
                        isUser
                          ? 'bg-slate-900 border border-slate-800 text-slate-100 rounded-br-none'
                          : isBot
                          ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/15 border border-amber-500/30 text-amber-100 rounded-bl-none'
                          : 'bg-emerald-600 text-white rounded-bl-none'
                      }`}
                    >
                      {msg.media_url && (
                        <img
                          src={msg.media_url}
                          alt="Attachment"
                          className="rounded-xl max-h-48 w-full object-cover mb-2 border border-white/10"
                        />
                      )}

                      <p className="whitespace-pre-line">{msg.content}</p>

                      {/* Interactive Buttons Preview */}
                      {msg.interactive_type === 'button' && msg.interactive_data?.buttons && (
                        <div className="mt-2.5 space-y-1 pt-2 border-t border-white/10">
                          {msg.interactive_data.buttons.map((b: string, i: number) => (
                            <div
                              key={i}
                              className="px-3 py-1.5 rounded-xl bg-slate-950/70 text-amber-300 text-center font-bold text-[11px] border border-amber-500/20"
                            >
                              {b}
                            </div>
                          ))}
                        </div>
                      )}

                      <span className="block text-[9px] text-slate-400 mt-1.5 text-left opacity-70">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Rich Input Bar with Canned Suggestions */}
            <div className="p-4 border-t border-white/5 bg-slate-900/60 relative">
              {showCannedMenu && cannedReplies.length > 0 && (
                <div className="absolute bottom-full mb-2 left-4 right-4 bg-slate-900 border border-amber-500/30 rounded-2xl p-2 shadow-2xl z-20 divide-y divide-slate-800 max-h-48 overflow-y-auto">
                  <div className="px-3 py-1 text-[10px] font-bold text-amber-400 uppercase">
                    ردود سريعة جاهزة (Slash Shortcuts)
                  </div>
                  {cannedReplies.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => applyCannedReply(c.content)}
                      className="w-full text-right px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-between"
                    >
                      <span className="font-bold text-amber-300">{c.shortcut}</span>
                      <span className="text-slate-400 text-[11px] truncate max-w-[200px]">{c.title}</span>
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="اكتب ردك هنا... (اكتب / للردود السريعة الجاهزة)"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />

                <button
                  type="submit"
                  className="p-3 rounded-2xl gold-btn flex items-center justify-center cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs">
            <MessageSquare className="w-12 h-12 text-slate-700 mb-3" />
            <p>اختر محادثة من القائمة الجانبية للبدء</p>
          </div>
        )}
      </div>

      {/* ── 3. Right Column: Customer Mini CRM ───────────────────────────── */}
      {customer && (
        <div className="w-76 bg-[#0b0f19] p-5 flex flex-col overflow-y-auto space-y-6">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-amber-400" />
              <span>بطاقة العميل (Mini CRM)</span>
            </h4>

            <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-white">{customer.name || 'بدون اسم'}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{customer.phone}</span>
                </div>
              )}
              {customer.email && (
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{customer.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Customer Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>الوسوم والـ Tags (مفصولة بفاصلة)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="عميل_مميز, سلة_متروكة"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Internal Notes */}
          <div className="flex-1 flex flex-col">
            <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>ملاحظات الوكيل الداخلية</span>
            </label>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={4}
              placeholder="اكتب ملاحظات خاصة بالفريق الداخلي هنا..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 resize-none"
            />

            <button
              onClick={handleSaveCrm}
              disabled={isSavingCrm}
              className="mt-4 w-full py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs transition-all"
            >
              {isSavingCrm ? 'جاري الحفظ...' : 'حفظ بيانات CRM ✓'}
            </button>
          </div>
        </div>
      )}

      {/* Interactive Message Modal */}
      {interactiveModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0f172a] border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>إرسال رسالة تفاعلية ذكية للعميل</span>
              </h3>
              <button onClick={() => setInteractiveModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Type selector */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setInteractiveType('buttons')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                  interactiveType === 'buttons' ? 'gold-btn' : 'bg-slate-900 border-white/5 text-slate-400'
                }`}
              >
                أزرار ردود سريعة (Quick Replies)
              </button>
              <button
                onClick={() => setInteractiveType('product')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                  interactiveType === 'product' ? 'gold-btn' : 'bg-slate-900 border-white/5 text-slate-400'
                }`}
              >
                بطاقة منتج (Product Card)
              </button>
            </div>

            {interactiveType === 'buttons' ? (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-300">أزرار الخيارات:</label>
                {buttonLabels.map((btn, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={btn}
                    onChange={(e) => {
                      const newB = [...buttonLabels];
                      newB[idx] = e.target.value;
                      setButtonLabels(newB);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">اسم المنتج</label>
                  <input
                    type="text"
                    value={productCard.title}
                    onChange={(e) => setProductCard({ ...productCard, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">السعر</label>
                  <input
                    type="text"
                    value={productCard.price}
                    onChange={(e) => setProductCard({ ...productCard, price: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">الوصف</label>
                  <textarea
                    rows={2}
                    value={productCard.description}
                    onChange={(e) => setProductCard({ ...productCard, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 resize-none"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleSendInteractive}
              className="w-full py-3 rounded-xl gold-btn text-xs font-bold mt-4"
            >
              إرسال العنصر التفاعلي الآن ✓
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
