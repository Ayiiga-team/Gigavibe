
import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Share2, 
  ShieldCheck, 
  MoreHorizontal, 
  ExternalLink,
  Copy,
  Globe
} from 'lucide-react';

interface InAppBrowserProps {
  url: string;
  onClose: () => void;
}

const InAppBrowser: React.FC<InAppBrowserProps> = ({ url, onClose }) => {
  const [currentUrl, setCurrentUrl] = useState(url);
  const [isLoading, setIsLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate page load progress
    setIsLoading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [currentUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    alert("Arena link copied! 🔗");
    setShowOptions(false);
  };

  const handleOpenExternal = () => {
    window.open(currentUrl, '_blank');
    setShowOptions(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-black animate-in slide-in-from-bottom duration-500 overflow-hidden relative">
      {/* Browser Header */}
      <header className="shrink-0 bg-black border-b border-white/5 z-50">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
            <div className="flex items-center gap-0.5">
              <button className="p-2 text-zinc-600 hover:text-white transition-colors disabled:opacity-30">
                <ChevronLeft size={22} />
              </button>
              <button className="p-2 text-zinc-600 hover:text-white transition-colors disabled:opacity-30">
                <ChevronRight size={22} />
              </button>
            </div>
          </div>

          <div className="flex-1 mx-2 flex items-center justify-center">
            <div className="w-full max-w-md bg-zinc-900/80 border border-white/5 rounded-2xl px-4 py-2 flex items-center gap-2 group">
              <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-tight text-zinc-400 truncate text-center flex-1">
                {currentUrl.replace(/^https?:\/\//, '')}
              </span>
              <button onClick={() => setCurrentUrl(currentUrl)} className={`text-zinc-500 hover:text-white transition-all ${isLoading ? 'animate-spin' : ''}`}>
                <RotateCw size={14} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={() => setShowOptions(!showOptions)} className="p-2 text-zinc-400 hover:text-white transition-colors">
              <MoreHorizontal size={24} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-[2px] w-full bg-zinc-900 relative overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-indigo-500 transition-all duration-300 ease-out shadow-[0_0_8px_rgba(99,102,241,0.6)]"
            style={{ width: `${progress}%`, opacity: progress === 100 ? 0 : 1 }}
          />
        </div>
      </header>

      {/* Browser Content */}
      <div className="flex-1 bg-white relative">
        {/* Placeholder for iframe - in a real app this would be a webview/iframe */}
        <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center p-10 text-center">
          <div className="w-20 h-20 rounded-3xl bg-zinc-900 flex items-center justify-center mb-6 border border-white/10 shadow-2xl">
             <Globe size={40} className="text-indigo-500 animate-pulse" />
          </div>
          <h2 className="text-xl font-black italic tracking-tighter text-white uppercase mb-2">Connecting to Arena Lens</h2>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] max-w-xs leading-relaxed">
            Opening external portal: <br/> <span className="text-indigo-400 mt-2 block lowercase">{currentUrl}</span>
          </p>
          
          <div className="mt-12 p-8 bg-zinc-900/50 rounded-[32px] border border-white/5 max-w-xs">
            <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest leading-relaxed mb-6">
              Security Notice: You are now viewing external content synchronized with the GIGAVibe Global Arena.
            </p>
            <button 
              onClick={handleOpenExternal}
              className="w-full bg-indigo-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-2"
            >
              <ExternalLink size={14} /> Open in System Browser
            </button>
          </div>
        </div>
        
        {/* Actual Iframe (Limited by X-Frame-Options in some sites) */}
        <iframe 
          src={currentUrl} 
          className="w-full h-full border-none bg-white relative z-10"
          title="GIGA-Lens Content"
          onLoad={() => setProgress(100)}
        />
      </div>

      {/* Options Dropdown */}
      {showOptions && (
        <div className="absolute top-16 right-4 w-56 bg-zinc-950/95 backdrop-blur-3xl border border-white/10 rounded-[32px] p-3 z-[60] shadow-2xl animate-in zoom-in-95 duration-200">
          <OptionItem icon={<Copy size={18} />} label="Copy Link" onClick={handleCopyLink} />
          <OptionItem icon={<Share2 size={18} />} label="Share to Pulse" onClick={() => {}} />
          <OptionItem icon={<ExternalLink size={18} />} label="Open Externally" onClick={handleOpenExternal} />
        </div>
      )}
    </div>
  );
};

const OptionItem: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center gap-3 p-4 hover:bg-white/5 rounded-2xl transition-colors text-left group">
    <div className="text-zinc-500 group-hover:text-indigo-400 transition-colors">{icon}</div>
    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 group-hover:text-white">{label}</span>
  </button>
);

export default InAppBrowser;
