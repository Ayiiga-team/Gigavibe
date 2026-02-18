
import React, { useState } from 'react';
import { Mail, Phone, Globe, ShieldCheck, ArrowRight, Loader2, Zap } from 'lucide-react';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider, isNeuralLinkActive } from '../firebase';

interface AuthViewProps {
  onLogin: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [method, setMethod] = useState<'INITIAL' | 'PHONE' | 'EMAIL'>('INITIAL');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    if (!isNeuralLinkActive) {
      setError("Cloud Sync is currently in Local Mode. Use Founder Access below.");
      return;
    }
    setIsSubmitting(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!isNeuralLinkActive) {
      setError("Cloud Sync is currently in Local Mode. Use Founder Access below.");
      return;
    }
    if (!email || !password) return;
    setIsSubmitting(true);
    setError('');
    try {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (loginErr: any) {
        if (loginErr.code === 'auth/user-not-found') {
          await createUserWithEmailAndPassword(auth, email, password);
        } else {
          throw loginErr;
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Skip auth for local development/sandbox
  const enterSandbox = () => {
    onLogin(); // App logic handles setting a local user if fbUser is null
  };

  return (
    <div className="flex flex-col h-screen bg-black items-center justify-center p-8 max-w-lg mx-auto border-x border-zinc-900">
      <div className="w-24 h-24 rounded-[36px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-black text-4xl italic tracking-tighter shadow-2xl shadow-indigo-500/20 mb-8">
        G
      </div>
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black mb-3 italic tracking-tighter">GIGAVibe</h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">Intelligent Global Arena</p>
      </div>

      <div className="w-full space-y-4">
        {method === 'INITIAL' ? (
          <>
            <AuthButton 
              icon={<Globe size={20} className="text-blue-400" />} 
              label={isSubmitting ? "Syncing..." : "Continue with Google"} 
              onClick={handleGoogleLogin} 
              disabled={isSubmitting}
            />
            <AuthButton icon={<Mail size={20} className="text-indigo-400" />} label="Email Arena Link" onClick={() => setMethod('EMAIL')} />
            
            <div className="relative py-4">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-900"></div></div>
               <div className="relative flex justify-center text-[8px] font-black uppercase tracking-widest"><span className="bg-black px-4 text-zinc-700">Arena Gatekeeper</span></div>
            </div>

            <button 
              onClick={enterSandbox}
              className="w-full flex items-center justify-center gap-3 py-6 bg-zinc-900/50 border border-indigo-500/20 rounded-[28px] text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:bg-indigo-600/10 transition-all active:scale-95"
            >
              <Zap size={16} /> Enter via Founder Sandbox
            </button>
          </>
        ) : (
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[40px] animate-in fade-in slide-in-from-right-4">
            <h3 className="text-xl font-black italic mb-6 uppercase tracking-tighter">{method === 'EMAIL' ? 'Neural Email Link' : 'Phone Verification'}</h3>
            
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Arena ID (Email)"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-5 text-sm mb-4 outline-none focus:ring-1 focus:ring-indigo-500 text-white font-bold italic"
            />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Security Key (Password)"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-5 text-sm mb-6 outline-none focus:ring-1 focus:ring-indigo-500 text-white font-bold italic"
            />

            {error && <p className="text-[10px] text-red-500 font-black uppercase tracking-widest mb-4 italic text-center">{error}</p>}

            <button 
              onClick={handleEmailAuth}
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-500 active:scale-95 transition-all shadow-xl shadow-indigo-900/20"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <>Initialize Session <ArrowRight size={18} /></>}
            </button>
            <button onClick={() => setMethod('INITIAL')} className="w-full text-zinc-600 text-[9px] font-black uppercase tracking-widest mt-6 hover:text-white">Back to Portal</button>
          </div>
        )}
      </div>

      <div className="mt-12 text-center">
        <div className="flex items-center justify-center gap-2 text-zinc-600 mb-4">
          <ShieldCheck size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">GIGAVibe Ecosystem Protected</span>
        </div>
        <p className="text-[9px] text-zinc-500 max-w-xs leading-relaxed uppercase font-black tracking-widest opacity-40">
          Founder: Ayiiga Benard
        </p>
      </div>
    </div>
  );
};

const AuthButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; disabled?: boolean }> = ({ icon, label, onClick, disabled }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className="w-full flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-[28px] hover:bg-zinc-800 transition-all active:scale-95 group disabled:opacity-50"
  >
    <div className="p-3 bg-zinc-800 rounded-2xl group-hover:bg-zinc-700">{icon}</div>
    <span className="font-black italic tracking-tight text-white flex-1 text-left">{label}</span>
  </button>
);

export default AuthView;
