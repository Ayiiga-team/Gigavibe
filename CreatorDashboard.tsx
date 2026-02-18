
import React from 'react';
import { 
  ArrowLeft, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Award, 
  Zap, 
  ChevronRight, 
  BarChart3, 
  Rocket, 
  ShieldCheck, 
  PieChart, 
  DownloadCloud, 
  Coins, 
  Gem,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Transaction, VerificationStatus } from '../../types';

interface CreatorDashboardProps {
  onClose: () => void;
  transactions?: Transaction[];
  verificationStatus?: VerificationStatus;
  onStartVerification?: () => void;
}

const CreatorDashboard: React.FC<CreatorDashboardProps> = ({ onClose, transactions = [], verificationStatus = 'NONE', onStartVerification }) => {
  const tipRevenue = transactions.filter(tx => tx.type === 'TIP').reduce((acc, tx) => acc + tx.amount, 0);
  const subRevenue = transactions.filter(tx => tx.type === 'SUBSCRIPTION').reduce((acc, tx) => acc + tx.amount, 0);
  const adRevenue = transactions.filter(tx => tx.type === 'AD_REVENUE').reduce((acc, tx) => acc + tx.amount, 0);
  const totalRevenue = tipRevenue + subRevenue + adRevenue;

  return (
    <div className="h-full bg-black overflow-y-auto pb-20 no-scrollbar">
      <header className="h-16 flex items-center justify-between px-4 sticky top-0 bg-black/90 backdrop-blur-md z-10 border-b border-zinc-900">
        <button onClick={onClose} className="p-3 hover:bg-zinc-900 rounded-3xl transition-colors text-white"><ArrowLeft size={24} /></button>
        <h3 className="font-black text-xl italic tracking-tighter text-white">ARENA STUDIO</h3>
        <div className="w-12"></div>
      </header>

      <div className="p-6">
        {/* Verification Banner */}
        {verificationStatus !== 'VERIFIED' && (
          <div className={`mb-8 p-6 rounded-[36px] border flex items-center justify-between transition-all ${verificationStatus === 'PENDING' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-indigo-600/5 border-indigo-500/20'}`}>
             <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${verificationStatus === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-600/10 text-indigo-400'}`}>
                   {verificationStatus === 'PENDING' ? <Clock size={24} /> : <ShieldCheck size={24} />}
                </div>
                <div>
                   <h4 className="text-sm font-black italic tracking-tight text-white uppercase">
                     {verificationStatus === 'PENDING' ? 'Audit in Progress' : 'Verify Identity'}
                   </h4>
                   <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                     {verificationStatus === 'PENDING' ? 'Neural review pending (12h-24h)' : 'Unlock GHC 1K+ Daily Payouts'}
                   </p>
                </div>
             </div>
             {verificationStatus === 'NONE' && (
                <button 
                  onClick={onStartVerification}
                  className="px-5 py-2.5 bg-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest text-white active:scale-95 transition-all shadow-lg shadow-indigo-900/20"
                >
                  Start KYC
                </button>
             )}
          </div>
        )}

        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-10 rounded-[48px] shadow-2xl mb-10 relative overflow-hidden">
          <PieChart size={120} className="absolute -right-6 -bottom-6 opacity-10 rotate-12 text-white" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">Net Revenue Share</span>
              <div className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-black text-white">75% Payout</div>
            </div>
            <h2 className="text-5xl font-black mb-8 tracking-tighter text-white">GHC {totalRevenue.toLocaleString()}<span className="text-white/60 text-2xl font-bold">.00</span></h2>
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div>
                <span className="text-[8px] font-black text-white/60 uppercase block mb-1">Ad Share</span>
                <p className="font-bold text-sm text-white">GHC {adRevenue}</p>
              </div>
              <div>
                <span className="text-[8px] font-black text-white/60 uppercase block mb-1 text-amber-300">Tips</span>
                <p className="font-bold text-sm text-white">GHC {tipRevenue}</p>
              </div>
              <div>
                <span className="text-[8px] font-black text-white/60 uppercase block mb-1 text-indigo-300">Subs</span>
                <p className="font-bold text-sm text-white">GHC {subRevenue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Installs Statistics */}
        <div className="mb-10">
          <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-white"><DownloadCloud size={24} className="text-emerald-500" /> Global Installs</h3>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-[40px] p-8 flex items-center justify-between">
            <div className="space-y-4">
               <div>
                 <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Total Arena Installs</p>
                 <p className="text-4xl font-black tracking-tighter text-white italic">12,482,900</p>
               </div>
               <div className="flex items-center gap-3">
                 <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-lg border border-emerald-500/20">+18% Monthly</div>
                 <div className="px-3 py-1 bg-indigo-500/10 text-indigo-500 text-[10px] font-black rounded-lg border border-indigo-500/20">92% Retention</div>
               </div>
            </div>
            <div className="w-20 h-20 bg-emerald-500/5 rounded-3xl flex items-center justify-center border border-emerald-500/10">
               <BarChart3 size={32} className="text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Trust Score Section */}
        <div className="mb-10">
           <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-white"><Award size={24} className="text-amber-500" /> Neural Trust Score</h3>
           <div className="bg-zinc-900/50 border border-zinc-800 rounded-[40px] p-8">
              <div className="flex justify-between items-center mb-6">
                 <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Arena Standing</span>
                 <span className={`text-sm font-black italic ${verificationStatus === 'VERIFIED' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {verificationStatus === 'VERIFIED' ? 'EXCELLENT' : 'PROBATION'}
                 </span>
              </div>
              <div className="h-3 bg-zinc-800 rounded-full overflow-hidden mb-6">
                 <div 
                   className={`h-full transition-all duration-1000 ${verificationStatus === 'VERIFIED' ? 'w-[95%] bg-emerald-500' : 'w-[40%] bg-amber-500'}`} 
                 />
              </div>
              <p className="text-[10px] text-zinc-600 font-bold leading-relaxed uppercase tracking-widest">
                 {verificationStatus === 'VERIFIED' ? 'Your identity is fully verified. All premium creator tools are unlocked.' : 'Complete identity verification to reach a score of 90+ and unlock daily payouts.'}
              </p>
           </div>
        </div>

        {/* Monetization Breakdown Cards */}
        <h3 className="text-xl font-black mb-6 text-white">Monetization Pulse</h3>
        <div className="grid grid-cols-2 gap-4 mb-10">
           <DashCard icon={<Coins size={24} />} label="Total Tips" value={`${transactions.filter(t=>t.type==='TIP').length} Gifts`} color="bg-amber-500/10 text-amber-500" />
           <DashCard icon={<Gem size={24} />} label="Subscribers" value="482 Fans" color="bg-indigo-500/10 text-indigo-400" />
        </div>

        <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-white"><Rocket size={24} className="text-orange-500" /> Boost Content</h3>
        <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-8 mb-10">
          <p className="text-sm text-zinc-400 mb-8 font-medium">Reach millions of fans in Ghana and the Global Arena. Starting from GHC 20.</p>
          <div className="space-y-4">
            <BoostItem label="Standard Vibe" reach="~15K people" price="GHC 20" />
            <BoostItem label="Elite Arena" reach="~100K people" price="GHC 150" active />
            <BoostItem label="Global Takeover" reach="~1M+ people" price="GHC 800" />
          </div>
          <button className="w-full bg-indigo-600 py-5 rounded-3xl font-black text-sm uppercase tracking-tight mt-8 shadow-xl shadow-indigo-900/40 active:scale-95 text-white">Boost Now</button>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[32px] p-6 flex items-center gap-5 mb-10">
           <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
             <ShieldCheck size={32} />
           </div>
           <div>
             <h4 className="font-black text-white">Anti-Fraud Engine Active</h4>
             <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">GIGAVibe monitors all bot engagement.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const DashCard: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = ({ icon, label, value, color }) => (
  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[36px] flex flex-col gap-4">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>{icon}</div>
    <div>
      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black tracking-tighter text-white">{value}</p>
    </div>
  </div>
);

const BoostItem: React.FC<{ label: string; reach: string; price: string; active?: boolean }> = ({ label, reach, price, active }) => (
  <div className={`flex items-center justify-between p-5 rounded-3xl border transition-all ${active ? 'bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-500/5' : 'bg-zinc-800/50 border-zinc-800'}`}>
    <div>
      <h5 className="text-sm font-black tracking-tight text-white">{label}</h5>
      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{reach}</p>
    </div>
    <span className="font-black text-indigo-400">{price}</span>
  </div>
);

export default CreatorDashboard;
