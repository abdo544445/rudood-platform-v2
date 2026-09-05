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
  ShoppingBag
} from 'lucide-react';
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
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  initialPlatform = 'whatsapp',
  botName = 'مساعد المتجر الذكي',
  botTone = 'friendly',
  welcomeMessage = 'أهلاً بك في متجرنا! كيف أقدر أساعدك اليوم؟',
  widgetColor = '#d4af37',
  quickReplies = ['🛒 تفاصيل العرض اليوم', '🚚 كم مدة الشحن؟', '📞 محادثة موظف خدمة العملاء'],
  productCard = {
    title: 'ساعة رويال كلاسيك جلد فاخر',
    price: '340 ر.س',
    description: 'ضمان سنتين شامل الشحن السريع المجاني اليوم.',
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400',
  },
  className = '',
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

  // Initialize with welcome message whenever welcomeMessage or botName changes
  useEffect(() => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSimulatedMessages([
      {
        id: 'init-1',
        sender: 'bot',
        text: welcomeMessage || 'أهلاً بك! نسعد بخدمتك.',
        time: now,
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
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
      } else if (text.includes('عرض') || text.includes('سعر') || text.includes('ساعة')) {
        replyText = `العرض الحالي على ${productCard.title} بسعر ${productCard.price} فقط شامل الضريبة والضمان سنتين! هل تود رابط الطلب الفوري؟ 🛍️`;
      } else if (text.includes('موظف') || text.includes('إنسان')) {
        replyText = 'تم تحويل استفسارك لأحد ممثلي خدمة العملاء وسيقوم بمراسلتك حالاً! 👨‍💼';
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
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsBotTyping(false);
    }, 900);
  };

  // Channel style tokens
  const getHeaderTheme = () => {
    switch (platform) {
      case 'whatsapp':
        return {
          bg: 'bg-[#075e54]',
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
          icon: Send,
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
          bg: 'bg-gradient-to-r from-[#833ab4]/80 via-[#fd1d1d]/80 to-[#fcb045]/80',
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
      
      {/* Platform Switcher Pills */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-white/10 mb-4 shadow-xl z-20">
        {[
          { id: 'whatsapp' as ChannelPlatform, label: 'واتساب', icon: MessageCircle, color: 'text-emerald-400' },
          { id: 'telegram' as ChannelPlatform, label: 'تليجرام', icon: Send, color: 'text-sky-400' },
          { id: 'web' as ChannelPlatform, label: 'الودجت', icon: Globe, color: 'text-amber-400' },
          { id: 'instagram' as ChannelPlatform, label: 'إنستغرام', icon: Camera, color: 'text-pink-400' },
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                active
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${active ? 'text-slate-950' : p.color}`} />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* iPhone 16 Frame Container */}
      <div className="relative w-[340px] h-[670px] bg-[#0c1017] rounded-[52px] p-3 shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_20px_rgba(212,175,55,0.15)] border-[4px] border-slate-700/60 flex flex-col justify-between overflow-hidden">
        
        {/* Outer Titanium Metallic Edge Reflection */}
        <div className="absolute inset-0 rounded-[48px] border border-white/15 pointer-events-none" />

        {/* Screen Inner Display */}
        <div className="w-full h-full bg-[#0b0e14] rounded-[44px] overflow-hidden flex flex-col relative border border-black/40">
          
          {/* 1. iOS Status Bar & Dynamic Island */}
          <div className="h-10 bg-black/70 backdrop-blur-md px-6 flex items-center justify-between z-30 shrink-0 text-white text-[11px] font-bold">
            {/* Clock */}
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

            {/* Dynamic Island Notch */}
            <div className="w-24 h-5 bg-black rounded-full flex items-center justify-between px-2 shadow-inner border border-white/10">
              <div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Status Icons */}
            <div className="flex items-center gap-1.5 text-slate-200">
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 2. Channel Chat Header */}
          <div className={`h-14 px-4 flex items-center justify-between text-white shrink-0 z-20 ${theme.bg}`}>
            <div className="flex items-center gap-2.5 overflow-hidden">
              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 cursor-pointer" />
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-slate-800 border border-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-300">
                  {botName.charAt(0) || 'م'}
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 border-2 border-black" />
              </div>
              <div className="overflow-hidden text-right">
                <h4 className="text-xs font-bold truncate">{botName}</h4>
                <p className="text-[9px] text-slate-300/90 truncate flex items-center gap-1">
                  <span>متصل الآن</span>
                  <span>•</span>
                  <span>{theme.badge}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-200">
              <Phone className="w-3.5 h-3.5 cursor-pointer opacity-80 hover:opacity-100" />
              <Video className="w-3.5 h-3.5 cursor-pointer opacity-80 hover:opacity-100" />
              <MoreVertical className="w-3.5 h-3.5 cursor-pointer opacity-80 hover:opacity-100" />
            </div>
          </div>

          {/* 3. Messages Stream */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gradient-to-b from-[#0b0e14] to-[#080d19] text-xs">
            {/* Encryption Notice */}
            <div className="text-center my-1">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-white/5 text-[9px] text-amber-300/80 font-bold inline-block">
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
                    className={`max-w-[85%] p-3 rounded-2xl shadow-lg relative ${
                      isBot ? theme.bubbleBot : theme.bubbleUser
                    } ${isBot ? 'rounded-br-none' : 'rounded-bl-none'}`}
                  >
                    <p className="whitespace-pre-line text-[11px] leading-relaxed">{msg.text}</p>

                    {/* Product Card Preview inside bubble */}
                    {msg.hasProduct && productCard && (
                      <div className="mt-2.5 rounded-xl bg-black/40 border border-amber-500/20 p-2 overflow-hidden space-y-1.5">
                        {productCard.imageUrl && (
                          <img
                            src={productCard.imageUrl}
                            alt={productCard.title}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[10px] text-white truncate max-w-[140px]">{productCard.title}</span>
                          <span className="font-extrabold text-amber-400 text-[10px]">{productCard.price}</span>
                        </div>
                        <p className="text-[9px] text-slate-400 line-clamp-2">{productCard.description}</p>
                        <button
                          type="button"
                          onClick={() => handleSend(`أريد طلب ${productCard.title}`)}
                          className="w-full py-1 rounded-lg gold-btn text-[9px] font-bold flex items-center justify-center gap-1 mt-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>شراء الآن بضغطة زر</span>
                        </button>
                      </div>
                    )}

                    {/* Interactive Quick Reply Buttons */}
                    {msg.hasButtons && quickReplies && quickReplies.length > 0 && (
                      <div className="mt-2.5 space-y-1 pt-1.5 border-t border-white/10">
                        {quickReplies.map((btn, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSend(btn)}
                            className="w-full py-1.5 px-2 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold text-center transition-all cursor-pointer truncate"
                          >
                            {btn}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-1 mt-1 text-[8px] text-slate-400">
                      <span>{msg.time}</span>
                      {!isBot && <CheckCheck className="w-3 h-3 text-sky-400" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Bot Typing Indicator */}
            {isBotTyping && (
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900 border border-white/5 w-fit text-[10px] text-amber-300">
                <Sparkles className="w-3 h-3 animate-spin text-amber-400" />
                <span>{botName} يكتب الآن...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 4. Realistic Bottom Input Bar */}
          <div className="p-2.5 bg-slate-950 border-t border-white/10 flex items-center gap-2 shrink-0 z-20">
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
              className="flex-1 bg-slate-900 border border-slate-800 rounded-full px-3.5 py-1.5 text-[11px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              className="w-8 h-8 rounded-full gold-btn flex items-center justify-center shrink-0 cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* iOS Bottom Home Bar Indicator */}
          <div className="h-4 bg-slate-950 flex items-center justify-center shrink-0">
            <div className="w-28 h-1 bg-white/30 rounded-full" />
          </div>

        </div>
      </div>
      
      <p className="text-[10px] text-slate-400 mt-2 font-bold flex items-center gap-1">
        <span>📱 محاكي هاتف حي ومباشر (iPhone 16 Pro)</span>
      </p>
    </div>
  );
};
