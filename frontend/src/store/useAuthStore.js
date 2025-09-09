import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';


export const useAuthStore = create((set) => ({
    authUser: null,
    
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    //loading state for checking if user is authenticated
    isCheckingAuth: true,

    checkAuth: async () =>{
        try {
            const res = await axiosInstance.get("/auth/check-auth");
            set({ authUser: res.data})
        } catch (error) {
            console.error("Error in checkAuth store: ", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    }
}));