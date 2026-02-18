
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Mic, Video, Repeat, Sparkles, MessageSquare, Heart, Gift, 
  Users, Pause, Play, Download, Save, Award, Camera, MicOff, 
  VideoOff, LayoutGrid, Music, Share2, Crown, ArrowLeft, 
  ImageIcon, RefreshCcw, Send, ShoppingBag, Zap, Brain, Target,
  Star, Flame, ChevronRight, Gem, AlertTriangle
} from 'lucide-react';

interface LiveStreamViewProps {
  onClose: () => void;
}

interface StreamMessage {
  id: string;
  user: string;
  msg: string;
  isHost?: boolean;
  isSystem?: boolean;
  color?: string;
}

interface HeartParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
}

const USER_COLORS = ['text-blue-400', 'text-pink-400', 'text-emerald-400', 'text-amber-400', 'text-purple-400', 'text-orange-400'];
const HEART_COLORS = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const LiveStreamView: React.FC<LiveStreamViewProps> = ({ onClose }) => {
  const [isStarting, setIsStarting] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [viewers, setViewers] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState('none');
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [showGiftHub, setShowGiftHub] = useState(false);
  const [streamTime, setStreamTime] = useState(0);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  
  const [hearts, setHearts] = useState<HeartParticle[]>([]);
  const [isAICohostActive, setIsAICohostActive] = useState(false);
  const [showShoppingPin, setShowShoppingPin] = useState(true);
  const [goalProgress, setGoalProgress] = useState(65);
  
  const [messages, setMessages] = useState<StreamMessage[]>([
    { id: '1', user: 'Arena_Bot', msg: 'Welcome to the Intelligent Global Arena! 🏛️', isHost: true, color: 'text-red-500' },
    { id: '2', user: 'System', msg: 'Neural Stream Link Optimized.', isSystem: true, color: 'text-indigo-400' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const currentStreamRef = useRef<MediaStream | null>(null);

  const spawnHeart = (e?: React.MouseEvent | React.TouchEvent) => {
    let startX, startY;
    if (e) {
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      startX = clientX;
      startY = clientY;
    } else {
      startX = window.innerWidth - 60;
      startY = window.innerHeight - 150;
    }

    const newHeart: HeartParticle = {
      id: Date.now(),
      x: startX,
      y: startY,
      color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
      size: Math.random() * 20 + 20,
      rotation: Math.random() * 40 - 20
    };

    setHearts(prev => [...prev, newHeart]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 2000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    let timer: any;
    let chatTimer: any;
    
    if (isLive && !isPaused) {
      timer = setInterval(() => {
        setStreamTime(prev => prev + 1);
        if (streamTime > 0 && streamTime % 10 === 0) setViewers(v => v + Math.floor(Math.random() * 10));
        if (Math.random() > 0.85) spawnHeart();
      }, 1000);

      chatTimer = setInterval(() => {
        const randomViewers = ['GigaFan_22', 'Sarah_Dev', 'Kwame_Pulse', 'TechKing', 'ArenaLover'];
        const randomMsgs = ['This is fire! 🔥', 'Accra is live today!', 'GIGAVibe for life.', 'Check out the AI Lab!', 'Love this content.'];
        
        if (Math.random() > 0.6) {
          const newMsg: StreamMessage = {
            id: Date.now().toString(),
            user: randomViewers[Math.floor(Math.random() * randomViewers.length)],
            msg: randomMsgs[Math.floor(Math.random() * randomMsgs.length)],
            color: USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]
          };
          setMessages(prev => [...prev.slice(-15), newMsg]);
        }
      }, 2500);
    }
    return () => {
      if (timer) clearInterval(timer);
      if (chatTimer) clearInterval(chatTimer);
    };
  }, [isLive, isPaused, streamTime]);

  const stopCurrentStream = () => {
    if (currentStreamRef.current) {
      currentStreamRef.current.getTracks().forEach(track => track.stop());
      currentStreamRef.current = null;
    }
  };

  const getCameraStream = async (mode: 'user' | 'environment') => {
    stopCurrentStream();
    
    // Multi-stage silent fallback
    const constraintStages = [
      { video: { facingMode: { ideal: mode }, width: { ideal: 1280 } }, audio: true },
      { video: true, audio: true },
      { video: true },
      { audio: true }
    ];

    for (const constraints of constraintStages) {
      try {
        if (!navigator.mediaDevices?.getUserMedia) break;
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        currentStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsSimulationMode(false);
        setIsVideoOff(!constraints.video);
        return stream;
      } catch (e) {
        continue; // Try next fallback silently
      }
    }

    // Entering Simulation Mode if hardware unavailable
    setIsSimulationMode(true);
    setIsVideoOff(true);
    return null;
  };

  const startBroadcast = async () => {
    await getCameraStream(facingMode);
    setIsStarting(false);
    setIsLive(true);
  };

  useEffect(() => {
    getCameraStream(facingMode);
    return () => stopCurrentStream();
  }, []);

  const toggleAICohost = () => {
    setIsAICohostActive(!isAICohostActive);
    if (!isAICohostActive) {
      const newMsg: StreamMessage = {
        id: 'ai-' + Date.now(),
        user: 'Neural AI',
        msg: 'Pulse AI Moderator initialized. Analyzing Arena engagement.',
        isSystem: true,
        color: 'text-indigo-400'
      };
      setMessages(prev => [...prev, newMsg]);
    }
  };

  if (isStarting) {
    return (
      <div className="h-full bg-black flex flex-col p-8 animate-in fade-in duration-500 overflow-hidden">
        <header className="flex items-center gap-4 mb-10">
          <button onClick={onClose} className="p-3 bg-zinc-900 rounded-2xl text-zinc-400">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-black italic tracking-tighter uppercase">ARENA LIVE STUDIO</h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Initialization</p>
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full aspect-[9/16] max-w-[280px] bg-zinc-900 rounded-[48px] border-2 border-zinc-800 overflow-hidden relative group shadow-2xl">
            {isSimulationMode ? (
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950 via-zinc-900 to-black flex flex-col items-center justify-center p-8 text-center">
                 <Brain size={48} className="text-indigo-500 mb-4 animate-pulse" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Simulation Proxy Active</p>
              </div>
            ) : (
               <video ref={videoRef} autoPlay muted playsInline className={`w-full h-full object-cover z-0 ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`} />
            )}
          </div>
          <div className="w-full max-w-sm mt-12">
            <input type="text" placeholder="Title your Arena..." className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-lg font-black outline-none text-white italic" />
          </div>
        </div>
        <button onClick={startBroadcast} className="w-full bg-indigo-600 py-6 rounded-3xl font-black text-xl uppercase tracking-widest active:scale-95 transition-all mt-10">
          GO LIVE
        </button>
      </div>
    );
  }

  return (
    <div 
      className="h-screen bg-black relative animate-in fade-in duration-500 overflow-hidden"
      onClick={(e) => spawnHeart(e)}
    >
      <div className="absolute inset-0 z-0">
         {!isSimulationMode ? (
           <video 
             ref={videoRef} 
             autoPlay 
             muted={isMicMuted} 
             playsInline 
             className={`w-full h-full object-cover transition-all ${isVideoOff ? 'opacity-0' : 'opacity-100'}`} 
           />
         ) : (
           <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center">
              <Brain size={120} className="text-indigo-900/40 mb-4 animate-bounce" />
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-900">Neural Sync Active</p>
           </div>
         )}
         <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
      </div>

      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {hearts.map(heart => (
          <div key={heart.id} className="absolute animate-heart-rise" style={{ left: heart.x, top: heart.y, color: heart.color, fontSize: heart.size, transform: `rotate(${heart.rotation}deg)` }}>
            <Heart fill="currentColor" />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 p-6 flex flex-col z-10">
        <header className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-red-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div> LIVE
              </div>
              <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 text-[10px] font-black border border-white/10">
                <Users size={14} className="text-white" /> {viewers}
              </div>
            </div>
            <div className="w-48 bg-black/40 backdrop-blur-md p-2 rounded-2xl border border-white/10 mt-2">
               <div className="h-1 bg-indigo-500 shadow-[0_0_10px_#6366f1]" style={{ width: `${goalProgress}%` }}></div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-red-600 rounded-2xl shadow-xl"><X size={22} /></button>
        </header>

        <div className="flex-1 flex flex-col justify-end gap-3 pb-28 overflow-hidden pointer-events-none">
           <div className="space-y-3 overflow-y-auto no-scrollbar max-h-[350px] pr-20">
              {messages.map((m) => (
                <LiveChatMsg key={m.id} user={m.user} msg={m.msg} isHost={m.isHost} isSystem={m.isSystem} color={m.color} />
              ))}
              <div ref={chatEndRef} />
           </div>
        </div>

        <div className="absolute right-6 bottom-28 flex flex-col items-center gap-5 z-20">
           <CircularBtn icon={<Brain size={24} />} active={isAICohostActive} onClick={toggleAICohost} label="AI" />
           <CircularBtn icon={<Star size={24} />} onClick={() => setShowFilters(!showFilters)} label="FX" />
           <CircularBtn icon={<Repeat size={24} />} onClick={() => setFacingMode(f => f === 'user' ? 'environment' : 'user')} label="Flip" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center gap-3">
          <div className="flex-1 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[32px] px-5 py-4 flex items-center shadow-2xl">
             <input 
               type="text" 
               value={chatInput}
               onChange={e => setChatInput(e.target.value)}
               placeholder="Vibe with the arena..." 
               className="flex-1 bg-transparent border-none outline-none text-sm text-white font-bold italic placeholder:text-zinc-700" 
             />
             {chatInput.trim() && (
               <button onClick={() => {}} className="p-2.5 bg-indigo-600 rounded-2xl text-white"><Send size={20} /></button>
             )}
          </div>
          <button onClick={() => spawnHeart()} className="w-16 h-16 rounded-full bg-pink-600/20 backdrop-blur-xl border border-pink-500/30 flex items-center justify-center text-pink-500 active:scale-75 transition-transform">
            <Heart size={30} fill="currentColor" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes heart-rise {
          0% { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-500px) scale(2) rotate(45deg); opacity: 0; }
        }
        .animate-heart-rise { animation: heart-rise 2s ease-out forwards; }
      `}</style>
    </div>
  );
};

const LiveChatMsg: React.FC<{ user: string; msg: string; isHost?: boolean; isSystem?: boolean; color?: string }> = ({ user, msg, isHost, isSystem, color }) => (
  <div className={`flex flex-col gap-1 p-3 rounded-[20px] backdrop-blur-md border border-white/5 pointer-events-auto ${isSystem ? 'bg-indigo-600/15' : 'bg-black/30'}`}>
     <span className={`font-black text-[9px] uppercase tracking-widest ${color || 'text-zinc-500'}`}>
       {isHost ? 'HOST' : isSystem ? 'SYSTEM' : user}
     </span>
     <span className="text-white font-bold text-xs italic">{msg}</span>
  </div>
);

const CircularBtn: React.FC<{ icon: React.ReactNode; active?: boolean; onClick: () => void; label: string }> = ({ icon, active, onClick, label }) => (
  <div className="flex flex-col items-center gap-1.5 pointer-events-auto">
    <button onClick={onClick} className={`w-14 h-14 rounded-full flex items-center justify-center text-white active:scale-75 transition-all border border-white/10 backdrop-blur-3xl ${active ? 'bg-indigo-600 border-indigo-400' : 'bg-black/40'}`}>
      {icon}
    </button>
    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{label}</span>
  </div>
);

export default LiveStreamView;
