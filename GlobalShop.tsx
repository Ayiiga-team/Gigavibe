
import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, 
  Star, 
  ArrowLeft, 
  X,
  Camera,
  Store,
  Package,
  ShoppingBag,
  Gem,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Product } from '../types';

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Arena Pro Buds', price: 920, rating: 4.9, seller: 'GIGA Sound', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', category: 'Electronics', description: 'Crystal clear audio for the global arena.' },
  { id: '2', name: 'Studio Halo Light', price: 340, rating: 4.7, seller: 'VibeLight', img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop', category: 'Creator Gear', description: 'Professional lighting for trending creators.' },
  { id: '3', name: 'Founder Black Tee', price: 180, rating: 5.0, seller: 'Arena HQ', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', category: 'Fashion', description: 'Limited edition founders arena apparel.' },
  { id: '4', name: 'Neural Stylus X', price: 1200, rating: 4.8, seller: 'Arena Tech', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop', category: 'Tech', description: 'Precision drawing for AI Lab visionaries.' },
];

const GlobalShop: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'EXPLORE' | 'LOGISTICS' | 'MERCHANT'>('EXPLORE');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  
  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);

  return (
    <div className="h-full bg-black flex flex-col relative overflow-hidden pt-16">
      <div className="px-6 py-5 bg-black/80 backdrop-blur-2xl border-b border-white/5 z-40 sticky top-0">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" size={20} />
            <input 
              type="text" placeholder="Search Global Market..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/80 border border-white/10 rounded-2xl py-4.5 pl-14 pr-4 text-[11px] font-black uppercase tracking-widest outline-none placeholder:text-zinc-800 text-white shadow-inner" 
            />
          </div>
          <button onClick={() => isSeller ? setShowAddItem(true) : setIsSeller(true)} className="h-14 px-7 bg-indigo-600 rounded-[22px] flex items-center justify-center gap-2.5 shadow-2xl active:scale-95 transition-all shrink-0 border border-indigo-400/30">
            <ShoppingBag size={20} className="text-white" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">List Product</span>
          </button>
        </div>
        <div className="flex gap-2 p-1.5 bg-zinc-900/40 rounded-[22px] border border-white/5 mt-5">
           <ShopTab label="Market" active={activeTab === 'EXPLORE'} onClick={() => setActiveTab('EXPLORE')} />
           <ShopTab label="Logistics" active={activeTab === 'LOGISTICS'} onClick={() => setActiveTab('LOGISTICS')} />
           <ShopTab label="Merchant" active={activeTab === 'MERCHANT'} onClick={() => setActiveTab('MERCHANT')} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-44 no-scrollbar">
        {activeTab === 'EXPLORE' && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-500">
            {filteredProducts.map(product => (
              <div key={product.id} onClick={() => setSelectedProduct(product)} className="bg-zinc-950 rounded-[40px] overflow-hidden border border-white/5 flex flex-col group relative shadow-xl">
                 <div className="relative aspect-square overflow-hidden bg-zinc-900">
                    <img src={product.img} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                 </div>
                 <div className="p-5 flex-1 flex flex-col justify-between">
                   <h5 className="font-black text-[10px] uppercase tracking-widest truncate mb-2 text-zinc-200 italic">{product.name}</h5>
                   <span className="text-indigo-400 font-black text-sm tracking-tighter">GHC {product.price}</span>
                 </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'LOGISTICS' && (
           <div className="space-y-6 animate-in slide-in-from-right duration-500 pt-4">
              <div className="bg-[#0A0A0B] border border-white/10 rounded-[48px] p-8 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                      <Truck size={20} />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black uppercase text-white tracking-widest italic">Order #GV-9283</h4>
                      <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">Est. Delivery: Tomorrow</p>
                    </div>
                  </div>
                  <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-lg text-[9px] font-black uppercase">In Transit</div>
                </div>

                <div className="space-y-8 relative">
                   <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-zinc-800"></div>
                   <div className="absolute left-4 top-2 h-1/2 w-0.5 bg-indigo-600 shadow-[0_0_10px_#6366f1]"></div>
                   
                   <LogisticsStep active label="Order Processed" time="10:20 AM" />
                   <LogisticsStep active label="Neural QA Passed" time="11:45 AM" />
                   <LogisticsStep active current label="Out for Delivery" time="02:30 PM" />
                   <LogisticsStep label="Arena Arrival" time="Pending" />
                </div>

                <div className="mt-10 pt-10 border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden">
                         <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Dispatcher</p>
                        <p className="text-sm font-black italic text-white">Giga Rider #42</p>
                      </div>
                   </div>
                   <button className="bg-indigo-600 p-4 rounded-2xl shadow-xl active:scale-90"><Zap size={20} className="text-white"/></button>
                </div>
              </div>
           </div>
        )}

        {activeTab === 'MERCHANT' && (
           <div className="py-24 text-center bg-zinc-900/30 rounded-[72px] border-2 border-dashed border-zinc-900 p-12">
              <Store size={72} className="mx-auto text-zinc-800 mb-8" />
              <h3 className="text-3xl font-black italic tracking-tighter mb-4 uppercase">Start Selling</h3>
              <button onClick={() => setIsSeller(true)} className="w-full bg-indigo-600 py-7 rounded-[36px] font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95 border border-indigo-400/20">Initialize Store</button>
           </div>
        )}
      </div>
    </div>
  );
};

const LogisticsStep: React.FC<{ active?: boolean; current?: boolean; label: string; time: string }> = ({ active, current, label, time }) => (
  <div className="flex gap-8 items-start relative z-10">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-4 border-black transition-all ${current ? 'bg-indigo-600 shadow-[0_0_15px_#6366f1]' : active ? 'bg-indigo-500' : 'bg-zinc-900'}`}>
      {active && !current && <CheckCircle2 size={14} className="text-white" />}
      {current && <Zap size={14} className="text-white animate-pulse" />}
    </div>
    <div className="flex-1">
      <h5 className={`text-xs font-black uppercase tracking-widest italic ${active ? 'text-white' : 'text-zinc-700'}`}>{label}</h5>
      <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{time}</p>
    </div>
  </div>
);

const ShopTab: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button onClick={onClick} className={`flex-1 py-3.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-300 ${active ? 'bg-white text-black shadow-2xl' : 'text-zinc-600 hover:text-zinc-300'}`}>
    {label}
  </button>
);

export default GlobalShop;
