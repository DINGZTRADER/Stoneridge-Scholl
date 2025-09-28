

import React from 'react';
// Fix: Correctly import Author as a value and ChatMessage as a type.
import { Author, type ChatMessage } from '../types';

const ChatMessage: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.author === Author.USER;

  const formattedText = message.text.split('\n').map((str, index, array) => (
    <React.Fragment key={index}>
      {str}
      {index === array.length - 1 ? null : <br />}
    </React.Fragment>
  ));

  return (
    <div className={`flex items-start gap-3 my-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center font-bold text-white ${
          isUser ? 'bg-stoneridge-gold' : message.isError ? 'bg-red-600' : 'bg-stoneridge-green'
        }`}
      >
        {isUser ? 'You' : 'AI'}
      </div>
      <div
        className={`p-4 rounded-lg max-w-lg ${
          isUser
            ? 'bg-stoneridge-green text-white rounded-br-none'
            : message.isError
            ? 'bg-red-50 text-red-800 rounded-bl-none shadow-sm border border-red-200'
            : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{formattedText}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
