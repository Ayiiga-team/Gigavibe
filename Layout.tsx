
import React, { useState, useEffect } from 'react';
import { 
  Orbit, 
  Zap, 
  Gem, 
  Cpu, 
  Coins, 
  Plus, 
  Bell, 
  MoreVertical,
  User
} from 'lucide-react';
import { AppTab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onPlusClick: () => void;
  onProfileClick: () => void;
  onNotificationsClick: () => void;
  onMenuClick: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  onPlusClick, 
  onProfileClick, 
  onNotificationsClick, 
  onMenuClick 
}) => {
  const isFeed = activeTab === AppTab.FEED;
  const [navProgress, setNavProgress] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  // display_navigate_progress implementation
  const handleTabChange = (tab: AppTab) => {
    if (tab === activeTab) return;
    setIsNavigating(true);
    setNavProgress(0);
    
    // Simulate navigation progress
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 30;
      if (p >= 100) {
        clearInterval(interval);
        setNavProgress(100);
        setTimeout(() => {
          setActiveTab(tab);
          setIsNavigating(false);
          setNavProgress(0);
        }, 150);
      } else {
        setNavProgress(p);
      }
    }, 40);
  };

  return (
    <div className="flex flex-col h-full w-full relative bg-black overflow-hidden">
      {/* Navigation Progress Bar */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 h-1 z-[100] bg-zinc-900">
          <div 
            className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1] transition-all duration-150 ease-out" 
            style={{ width: `${navProgress}%` }}
          />
        </div>
      )}

      {/* Immersive View Container */}
      <div className={`absolute inset-0 z-0 h-full w-full overflow-hidden transition-opacity duration-300 ${isNavigating ? 'opacity-50' : 'opacity-100'}`}>
        {children}
      </div>

      {/* Global Arena Top Bar */}
      <header className={`h-16 flex items-center justify-between px-4 z-[60] fixed top-0 left-0 right-0 transition-all duration-300 ${isFeed ? 'bg-gradient-to-b from-black to-transparent' : 'bg-black/90 backdrop-blur-3xl border-b border-white/5'}`}>
        <div className="flex items-center gap-3">
          <button 
            onClick={onProfileClick}
            className="w-10 h-10 rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 flex items-center justify-center transition-all active:scale-90"
          >
            <User size={18} className="text-zinc-400" />
          </button>
          <div className="flex flex-col -gap-0.5 pointer-events-none">
            <h1 className="text-xl font-black italic tracking-tighter text-white leading-none">GIGAVibe</h1>
            <span className="text-[7px] font-black uppercase tracking-[0.4em] text-indigo-500">Global Arena</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button onClick={onPlusClick} className="p-2 text-white hover:text-indigo-400 transition-all active:scale-75">
            <div className="bg-indigo-600 rounded-xl p-2 shadow-lg shadow-indigo-600/20">
              <Plus size={20} strokeWidth={4} />
            </div>
          </button>
          <button onClick={onNotificationsClick} className="relative p-2 text-white/80 hover:text-white transition-all active:scale-75">
            <Bell size={24} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-pink-500 rounded-full border-2 border-black animate-pulse"></span>
          </button>
          <button onClick={onMenuClick} className="p-2 text-white/80 hover:text-white transition-all active:scale-75">
            <MoreVertical size={24} />
          </button>
        </div>
      </header>

      {/* Symmetric 5-Tab Navigation Bar */}
      <nav className={`h-24 z-[60] fixed bottom-0 left-0 right-0 grid grid-cols-5 px-4 pb-8 transition-all duration-300 ${isFeed ? 'bg-gradient-to-t from-black via-black/90 to-transparent' : 'bg-black/95 backdrop-blur-3xl border-t border-white/5'}`}>
        <NavItem 
          icon={<Orbit size={28} />} 
          label="Arena" 
          active={activeTab === AppTab.FEED} 
          onClick={() => handleTabChange(AppTab.FEED)} 
        />
        <NavItem 
          icon={<Zap size={28} />} 
          label="Pulse" 
          active={activeTab === AppTab.CHATS} 
          onClick={() => handleTabChange(AppTab.CHATS)} 
        />
        <NavItem 
          icon={<Gem size={28} />} 
          label="Market" 
          active={activeTab === AppTab.SHOP} 
          onClick={() => handleTabChange(AppTab.SHOP)} 
        />
        <NavItem 
          icon={<Cpu size={28} />} 
          label="Labs" 
          active={activeTab === AppTab.AI_LAB} 
          onClick={() => handleTabChange(AppTab.AI_LAB)} 
        />
        <NavItem 
          icon={<Coins size={28} />} 
          label="Vault" 
          active={activeTab === AppTab.WALLET} 
          onClick={() => handleTabChange(AppTab.WALLET)} 
        />
      </nav>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-1 transition-all duration-300 relative group h-full"
  >
    {active && (
      <div className="absolute inset-0 bg-indigo-500/5 blur-2xl rounded-full" />
    )}
    <div className={`transition-all duration-500 ${active ? 'text-indigo-400 scale-110 drop-shadow-[0_0_12px_rgba(99,102,241,0.5)]' : 'text-zinc-500 hover:text-zinc-300'}`}>
      {icon}
    </div>
    <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-all ${active ? 'text-indigo-400 opacity-100' : 'text-zinc-600 opacity-50 group-hover:opacity-100'}`}>
      {label}
    </span>
    {active && (
       <div className="absolute bottom-4 w-1 h-1 bg-indigo-500 rounded-full shadow-[0_0_8px_#6366f1]"></div>
    )}
  </button>
);

export default Layout;
