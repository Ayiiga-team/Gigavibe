
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Camera, 
  User, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft, 
  Fingerprint, 
  Scan, 
  Loader2,
  Lock,
  AlertTriangle,
  Upload
} from 'lucide-react';

interface VerificationViewProps {
  onClose: () => void;
  onSubmitted: () => void;
}

const VerificationView: React.FC<VerificationViewProps> = ({ onClose, onSubmitted }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ fullName: '', nationality: 'Ghana', idNumber: '' });
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSensorOffline, setIsSensorOffline] = useState(false);
  const [capturedDocs, setCapturedDocs] = useState<{ id?: string; selfie?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setIsCapturing(true);
    setIsSensorOffline(false);
    const targetFacingMode = step === 2 ? 'environment' : 'user';
    
    const fallbacks = [
      { video: { facingMode: { ideal: targetFacingMode } } },
      { video: true }
    ];

    let success = false;
    for (const constraints of fallbacks) {
      try {
        if (!navigator.mediaDevices?.getUserMedia) break;
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        success = true;
        break;
      } catch (err) {
        continue;
      }
    }

    if (!success) {
      setIsSensorOffline(true);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      if (step === 2) setCapturedDocs({ ...capturedDocs, id: dataUrl });
      if (step === 3) setCapturedDocs({ ...capturedDocs, selfie: dataUrl });
      stopCamera();
    }
  };

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        if (step === 2) setCapturedDocs({ ...capturedDocs, id: url });
        if (step === 3) setCapturedDocs({ ...capturedDocs, selfie: url });
        setIsCapturing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitted();
      setStep(4);
    }, 3000);
  };

  return (
    <div className="h-full bg-black flex flex-col relative overflow-hidden">
      <header className="h-20 flex items-center justify-between px-6 border-b border-zinc-900 bg-black/90 backdrop-blur-xl z-50">
        <button onClick={step === 1 ? onClose : () => setStep(step - 1)} className="p-2 text-zinc-400">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
           <ShieldCheck size={20} className="text-indigo-400" />
           <h3 className="font-black italic tracking-tighter uppercase text-sm">Identity Vault</h3>
        </div>
        <button onClick={onClose} className="p-2 text-zinc-400"><X size={24} /></button>
      </header>

      <div className="flex h-1 bg-zinc-900">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className={`flex-1 transition-all duration-500 ${step >= s ? 'bg-indigo-600' : 'bg-transparent'}`} />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right duration-500 max-w-sm mx-auto">
            <div className="text-center mb-12">
               <div className="w-20 h-20 bg-indigo-600/10 rounded-[32px] flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
                  <User size={40} className="text-indigo-400" />
               </div>
               <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Legal Matrix</h2>
               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">Identity Record</p>
            </div>
            <div className="space-y-6">
              <div className="bg-zinc-900/60 p-6 rounded-[32px] border border-white/5">
                <label className="text-[10px] font-black text-zinc-600 uppercase mb-2 block tracking-widest">Full Legal Name</label>
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="As shown on ID" 
                  className="w-full bg-transparent outline-none font-bold text-lg text-white italic" 
                />
              </div>
            </div>
            <button onClick={() => setStep(2)} disabled={!formData.fullName} className="w-full bg-indigo-600 py-6 rounded-[32px] font-black uppercase tracking-widest text-xs mt-12 disabled:opacity-20">Continue</button>
          </div>
        )}

        {(step === 2 || step === 3) && (
          <div className="animate-in fade-in slide-in-from-right duration-500 max-w-sm mx-auto">
             <div className="text-center mb-10">
               <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-2">
                 {step === 2 ? 'Document Capture' : 'Neural Liveness'}
               </h2>
               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">
                 {step === 2 ? 'Upload National ID' : 'Face Scan Biometrics'}
               </p>
            </div>

            <div 
              onClick={(!isCapturing && !capturedDocs.id && step === 2) || (!isCapturing && !capturedDocs.selfie && step === 3) ? startCamera : undefined}
              className="w-full aspect-square bg-zinc-900 rounded-[40px] border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center relative overflow-hidden group mb-8"
            >
               {(step === 2 ? capturedDocs.id : capturedDocs.selfie) ? (
                 <img src={step === 2 ? capturedDocs.id : capturedDocs.selfie} className="w-full h-full object-cover" alt="Captured" />
               ) : isCapturing ? (
                 isSensorOffline ? (
                    <label className="flex flex-col items-center gap-4 text-center p-6 cursor-pointer">
                       <Upload className="text-indigo-400" size={40} />
                       <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Camera Offline. Select File.</p>
                       <input type="file" className="hidden" accept="image/*" onChange={handleManualUpload} />
                    </label>
                 ) : (
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                 )
               ) : (
                 <>
                   {step === 2 ? <FileText size={48} className="text-zinc-700 mb-4" /> : <Fingerprint size={48} className="text-indigo-500/50 mb-4" />}
                   <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Tap to Begin</span>
                 </>
               )}
               {isCapturing && !isSensorOffline && (
                 <button onClick={capturePhoto} className="absolute bottom-6 w-16 h-16 bg-white rounded-full border-4 border-black shadow-2xl flex items-center justify-center z-10"><Camera size={28} className="text-black" /></button>
               )}
            </div>

            <button 
              onClick={() => step === 2 ? setStep(3) : handleFinalSubmit()}
              disabled={(step === 2 && !capturedDocs.id) || (step === 3 && !capturedDocs.selfie) || isSubmitting}
              className="w-full bg-indigo-600 py-6 rounded-[32px] font-black uppercase tracking-widest text-xs shadow-2xl disabled:opacity-20 flex items-center justify-center gap-3"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Proceed'}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in zoom-in duration-500 max-w-sm mx-auto flex flex-col items-center justify-center h-full text-center py-20">
             <CheckCircle2 size={56} className="text-emerald-500 mb-10" />
             <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-4">PULSE SYNCED</h2>
             <p className="text-sm text-zinc-500 font-bold mb-12 italic">Identity Record submitted for Neural Audit.</p>
             <button onClick={onClose} className="w-full bg-zinc-900 py-6 rounded-[32px] font-black uppercase tracking-widest text-xs text-white">Return to Arena</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationView;
