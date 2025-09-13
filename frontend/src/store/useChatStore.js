import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useChatStore = create((set) => ({
    messages: [],
    users : [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    onlineUsers: [],

    getUsers: async() => {
        set({isUsersLoading: true});
        try {
            const res = await axiosInstance.get('/messages/users')
            set({users: res.data})
        } catch (error) {
            console.error("Error in getUsers:", error);
            toast.error("Failed to load users.");
        }finally{
            set({isUsersLoading: false});
        }
    },

    getMessages : async(userId) => {
        set({isMessagesLoading: true})
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages: res.data})
        } catch (error) {
            console.error("Error in getMessages:", error);
            toast.error("Failed to load messages.");            
        }finally{
            set({isMessagesLoading: false})
        }
    },

    // optimize 
    setSelectedUser: (selectedUser) => set({selectedUser}),
    


}))