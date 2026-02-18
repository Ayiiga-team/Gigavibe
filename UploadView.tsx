
import React, { useState, useRef } from 'react';
import { X, Upload, Music, MapPin, Tag, Globe, ChevronRight, Video, ImageIcon, FileMusic } from 'lucide-react';
import { CreatorPost } from '../../types';

interface UploadViewProps {
  onClose: () => void;
  onPostCreated: (post: CreatorPost) => void;
}

const UploadView: React.FC<UploadViewProps> = ({ onClose, onPostCreated }) => {
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectMedia = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handlePost = () => {
    if (!previewUrl) return;

    // Fixed CreatorPost object initialization to match the required types
    const newPost: CreatorPost = {
      id: Date.now().toString(),
      creatorName: 'Ayiiga Benard', // Mock logged in user
      creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      type: selectedFile?.type.startsWith('video') ? 'video' : 'image',
      bg: previewUrl,
      caption: caption || 'Check out my new vibe! #GIGAVibe',
      likes: 0,
      followers: 0,
      // Fixed: Type 'number' is not assignable to type 'CommentData[]'.
      commentCount: 0,
      comments: [],
      shares: 0,
      earnings: 0,
      isLiked: false,
      isFollowing: true
    };

    onPostCreated(newPost);
    alert('Vibe Posted Successfully! 🚀');
    onClose();
  };

  return (
    <div className="h-full bg-zinc-950 flex flex-col w-full fixed inset-0 z-[100]">
      <header className="h-16 flex items-center justify-between px-6 border-b border-zinc-900 sticky top-0 bg-black/90 backdrop-blur-md z-10">
        <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-full"><X size={28} /></button>
        <h3 className="font-black text-xl italic tracking-tighter">New Vibe</h3>
        <button 
          onClick={() => selectedFile && setStep(2)}
          className={`text-sm font-black uppercase text-indigo-400 ${!selectedFile || step === 2 ? 'invisible' : ''}`}
        >
          Next
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-32">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="video/*,image/*,audio/*" 
          onChange={onFileChange} 
        />

        {step === 1 ? (
          <div className="flex flex-col h-full animate-in fade-in duration-300">
            <div 
              onClick={handleSelectMedia}
              className="w-full aspect-[4/5] bg-zinc-900 rounded-[48px] border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center gap-6 text-zinc-600 cursor-pointer hover:border-indigo-500 hover:text-indigo-400 transition-all group relative overflow-hidden"
            >
              {previewUrl ? (
                <>
                  {selectedFile?.type.startsWith('video') ? (
                    <video src={previewUrl} className="w-full h-full object-cover" autoPlay loop muted />
                  ) : selectedFile?.type.startsWith('audio') ? (
                    <div className="flex flex-col items-center gap-4">
                      <FileMusic size={80} className="text-purple-500" />
                      <p className="font-bold text-white">{selectedFile.name}</p>
                    </div>
                  ) : (
                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <p className="bg-white text-black px-6 py-2 rounded-full font-black uppercase text-xs">Change Media</p>
                  </div>
                </>
              ) : (
                <>
                  <Upload size={64} className="group-hover:scale-110 transition-transform text-indigo-500" />
                  <div className="text-center px-8">
                    <p className="text-lg font-black text-white">Select from Gallery</p>
                    <p className="text-[10px] uppercase tracking-widest mt-2 text-zinc-500 font-bold leading-relaxed">Videos, Photos or Music Lab Tracks</p>
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8">
              <button onClick={handleSelectMedia} className="flex flex-col items-center gap-2 p-4 bg-zinc-900 border border-zinc-800 rounded-3xl active:scale-90 transition-all">
                <Video size={20} className="text-zinc-400" />
                <span className="text-[10px] font-black uppercase text-zinc-500">Camera</span>
              </button>
              <button onClick={handleSelectMedia} className="flex flex-col items-center gap-2 p-4 bg-zinc-900 border border-zinc-800 rounded-3xl active:scale-90 transition-all">
                <ImageIcon size={20} className="text-zinc-400" />
                <span className="text-[10px] font-black uppercase text-zinc-500">Photos</span>
              </button>
              <button onClick={handleSelectMedia} className="flex flex-col items-center gap-2 p-4 bg-zinc-900 border border-zinc-800 rounded-3xl active:scale-90 transition-all">
                <Music size={20} className="text-zinc-400" />
                <span className="text-[10px] font-black uppercase text-zinc-500">Music</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 animate-in slide-in-from-right duration-300">
            <div className="flex gap-4 items-start">
              <div className="w-24 h-32 bg-zinc-900 rounded-2xl overflow-hidden shrink-0 border border-zinc-800">
                {selectedFile?.type.startsWith('image') || selectedFile?.type.startsWith('video') ? (
                  <img src={previewUrl!} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-500/10"><Music className="text-indigo-400" /></div>
                )}
              </div>
              <textarea 
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption... tag your vibe arena #GIGAVibe"
                className="flex-1 bg-transparent border-none outline-none text-base h-32 resize-none font-medium placeholder:text-zinc-700 text-white"
              ></textarea>
            </div>

            <div className="space-y-3">
              <UploadOption icon={<Music size={22} />} label="Add Music" value="None" />
              <UploadOption icon={<Tag size={22} />} label="Tag People" value="0 people" />
              <UploadOption icon={<MapPin size={22} />} label="Location" value="Accra, Ghana" />
              <UploadOption icon={<Globe size={22} />} label="Who can see this" value="Public" />
            </div>

            <div className="mt-8">
               <button 
                onClick={handlePost}
                className="w-full bg-indigo-600 py-6 rounded-[32px] font-black text-xl tracking-tight shadow-2xl shadow-indigo-900/40 active:scale-95 transition-all"
               >
                 Launch Vibe
               </button>
               <p className="text-[11px] text-zinc-500 text-center mt-6 uppercase tracking-[0.2em] font-black opacity-60">Estimated Reach: ~12.4K People</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const UploadOption: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center justify-between p-5 bg-zinc-900/50 rounded-3xl border border-zinc-900 active:bg-zinc-900 transition-colors">
    <div className="flex items-center gap-4">
      <div className="text-indigo-500">{icon}</div>
      <span className="text-base font-bold text-white">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-sm text-zinc-500 font-bold">{value}</span>
      <ChevronRight size={18} className="text-zinc-700" />
    </div>
  </div>
);

export default UploadView;
