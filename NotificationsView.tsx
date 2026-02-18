
import React from 'react';
import { ArrowLeft, Bell, Heart, MessageSquare, DollarSign, UserPlus, Star } from 'lucide-react';

interface NotificationsViewProps {
  onClose: () => void;
}

const NotificationsView: React.FC<NotificationsViewProps> = ({ onClose }) => {
  return (
    <div className="h-full bg-black flex flex-col">
      <header className="h-16 flex items-center justify-between px-4 sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-zinc-900">
        <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-full"><ArrowLeft size={24} /></button>
        <h3 className="font-black text-lg">Notifications</h3>
        <button className="text-[10px] font-black uppercase text-indigo-400">Clear All</button>
      </header>

      <div className="flex-1 overflow-y-auto p-2">
        <NotificationItem 
          icon={<Heart size={16} className="text-pink-500" />} 
          msg="Kwame Tech liked your latest AI Studio vision." 
          time="2 min ago" 
        />
        <NotificationItem 
          icon={<DollarSign size={16} className="text-green-500" />} 
          msg="Payout successful! GHC 1,200 deposited to Wallet." 
          time="1h ago" 
          highlight
        />
        <NotificationItem 
          icon={<UserPlus size={16} className="text-blue-500" />} 
          msg="Sarah_Dev followed you. Check her feed!" 
          time="3h ago" 
        />
        <NotificationItem 
          icon={<Star size={16} className="text-yellow-500" />} 
          msg="You earned a 5-star rating on GlobalShop!" 
          time="Yesterday" 
        />
        <NotificationItem 
          icon={<MessageSquare size={16} className="text-indigo-500" />} 
          msg="New message in GIGAVibe Alpha Founders group." 
          time="Yesterday" 
        />
      </div>
    </div>
  );
};

const NotificationItem: React.FC<{ icon: React.ReactNode; msg: string; time: string; highlight?: boolean }> = ({ icon, msg, time, highlight }) => (
  <div className={`p-4 flex gap-4 rounded-3xl mb-1 transition-colors ${highlight ? 'bg-indigo-500/5 border border-indigo-500/10' : 'hover:bg-zinc-900'}`}>
    <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-800">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-sm text-zinc-300 leading-snug">{msg}</p>
      <span className="text-[10px] text-zinc-500 font-bold uppercase mt-1 inline-block">{time}</span>
    </div>
  </div>
);

export default NotificationsView;
