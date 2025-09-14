import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';


export const useAuthStore = create((set) => ({
    authUser: null,
    
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    //loading state for checking if user is authenticated
    isCheckingAuth: true,

    onlineUsers: [],

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
    },

    signup : async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            toast.success("Signup successful!");
            set({ authUser: res.data });
        }catch (error) {
            console.error("Error during signup (useAuthStore): ", error);
            const message = error.response?.data?.message || "Signup failed. Please try again.";
            toast.error(message);
        }finally{
            set({ isSigningUp: false });
        }
    },

    login : async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Login successful!");
        } catch (error) {
            console.error("Error during login (useAuthStore): ", error);
            const message = error.response?.data?.message || "Login failed. Please try again.";
            toast.error(message);
        }finally{
            set({ isLoggingIn: false });
        }
    },

    logout : async() => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null});
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Error during logout (useAuthStore): ", error);
            const message = error.response?.data?.message || "Logout failed. Please try again.";
            toast.error(message);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try{
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully!");
        }catch (error) {
            console.error("Error during profile update (useAuthStore): ", error);
            const message = error.response?.data?.message || "Profile update failed. Please try again.";
            toast.error(message);
        }finally{
            set({ isUpdatingProfile: false });
        }
    },


}));