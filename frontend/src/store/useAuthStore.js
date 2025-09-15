import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io,   } from 'socket.io-client';

const BASE_URL = 'http://localhost:5001';


export const useAuthStore = create((set, get) => ({
    authUser: null,
    
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    //loading state for checking if user is authenticated
    isCheckingAuth: true,

    onlineUsers: [],

    socket : null,

    checkAuth: async () =>{
        try {
            const res = await axiosInstance.get("/auth/check-auth");
            set({ authUser: res.data})
            get().connectSocket();
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
            get().connectSocket();  // Connect socket after signup
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
            get().connectSocket();  // Connect socket after login
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
            get().disconnectSocket();  // Disconnect socket on logout
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

    connectSocket: async() => {
        const {authUser} = get();
        if (!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, {
            query : {
                userId : authUser._id,
            },
        }); 
        socket.connect()

        set({socket: socket});

        socket.on("getOnlineUsers", (userIds) => {  
            set({onlineUsers: userIds});
        }) 
        
    },

    disconnectSocket: async() => {
        if (get().socket?.connected) get().socket.disconnect();
    }


}));