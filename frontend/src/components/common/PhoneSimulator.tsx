import React, { useState, useEffect, useRef } from 'react';
import { 
  Wifi, 
  Battery, 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  ChevronRight, 
  CheckCheck, 
  Sparkles,
  MessageCircle,
  Globe,
  Camera,
  ShoppingCart,
  Truck,
  PhoneCall
} from 'lucide-react';
import { TelegramIcon } from '../icons/TelegramIcon';
import { soundEngine } from '../../services/soundEngine';

export type ChannelPlatform = 'whatsapp' | 'telegram' | 'web' | 'instagram';

export interface PhoneSimulatorProps {
  initialPlatform?: ChannelPlatform;
  botName?: string;
  botTone?: string;
  welcomeMessage?: string;
  widgetColor?: string;
  quickReplies?: string[];
  productCard?: {
    title: string;
    price: string;
    description: string;
    imageUrl?: string;
  };
  onSendMessage?: (text: string) => void;
  className?: string;
  showHeaderTitle?: boolean;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  initialPlatform = 'whatsapp',
  botName = 'مساعد المتجر الذكي',
  botTone = 'friendly',
  welcomeMessage = 'أهلاً بك! نسعد بخدمتك.',
  widgetColor = '#d4af37',
  quickReplies = ['🛒 تفاصيل العرض اليوم', '🚚 كم مدة الشحن؟', '📞 محادثة موظف خدمة العملاء'],
  productCard = {
    title: 'ساعة رويال كلاسيك جلد فاخر',
    price: '340 ر.س',
    description: 'ضمان سنتين شامل الشحن السريع المجاني اليوم.',
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop&q=80',
  },
  className = '',
  showHeaderTitle = false,
}) => {
  const [platform, setPlatform] = useState<ChannelPlatform>(initialPlatform);
  const [inputText, setInputText] = useState('');
  const [simulatedMessages, setSimulatedMessages] = useState<Array<{
    id: string;
    sender: 'bot' | 'user';
    text: string;
    time: string;
    hasButtons?: boolean;
    hasProduct?: boolean;
  }>>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Format current time like "AM 06:00" or "06:00 AM"
  const getCurrentTimeFormatted = () => {
    const d = new Date();
    const hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    return `${ampm} ${formattedHours}:${minutes}`;
  };

  // Initialize with welcome message whenever welcomeMessage or botName changes
  useEffect(() => {
    setSimulatedMessages([
      {
        id: 'init-1',
        sender: 'bot',
        text: welcomeMessage || 'أهلاً بك! نسعد بخدمتك.',
        time: getCurrentTimeFormatted(),
        hasButtons: true,
        hasProduct: true,
      },
    ]);
  }, [welcomeMessage, botName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [simulatedMessages, isBotTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    soundEngine.playSent();
    const timeNow = getCurrentTimeFormatted();

    // Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user' as const,
      text,
      time: timeNow,
    };

    setSimulatedMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsBotTyping(true);

    // Simulate smart AI response based on bot tone
    setTimeout(() => {
      soundEngine.playReceived();
      let replyText = '';
      if (text.includes('شحن') || text.includes('توصيل')) {
        replyText = 'الشحن متاح لجميع مدن المملكة والخليج خلال 24 - 48 ساعة مع سمسا وأرامكس 🚚✨';
      } else if (text.includes('عرض') || text.includes('سعر') || text.includes('ساعة') || text.includes('شراء')) {
        replyText = `العرض الحالي على ${productCard.title} بسعر ${productCard.price} فقط شامل الضريبة والضمان سنتين والشحن المجاني! 🛍️✨\nهل تود تأكيد طلبك الآن؟`;
      } else if (text.includes('موظف') || text.includes('إنسان') || text.includes('خدمة العملاء')) {
        replyText = 'تم تحويل استفسارك لأحد ممثلي خدمة العملاء وسيقوم بمراسلتك حالاً! 👨‍💼📞';
      } else {
        if (botTone === 'sales') {
          replyText = `سؤالك في محله! يسعدني إخبارك بأن طلباتك مؤهلة لخصم 15% إضافي اليوم عبر كود REDOOD15 🎁`;
        } else if (botTone === 'formal') {
          replyText = `أهلاً بك. تم استلام طلبك ومطابقته مع قواعد بيانات المتجر. تفضل بأي استفسارات إضافية.`;
        } else {
          replyText = `أهلاً وسهلاً بك يا غالي! سعداء جداً بتواصلك معنا، كيف نقدر نخدمك ونسعدك اليوم؟ 😊`;
        }
      }

      setSimulatedMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: replyText,
          time: getCurrentTimeFormatted(),
        },
      ]);
      setIsBotTyping(false);
    }, 850);
  };

  // Channel style tokens
  const getHeaderTheme = () => {
    switch (platform) {
      case 'whatsapp':
        return {
          bg: 'bg-[#005c4b]',
          accent: '#25d366',
          badge: 'WhatsApp Business',
          icon: MessageCircle,
          bubbleBot: 'bg-[#202c33] text-slate-100',
          bubbleUser: 'bg-[#005c4b] text-slate-100',
        };
      case 'telegram':
        return {
          bg: 'bg-[#17212b]',
          accent: '#2481cc',
          badge: 'Telegram Bot',
          icon: TelegramIcon,
          bubbleBot: 'bg-[#182533] text-slate-100',
          bubbleUser: 'bg-[#2b5278] text-slate-100',
        };
      case 'web':
        return {
          bg: 'bg-slate-900 border-b border-amber-500/20',
          accent: widgetColor,
          badge: 'Live Web Chat',
          icon: Globe,
          bubbleBot: 'bg-slate-800/90 text-slate-100 border border-white/5',
          bubbleUser: 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold',
        };
      case 'instagram':
        return {
          bg: 'bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]',
          accent: '#e1306c',
          badge: 'Instagram Direct',
          icon: Camera,
          bubbleBot: 'bg-slate-800 text-slate-100',
          bubbleUser: 'bg-[#3797f0] text-white',
        };
    }
  };

  const theme = getHeaderTheme();

  return (
    <div className={`flex flex-col items-center select-none font-['Cairo',sans-serif] ${className}`}>
      
      {/* Optional Top Header Title */}
      {showHeaderTitle && (
        <div className="w-full text-center mb-3">
          <span className="text-sm font-black text-amber-400 flex items-center justify-center gap-1.5">
            <span>📱 المعاينة التفاعلية المباشرة</span>
          </span>
          <p className="text-[11px] text-slate-400 mt-0.5">تحديث فوري لاسم المساعد والنبرة والرسائل</p>
        </div>
      )}

      {/* Platform Switcher Pill Bar (Exact match to reference screenshot) */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#0b1220]/95 border border-slate-700/60 mb-5 shadow-2xl z-20 backdrop-blur-md">
        {[
          { id: 'whatsapp' as ChannelPlatform, label: 'واتساب', icon: MessageCircle, isSpecial: true },
          { id: 'telegram' as ChannelPlatform, label: 'تليجرام', icon: TelegramIcon, iconColor: 'text-[#2481cc]' },
          { id: 'web' as ChannelPlatform, label: 'الودجت', icon: Globe, iconColor: 'text-amber-400' },
          { id: 'instagram' as ChannelPlatform, label: 'إنستغرام', icon: Camera, iconColor: 'text-pink-400' },
        ].map((p) => {
          const Icon = p.icon;
          const active = platform === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setPlatform(p.id);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                active
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 font-black scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>{p.label}</span>
              <Icon className={`w-4 h-4 ${active ? 'text-slate-950' : (p.iconColor || 'text-slate-300')}`} />
            </button>
          );
        })}
      </div>

      {/* iPhone 16 Pro Frame Container */}
      <div className="relative w-[345px] h-[685px] bg-[#0c1017] rounded-[52px] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_35px_rgba(212,175,55,0.12)] border-[4px] border-slate-700/80 flex flex-col justify-between overflow-hidden">
        
        {/* Outer Titanium Metallic Edge Reflection */}
        <div className="absolute inset-0 rounded-[48px] border border-white/10 pointer-events-none" />

        {/* Screen Inner Display */}
        <div className="w-full h-full bg-[#0b0e14] rounded-[44px] overflow-hidden flex flex-col relative border border-black/50">
          
          {/* 1. iOS Status Bar & Dynamic Island */}
          <div className="h-11 bg-black/85 backdrop-blur-md px-5 flex items-center justify-between z-30 shrink-0 text-white text-[11px] font-bold">
            {/* Battery & Wifi on Left */}
            <div className="flex items-center gap-2 text-slate-200">
              <Battery className="w-4 h-4" />
              <Wifi className="w-3.5 h-3.5" />
            </div>

            {/* Dynamic Island Notch in Center */}
            <div className="w-24 h-5 bg-black rounded-full flex items-center justify-between px-2.5 shadow-inner border border-white/15">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
            </div>

            {/* Clock on Right */}
            <span className="font-mono text-[11px] text-slate-200 tracking-tight">
              {getCurrentTimeFormatted()}
            </span>
          </div>

          {/* 2. Channel Chat Header (WhatsApp Theme Exact Replica) */}
          <div className={`h-14 px-3.5 flex items-center justify-between text-white shrink-0 z-20 ${theme.bg}`}>
            {/* Right Group: Chevron, Avatar, Name & Status in RTL */}
            <div className="flex items-center gap-2 overflow-hidden">
              <ChevronRight className="w-4 h-4 text-slate-200 shrink-0 cursor-pointer" />
              
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-[#111b21] border border-amber-500/40 flex items-center justify-center text-sm font-bold text-amber-300 shadow-sm">
                  {botName.charAt(0) || 'م'}
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 border-2 border-[#005c4b]" />
              </div>

              <div className="overflow-hidden text-right">
                <h4 className="text-xs font-black truncate text-white leading-tight">{botName}</h4>
                <p className="text-[9.5px] text-emerald-100/90 truncate flex items-center gap-1">
                  <span>متصل الآن</span>
                  <span>•</span>
                  <span>{theme.badge}</span>
                </p>
              </div>
            </div>

            {/* Left Group: Action Icons */}
            <div className="flex items-center gap-2.5 text-slate-100">
              <Phone className="w-4 h-4 cursor-pointer opacity-90 hover:opacity-100 transition-opacity" />
              <Video className="w-4 h-4 cursor-pointer opacity-90 hover:opacity-100 transition-opacity" />
              <MoreVertical className="w-4 h-4 cursor-pointer opacity-90 hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* 3. Messages Stream */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#0b141a] text-xs">
            {/* Encryption Notice Pill */}
            <div className="text-center my-1">
              <span className="px-3 py-1 rounded-xl bg-[#18222d]/90 border border-amber-500/20 text-[9.5px] text-amber-300/90 font-bold inline-block shadow-sm">
                🔒 محادثة مشفرة وآمنة عبر منصة ردود
              </span>
            </div>

            {simulatedMessages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[92%] p-3 rounded-2xl shadow-xl relative ${
                      isBot ? theme.bubbleBot : theme.bubbleUser
                    } ${isBot ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
                  >
                    <p className="whitespace-pre-line text-xs leading-relaxed font-medium">{msg.text}</p>

                    {/* Product Card Preview inside bubble (Exact replica) */}
                    {msg.hasProduct && productCard && (
                      <div className="mt-2.5 rounded-xl bg-[#111b21] border border-amber-500/30 p-2.5 overflow-hidden space-y-2 shadow-inner">
                        {productCard.imageUrl && (
                          <div className="w-full h-28 rounded-lg overflow-hidden bg-black/60 flex items-center justify-center">
                            <img
                              src={productCard.imageUrl}
                              alt={productCard.title}
                              className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        
                        {/* Title and Price Row */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-[11px] text-white truncate">{productCard.title}</span>
                          <span className="font-black text-amber-400 text-xs whitespace-nowrap">{productCard.price}</span>
                        </div>

                        {/* Description */}
                        <p className="text-[9.5px] text-slate-300 leading-relaxed">{productCard.description}</p>
                        
                        {/* Gold Action Button */}
                        <button
                          type="button"
                          onClick={() => handleSend(`أريد شراء ${productCard.title}`)}
                          className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/25 cursor-pointer transition-all active:scale-[0.98]"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>شراء الآن بضغطة زر</span>
                        </button>
                      </div>
                    )}

                    {/* Interactive Quick Reply Buttons (Exact Replica from Screenshot) */}
                    {msg.hasButtons && quickReplies && quickReplies.length > 0 && (
                      <div className="mt-2.5 space-y-1.5 pt-1.5 border-t border-white/10">
                        {quickReplies.map((btn, idx) => {
                          const isCart = btn.includes('عرض') || btn.includes('شراء') || btn.includes('🛒');
                          const isTruck = btn.includes('شحن') || btn.includes('توصيل') || btn.includes('🚚');
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSend(btn)}
                              className="w-full py-2 px-3 rounded-xl bg-[#18222d] hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
                            >
                              {isCart ? (
                                <ShoppingCart className="w-3.5 h-3.5" />
                              ) : isTruck ? (
                                <Truck className="w-3.5 h-3.5" />
                              ) : (
                                <PhoneCall className="w-3.5 h-3.5" />
                              )}
                              <span>{btn.replace(/^[^\w\s\u0600-\u06FF]+/g, '').trim() || btn}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Timestamp & Delivery status */}
                    <div className="flex items-center justify-end gap-1 mt-1 text-[8.5px] text-slate-400">
                      <span>{msg.time}</span>
                      {!isBot && <CheckCheck className="w-3.5 h-3.5 text-sky-400" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Bot Typing Indicator */}
            {isBotTyping && (
              <div className="flex items-center gap-1.5 p-2 px-3 rounded-xl bg-[#202c33] border border-white/5 w-fit text-[10.5px] text-amber-300 animate-pulse">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{botName} يكتب الآن...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 4. Realistic Bottom Input Bar */}
          <div className="p-2.5 bg-[#0b1017] border-t border-white/10 flex items-center gap-2 shrink-0 z-20">
            <button
              type="button"
              onClick={() => handleSend()}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 flex items-center justify-center shrink-0 cursor-pointer shadow-md shadow-amber-500/20 active:scale-90 transition-transform"
            >
              <Send className="w-3.5 h-3.5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="اكتب رسالة تجريبية..."
              className="flex-1 bg-[#18222d] border border-slate-700/60 rounded-full px-4 py-2 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* iOS Bottom Home Bar Indicator */}
          <div className="h-4 bg-[#0b1017] flex items-center justify-center shrink-0">
            <div className="w-28 h-1 bg-white/30 rounded-full" />
          </div>

        </div>
      </div>
      
      {/* iPhone Model Label (Moved Below the Phone as requested) */}
      <div className="text-xs text-slate-400 mt-3 font-bold flex items-center justify-center gap-1.5">
        <span>📱 محاكي هاتف حي ومباشر (iPhone 16 Pro)</span>
      </div>
    </div>
  );
};

