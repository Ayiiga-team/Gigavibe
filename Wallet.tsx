
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis, XAxis } from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  Building, 
  ShieldCheck, 
  Wallet as WalletIcon,
  TrendingUp,
  Settings,
  CheckCircle2,
  X,
  ChevronRight,
  Smartphone,
  Coins,
  Gem,
  Zap,
  Clock,
  Lock,
  Unlock,
  Fingerprint,
  Delete
} from 'lucide-react';
import { Transaction } from '../types';

const DATA = [
  { date: 'Mon', amount: 450 },
  { date: 'Tue', amount: 380 },
  { date: 'Wed', amount: 410 },
  { date: 'Thu', amount: 620 },
  { date: 'Fri', amount: 580 },
  { date: 'Sat', amount: 840 },
  { date: 'Sun', amount: 720 },
];

interface WalletProps {
  transactions?: Transaction[];
}

const Wallet: React.FC<WalletProps> = ({ transactions = [] }) => {
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [done, setDone] = useState(false);
  
  // Security PIN States
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');
  const [savedPin, setSavedPin] = useState<string | null>(localStorage.getItem('gigavibe_vault_pin'));
  const [isSettingPin, setIsSettingPin] = useState(!localStorage.getItem('gigavibe_vault_pin'));
  const [pinError, setPinError] = useState(false);

  const handleWithdraw = () => {
    setWithdrawing(true);
    setTimeout(() => {
      setWithdrawing(false);
      setDone(true);
    }, 2000);
  };

  const handleKeypadPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setPinError(false);

      if (newPin.length === 4) {
        if (isSettingPin) {
          // Confirming the new PIN
          localStorage.setItem('gigavibe_vault_pin', newPin);
          setSavedPin(newPin);
          setIsSettingPin(false);
          setIsLocked(false);
          setPin('');
          alert("Vault Security Initialized 🛡️");
        } else if (newPin === savedPin) {
          // Unlocking
          setIsLocked(false);
          setPin('');
        } else {
          // Wrong PIN
          setPinError(true);
          setTimeout(() => setPin(''), 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const currentBalance = transactions.reduce((acc, tx) => {
    if (tx.type === 'WITHDRAWAL') return acc - tx.amount;
    return acc + tx.amount;
  }, 12450);

  // If locked, show the PIN entry screen
  if (isLocked) {
    return (
      <div className="h-full w-full bg-black flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
        <div className="w-full max-w-sm flex flex-col items-center">
          <div className="w-20 h-20 bg-indigo-600/10 rounded-[32px] flex items-center justify-center mb-8 border border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
            {isSettingPin ? <ShieldCheck size={40} className="text-indigo-400" /> : <Lock size={40} className="text-indigo-400" />}
          </div>
          
          <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2 text-center">
            {isSettingPin ? 'Secure Your Vault' : 'Vault Locked'}
          </h2>
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] mb-12 text-center">
            {isSettingPin ? 'Initialize 4-Digit Security Pulse' : 'Enter Neural PIN to access funds'}
          </p>

          {/* PIN Dots */}
          <div className="flex gap-6 mb-16">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                  pin.length >= i 
                    ? 'bg-indigo-500 border-indigo-500 shadow-[0_0_10px_#6366f1]' 
                    : pinError 
                      ? 'border-red-500 bg-red-500/20 animate-bounce' 
                      : 'border-zinc-800'
                }`}
              />
            ))}
          </div>

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-6 w-full">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button 
                key={num} 
                onClick={() => handleKeypadPress(num)}
                className="w-full aspect-square rounded-3xl bg-zinc-900/50 border border-white/5 flex items-center justify-center text-2xl font-black italic hover:bg-zinc-800 active:scale-90 transition-all text-white"
              >
                {num}
              </button>
            ))}
            <button className="w-full aspect-square rounded-3xl flex items-center justify-center text-zinc-700">
              <Fingerprint size={32} />
            </button>
            <button 
              onClick={() => handleKeypadPress('0')}
              className="w-full aspect-square rounded-3xl bg-zinc-900/50 border border-white/5 flex items-center justify-center text-2xl font-black italic hover:bg-zinc-800 active:scale-90 transition-all text-white"
            >
              0
            </button>
            <button 
              onClick={handleDelete}
              className="w-full aspect-square rounded-3xl flex items-center justify-center text-zinc-400 active:scale-90 transition-all"
            >
              <Delete size={28} />
            </button>
          </div>
          
          {pinError && (
            <p className="mt-8 text-[10px] font-black uppercase text-red-500 tracking-widest animate-pulse">Neural PIN Mismatch. Access Denied.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-black overflow-y-auto no-scrollbar pb-32 animate-in slide-in-from-bottom duration-500">
      <div className="p-6">
        {/* Header with Lock Action */}
        <div className="flex items-center justify-between mb-8 px-2 pt-16">
           <div>
              <h2 className="text-3xl font-black italic tracking-tighter uppercase">Vault Studio</h2>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Digital Asset Management</p>
           </div>
           <button 
             onClick={() => setIsLocked(true)}
             className="w-12 h-12 rounded-2xl bg-zinc-900/50 border border-white/5 flex items-center justify-center text-indigo-400 active:scale-90 transition-all"
           >
             <Unlock size={20} />
           </button>
        </div>

        {/* Balance Card */}
        <div className="bg-[#111112] border border-white/5 rounded-[48px] p-10 shadow-2xl mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
            <TrendingUp size={180} className="text-emerald-500" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] font-black text-[#10B981] uppercase tracking-widest bg-[#10B981]/10 px-3 py-1.5 rounded-xl">Available Payout</span>
              <div className="bg-[#10B981]/10 text-[#10B981] text-[10px] px-3 py-1.5 rounded-xl font-black">+12.5%</div>
            </div>
            
            <h1 className="text-5xl font-black tracking-tighter mb-10 text-white">
              GHC {currentBalance.toLocaleString()}<span className="text-zinc-700 text-2xl font-bold">.00</span>
            </h1>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setShowWithdraw(true)}
                className="flex-1 bg-[#10B981] hover:bg-[#0ea873] py-5 rounded-[28px] font-black text-sm uppercase tracking-tight flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-[#10B981]/20 text-black"
              >
                <ArrowUpRight size={20} strokeWidth={3} /> Withdraw
              </button>
              <button className="flex-1 bg-[#1A1A1B] hover:bg-zinc-800 py-5 rounded-[28px] font-black text-sm uppercase tracking-tight flex items-center justify-center gap-2 transition-all active:scale-95 border border-white/5 text-white">
                <ArrowDownLeft size={20} strokeWidth={3} /> Add Funds
              </button>
            </div>
          </div>
        </div>

        {/* Transaction Ledger */}
        <div className="mb-12 px-2">
           <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-xl italic tracking-tight">Arena Ledger</h3>
              <button className="text-[10px] font-black uppercase text-indigo-400">View All</button>
           </div>
           <div className="space-y-4">
              {transactions.map(tx => (
                <TransactionItem key={tx.id} tx={tx} />
              ))}
           </div>
        </div>

        {/* Earnings Insight */}
        <div className="mb-12 px-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-xl italic tracking-tight">Earnings Insight</h3>
            <button className="bg-[#1A1A1B] px-4 py-2 rounded-xl border border-white/5 text-[9px] font-black uppercase text-[#10B981] tracking-widest">Weekly</button>
          </div>
          
          <div className="h-64 w-full bg-[#0A0A0B] rounded-[48px] border border-white/5 p-8 relative shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#10B981" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#chartGradient)" 
                  dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#0A0A0B' }}
                  activeDot={{ r: 8, fill: '#FFFFFF', stroke: '#10B981', strokeWidth: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Local Payout Methods Grid */}
        <div className="mb-12 px-2">
          <h3 className="font-black text-xl italic tracking-tight mb-8">Local Payout Methods</h3>
          <div className="grid grid-cols-3 gap-5">
            <PaymentMethod icon={<Smartphone className="text-yellow-500" />} label="MoMo" />
            <PaymentMethod icon={<Building className="text-blue-500" />} label="Bank" />
            <PaymentMethod icon={<CreditCard className="text-purple-500" />} label="Cards" />
          </div>
        </div>

        {/* Security Banner */}
        <div className="px-2">
           <div className="bg-[#10B981]/5 border border-[#10B981]/15 rounded-[36px] p-8 flex items-center gap-6 shadow-xl">
            <div className="w-16 h-16 rounded-[22px] bg-[#10B981]/10 flex items-center justify-center text-[#10B981] shrink-0 border border-[#10B981]/10">
              <ShieldCheck size={36} />
            </div>
            <div>
              <h4 className="font-black text-[#10B981] text-sm uppercase tracking-tight">Vault-Level Security</h4>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.15em] mt-1.5 leading-relaxed opacity-80">Transactions are encrypted and verified via KYC.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Overlay */}
      {showWithdraw && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/90 backdrop-blur-xl p-6 animate-in fade-in duration-300">
          <div className="bg-[#0A0A0B] border border-white/5 w-full max-w-lg rounded-t-[56px] p-10 pb-16 shadow-2xl relative animate-in slide-in-from-bottom duration-500">
            {!done ? (
              <>
                <button onClick={() => setShowWithdraw(false)} className="absolute top-8 right-8 p-3 bg-zinc-900 rounded-full text-zinc-500"><X size={24}/></button>
                <div className="mb-10">
                  <h2 className="text-3xl font-black italic tracking-tighter mb-4 uppercase">Authorize Payout</h2>
                  <p className="text-sm text-zinc-500 font-bold leading-relaxed">Your earnings of <span className="text-white">GHC {currentBalance.toLocaleString()}.00</span> will be wired to your verified GIGAVibe MoMo Gateway.</p>
                </div>
                
                <button 
                  disabled={withdrawing}
                  onClick={handleWithdraw}
                  className="w-full bg-[#10B981] py-6 rounded-[32px] font-black text-lg uppercase tracking-widest flex items-center justify-center gap-4 active:scale-95 transition-all disabled:opacity-50 text-black shadow-2xl shadow-[#10B981]/20"
                >
                  {withdrawing ? <div className="w-6 h-6 border-4 border-black/30 border-t-black rounded-full animate-spin"></div> : 'Confirm Transaction'}
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center text-center py-6 animate-in zoom-in duration-300">
                <div className="w-24 h-24 bg-[#10B981]/10 rounded-full flex items-center justify-center text-[#10B981] mb-8 border border-[#10B981]/20">
                  <CheckCircle2 size={56} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter mb-4 uppercase">Success</h2>
                <p className="text-sm text-zinc-500 mb-12 font-bold leading-relaxed max-w-[240px]">The neural network has cleared your funds. Check your wallet shortly.</p>
                <button 
                  onClick={() => { setShowWithdraw(false); setDone(false); }}
                  className="w-full bg-zinc-900 py-5 rounded-[28px] font-black text-sm uppercase tracking-widest text-zinc-300"
                >
                  Return to Vault
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const TransactionItem: React.FC<{ tx: Transaction }> = ({ tx }) => {
  const isIncoming = tx.type !== 'WITHDRAWAL';
  const getIcon = () => {
    switch(tx.type) {
      case 'TIP': return <Coins size={18} className="text-amber-500" />;
      case 'SUBSCRIPTION': return <Gem size={18} className="text-indigo-400" />;
      case 'AD_REVENUE': return <Zap size={18} className="text-emerald-500" />;
      default: return <ArrowUpRight size={18} className="text-red-500" />;
    }
  };

  const getLabel = () => {
    switch(tx.type) {
      case 'TIP': return `Tip from ${tx.from}`;
      case 'SUBSCRIPTION': return `Sub from ${tx.from}`;
      case 'AD_REVENUE': return 'Global Ad Share';
      default: return 'Arena Withdrawal';
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-[32px] flex items-center justify-between group hover:bg-zinc-900 transition-colors">
       <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/5">
             {getIcon()}
          </div>
          <div>
             <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-200">{getLabel()}</h5>
             <div className="flex items-center gap-1 text-[9px] text-zinc-600 font-bold uppercase mt-1">
                <Clock size={10} /> {tx.date}
             </div>
          </div>
       </div>
       <div className={`text-sm font-black italic tracking-tight ${isIncoming ? 'text-[#10B981]' : 'text-zinc-500'}`}>
          {isIncoming ? '+' : '-'}GHC {tx.amount}
       </div>
    </div>
  );
};

const PaymentMethod: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <button className="flex flex-col items-center gap-4 p-8 rounded-[40px] bg-[#0D0D0E] border border-white/5 hover:border-[#10B981]/30 transition-all active:scale-90 group shadow-lg">
    <div className="p-4 rounded-[20px] bg-zinc-900 group-hover:bg-[#10B981]/10 transition-colors">
      {React.cloneElement(icon as React.ReactElement<any>, { size: 28 })}
    </div>
    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] group-hover:text-zinc-300 transition-colors">{label}</span>
  </button>
);

export default Wallet;
