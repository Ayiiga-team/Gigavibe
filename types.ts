
export enum AppTab {
  FEED = 'FEED',
  CHATS = 'CHATS',
  SHOP = 'SHOP',
  AI_LAB = 'AI_LAB',
  WALLET = 'WALLET'
}

export type VerificationStatus = 'NONE' | 'PENDING' | 'VERIFIED';

export type OverlayView = 'PROFILE' | 'NOTIFICATIONS' | 'SETTINGS' | 'DASHBOARD' | 'LIVE_STREAM' | 'UPLOAD' | 'CALL' | 'BROWSER' | 'MONETIZE' | 'VERIFICATION' | 'SHARE' | null;

export interface CommentData {
  id: string;
  user: string;
  text: string;
  time: string;
  isCreator?: boolean;
}

export interface CreatorPost {
  id: string;
  creatorName: string;
  creatorAvatar: string;
  type: 'video' | 'image' | 'music';
  bg: string;
  caption: string;
  hashtags?: string[];
  likes: number;
  followers: number;
  commentCount: number;
  comments: CommentData[];
  shares: number;
  earnings: number;
  isLive?: boolean;
  isFollowing?: boolean;
  isLiked?: boolean;
  isMonetized?: boolean;
  isBoosted?: boolean;
  externalLink?: string;
  isVerified?: boolean;
  // Monetization specific
  isPremium?: boolean;
  hasAccess?: boolean;
  subscriptionPrice?: number;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
  isGroup: boolean;
  isPinned?: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  seller: string;
  img: string;
  category: string;
  description?: string;
}

export interface Message {
  id: string;
  sender: string;
  text?: string;
  time: string;
  isMe: boolean;
  type?: 'text' | 'image' | 'audio' | 'file' | 'contact' | 'link';
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  linkUrl?: string;
}

export interface Transaction {
  id: string;
  type: 'TIP' | 'SUBSCRIPTION' | 'WITHDRAWAL' | 'AD_REVENUE';
  amount: number;
  from?: string;
  date: string;
  status: 'COMPLETED' | 'PENDING';
}
