
import React, { useState } from 'react';
import { X, Coins, Gem, Zap, CheckCircle2, ShieldCheck, ArrowRight, Heart } from 'lucide-react';

interface MonetizationOverlayProps {
  type: 'TIP' | 'SUBSCRIBE';
  creatorName: string;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

const TIP_AMOUNTS = [5, 10, 50, 100, 500];

const MonetizationOverlay: React.FC<MonetizationOverlayProps> = ({ type, creatorName, onClose, onSuccess }) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(type === 'TIP' ? 10 : 25);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleAction = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      setTimeout(() => {
        onSuccess(selectedAmount);
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/90 backdrop-blur-xl p-6 animate-in fade-in duration-300">
      <div className="bg-[#0A0A0B] border border-white/10 w-full max-w-lg rounded-t-[56px] p-10 shadow-2xl relative animate-in slide-in-from-bottom duration-500">
        {!isDone ? (
          <>
            <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-zinc-900 rounded-full text-zinc-500"><X size={24}/></button>
            
            <div className="text-center mb-10 pt-4">
              <div className="w-20 h-20 bg-amber-500/10 rounded-[32px] flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
                {type === 'TIP' ? <Coins size={40} className="text-amber-500" /> : <Gem size={40} className="text-indigo-400" />}
              </div>
              <h2 className="text-3xl font-black italic tracking-tighter mb-2 uppercase">
                {type === 'TIP' ? 'Arena Tip' : 'Pulse Access'}
              </h2>
              <p className="text-sm text-zinc-500 font-bold">Supporting <span className="text-white italic">@{creatorName}</span></p>
            </div>

            {type === 'TIP' ? (
              <div className="grid grid-cols-3 gap-3 mb-10">
                {TIP_AMOUNTS.map(amt => (
                  <button 
                    key={amt}
                    onClick={() => setSelectedAmount(amt)}
                    className={`py-6 rounded-3xl border font-black text-sm transition-all ${selectedAmount === amt ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'bg-zinc-900 border-white/5 text-zinc-500'}`}
                  >
                    GHC {amt}
                  </button>
                ))}
                <div className="bg-zinc-900 border border-white/5 rounded-3xl p-4 flex flex-col items-center justify-center opacity-40">
                   <p className="text-[8px] font-black uppercase">Custom</p>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[40px] mb-10">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400">Monthly Pulse</h4>
                    <p className="text-[10px] text-zinc-500 font-bold">Unlocks all exclusive media</p>
                  </div>
                  <div className="text-2xl font-black italic">GHC 25<span className="text-xs">/mo</span></div>
                </div>
                <div className="space-y-3">
                  <BenefitItem text="Access to Premium Arena Feed" />
                  <BenefitItem text="Priority Messaging Badge" />
                  <BenefitItem text="Exclusive Lab Content" />
                </div>
              </div>
            )}

            <button 
              onClick={handleAction}
              disabled={isProcessing}
              className={`w-full py-7 rounded-[32px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl ${type === 'TIP' ? 'bg-amber-500 text-black shadow-amber-900/20' : 'bg-indigo-600 text-white shadow-indigo-900/20'}`}
            >
              {isProcessing ? (
                <Zap size={20} className="animate-spin" />
              ) : (
                <>Initialize Transaction <ArrowRight size={18} /></>
              )}
            </button>
            <div className="mt-8 flex items-center justify-center gap-2 text-zinc-700">
               <ShieldCheck size={14} />
               <span className="text-[9px] font-black uppercase tracking-widest">Vault-Secured Payment Gateway</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-center py-10 animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-8 border border-emerald-500/20">
              <CheckCircle2 size={56} />
            </div>
            <h2 className="text-4xl font-black italic tracking-tighter mb-4 uppercase">Success</h2>
            <p className="text-sm text-zinc-500 mb-12 font-bold leading-relaxed max-w-[240px]">
              {type === 'TIP' ? 'Your tip has been added to their Vault.' : 'You are now an official Arena Member!'}
            </p>
            <div className="animate-bounce">
               <Heart size={32} className="text-pink-500 fill-pink-500" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BenefitItem: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center gap-3">
    <div className="w-5 h-5 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/20">
      <Zap size={10} className="text-indigo-400" />
    </div>
    <span className="text-[10px] font-black uppercase tracking-tight text-zinc-400">{text}</span>
  </div>
);

export default MonetizationOverlay;
