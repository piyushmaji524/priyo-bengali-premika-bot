
import React from 'react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: Date;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isUser,
  timestamp = new Date() 
}) => {
  return (
    <div
      className={cn(
        'message-bubble bengali-text',
        isUser ? 'message-bubble-user' : 'message-bubble-bot'
      )}
    >
      <div className="text-sm md:text-base">{message}</div>
      <div className="text-xs opacity-70 mt-1 text-right">
        {timestamp.toLocaleTimeString('bn-BD', { 
          hour: '2-digit', 
          minute: '2-digit'
        })}
      </div>
    </div>
  );
};

export default ChatMessage;
