import {create} from 'zustand';

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem('chat-theme') || 'light',
    setTheme : (theme) => {
        localStorage.setItem('chat-theme', theme);
        set({theme}); //shorthand for {theme: theme}
    }
}));