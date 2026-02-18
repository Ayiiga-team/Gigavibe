
import React, { useState, useEffect, useRef } from 'react';
import { X, Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, User, Sparkles, ShieldCheck, Brain } from 'lucide-react';

interface CallOverlayProps {
  onClose: () => void;
  callName: string;
  callType: 'audio' | 'video';
}

const CallOverlay: React.FC<CallOverlayProps> = ({ onClose, callName, callType }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'CONNECTING' | 'CONNECTED'>('CONNECTING');
  const [isSensorOffline, setIsSensorOffline] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const initMedia = async () => {
      const constraints = callType === 'video' 
        ? [{ video: { facingMode: { ideal: 'user' } }, audio: true }, { video: true, audio: true }, { audio: true }]
        : [{ audio: true }];

      let streamFound = false;
      for (const config of constraints) {
        try {
          if (!navigator.mediaDevices?.getUserMedia) break;
          const stream = await navigator.mediaDevices.getUserMedia(config);
          streamRef.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
          setIsVideoOff(!config.video);
          streamFound = true;
          break;
        } catch (e) {
          continue;
        }
      }

      if (!streamFound) {
        setIsSensorOffline(true);
        setIsVideoOff(true);
      }
    };

    initMedia();

    const timer = setTimeout(() => setCallStatus('CONNECTED'), 2500);
    
    let ticker: any;
    if (callStatus === 'CONNECTED') {
      ticker = setInterval(() => setCallDuration(d => d + 1), 1000);
    }

    return () => {
      clearTimeout(timer);
      if (ticker) clearInterval(ticker);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [callStatus, callType]);

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="h-full w-full bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Immersive Background */}
      {callType === 'video' && !isSensorOffline ? (
        <div className="absolute inset-0">
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline
            className={`w-full h-full object-cover transition-opacity duration-1000 ${isVideoOff ? 'opacity-0' : 'opacity-40'}`} 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950 via-black to-zinc-950">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" />
        </div>
      )}

      {/* Identity Profile */}
      <div className="relative z-10 flex flex-col items-center gap-6 animate-in zoom-in duration-700">
        <div className="relative">
          <div className={`w-32 h-32 rounded-[48px] bg-zinc-900 flex items-center justify-center border-4 border-white/10 overflow-hidden shadow-2xl ${callStatus === 'CONNECTED' ? 'ring-4 ring-indigo-500/20' : 'animate-pulse'}`}>
            {isSensorOffline ? <Brain size={64} className="text-indigo-400 opacity-50" /> : <User size={64} className="text-zinc-700" />}
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center border-4 border-zinc-950 shadow-lg">
            {isSensorOffline ? <Sparkles size={18} /> : (callType === 'video' ? <Video size={18} /> : <Volume2 size={18} />)}
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-3xl font-black italic tracking-tighter mb-2">{callName}</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
            {callStatus === 'CONNECTING' ? 'Securing Neural Link...' : (isSensorOffline ? 'Neural Audio Proxy Active' : formatTime(callDuration))}
          </p>
        </div>
      </div>

      {/* Security Badge */}
      <div className="absolute top-12 flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 z-20">
        <ShieldCheck size={14} className="text-emerald-400" />
        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">End-to-End Encryption</span>
      </div>

      {/* Control Panel */}
      <div className="absolute bottom-20 left-0 right-0 px-10 flex flex-col items-center gap-10 z-20">
        <div className="flex items-center justify-center gap-8">
           <CallBtn 
             icon={isMuted ? <MicOff /> : <Mic />} 
             active={isMuted} 
             onClick={() => setIsMuted(!isMuted)} 
           />
           
           <button 
             onClick={onClose}
             className="w-20 h-20 rounded-[32px] bg-red-600 flex items-center justify-center shadow-2xl shadow-red-900/50 hover:scale-105 active:scale-90 transition-all border-4 border-white/10"
           >
             <PhoneOff size={32} />
           </button>

           {callType === 'video' && !isSensorOffline ? (
             <CallBtn 
               icon={isVideoOff ? <VideoOff /> : <Video />} 
               active={isVideoOff} 
               onClick={() => setIsVideoOff(!isVideoOff)} 
             />
           ) : (
             <CallBtn icon={<Volume2 />} />
           )}
        </div>
        
        <div className="flex items-center gap-3 text-zinc-600">
          <Sparkles size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {isSensorOffline ? 'Arena AI Neural Link Active' : 'GIGAVibe AI Noise Cancellation Active'}
          </span>
        </div>
      </div>
    </div>
  );
};

const CallBtn: React.FC<{ icon: React.ReactNode; active?: boolean; onClick?: () => void }> = ({ icon, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-16 h-16 rounded-[28px] flex items-center justify-center border transition-all active:scale-75 ${
      active ? 'bg-white text-black border-white' : 'bg-white/10 text-white border-white/10'
    }`}
  >
    {icon}
  </button>
);

export default CallOverlay;
