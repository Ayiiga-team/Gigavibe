
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Initialize Global Arena
const startArena = () => {
    const rootElement = document.getElementById('root');
    if (!rootElement) throw new Error("Arena Root missing.");

    const root = ReactDOM.createRoot(rootElement);
    // Removed StrictMode for production to prevent sensor double-mounting issues
    root.render(<App />);
    
    console.log("GIGAVibe Ecosystem Online. Founder: Ayiiga Benard");
};

// Neural Boot Sequence
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startArena);
} else {
    startArena();
}
