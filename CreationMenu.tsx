import React from 'react';
import { Video, Image, Music, Radio, X, Film } from 'lucide-react';

interface CreationMenuProps {
  onClose: () => void;
  onAction: (type: 'VIDEO' | 'PHOTO' | 'MUSIC' | 'LIVE') => void;
}

const CreationMenu: React.FC<CreationMenuProps> = ({ onClose, onAction }) => {
  return (
    <div className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6">
      {/* Tap outside to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black italic tracking-tighter text-white mb-2">Create Vibe</h2>
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Intelligent Arena Studio</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ActionButton 
            onClick={() => onAction('VIDEO')} 
            icon={<Film className="text-white" size={28} />} 
            label="Upload Video" 
            bgColor="bg-pink-600"
            description="Clips & Stories"
          />
          <ActionButton 
            onClick={() => onAction('PHOTO')} 
            icon={<Image className="text-white" size={28} />} 
            label="Gallery" 
            bgColor="bg-blue-600"
            description="Photos & Art"
          />
          <ActionButton 
            onClick={() => onAction('MUSIC')} 
            icon={<Music className="text-white" size={28} />} 
            label="Sound Lab" 
            bgColor="bg-purple-600"
            description="Upload Tracks"
          />
          <ActionButton 
            onClick={() => onAction('LIVE')} 
            icon={<Radio className="text-white" size={28} />} 
            label="Go Live" 
            bgColor="bg-red-600"
            description="Start Stream"
          />
        </div>

        <div className="mt-12 flex justify-center">
          <button 
            onClick={onClose}
            className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center text-white active:scale-90 transition-all shadow-2xl"
          >
            <X size={32} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; description: string; onClick: () => void; bgColor: string }> = ({ icon, label, description, onClick, bgColor }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-3 p-6 rounded-[32px] bg-zinc-900 border border-zinc-800 hover:border-indigo-500 active:scale-95 transition-all group"
  >
    <div className={`p-4 rounded-2xl ${bgColor} shadow-lg transition-transform group-hover:scale-110`}>
      {icon}
    </div>
    <div className="text-center">
      <h4 className="text-[10px] font-black text-white uppercase tracking-wider">{label}</h4>
      <p className="text-[8px] font-bold text-zinc-500 uppercase mt-0.5">{description}</p>
    </div>
  </button>
);

export default CreationMenu;