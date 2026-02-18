
import React, { useState } from 'react';
import { X, Copy, Share, MessageCircle, Twitter, Facebook, Link as LinkIcon, Check, Send } from 'lucide-react';
import { CreatorPost } from '../types';

interface ShareOverlayProps {
  post: CreatorPost;
  onClose: () => void;
}

const QUICK_SEND_CONTACTS = [
  { id: '1', name: 'Ayiiga Benard', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
  { id: '2', name: 'Sarah_Dev', avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop' },
  { id: '3', name: 'Kwame Tech', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
];

const ShareOverlay: React.FC<ShareOverlayProps> = ({ post, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://gigavibe.arena/post/${post.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `GIGAVibe Arena: ${post.creatorName}`,
          text: post.caption,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/80 backdrop-blur-md p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="bg-[#0A0A0B] border border-white/10 w-full max-w-lg rounded-t-[56px] p-8 pb-16 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-500">
        <div className="w-12 h-1.5 bg-zinc-900 rounded-full mx-auto mb-8 shrink-0" />
        
        <header className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-3xl font-black italic tracking-tighter uppercase">Broadcast Vibe</h3>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Share to the Global Arena</p>
          </div>
          <button onClick={onClose} className="p-3 bg-zinc-900 rounded-full text-zinc-400"><X size={24} /></button>
        </header>

        {/* Quick Send to Pulse Contacts */}
        <div className="mb-10">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">Quick Pulse Send</h4>
          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-2">
            {QUICK_SEND_CONTACTS.map(contact => (
              <button key={contact.id} className="flex flex-col items-center gap-3 shrink-0 group active:scale-90 transition-transform">
                <div className="w-16 h-16 rounded-[24px] border border-white/5 overflow-hidden group-hover:border-indigo-500 transition-colors">
                  <img src={contact.avatar} className="w-full h-full object-cover" alt={contact.name} />
                </div>
                <span className="text-[9px] font-black uppercase text-zinc-500 group-hover:text-white truncate w-16 text-center">{contact.name.split(' ')[0]}</span>
              </button>
            ))}
            <button className="flex flex-col items-center gap-3 shrink-0 active:scale-90 transition-transform">
               <div className="w-16 h-16 rounded-[24px] bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-600">
                  <MessageCircle size={24} />
               </div>
               <span className="text-[9px] font-black uppercase text-zinc-600">More</span>
            </button>
          </div>
        </div>

        {/* External Options */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          <SocialBtn icon={<LinkIcon size={20} />} label="Link" onClick={handleCopyLink} />
          <SocialBtn icon={<Twitter size={20} />} label="X" onClick={handleNativeShare} />
          <SocialBtn icon={<Facebook size={20} />} label="Meta" onClick={handleNativeShare} />
          <SocialBtn icon={<Share size={20} />} label="Share" onClick={handleNativeShare} />
        </div>

        {/* Action Button */}
        <button 
          onClick={handleCopyLink}
          className="w-full bg-indigo-600 py-6 rounded-[32px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-indigo-600/20"
        >
          {copied ? <Check size={20} className="text-white" /> : <Copy size={20} />}
          {copied ? 'Link Initialized' : 'Copy Arena Link'}
        </button>
      </div>
    </div>
  );
};

const SocialBtn: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 group">
    <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:bg-zinc-800 transition-all">
      {icon}
    </div>
    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400">{label}</span>
  </button>
);

export default ShareOverlay;
