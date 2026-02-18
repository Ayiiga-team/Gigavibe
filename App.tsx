
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot, getDoc, setDoc } from 'firebase/firestore';
import { AppTab, OverlayView, CreatorPost, Transaction, VerificationStatus } from './types';
import { auth, db, isNeuralLinkActive } from './firebase';
import Layout from './components/Layout';
import SocialFeed from './views/SocialFeed';
import Chats from './views/Chats';
import GlobalShop from './views/GlobalShop';
import AILab from './views/AILab';
import Wallet from './views/Wallet';
import AuthView from './views/AuthView';
import CreationMenu from './components/CreationMenu';
import ProfileView from './views/subviews/ProfileView';
import NotificationsView from './views/subviews/NotificationsView';
import SettingsView from './views/subviews/SettingsView';
import CreatorDashboard from './views/subviews/CreatorDashboard';
import LiveStreamView from './views/subviews/LiveStreamView';
import UploadView from './views/subviews/UploadView';
import CallOverlay from './views/subviews/CallOverlay';
import InAppBrowser from './components/InAppBrowser';
import MonetizationOverlay from './components/MonetizationOverlay';
import VerificationView from './views/subviews/VerificationView';
import ShareOverlay from './components/ShareOverlay';

const INITIAL_POSTS: CreatorPost[] = [
  {
    id: '1',
    creatorName: 'Ayiiga Benard',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    type: 'video',
    bg: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80',
    caption: 'GIGAVibe: The Intelligent Global Arena is officially live! 🌍 We pay creators 75% ad share. Check our roadmap here: https://gigavibe.arena/roadmap',
    likes: 2400500,
    followers: 1200000,
    commentCount: 89000,
    comments: [],
    shares: 45000,
    earnings: 4500,
    isVerified: true,
    externalLink: 'https://google.com'
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAppReady, setIsAppReady] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.FEED);
  const [isCreationMenuOpen, setCreationMenuOpen] = useState(false);
  const [overlay, setOverlay] = useState<OverlayView>(null);
  const [browserUrl, setBrowserUrl] = useState<string>('');
  const [posts, setPosts] = useState<CreatorPost[]>(INITIAL_POSTS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [callData, setCallData] = useState<{ name: string; type: 'audio' | 'video' } | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('NONE');
  const [shareData, setShareData] = useState<CreatorPost | null>(null);
  const [monetizeTarget, setMonetizeTarget] = useState<{ type: 'TIP' | 'SUBSCRIBE', creator: string } | null>(null);

  useEffect(() => {
    // Fail-safe Boot: If Firebase hangs, initialize Local Node after 2 seconds
    const bootTimeout = setTimeout(() => {
      if (!isAppReady) {
        console.warn("Arena Boot: Firebase connection slow. Entering Local Node Mode.");
        setIsAppReady(true);
      }
    }, 2000);

    // Listen for Firebase Auth changes
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser && isNeuralLinkActive) {
        try {
          const userRef = doc(db, "users", fbUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              name: fbUser.displayName || "New Creator",
              email: fbUser.email,
              kyc: "NONE",
              balance: 0,
              createdAt: new Date()
            });
          } else {
            setVerificationStatus(userSnap.data().kyc as VerificationStatus);
          }
        } catch (err) {
          console.error("Auth Data Sync Failed:", err);
        }
      }
      setIsAppReady(true);
      clearTimeout(bootTimeout);
    }, (error) => {
      console.error("Auth Error:", error);
      setIsAppReady(true);
      clearTimeout(bootTimeout);
    });

    // Real-time Feed Sync with Error Handling
    let postsUnsubscribe = () => {};
    if (isNeuralLinkActive) {
      postsUnsubscribe = onSnapshot(
        doc(db, "arena", "posts"), 
        (doc) => {
          if (doc.exists()) {
            setPosts(doc.data().posts || INITIAL_POSTS);
          }
        },
        (error) => {
          console.warn("Arena Feed Sync: Using local cache due to permission/connection status.");
        }
      );
    }

    return () => {
      unsubscribe();
      postsUnsubscribe();
      clearTimeout(bootTimeout);
    };
  }, [isAppReady]);

  const handleLogout = async () => {
    if (isNeuralLinkActive) {
      await auth.signOut();
    } else {
      setUser(null);
    }
    setOverlay(null);
  };

  const openBrowser = (url: string) => {
    setBrowserUrl(url);
    setOverlay('BROWSER');
  };

  const handleMonetize = (type: 'TIP' | 'SUBSCRIBE', creator: string) => {
    setMonetizeTarget({ type, creator });
    setOverlay('MONETIZE');
  };

  const startCall = (name: string, type: 'audio' | 'video') => {
    setCallData({ name, type });
    setOverlay('CALL');
  };

  const handleVerificationSubmitted = async () => {
    setVerificationStatus('PENDING');
    if (user && isNeuralLinkActive) {
      try {
        await setDoc(doc(db, "users", user.uid), { kyc: 'PENDING' }, { merge: true });
      } catch (err) {
        console.warn("Identity Vault: Local update only.");
      }
    }
  };

  const renderView = () => {
    switch (activeTab) {
      case AppTab.FEED: return <SocialFeed posts={posts} setPosts={setPosts} onOpenLink={openBrowser} onMonetize={handleMonetize} onShare={(p) => { setShareData(p); setOverlay('SHARE'); }} />;
      case AppTab.CHATS: return <Chats onStartCall={startCall} onOpenLink={openBrowser} />;
      case AppTab.SHOP: return <GlobalShop />;
      case AppTab.AI_LAB: return <AILab />;
      case AppTab.WALLET: return <Wallet transactions={transactions} />;
      default: return <SocialFeed posts={posts} setPosts={setPosts} onOpenLink={openBrowser} onMonetize={handleMonetize} onShare={(p) => { setShareData(p); setOverlay('SHARE'); }} />;
    }
  };

  const renderOverlay = () => {
    switch (overlay) {
      case 'PROFILE': return <ProfileView onClose={() => setOverlay(null)} onLogout={handleLogout} onMonetize={handleMonetize} isVerified={verificationStatus === 'VERIFIED'} onVerify={() => setOverlay('VERIFICATION')} />;
      case 'NOTIFICATIONS': return <NotificationsView onClose={() => setOverlay(null)} />;
      case 'SETTINGS': return <SettingsView onClose={() => setOverlay(null)} verificationStatus={verificationStatus} onStartVerification={() => setOverlay('VERIFICATION')} />;
      case 'DASHBOARD': return <CreatorDashboard onClose={() => setOverlay(null)} transactions={transactions} verificationStatus={verificationStatus} onStartVerification={() => setOverlay('VERIFICATION')} />;
      case 'LIVE_STREAM': return <LiveStreamView onClose={() => setOverlay(null)} />;
      case 'UPLOAD': return <UploadView onClose={() => setOverlay(null)} onPostCreated={(p) => setPosts([p, ...posts])} />;
      case 'CALL': return <CallOverlay onClose={() => setOverlay(null)} callName={callData?.name || 'User'} callType={callData?.type || 'audio'} />;
      case 'BROWSER': return <InAppBrowser url={browserUrl} onClose={() => setOverlay(null)} />;
      case 'SHARE': return shareData ? <ShareOverlay post={shareData} onClose={() => setOverlay(null)} /> : null;
      case 'MONETIZE': return monetizeTarget ? (
        <MonetizationOverlay 
          type={monetizeTarget.type} 
          creatorName={monetizeTarget.creator} 
          onClose={() => setOverlay(null)} 
          onSuccess={(amt) => console.log("Monetized", amt)}
        />
      ) : null;
      case 'VERIFICATION': return <VerificationView onClose={() => setOverlay(null)} onSubmitted={handleVerificationSubmitted} />;
      default: return null;
    }
  };

  if (!isAppReady) {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-indigo-600 rounded-[32px] animate-pulse shadow-2xl shadow-indigo-500/20" />
        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500 animate-pulse">Initializing Arena Pulse...</p>
      </div>
    );
  }

  // Fallback to AuthView if no user is authenticated (Cloud or Local)
  if (!user && isNeuralLinkActive) {
    return <AuthView onLogin={() => {}} />;
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white overflow-hidden font-sans selection:bg-indigo-500/30 fixed inset-0">
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onPlusClick={() => setCreationMenuOpen(true)}
        onProfileClick={() => setOverlay('PROFILE')}
        onNotificationsClick={() => setOverlay('NOTIFICATIONS')}
        onMenuClick={() => setOverlay('SETTINGS')}
      >
        <main className="flex-1 overflow-hidden relative h-full w-full">
          {renderView()}
          {/* Cloud Status Indicator */}
          {!isNeuralLinkActive && (
            <div className="fixed top-20 right-4 z-[70] bg-zinc-900/80 backdrop-blur-xl border border-white/5 px-3 py-1.5 rounded-full flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
               <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Local Node</span>
            </div>
          )}
        </main>
      </Layout>

      {isCreationMenuOpen && (
        <CreationMenu 
          onClose={() => setCreationMenuOpen(false)} 
          onAction={(type) => {
            setCreationMenuOpen(false);
            if (type === 'LIVE') setOverlay('LIVE_STREAM');
            else setOverlay('UPLOAD');
          }}
        />
      )}

      {overlay && (
        <div className="fixed inset-0 z-[100] bg-black animate-in fade-in slide-in-from-bottom-4 duration-300 h-full w-full">
          {renderOverlay()}
        </div>
      )}
    </div>
  );
};

export default App;
