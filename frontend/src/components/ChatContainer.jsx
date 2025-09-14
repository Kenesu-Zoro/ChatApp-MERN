import React from 'react'
import { useChatStore } from '../store/useChatStore.js'
import { useEffect } from 'react'
import MessageSkeleton from './skeleton/MessagesSkeleton.jsx'
import ChatHeader from './ChatHeader.jsx'
import MessageInput from './MessageInput.jsx'

const ChatContainer = () => {
    const {messages, getMessages, isMessagesLoading, selectedUser} = useChatStore();

    useEffect(() => {
        getMessages(selectedUser._id);
    }, [selectedUser._id, getMessages]);

    if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }


  return (
    <div>
        <ChatHeader />
        <p>Messages.......</p>
        <MessageInput />
    </div>
  )
}

export default ChatContainer