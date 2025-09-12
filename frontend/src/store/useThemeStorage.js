import {create} from 'zustand';

export const useThemeStorage = create((set) => ({
    theme : localStorage.getItem('chat-theme') || 'light',
    setTheme : (theme) => {
        localStrage.setItem('chat-theme', theme);
        set({theme}); //shorthand for {theme: theme}
    }
}));