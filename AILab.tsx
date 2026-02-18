
import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Video, 
  Image as ImageIcon, 
  Music, 
  Type, 
  Send, 
  Loader2, 
  Share2, 
  History, 
  Copy, 
  Check, 
  Layout, 
  BookOpen, 
  Mic, 
  MicOff, 
  Download, 
  X,
  Music2,
  Activity,
  Wind,
  FileCode
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const AI_TOOLS = [
  { id: 'video', label: 'AI Video', icon: <Video size={20} />, color: 'bg-pink-500' },
  { id: 'image', label: 'AI Image', icon: <ImageIcon size={20} />, color: 'bg-blue-500' },
  { id: 'music', label: 'Composer', icon: <Music size={20} />, color: 'bg-purple-500' },
  { id: 'songwriter', label: 'Songwriter', icon: <Type size={20} />, color: 'bg-emerald-500' },
  { id: 'copywriting', label: 'Copywriter', icon: <Layout size={20} />, color: 'bg-orange-500' },
  { id: 'bookwriter', label: 'Book Writer', icon: <BookOpen size={20} />, color: 'bg-indigo-500' },
];

const GENRES = ['Afrobeat', 'Highlife', 'Amapiano', 'Phonk', 'Pop', 'Jazz', 'Cinematic'];
const MOODS = ['Energetic', 'Dark', 'Chill', 'Uplifting', 'Melancholic'];

const AILab: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState('image');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ type: 'image' | 'text'; content: string; tool: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Music Specific State
  const [genre, setGenre] = useState('Afrobeat');
  const [tempo, setTempo] = useState(110);
  const [mood, setMood] = useState('Energetic');

  // Voice State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordInterval = useRef<number | null>(null);

  useEffect(() => {
    if (isRecording) {
      recordInterval.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordInterval.current) clearInterval(recordInterval.current);
      setRecordingTime(0);
    }
    return () => {
      if (recordInterval.current) clearInterval(recordInterval.current);
    };
  }, [isRecording]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setResult(null);
    setCopied(false);
    setSaved(false);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      if (selectedTool === 'image') {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: `Professional ${selectedTool} creation: ${prompt}` }] }
        });
        
        let imageUrl = '';
        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              imageUrl = `data:image/png;base64,${part.inlineData.data}`;
              break;
            }
          }
        }
        if (imageUrl) {
          setResult({ type: 'image', content: imageUrl, tool: selectedTool });
        } else {
          setResult({ type: 'text', content: "Neural synthesis failed. Retrying...", tool: selectedTool });
        }
      } else {
        let systemInstruction = `You are an AI creation specialist for the GIGAVibe super app. Your task: ${selectedTool}. Return creative and high-quality results.`;
        
        // Enhance for music tools
        if (selectedTool === 'songwriter' || selectedTool === 'music') {
          systemInstruction = `You are a professional Music Theorist and Songwriter for GIGAVibe. 
          Generate a detailed blueprint for a song including Structure (Verse, Chorus, Bridge), Lyrics, and Chords.
          Target Parameters:
          Genre: ${genre}
          Tempo: ${tempo} BPM
          Mood: ${mood}
          
          Provide the output in a clean, structured Markdown format. 
          Also, provide a short ABC notation snippet for the lead melody.`;
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: { systemInstruction, temperature: 0.85 }
        });
        setResult({ type: 'text', content: response.text || "Communication interrupted.", tool: selectedTool });
      }
    } catch (error) {
      console.error(error);
      setResult({ type: 'text', content: "Neural link unstable. Refresh required.", tool: selectedTool });
    } finally {
      setIsGenerating(false);
    }
  };

  const exportMIDI = () => {
    // Simulated MIDI Generation Logic
    // In a production environment, we'd use a library like 'midi-writer-js'
    // Here we generate a simple blob representing a MIDI file with the metadata
    const midiHeader = [0x4d, 0x54, 0x68, 0x64, 0x00, 0x00, 0x00, 0x06, 0x00, 0x01, 0x00, 0x01, 0x01, 0xe0];
    const data = new Uint8Array([...midiHeader]);
    const blob = new Blob([data], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Arena_Pulse_${genre}_${tempo}BPM.mid`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert("MIDI Pattern Exported to Sound Lab! 🎧");
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        if (isRecording) {
           setIsRecording(false);
           setPrompt("A soulful Afrobeat anthem about the global arena, featuring deep basslines and rhythmic percussion.");
        }
      }, 3500);
    } else {
      setIsRecording(false);
    }
  };

  const formatRecordTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isMusicTool = selectedTool === 'songwriter' || selectedTool === 'music';

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden relative">
      <header className="p-8 bg-black/60 backdrop-blur-3xl border-b border-white/5 flex justify-between items-center z-10 shrink-0">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase">AI LAB</h2>
          <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em]">Neural Creator Engine</p>
        </div>
        <button className="p-4 bg-zinc-900/50 border border-white/5 rounded-3xl text-zinc-500 hover:text-white transition-colors active:scale-90">
          <History size={24} />
        </button>
      </header>

      <div className="px-6 py-6 flex gap-4 overflow-x-auto no-scrollbar shrink-0 border-b border-white/5 bg-zinc-950/20">
        {AI_TOOLS.map(tool => (
          <button 
            key={tool.id}
            onClick={() => { setSelectedTool(tool.id); setResult(null); }}
            className={`flex flex-col items-center gap-3 p-6 rounded-[36px] border transition-all shrink-0 min-w-[110px] ${
              selectedTool === tool.id 
                ? 'bg-zinc-900 border-indigo-500 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]' 
                : 'bg-zinc-950 border-white/5 text-zinc-600'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${selectedTool === tool.id ? tool.color : 'bg-zinc-900 opacity-40'}`}>
              {tool.icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-tight">{tool.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 px-8 overflow-y-auto pb-52 no-scrollbar pt-6">
        {/* Neural Parameters for Music */}
        {isMusicTool && !isGenerating && !result && (
          <div className="mb-8 space-y-6 animate-in slide-in-from-top duration-500">
             <div className="bg-zinc-900/40 p-6 rounded-[40px] border border-white/5">
                <div className="flex items-center gap-2 mb-4">
                   <Music2 size={16} className="text-indigo-400" />
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Global Genre</h4>
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                   {GENRES.map(g => (
                     <button 
                       key={g} 
                       onClick={() => setGenre(g)}
                       className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${genre === g ? 'bg-indigo-600 text-white' : 'bg-zinc-900 text-zinc-500 border border-white/5'}`}
                     >
                        {g}
                     </button>
                   ))}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-900/40 p-6 rounded-[40px] border border-white/5">
                   <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Activity size={16} className="text-emerald-400" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Tempo</h4>
                      </div>
                      <span className="text-xs font-black text-white italic">{tempo} BPM</span>
                   </div>
                   <input 
                     type="range" min="60" max="180" 
                     value={tempo} 
                     onChange={(e) => setTempo(parseInt(e.target.value))}
                     className="w-full accent-indigo-500 bg-zinc-800 h-1.5 rounded-full appearance-none cursor-pointer"
                   />
                </div>
                <div className="bg-zinc-900/40 p-6 rounded-[40px] border border-white/5">
                   <div className="flex items-center gap-2 mb-4">
                      <Wind size={16} className="text-blue-400" />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Mood Weight</h4>
                   </div>
                   <div className="flex gap-2 overflow-x-auto no-scrollbar">
                      {MOODS.map(m => (
                        <button 
                          key={m} 
                          onClick={() => setMood(m)}
                          className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${mood === m ? 'bg-indigo-600 text-white' : 'bg-zinc-900 text-zinc-500 border border-white/5'}`}
                        >
                           {m}
                        </button>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {isGenerating ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-8">
            <div className="relative">
               <Loader2 className="animate-spin text-indigo-500" size={64} />
               <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-pulse" size={24} />
            </div>
            <p className="text-xl font-black tracking-tight italic text-white uppercase animate-pulse">Architecting Vision...</p>
          </div>
        ) : result ? (
          <div className="animate-in fade-in zoom-in duration-500 pb-12">
            <div className="bg-[#0A0A0B] border border-white/10 rounded-[48px] overflow-hidden shadow-2xl p-8">
              {result.type === 'image' ? (
                <img src={result.content} className="w-full aspect-[4/5] object-cover rounded-[32px] mb-8" alt="AI Creation" />
              ) : (
                <div className="whitespace-pre-wrap font-sans text-sm font-medium leading-relaxed text-zinc-200 bg-white/5 p-8 rounded-[36px] mb-8 italic border border-white/5">
                  {result.content}
                </div>
              )}
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => { navigator.clipboard.writeText(result.content); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="flex-1 min-w-[120px] bg-zinc-900 py-5 rounded-[28px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                  {copied ? 'Linked' : 'Copy'}
                </button>
                <button 
                  onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}
                  className="flex-1 min-w-[120px] bg-indigo-600 py-5 rounded-[28px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                >
                  {saved ? <Check size={18} /> : <Download size={18} />}
                  {saved ? 'Archived' : 'Save'}
                </button>
                {isMusicTool && (
                  <button 
                    onClick={exportMIDI}
                    className="w-full bg-emerald-600/10 text-emerald-500 py-5 rounded-[28px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 border border-emerald-500/20 mt-2"
                  >
                    <FileCode size={18} /> Export MIDI Pattern
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center gap-8 text-center opacity-40">
            <Sparkles size={72} className="text-zinc-700" />
            <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">Initialize Creation</h3>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Ready for Neural Input</p>
          </div>
        )}
      </div>

      {/* Prompter Engine - Sticky Control */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-lg px-8 z-50">
        <div className={`p-1.5 rounded-[44px] transition-all duration-500 ${isRecording ? 'recording-pulse' : 'bg-white/10 backdrop-blur-3xl shadow-2xl'}`}>
          <div className="bg-[#0A0A0B]/95 rounded-[40px] p-3 flex items-center gap-3 border border-white/5">
            <button 
              onClick={toggleRecording}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-zinc-900 text-zinc-500 active:scale-90'}`}
            >
              {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            
            <div className="flex-1 px-3">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder={isRecording ? `Neural Sampling... ${formatRecordTime(recordingTime)}` : `Manifest ${selectedTool}...`}
                className="w-full bg-transparent border-none focus:ring-0 outline-none text-sm font-bold placeholder:text-zinc-800 text-white italic"
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-16 h-14 rounded-[28px] bg-indigo-600 flex items-center justify-center disabled:opacity-20 transition-all shadow-xl active:scale-90"
            >
              <Send size={24} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILab;
