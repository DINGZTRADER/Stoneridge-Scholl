import React, { useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the school..."
          disabled={isLoading}
          className="w-full py-3 pl-4 pr-16 text-sm text-gray-900 placeholder-gray-500 bg-gray-100 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-stoneridge-gold"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-white bg-stoneridge-green rounded-full disabled:bg-gray-400 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stoneridge-green transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </button>
      </div>
    </form>
  );
};

export default ChatInput;