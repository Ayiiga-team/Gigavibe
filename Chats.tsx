
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  Edit3, 
  Users, 
  ChevronRight, 
  Phone, 
  Video, 
  MoreVertical, 
  ArrowLeft, 
  Send, 
  Image, 
  Mic, 
  Sparkles, 
  Pin, 
  PinOff, 
  X, 
  UserPlus, 
  ShieldCheck, 
  Smile, 
  Paperclip, 
  File, 
  MapPin, 
  User as UserIcon,
  Play,
  Pause,
  Trash2,
  CheckCheck,
  Camera,
  Music,
  Download,
  PhoneCall,
  MessageCircle,
  Hash,
  Globe
} from 'lucide-react';
import { Chat, Message } from '../types';

const INITIAL_CHATS: Chat[] = [
  { id: '1', name: 'GIGAVibe Alpha Founders', lastMsg: 'Benard: The payment gateway is ready!', time: '12:45 PM', unread: 5, online: true, isGroup: true, avatar: '', isPinned: true },
  { id: '2', name: 'Ayiiga Benard', lastMsg: 'Check the new portal link.', time: '11:20 AM', unread: 0, online: true, isGroup: false, avatar: '', isPinned: false },
  { id: '3', name: 'Global Marketplace Support', lastMsg: 'Your seller ID is verified.', time: 'Yesterday', unread: 0, online: false, isGroup: false, avatar: '', isPinned: false },
  { id: '4', name: 'Arena Gaming Hub', lastMsg: 'User442: GG everyone!', time: '2:15 PM', unread: 12, online: true, isGroup: true, avatar: '', isPinned: false },
  { id: '5', name: 'Sarah_Dev', lastMsg: 'The new UI is fire 🔥', time: '10:10 AM', unread: 0, online: true, isGroup: false, avatar: '', isPinned: true },
  { id: '6', name: 'Tech Creators Ghana', lastMsg: 'Meeting at 5 PM GMT', time: 'Monday', unread: 0, online: true, isGroup: true, avatar: '', isPinned: false },
];

const MOCK_CONTACTS = [
  { id: 'c1', name: 'Kwame Arena', status: 'Building the future', online: true },
  { id: 'c2', name: 'Sarah_Dev', status: 'Available for collab', online: true },
  { id: 'c3', name: 'GigaKing', status: 'Vibing in Accra', online: false },
];

const EMOJIS = ['❤️', '🔥', '😂', '🙌', '🚀', '✨', '💎', '🏟️', '👑', '💯', '🙏', '⚡', '💡', '✅', '🌍', '🎧', '🏛️', '🇬🇭'];

interface ChatsProps {
  onStartCall: (name: string, type: 'audio' | 'video') => void;
  onOpenLink?: (url: string) => void;
}

type ChatCategory = 'PRIVATE' | 'COMMUNITY';

const Chats: React.FC<ChatsProps> = ({ onStartCall, onOpenLink }) => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [activeCategory, setActiveCategory] = useState<ChatCategory>('PRIVATE');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', sender: 'Ayiiga Benard', text: 'Yo! Have you checked the latest AI Lab update?', time: '10:00 AM', isMe: false, type: 'text' },
    { id: 'm2', sender: 'Me', text: 'Just testing it now. The image generation is insane! 🚀', time: '10:05 AM', isMe: true, type: 'text' },
    { id: 'm3', sender: 'Ayiiga Benard', type: 'link', linkUrl: 'https://openai.com', text: 'Check this new AI Research portal!', time: '11:22 AM', isMe: false }
  ]);
  const [input, setInput] = useState('');
  
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [contactSearch, setContactSearch] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const recordIntervalRef = useRef<any>(null);

  const filteredChats = useMemo(() => {
    return chats.filter(chat => {
      const matchesCategory = activeCategory === 'PRIVATE' ? !chat.isGroup : chat.isGroup;
      const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           chat.lastMsg.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [chats, activeCategory, searchQuery]);

  const filteredContacts = useMemo(() => {
    return MOCK_CONTACTS.filter(c => c.name.toLowerCase().includes(contactSearch.toLowerCase()));
  }, [contactSearch]);

  const addMessage = (msg: Partial<Message>) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'Me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      type: 'text',
      ...msg
    };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setShowEmojiPicker(false);
    setShowAttachmentMenu(false);
  };

  const handleSendText = () => {
    if (!input.trim()) return;
    addMessage({ text: input, type: 'text' });
  };

  const startVoiceRecord = () => {
    setIsRecording(true);
    setRecordTime(0);
    recordIntervalRef.current = setInterval(() => {
      setRecordTime(prev => prev + 1);
    }, 1000);
  };

  const stopVoiceRecord = (send = true) => {
    if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    setIsRecording(false);
    if (send && recordTime > 0) {
      addMessage({ type: 'audio', mediaUrl: '#', text: `Voice Note (${formatTime(recordTime)})` });
    }
  };

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleEmojiClick = (emoji: string) => {
    setInput(prev => prev + emoji);
  };

  const handleFileUpload = (type: Message['type']) => {
    const mockData: Record<string, Partial<Message>> = {
      image: { type: 'image', mediaUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop', text: 'Check this arena concept!' },
      file: { type: 'file', fileName: 'Roadmap_2025.pdf', fileSize: '4.8 MB', text: 'Official 2025 Roadmap' },
      contact: { type: 'contact', text: 'Benard Founder', mediaUrl: 'c4' }
    };
    addMessage(mockData[type || 'text'] || {});
  };

  const handleAudioCall = () => selectedChat && onStartCall(selectedChat.name, 'audio');
  const handleVideoCall = () => selectedChat && onStartCall(selectedChat.name, 'video');

  const getAudioLabel = (text?: string) => {
    if (!text) return '0:00';
    try {
      if (text.includes('(')) return text.split('(')[1].split(')')[0];
    } catch (e) {}
    return '0:42';
  };

  if (selectedChat) {
    return (
      <div className="flex flex-col h-full bg-black animate-in slide-in-from-right duration-300">
        <header className="h-20 flex items-center justify-between px-4 border-b border-zinc-900 bg-black/80 backdrop-blur-xl sticky top-16 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedChat(null)} className="p-2 text-zinc-400 hover:text-white transition-colors"><ArrowLeft size={24} /></button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[20px] bg-indigo-600/20 flex items-center justify-center font-black text-indigo-400 border border-indigo-500/20 italic tracking-tighter">
                {selectedChat.name[0]}
              </div>
              <div className="max-w-[120px]">
                <h4 className="font-black text-sm truncate italic tracking-tight">{selectedChat.name}</h4>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                   <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Active Now</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleAudioCall} className="text-indigo-400 p-2.5 hover:bg-indigo-500/10 rounded-2xl active:scale-90 transition-all group"><Phone size={22}/></button>
            <button onClick={handleVideoCall} className="text-indigo-400 p-2.5 hover:bg-indigo-500/10 rounded-2xl active:scale-90 transition-all group"><Video size={22}/></button>
            <button className="text-zinc-400 p-2.5 hover:text-white"><MoreVertical size={22} /></button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-36">
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[85%] rounded-[28px] ${m.isMe ? 'bg-indigo-600 text-white rounded-tr-none shadow-[0_4px_20px_rgba(79,70,229,0.25)]' : 'bg-zinc-900 text-zinc-200 rounded-tl-none border border-zinc-800 shadow-xl'}`}>
                {m.type === 'text' && <p className="px-5 py-4 text-sm font-semibold leading-relaxed">{m.text}</p>}
                {m.type === 'image' && (
                  <div className="p-1.5">
                    <img src={m.mediaUrl} className="w-full rounded-[22px] aspect-[4/5] object-cover mb-2" alt="Media" />
                    <p className="px-4 pb-3 text-xs font-bold opacity-90">{m.text}</p>
                  </div>
                )}
                {m.type === 'audio' && (
                  <div className="px-6 py-5 flex items-center gap-4 min-w-[240px]">
                    <button className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"><Play size={20} fill="currentColor" /></button>
                    <div className="flex-1 space-y-2">
                       <div className="h-1.5 bg-white/20 rounded-full relative overflow-hidden">
                          <div className="absolute inset-y-0 left-0 bg-white w-2/5 rounded-full"></div>
                       </div>
                       <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest opacity-60">
                          <span>0:42</span>
                          <span>{getAudioLabel(m.text)}</span>
                       </div>
                    </div>
                  </div>
                )}
                {m.type === 'file' && (
                  <div className="px-6 py-5 flex items-center gap-4 min-w-[220px]">
                    <div className="w-14 h-14 bg-white/5 rounded-[22px] flex items-center justify-center border border-white/5"><File size={28} className="text-indigo-400" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black truncate tracking-tight italic">{m.fileName}</p>
                      <p className="text-[9px] opacity-60 uppercase font-black tracking-widest">{m.fileSize}</p>
                    </div>
                    <button className="p-2 text-white/40 hover:text-white transition-colors"><Download size={20} /></button>
                  </div>
                )}
                {m.type === 'link' && (
                  <div 
                    onClick={() => onOpenLink?.(m.linkUrl!)}
                    className="p-1 cursor-pointer group"
                  >
                    <div className="bg-white/5 rounded-[24px] p-4 mb-2 group-hover:bg-white/10 transition-colors border border-white/5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                           <Globe size={16} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 truncate">Arena Portal</p>
                      </div>
                      <p className="text-xs font-bold text-white mb-1 truncate">{m.linkUrl?.replace(/^https?:\/\//, '')}</p>
                      <p className="text-[10px] text-zinc-500 line-clamp-2 italic leading-relaxed">{m.text}</p>
                    </div>
                    <div className="px-4 pb-3 flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-zinc-600">
                       <span>Tap to Initialize Lens</span>
                       <ChevronRight size={12} />
                    </div>
                  </div>
                )}
                {m.type === 'contact' && (
                  <div className="px-6 py-6 flex flex-col items-center text-center gap-4 min-w-[200px]">
                    <div className="w-16 h-16 bg-zinc-800 rounded-[24px] flex items-center justify-center font-black text-2xl italic tracking-tighter border-2 border-white/5">{(m.text || 'U')[0]}</div>
                    <div>
                       <p className="text-base font-black italic tracking-tight">{m.text}</p>
                       <p className="text-[9px] opacity-50 uppercase font-black tracking-[0.2em] mt-1">Arena Link</p>
                    </div>
                    <button className="w-full bg-white/10 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-widest border border-white/5 hover:bg-white/20 transition-all">Connect Pulse</button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-2.5 px-2">
                 <span className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">{m.time}</span>
                 {m.isMe && <CheckCheck size={14} className="text-indigo-500" />}
              </div>
            </div>
          ))}
        </div>

        {showEmojiPicker && (
          <div className="absolute bottom-32 left-6 right-6 bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-[40px] p-5 grid grid-cols-6 gap-3 z-50 shadow-2xl animate-in slide-in-from-bottom-4">
            {EMOJIS.map(e => <button key={e} onClick={() => handleEmojiClick(e)} className="text-3xl hover:scale-125 transition-transform p-2">{e}</button>)}
          </div>
        )}

        {showAttachmentMenu && (
          <div className="absolute bottom-32 left-6 w-64 bg-zinc-950/90 backdrop-blur-3xl border border-white/10 rounded-[40px] p-5 flex flex-col gap-2 z-50 shadow-2xl animate-in zoom-in-75 origin-bottom-left">
            <AttachmentItem icon={<Image size={22} />} label="Arena Gallery" color="text-pink-500" onClick={() => handleFileUpload('image')} />
            <AttachmentItem icon={<File size={22} />} label="Vault Docs" color="text-blue-500" onClick={() => handleFileUpload('file')} />
            <AttachmentItem icon={<UserIcon size={22} />} label="Contact Pulse" color="text-orange-500" onClick={() => handleFileUpload('contact')} />
            <AttachmentItem icon={<MapPin size={22} />} label="Neural Location" color="text-emerald-500" onClick={() => {}} />
            <AttachmentItem icon={<Music size={22} />} label="Sound Lab" color="text-purple-500" onClick={() => {}} />
          </div>
        )}

        <div className="p-6 bg-black border-t border-zinc-900 fixed bottom-20 left-0 right-0 z-[60] pb-10">
          {isRecording ? (
            <div className="flex items-center gap-4 bg-pink-600/10 border border-pink-500/20 rounded-[36px] px-8 py-5 animate-in slide-in-from-bottom">
               <div className="w-3 h-3 bg-pink-600 rounded-full animate-pulse shadow-[0_0_10px_#db2777]"></div>
               <span className="flex-1 font-black text-pink-500 tracking-tighter italic text-lg uppercase">Pulse Record: {formatTime(recordTime)}</span>
               <button onClick={() => stopVoiceRecord(false)} className="p-2 text-zinc-600 hover:text-white"><Trash2 size={24} /></button>
               <button onClick={() => stopVoiceRecord(true)} className="w-14 h-14 rounded-full bg-pink-600 flex items-center justify-center shadow-xl active:scale-90"><Send size={24} /></button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button onClick={() => { setShowAttachmentMenu(!showAttachmentMenu); setShowEmojiPicker(false); }} className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-all border ${showAttachmentMenu ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-zinc-900 text-zinc-500 border-white/5'}`}><Paperclip size={24} className={showAttachmentMenu ? 'rotate-[135deg]' : ''} /></button>
              <div className="flex-1 bg-zinc-900/80 backdrop-blur-xl border border-white/5 rounded-[36px] flex items-center px-5 py-4 transition-all focus-within:border-indigo-500/50 shadow-2xl">
                <button onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowAttachmentMenu(false); }} className="p-2 text-zinc-500 hover:text-yellow-500"><Smile size={26} /></button>
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendText()} placeholder="Pulse the arena..." className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-base font-bold text-white placeholder:text-zinc-800 px-3 italic" />
              </div>
              {input.trim() ? (
                <button onClick={handleSendText} className="w-16 h-14 rounded-[24px] bg-indigo-600 flex items-center justify-center shadow-2xl active:scale-90 transition-all"><Send size={26}/></button>
              ) : (
                <button onMouseDown={startVoiceRecord} onTouchStart={startVoiceRecord} className="w-16 h-14 rounded-[24px] bg-zinc-900 flex items-center justify-center shadow-xl active:scale-95 text-indigo-400"><Mic size={28} /></button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black relative">
      <div className="p-8 pb-4 bg-black/60 sticky top-16 z-30 backdrop-blur-3xl border-b border-white/5">
        <div className="relative mb-6">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={22} />
          <input type="text" placeholder="Search Arena Pulse..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-zinc-900 border border-white/5 rounded-[36px] py-5 pl-16 pr-8 text-base font-black italic tracking-tight focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-zinc-700 text-white" />
        </div>
        <div className="flex gap-4">
          <button onClick={() => setActiveCategory('PRIVATE')} className={`flex-1 py-4 px-6 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${activeCategory === 'PRIVATE' ? 'bg-indigo-600/20 border border-indigo-500/50 text-indigo-400' : 'bg-zinc-900 text-zinc-500'}`}><UserIcon size={18} /> Private Pulse</button>
          <button onClick={() => setActiveCategory('COMMUNITY')} className={`flex-1 py-4 px-6 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${activeCategory === 'COMMUNITY' ? 'bg-indigo-600/20 border border-indigo-500/50 text-indigo-400' : 'bg-zinc-900 text-zinc-500'}`}><Users size={18} /> Community Arena</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-52">
        {filteredChats.map(chat => (
          <div key={chat.id} onClick={() => setSelectedChat(chat)} className="group flex items-center gap-6 px-8 py-6 hover:bg-zinc-900/50 transition-all cursor-pointer border-b border-zinc-900/30">
            <div className="relative">
              <div className={`w-16 h-16 rounded-[26px] flex items-center justify-center text-2xl font-black italic tracking-tighter shadow-xl ${chat.isGroup ? 'bg-indigo-600/20 text-indigo-400' : 'bg-zinc-900 text-zinc-500'}`}>{chat.isGroup ? <Hash size={32} /> : chat.name[0]}</div>
              {chat.online && <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-[4px] border-black rounded-full shadow-lg"></div>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-zinc-100 truncate italic tracking-tight text-lg">{chat.name}</h3>
                  {chat.isPinned && <Pin size={12} className="text-indigo-500 fill-indigo-500" />}
                </div>
                <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{chat.time}</span>
              </div>
              <p className="text-sm text-zinc-500 truncate font-semibold">{chat.lastMsg}</p>
            </div>
            {chat.unread > 0 && <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full">{chat.unread}</span>}
          </div>
        ))}
      </div>
      
      <button onClick={() => setIsNewChatOpen(true)} className="fixed bottom-32 right-8 w-20 h-20 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-2xl active:scale-90 transition-all z-[60] border-2 border-white/20 group overflow-hidden"><Edit3 size={36} className="text-white relative z-10" /></button>

      {isNewChatOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-2xl p-10 flex flex-col animate-in slide-in-from-bottom duration-500">
          <header className="flex justify-between items-center mb-12 shrink-0">
            <div>
              <h2 className="text-4xl font-black italic tracking-tighter mb-2">NEW PULSE</h2>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em]">Connect to the Global Arena</p>
            </div>
            <button onClick={() => setIsNewChatOpen(false)} className="p-5 bg-zinc-900 rounded-[28px] text-zinc-400 border border-white/5"><X size={32}/></button>
          </header>
          <div className="relative mb-12">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-600" size={24} />
            <input autoFocus value={contactSearch} onChange={e => setContactSearch(e.target.value)} placeholder="Search Pulse Network..." className="w-full bg-zinc-900/80 border border-white/5 rounded-[40px] py-7 pl-20 pr-10 text-xl font-black italic tracking-tight focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all placeholder:text-zinc-800 text-white" />
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-5 pb-20">
            {filteredContacts.map(contact => (
              <div key={contact.id} onClick={() => {
                const newChat: Chat = { id: contact.id, name: contact.name, lastMsg: 'Vibe pulse established', time: 'Now', unread: 0, online: contact.online, isGroup: false, avatar: '' };
                setChats([newChat, ...chats.filter(c => c.id !== contact.id)]);
                setSelectedChat(newChat);
                setIsNewChatOpen(false);
              }} className="flex items-center gap-6 p-5 rounded-[40px] hover:bg-zinc-900 transition-all cursor-pointer group border border-transparent hover:border-white/5 shadow-lg active:scale-95">
                <div className="w-16 h-16 rounded-[26px] bg-zinc-800 flex items-center justify-center text-zinc-500 font-black italic tracking-tighter text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">{contact.name[0]}</div>
                <div className="flex-1">
                  <h5 className="font-black text-white italic tracking-tighter text-xl">{contact.name}</h5>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1">{contact.status}</p>
                </div>
                <ChevronRight size={24} className="text-zinc-800" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AttachmentItem: React.FC<{ icon: React.ReactNode; label: string; color: string; onClick: () => void }> = ({ icon, label, color, onClick }) => (
  <button onClick={onClick} className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-[24px] transition-all text-left group">
    <div className={`${color} bg-white/5 p-3 rounded-2xl group-hover:scale-110 transition-transform`}>{icon}</div>
    <span className="text-xs font-black uppercase tracking-widest text-zinc-300 group-hover:text-white">{label}</span>
  </button>
);

export default Chats;
