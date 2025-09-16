import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore.js';

export const useChatStore = create((set, get) => ({
    messages: [],
    users : [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    

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

    sendMessage: async(messageData) => {
        const { messages, selectedUser } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({messages:[...messages, res.data]});
        } catch (error) {
            console.error("Error in sendMessages:", error);
            toast.error("Failed to send message.");
        }
    },

    subscribeToMessages: () => {
        const {selectedUser} = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket?.on("newMessage", (newMessage) => {
            if(newMessage.senderId !== selectedUser._id) return;
            set({
                messages: [...get().messages, newMessage]
            })
        })
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket?.off("newMessage");
    },
        
    // optimize 
    setSelectedUser: (selectedUser) => set({selectedUser}),


    
}))