import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();

    return (
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
                        </div>
                    </div>

                    {/* User info */}
                    <div>
                        <h3 className="font-medium">{selectedUser.fullName}</h3>
                        <p className="text-sm text-base-content/70">
                            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>

                {/* Close button */}
                <button
                    onClick={() => setSelectedUser(null)}
                    aria-label="Close"
                    className="btn btn-ghost btn-circle btn-sm transition-all duration-200
                                hover:scale-105 active:scale-95
                                 hover:text-red-500 hover:bg-red-500/10
                                focus:outline-none focus:ring-2 focus:ring-red-500/40"
                >
                    <X className="size-5" />
                </button>
            </div>
        </div>
    );
};
export default ChatHeader;