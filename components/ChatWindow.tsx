

import React, { useRef, useEffect } from 'react';
import type { ChatMessage as Message } from '../types';
// Fix: Removed unused Author import.
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import Spinner from './shared/Spinner';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onSendMessage }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
            {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
            ))}
            {isLoading && (
                <div className="flex justify-start my-4">
                     <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center font-bold text-white bg-stoneridge-green">
                        AI
                    </div>
                    <div className="ml-3 p-4 bg-white rounded-lg rounded-bl-none shadow-sm">
                        <Spinner />
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </div>
      <ChatInput onSend={onSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatWindow;
