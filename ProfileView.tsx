
import React, { useRef, useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Settings, 
  Edit2, 
  Share2, 
  LogOut, 
  Camera, 
  Star,
  User,
  Video,
  Music,
  ImageIcon,
  LayoutGrid,
  Sparkles,
  Play,
  X,
  Check,
  Coins,
  Gem,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

interface ProfileViewProps {
  onClose: () => void;
  onLogout: () => void;
  onMonetize?: (type: 'TIP' | 'SUBSCRIBE', creator: string) => void;
  isVerified?: boolean;
  onVerify?: () => void;
}

type ContentFilter = 'ALL' | 'VIDEOS' | 'PHOTOS' | 'MUSIC';

const MOCK_PROFILE_POSTS = [
  { id: 1, type: 'VIDEOS', img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop' },
  { id: 2, type: 'PHOTOS', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=400&fit=crop' },
  { id: 3, type: 'MUSIC', img: 'https://images.unsplash.com/photo-1514525253361-bee8718a300a?w=400&h=400&fit=crop' },
  { id: 4, type: 'VIDEOS', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop' },
  { id: 5, type: 'PHOTOS', img: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&h=400&fit=crop' },
];

const ProfileView: React.FC<ProfileViewProps> = ({ onClose, onLogout, onMonetize, isVerified, onVerify }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [bio, setBio] = useState('Building the Intelligent Global Arena. Africa to the World. 🌍 Founders @ GIGAVibe.');
  const [tempBio, setTempBio] = useState(bio);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ContentFilter>('ALL');

  const filteredPosts = useMemo(() => {
    if (activeFilter === 'ALL') return MOCK_PROFILE_POSTS;
    return MOCK_PROFILE_POSTS.filter(p => p.type === activeFilter);
  }, [activeFilter]);

  const handleUpdateBio = () => {
    if (window.confirm("Broadcast update to the Global Arena? This change is visible to 1.2M fans.")) {
      setBio(tempBio);
      setIsEditingBio(false);
      alert("Bio Synced Successfully! 🚀");
    }
  };

  const handleCancelBio = () => {
    setTempBio(bio);
    setIsEditingBio(false);
  };

  const handleLogoutAction = () => {
    if (window.confirm("Terminate GIGAVibe session? Your presence in the Global Arena will be paused.")) {
      onLogout();
    }
  };

  const isOwner = true; // Mock

  return (
    <div className="h-full flex flex-col bg-black overflow-y-auto pb-20 no-scrollbar">
      <header className="h-16 flex items-center justify-between px-4 sticky top-0 bg-black/90 backdrop-blur-md z-10 border-b border-zinc-900">
        <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-2xl transition-colors text-white"><ArrowLeft size={24} /></button>
        <h3 className="font-black text-lg tracking-tight italic text-white">Profile Studio</h3>
        <div className="flex gap-2">
          <button className="p-2 text-zinc-400 hover:text-white"><Share2 size={20} /></button>
          <button className="p-2 text-zinc-400 hover:text-white"><Settings size={20} /></button>
        </div>
      </header>

      <div className="flex flex-col items-center pt-10 px-6">
        <div className="relative group cursor-pointer mb-6" onClick={() => fileInputRef.current?.click()}>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setProfileImg(URL.createObjectURL(file));
          }} />
          <div className="w-24 h-24 rounded-[32px] bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 p-0.5 shadow-2xl transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-zinc-900 rounded-[30px] flex items-center justify-center overflow-hidden">
              {profileImg ? <img src={profileImg} className="w-full h-full object-cover" alt="Profile" /> : <User size={36} className="text-zinc-700" />}
            </div>
          </div>
          <div className="absolute bottom-4 right-0 w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center border-4 border-black">
            <Camera size={12} className="text-white" />
          </div>
        </div>

        <h2 className="text-xl font-black flex items-center gap-2 text-white italic tracking-tighter uppercase">
           Ayiiga Benard 
           {isVerified ? (
             <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-500/10" />
           ) : (
             <Star className="text-yellow-500 fill-yellow-500" size={16} />
           )}
        </h2>
        <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mt-1 mb-6">
           {isVerified ? 'Verified Global Creator' : 'Elite Founder'}
        </p>

        <div className="w-full max-w-sm text-center px-4 mb-8">
          {isEditingBio ? (
            <div className="flex flex-col gap-4">
              <textarea 
                value={tempBio} 
                onChange={(e) => setTempBio(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-300 outline-none resize-none font-medium focus:ring-1 focus:ring-indigo-500"
                rows={3}
              />
              <div className="flex gap-2">
                <button onClick={handleCancelBio} className="flex-1 bg-zinc-900 text-zinc-400 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                  <X size={14} /> Cancel
                </button>
                <button onClick={handleUpdateBio} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                  <Check size={14} /> Save Vibe
                </button>
              </div>
            </div>
          ) : (
            <div className="group cursor-pointer" onClick={() => setIsEditingBio(true)}>
              <p className="text-sm text-zinc-400 leading-relaxed italic font-medium">{bio}</p>
              <div className="flex items-center justify-center gap-1 text-[9px] text-indigo-500 font-black uppercase mt-2 opacity-0 group-hover:opacity-100 transition-all">
                <Edit2 size={10} /> Edit Arena Bio
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-10 mb-8">
          <Stat label="Vibes" value="124" />
          <Stat label="Fans" value="1.2M" />
        </div>

        {/* Monetization Actions for Fans */}
        {!isOwner && (
          <div className="flex gap-3 w-full max-w-sm mb-6 px-4">
            <button 
              onClick={() => onMonetize?.('SUBSCRIBE', 'Ayiiga Benard')}
              className="flex-1 bg-indigo-600 text-white py-5 rounded-[24px] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-indigo-900/20 active:scale-95 transition-all"
            >
              Subscribe <Gem size={14} />
            </button>
            <button 
              onClick={() => onMonetize?.('TIP', 'Ayiiga Benard')}
              className="flex-1 bg-amber-500 text-black py-5 rounded-[24px] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-amber-900/20 active:scale-95 transition-all"
            >
              Send Tip <Coins size={14} />
            </button>
          </div>
        )}

        {isOwner && !isVerified && (
          <button 
            onClick={onVerify}
            className="w-full max-w-sm mb-6 bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 py-5 rounded-[24px] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
             <ShieldCheck size={16} /> Verify Your Identity
          </button>
        )}

        <div className="flex gap-3 w-full max-w-sm mb-10 px-4">
          <button className="flex-1 bg-white text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">Edit Studio</button>
          <button className="flex-1 bg-zinc-900 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-zinc-800 active:scale-95 transition-all text-white">Insights</button>
        </div>
      </div>

      <div className="border-t border-zinc-900/50">
        <div className="flex px-4 py-4 gap-2 overflow-x-auto no-scrollbar bg-black/50 backdrop-blur-xl sticky top-16 z-10">
          <FilterChip label="All" active={activeFilter === 'ALL'} onClick={() => setActiveFilter('ALL')} />
          <FilterChip label="Videos" active={activeFilter === 'VIDEOS'} onClick={() => setActiveFilter('VIDEOS')} />
          <FilterChip label="Photos" active={activeFilter === 'PHOTOS'} onClick={() => setActiveFilter('PHOTOS')} />
          <FilterChip label="Music" active={activeFilter === 'MUSIC'} onClick={() => setActiveFilter('MUSIC')} />
        </div>
        
        <div className="grid grid-cols-3 gap-0.5">
          {filteredPosts.map((post) => (
            <div key={post.id} className="aspect-square bg-zinc-900 relative group overflow-hidden">
              <img src={post.img} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Post" />
              {post.type === 'VIDEOS' && (
                <div className="absolute bottom-2 left-2 text-white">
                  <Play size={12} fill="currentColor" />
                </div>
              )}
              {post.type === 'MUSIC' && (
                <div className="absolute bottom-2 left-2 text-white">
                  <Music size={12} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-8">
        <button 
          onClick={handleLogoutAction}
          className="w-full py-5 rounded-[32px] bg-red-600/5 text-red-500 border border-red-500/10 font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-red-600/10 transition-all"
        >
          <LogOut size={18} /> Exit Arena Session
        </button>
      </div>
    </div>
  );
};

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col items-center">
    <span className="text-lg font-black text-white italic tracking-tighter">{value}</span>
    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{label}</span>
  </div>
);

const FilterChip: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
      active ? 'bg-white text-black' : 'bg-zinc-900/50 text-zinc-600 border border-white/5'
    }`}
  >
    {label}
  </button>
);

export default ProfileView;
