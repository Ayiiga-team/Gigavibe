
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Bell, 
  Globe, 
  HelpCircle, 
  ChevronRight, 
  LogOut, 
  Moon, 
  Eye, 
  CreditCard, 
  Heart,
  Lock,
  ShieldCheck,
  Cpu,
  Wifi,
  Terminal,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { VerificationStatus } from '../../types';

interface SettingsViewProps {
  onClose: () => void;
  verificationStatus?: VerificationStatus;
  onStartVerification?: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onClose, verificationStatus = 'NONE', onStartVerification }) => {
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);

  useEffect(() => {
    const handleStatus = () => setOnlineStatus(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  const getKycLabel = () => {
    switch(verificationStatus) {
      case 'VERIFIED': return 'Verified Identity';
      case 'PENDING': return 'Audit Pending';
      default: return 'Unverified Identity';
    }
  };

  const getKycColor = () => {
    switch(verificationStatus) {
      case 'VERIFIED': return 'text-emerald-500';
      case 'PENDING': return 'text-amber-500';
      default: return 'text-zinc-600';
    }
  };

  const getKycIcon = () => {
    switch(verificationStatus) {
      case 'VERIFIED': return <CheckCircle2 size={20} className="text-emerald-500" />;
      case 'PENDING': return <Clock size={20} className="text-amber-500" />;
      default: return <AlertCircle size={20} className="text-zinc-600" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-black overflow-y-auto no-scrollbar">
      <header className="h-20 flex items-center justify-between px-6 sticky top-0 bg-black/90 backdrop-blur-xl z-20 border-b border-zinc-900/50">
        <button 
          onClick={onClose} 
          className="p-3 bg-zinc-900/50 rounded-2xl active:scale-90 transition-transform border border-white/5"
        >
          <ArrowLeft size={24} />
        </button>
        <h3 className="font-black text-lg italic tracking-tighter uppercase text-zinc-400">Settings</h3>
        <div className="w-12"></div>
      </header>

      <div className="p-6 space-y-10 pb-32">
        {/* Profile Card Section */}
        <div className="bg-[#0A0A0B] p-8 rounded-[40px] border border-white/5 shadow-2xl">
           <div className="flex items-center gap-5 mb-8">
              <div className="w-20 h-20 rounded-[28px] bg-zinc-900 border border-white/10 flex items-center justify-center font-black text-3xl italic tracking-tighter text-zinc-300">
                A
              </div>
              <div className="space-y-1">
                 <h4 className="text-2xl font-black tracking-tight italic">Ayiiga Benard</h4>
                 <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Founder Status Active</p>
                 </div>
              </div>
           </div>
           <button className="w-full bg-zinc-900/80 py-4.5 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 border border-indigo-500/20 active:scale-[0.98] transition-all hover:bg-zinc-800">
             Manage Studio Profile
           </button>
        </div>

        {/* SECURITY & IDENTITY - UPDATED */}
        <Section title="Security & Identity">
           <div 
             onClick={verificationStatus === 'NONE' ? onStartVerification : undefined}
             className="flex items-center justify-between p-6 hover:bg-zinc-900/40 transition-all cursor-pointer border-b border-zinc-900/50 group"
           >
              <div className="flex items-center gap-5">
                 <div className="text-zinc-500 group-hover:text-indigo-400 transition-colors">
                    <ShieldCheck size={20} />
                 </div>
                 <span className="text-sm font-black tracking-tight text-zinc-200 group-hover:text-white transition-colors">
                    Identity Verification (KYC)
                 </span>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    {getKycIcon()}
                    <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${getKycColor()}`}>
                       {getKycLabel()}
                    </span>
                 </div>
                 <ChevronRight size={18} className="text-zinc-800 group-hover:text-zinc-600 transition-colors" />
              </div>
           </div>
           <SettingItem 
             icon={<Lock size={20} />} 
             label="Neural Passkey" 
             value="ACTIVE" 
             valueColor="text-emerald-500"
           />
        </Section>

        {/* SYSTEM PULSE */}
        <Section title="System Pulse">
          <SettingItem 
            icon={<Cpu size={20} />} 
            label="JavaScript Engine" 
            value="ACTIVE (v8)" 
            valueColor="text-emerald-500"
          />
          <SettingItem 
            icon={<Wifi size={20} />} 
            label="Internet Permission" 
            value={onlineStatus ? "GRANTED" : "DISCONNECTED"} 
            valueColor={onlineStatus ? "text-emerald-500" : "text-red-500"}
          />
          <div className="p-6 border-t border-zinc-900/50 bg-zinc-950/30">
            <div className="flex items-center gap-5 mb-4">
              <Terminal size={20} className="text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Global User Agent</span>
            </div>
            <p className="text-[9px] font-mono text-zinc-600 bg-black/40 p-3 rounded-xl border border-white/5 break-all leading-relaxed">
              {navigator.userAgent}
            </p>
          </div>
        </Section>

        <button className="w-full mt-12 flex items-center justify-center gap-4 py-7 bg-red-600/5 text-red-500 font-black uppercase text-[11px] tracking-[0.2em] rounded-[36px] border border-red-500/10 active:scale-95 transition-all hover:bg-red-600/10 group">
          <LogOut size={22} className="group-hover:rotate-12 transition-transform" /> 
          Terminate Arena Session
        </button>

        <div className="text-center py-12 opacity-30">
          <p className="text-[9px] font-black uppercase tracking-[0.5em] mb-2 text-zinc-500">GIGAVibe Ecosystem</p>
          <p className="text-[9px] font-bold italic text-zinc-600">Global Arena Build v1.2.0-Production</p>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-4">
    <h4 className="px-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">{title}</h4>
    <div className="bg-[#0A0A0B]/60 rounded-[36px] border border-zinc-900/50 overflow-hidden shadow-xl">
      {children}
    </div>
  </div>
);

const SettingItem: React.FC<{ icon: React.ReactNode; label: string; value?: string; valueColor?: string }> = ({ icon, label, value, valueColor = "text-zinc-500" }) => (
  <div className="flex items-center justify-between p-6 hover:bg-zinc-900/40 transition-all cursor-pointer border-b border-zinc-900/50 last:border-none group active:bg-zinc-900">
    <div className="flex items-center gap-5">
      <div className="text-zinc-500 group-hover:text-indigo-400 transition-colors">
        {icon}
      </div>
      <span className="text-sm font-black tracking-tight text-zinc-200 group-hover:text-white transition-colors">
        {label}
      </span>
    </div>
    <div className="flex items-center gap-4">
      {value && (
        <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${valueColor}`}>
          {value}
        </span>
      )}
      <ChevronRight size={18} className="text-zinc-800 group-hover:text-zinc-600 transition-colors" />
    </div>
  </div>
);

export default SettingsView;
