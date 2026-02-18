
export const TABS = {
    ARENA: 'FEED',
    PULSE: 'CHATS',
    MARKET: 'SHOP',
    LABS: 'AI_LAB',
    VAULT: 'WALLET'
};

export const OVERLAYS = {
    PROFILE: 'PROFILE',
    NOTIFICATIONS: 'NOTIFICATIONS',
    SETTINGS: 'SETTINGS',
    DASHBOARD: 'DASHBOARD',
    LIVE: 'LIVE_STREAM',
    UPLOAD: 'UPLOAD',
    VERIFY: 'VERIFICATION'
};

export class GigaRouter {
    constructor(onNavigate) {
        this.onNavigate = onNavigate;
    }

    pushTab(tab) {
        this.onNavigate({ type: 'TAB', value: tab });
        localStorage.setItem('gigavibe_last_tab', tab);
    }

    pushOverlay(overlay) {
        this.onNavigate({ type: 'OVERLAY', value: overlay });
    }

    closeOverlay() {
        this.onNavigate({ type: 'OVERLAY', value: null });
    }
}
