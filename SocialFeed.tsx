
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Plus, 
  X, 
  Star, 
  Send, 
  MoreHorizontal, 
  Rocket, 
  Radio,
  RefreshCw,
  Loader2,
  CheckCircle2,
  TrendingUp,
  Globe,
  Coins,
  Lock,
  Gem,
  Search,
  Hash,
  MapPin,
  Compass,
  Zap,
  ExternalLink,
  ChevronRight,
  Target,
  BarChart3,
  Flame,
  UserPlus,
  UserCheck
} from 'lucide-react';
import { CreatorPost, CommentData } from '../types';
import { GoogleGenAI } from '@google/genai';

interface SocialFeedProps {
  posts: CreatorPost[];
  setPosts: React.Dispatch<React.SetStateAction<CreatorPost[]>>;
  onOpenLink?: (url: string) => void;
  onMonetize?: (type: 'TIP' | 'SUBSCRIBE', creator: string) => void;
  onShare?: (post: CreatorPost) => void;
}

const SocialFeed: React.FC<SocialFeedProps> = ({ posts, setPosts, onOpenLink, onMonetize, onShare }) => {
  const [feedMode, setFeedMode] = useState<'FOR_YOU' | 'GLOBAL_PULSE' | 'NEARBY'>('FOR_YOU');
  const [activeCommentPost, setActiveCommentPost] = useState<CreatorPost | null>(null);
  const [activeMoreMenu, setActiveMoreMenu] = useState<CreatorPost | null>(null);
  const [activeBoostPost, setActiveBoostPost] = useState<CreatorPost | null>(null);
  const [newComment, setNewComment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  
  // Grounding states
  const [pulseData, setPulseData] = useState<{ text: string; sources: any[] } | null>(null);
  const [nearbyData, setNearbyData] = useState<{ text: string; sources: any[] } | null>(null);
  const [isGroundingLoading, setIsGroundingLoading] = useState(false);

  // Boost states
  const [boostBudget, setBoostBudget] = useState(50);
  const [boostDays, setBoostDays] = useState(3);
  const [isBoosting, setIsBoosting] = useState(false);
  const [boostSuccess, setBoostSuccess] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullY, setPullY] = useState(0);
  const startY = useRef(0);
  const feedRef = useRef<HTMLDivElement>(null);

  // Real-time filtering logic
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const query = searchQuery.toLowerCase();
    return posts.filter(post => {
      const inCaption = post.caption.toLowerCase().includes(query);
      const inHashtags = post.hashtags?.some(tag => tag.toLowerCase().includes(query));
      return inCaption || inHashtags;
    });
  }, [posts, searchQuery]);

  const handleFetchPulse = async () => {
    setIsGroundingLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Summarize the top 3 global trending events in technology, finance, and creative arts for today in a short, punchy 'Arena Pulse' format. Be concise.",
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      setPulseData({ text: response.text || "Pulse synchronization failed.", sources });
    } catch (err) {
      console.error(err);
      setPulseData({ text: "Neural link unstable. Could not fetch pulse.", sources: [] });
    } finally {
      setIsGroundingLoading(false);
    }
  };

  const handleFetchNearby = async () => {
    setIsGroundingLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let lat = 5.6037; // Default Accra
      let lng = -0.1870;

      if (navigator.geolocation) {
        const pos = await new Promise<GeolocationPosition>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: "Find 3 trending creative hubs, lounges, or tech arenas near my current location. Briefly explain why they are popular right now.",
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: { latLng: { latitude: lat, longitude: lng } }
          }
        }
      });
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      setNearbyData({ text: response.text || "No arenas found nearby.", sources });
    } catch (err) {
      console.error(err);
      setNearbyData({ text: "Could not access geographic pulse data.", sources: [] });
    } finally {
      setIsGroundingLoading(false);
    }
  };

  useEffect(() => {
    if (feedMode === 'GLOBAL_PULSE' && !pulseData) handleFetchPulse();
    if (feedMode === 'NEARBY' && !nearbyData) handleFetchNearby();
  }, [feedMode]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (feedRef.current && feedRef.current.scrollTop === 0) {
      startY.current = e.touches[0].pageY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current > 0 && feedRef.current && feedRef.current.scrollTop === 0) {
      const currentY = e.touches[0].pageY;
      const diff = currentY - startY.current;
      if (diff > 0) setPullY(Math.min(diff * 0.4, 150));
    }
  };

  const handleTouchEnd = () => {
    if (pullY > 80) {
      setIsRefreshing(true);
      setPullY(80);
      setTimeout(() => {
        setIsRefreshing(false);
        setPullY(0);
      }, 1500);
    } else {
      setPullY(0);
    }
    startY.current = 0;
  };

  const toggleLike = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { 
      ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 
    } : p));
  };

  const toggleFollow = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? {
      ...p, isFollowing: !p.isFollowing, followers: p.isFollowing ? p.followers - 1 : p.followers + 1
    } : p));
  };

  const handleConfirmBoost = () => {
    if (!activeBoostPost) return;
    setIsBoosting(true);
    // Simulate Arena neural sync for boost
    setTimeout(() => {
      setIsBoosting(false);
      setBoostSuccess(true);
      setPosts(prev => prev.map(p => p.id === activeBoostPost.id ? { ...p, isBoosted: true } : p));
      setTimeout(() => {
        setBoostSuccess(false);
        setActiveBoostPost(null);
      }, 2000);
    }, 2500);
  };

  const formatNum = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const estimatedReach = Math.floor(boostBudget * 500 / (boostDays || 1));

  return (
    <div className="h-full w-full bg-black relative overflow-hidden select-none">
      {/* Top Controls Overlay */}
      <div className="absolute top-20 left-4 right-4 z-[50] flex items-center justify-between gap-4">
        {/* Minimized Search */}
        <div className={`relative flex items-center transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isSearchExpanded ? 'w-full' : 'w-12'} h-12 bg-zinc-900/80 backdrop-blur-3xl border border-white/10 rounded-[24px] overflow-hidden group shadow-2xl`}>
          <button onClick={() => setIsSearchExpanded(!isSearchExpanded)} className="w-12 h-12 flex items-center justify-center shrink-0 text-zinc-400 group-hover:text-indigo-400 transition-colors">
            <Search size={20} />
          </button>
          <input 
            type="text" placeholder="Search Arena..." value={searchQuery}
            onFocus={() => setIsSearchExpanded(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`flex-1 bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-[0.2em] text-white placeholder:text-zinc-700 transition-opacity duration-300 ${isSearchExpanded ? 'opacity-100 pr-10' : 'opacity-0 w-0 pointer-events-none'}`}
          />
          {isSearchExpanded && (
            <button onClick={() => { setSearchQuery(''); setIsSearchExpanded(false); }} className="absolute right-3 p-1.5 bg-zinc-800 rounded-full text-zinc-400 hover:text-white">
              <X size={12} />
            </button>
          )}
        </div>

        {/* Feed Selectors - Right Aligned when search not expanded */}
        {!isSearchExpanded && (
          <div className="flex gap-2 bg-zinc-900/80 backdrop-blur-3xl p-1 rounded-[24px] border border-white/10">
            <FeedTab active={feedMode === 'FOR_YOU'} onClick={() => setFeedMode('FOR_YOU')} icon={<Zap size={14} />} />
            <FeedTab active={feedMode === 'GLOBAL_PULSE'} onClick={() => setFeedMode('GLOBAL_PULSE')} icon={<Globe size={14} />} />
            <FeedTab active={feedMode === 'NEARBY'} onClick={() => setFeedMode('NEARBY')} icon={<MapPin size={14} />} />
          </div>
        )}
      </div>

      <div ref={feedRef} className="feed-container h-full w-full no-scrollbar" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        {feedMode === 'FOR_YOU' ? (
          filteredPosts.map(post => (
            <FeedItem 
              key={post.id} post={post} formatNum={formatNum} 
              toggleLike={toggleLike} handleShare={onShare || (() => {})} 
              setActiveCommentPost={setActiveCommentPost} setActiveBoostPost={setActiveBoostPost} 
              setActiveMoreMenu={setActiveMoreMenu} onOpenLink={onOpenLink} onMonetize={onMonetize} 
              toggleFollow={toggleFollow}
            />
          ))
        ) : (
          <div className="h-full w-full p-8 pt-40 overflow-y-auto no-scrollbar pb-32">
            <div className="bg-zinc-900/40 border border-white/5 rounded-[48px] p-8 shadow-2xl relative overflow-hidden min-h-[500px]">
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                {feedMode === 'GLOBAL_PULSE' ? <Globe size={200} /> : <Compass size={200} />}
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                    {feedMode === 'GLOBAL_PULSE' ? <Radio size={24} className="animate-pulse" /> : <MapPin size={24} />}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase">{feedMode === 'GLOBAL_PULSE' ? 'Global Pulse' : 'Nearby Arenas'}</h2>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Neural Sync Active</p>
                  </div>
                </div>

                {isGroundingLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-6">
                    <Loader2 size={40} className="text-indigo-500 animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 animate-pulse">Syncing Neural Context...</p>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
                    <div className="text-lg font-bold text-zinc-300 leading-relaxed italic border-l-2 border-indigo-500 pl-6 py-2">
                      {feedMode === 'GLOBAL_PULSE' ? pulseData?.text : nearbyData?.text}
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] mb-2">Arena Sources</h4>
                      {(feedMode === 'GLOBAL_PULSE' ? pulseData?.sources : nearbyData?.sources)?.map((src: any, i: number) => (
                        <div 
                          key={i} 
                          onClick={() => onOpenLink?.(src.web?.uri || src.maps?.uri)}
                          className="flex items-center justify-between p-5 bg-black/40 border border-white/5 rounded-[24px] group active:scale-95 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-indigo-400">
                                {feedMode === 'GLOBAL_PULSE' ? <ExternalLink size={18} /> : <Compass size={18} />}
                             </div>
                             <p className="text-xs font-black uppercase tracking-tight text-zinc-400 truncate max-w-[200px]">{src.web?.title || src.maps?.title || "Arena Link"}</p>
                          </div>
                          <ChevronRight size={18} className="text-zinc-800" />
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={feedMode === 'GLOBAL_PULSE' ? handleFetchPulse : handleFetchNearby}
                      className="w-full bg-zinc-950 py-5 rounded-[28px] border border-white/10 text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center justify-center gap-3 hover:bg-zinc-900"
                    >
                      <RefreshCw size={14} /> Refresh Pulse
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Boost Post Overlay */}
      {activeBoostPost && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-end justify-center animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => !isBoosting && setActiveBoostPost(null)} />
          <div className="bg-[#0A0A0B] w-full max-w-lg rounded-t-[56px] border-t border-white/10 flex flex-col relative z-10 animate-in slide-in-from-bottom duration-500 p-8 pb-32">
            {!boostSuccess ? (
              <>
                <div className="w-12 h-1.5 bg-zinc-900 rounded-full mx-auto mb-8 shrink-0" />
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-black italic tracking-tighter uppercase">Boost Pulse</h3>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Spend GHC to reach the Global Arena</p>
                  </div>
                  <div className="p-4 bg-indigo-600/10 rounded-2xl text-indigo-400">
                    <Rocket size={24} className={isBoosting ? "animate-bounce" : ""} />
                  </div>
                </div>

                <div className="space-y-8 flex-1">
                  {/* Budget Slider */}
                  <div className="bg-zinc-900/40 p-6 rounded-[32px] border border-white/5">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Coins size={16} className="text-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Campaign Budget</span>
                      </div>
                      <span className="text-xl font-black text-white italic">GHC {boostBudget}</span>
                    </div>
                    <input 
                      type="range" min="10" max="500" step="10"
                      value={boostBudget} onChange={e => setBoostBudget(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                    />
                  </div>

                  {/* Duration Slider */}
                  <div className="bg-zinc-900/40 p-6 rounded-[32px] border border-white/5">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Target size={16} className="text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Boost Duration</span>
                      </div>
                      <span className="text-xl font-black text-white italic">{boostDays} Days</span>
                    </div>
                    <input 
                      type="range" min="1" max="14" step="1"
                      value={boostDays} onChange={e => setBoostDays(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                    />
                  </div>

                  {/* Reach Estimation */}
                  <div className="p-8 bg-indigo-600/5 rounded-[40px] border border-indigo-500/10 flex items-center justify-between shadow-inner">
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400">
                          <BarChart3 size={28} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Estimated Reach</p>
                          <p className="text-3xl font-black text-white italic tracking-tighter">~{formatNum(estimatedReach)} Fans</p>
                       </div>
                    </div>
                    <Flame size={24} className="text-orange-500 animate-pulse" />
                  </div>
                </div>

                <div className="mt-12 flex gap-4">
                   <button 
                     onClick={() => setActiveBoostPost(null)}
                     disabled={isBoosting}
                     className="flex-1 py-6 rounded-[28px] bg-zinc-900 text-zinc-500 font-black uppercase text-[10px] tracking-widest border border-white/5 disabled:opacity-30"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={handleConfirmBoost}
                     disabled={isBoosting}
                     className="flex-[2] py-6 rounded-[28px] bg-indigo-600 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                   >
                     {isBoosting ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                     {isBoosting ? "Initializing Pulse..." : "Confirm Boost"}
                   </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-8 border border-emerald-500/20 shadow-2xl">
                  <CheckCircle2 size={56} />
                </div>
                <h3 className="text-4xl font-black italic tracking-tighter uppercase mb-4">Pulse Boosted!</h3>
                <p className="text-sm text-zinc-500 font-bold mb-12 italic leading-relaxed">Your content is now synchronizing across the Global Arena. Visibility is increasing by <span className="text-white">+{(boostBudget/10).toFixed(0)}x</span>.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Comment overlays remain here... */}
      {activeCommentPost && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-end justify-center animate-in fade-in duration-300">
           <div className="absolute inset-0" onClick={() => setActiveCommentPost(null)} />
           <div className="bg-[#0A0A0B] w-full max-w-lg h-[80%] rounded-t-[56px] border-t border-white/10 flex flex-col relative z-10 animate-in slide-in-from-bottom duration-500">
              <div className="w-12 h-1.5 bg-zinc-900 rounded-full mx-auto mt-5 shrink-0" />
              <header className="px-8 py-8 flex items-center justify-between shrink-0">
                 <h3 className="text-3xl font-black italic tracking-tighter uppercase">Arena Pulse</h3>
                 <button onClick={() => setActiveCommentPost(null)} className="p-3 bg-zinc-900 rounded-full text-zinc-400"><X size={24}/></button>
              </header>
              <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar pb-32">
                 {activeCommentPost.comments?.map((comment) => (
                    <Comment key={comment.id} user={comment.user} msg={comment.text} time={comment.time} isCreator={comment.isCreator} />
                 ))}
              </div>
              <div className="p-8 bg-zinc-950/90 border-t border-white/5 pb-32">
                 <div className="flex gap-4 bg-zinc-900 border border-white/10 rounded-[28px] p-2 items-center group">
                    <input autoFocus placeholder="Add a pulse..." className="flex-1 bg-transparent border-none outline-none px-4 text-sm font-bold text-white placeholder:text-zinc-700 italic" value={newComment} onChange={e => setNewComment(e.target.value)} />
                    <button onClick={() => {}} className="w-12 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white active:scale-90"><Send size={18}/></button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const FeedTab: React.FC<{ active: boolean; icon: React.ReactNode; onClick: () => void }> = ({ active, icon, onClick }) => (
  <button 
    onClick={onClick} 
    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${active ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-600 hover:text-zinc-300'}`}
  >
    {icon}
  </button>
);

const FeedItem: React.FC<{
  post: CreatorPost;
  formatNum: (n: number) => string;
  toggleLike: (id: string) => void;
  toggleFollow: (id: string) => void;
  handleShare: (post: CreatorPost) => void;
  setActiveCommentPost: (post: CreatorPost) => void;
  setActiveBoostPost: (post: CreatorPost) => void;
  setActiveMoreMenu: (post: CreatorPost) => void;
  onOpenLink?: (url: string) => void;
  onMonetize?: (type: 'TIP' | 'SUBSCRIBE', creator: string) => void;
}> = ({ post, formatNum, toggleLike, toggleFollow, handleShare, setActiveCommentPost, setActiveBoostPost, setActiveMoreMenu, onOpenLink, onMonetize }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target); }
    }, { threshold: 0.1 });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => { if (containerRef.current) observer.unobserve(containerRef.current); };
  }, []);

  const isLocked = post.isPremium && !post.hasAccess;

  return (
    <div ref={containerRef} className="feed-item relative w-full h-full overflow-hidden block">
      <div className="absolute inset-0 w-full h-full bg-zinc-950 overflow-hidden">
        {isVisible && (
          post.type === 'video' ? (
            <video src={post.bg} className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${isLocked ? 'blur-3xl scale-125' : ''}`} autoPlay loop muted playsInline onLoadedData={() => setIsLoaded(true)} />
          ) : (
            <img src={post.bg} className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${isLocked ? 'blur-3xl scale-125' : ''}`} alt="Post Background" onLoad={() => setIsLoaded(true)} />
          )
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/95"></div>
      
      <div className="absolute right-4 bottom-80 flex flex-col items-center gap-6 z-40">
         <ActionBtn icon={<Heart size={30} className={post.isLiked ? 'fill-pink-600 text-pink-600' : 'text-white'} />} label={formatNum(post.likes)} onClick={() => toggleLike(post.id)} />
         <ActionBtn icon={<MessageSquare size={30} className="text-white" />} label={formatNum(post.commentCount || 0)} onClick={() => setActiveCommentPost(post)} />
         <ActionBtn icon={<Coins size={30} className="text-amber-500" />} label="Tip" onClick={() => onMonetize?.('TIP', post.creatorName)} />
         <ActionBtn icon={<Rocket size={30} className={post.isBoosted ? "text-indigo-400 drop-shadow-[0_0_8px_#6366f1]" : "text-zinc-500"} />} label={post.isBoosted ? "Boosted" : "Boost"} onClick={() => !post.isBoosted && setActiveBoostPost(post)} />
         <ActionBtn icon={<Share2 size={30} className="text-zinc-200" />} label="Share" onClick={() => handleShare(post)} />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-6 pb-36">
        <div className="max-w-full">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 overflow-hidden shrink-0">
                <img src={post.creatorAvatar} className="w-full h-full object-cover" alt="Avatar" />
              </div>
              <div>
                <h3 className="font-black text-lg text-white italic tracking-tighter uppercase leading-tight">{post.creatorName}</h3>
                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em]">{formatNum(post.followers || 0)} Fans</p>
              </div>
            </div>
            <button 
              onClick={() => toggleFollow(post.id)}
              className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-1.5 ${
                post.isFollowing 
                  ? 'bg-transparent text-zinc-500 border border-zinc-800' 
                  : 'bg-white text-black shadow-lg shadow-white/10'
              }`}
            >
              {post.isFollowing ? <UserCheck size={12} /> : <UserPlus size={12} />}
              {post.isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
          <p className="text-sm font-bold text-white line-clamp-3 mb-3 leading-relaxed drop-shadow-md pr-12">{post.caption}</p>
        </div>
      </div>
    </div>
  );
};

const ActionBtn: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1.5 active:scale-75 transition-transform">
    <div>{icon}</div>
    <span className="text-[10px] font-black text-white uppercase tracking-tighter drop-shadow-md">{label}</span>
  </button>
);

const Comment: React.FC<{ user: string; msg: string; time: string; isCreator?: boolean }> = ({ user, msg, time, isCreator }) => (
  <div className="flex gap-4">
    <div className={`w-10 h-10 rounded-2xl bg-zinc-900 flex items-center justify-center font-black text-xs shrink-0 border ${isCreator ? 'text-indigo-400 border-indigo-500/30' : 'text-zinc-600 border-white/5'}`}>{user[0]}</div>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <span className={`text-[10px] font-black uppercase tracking-tight ${isCreator ? 'text-indigo-400' : 'text-zinc-400'}`}>@{user}</span>
        <span className="text-[8px] text-zinc-700 font-bold uppercase tracking-widest">{time}</span>
      </div>
      <p className="text-xs font-medium text-zinc-300 leading-relaxed bg-white/5 p-3 rounded-2xl rounded-tl-none">{msg}</p>
    </div>
  </div>
);

export default SocialFeed;
