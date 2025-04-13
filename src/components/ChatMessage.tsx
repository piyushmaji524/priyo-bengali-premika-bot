
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import TypewriterText from './TypewriterText';

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
  const [isTypingComplete, setIsTypingComplete] = useState(isUser); // User messages don't need typing animation

  return (
    <div
      className={cn(
        'message-bubble bengali-text',
        isUser ? 'message-bubble-user' : 'message-bubble-bot'
      )}
    >
      <div className="text-sm md:text-base">
        {isUser ? (
          message
        ) : (
          <TypewriterText 
            text={message} 
            speed={30} 
            onComplete={() => setIsTypingComplete(true)}
          />
        )}
      </div>
      <div className={cn(
        "text-xs opacity-70 mt-1 text-right",
        !isTypingComplete && !isUser && "opacity-0"
      )}>
        {timestamp.toLocaleTimeString('bn-BD', { 
          hour: '2-digit', 
          minute: '2-digit'
        })}
      </div>
    </div>
  );
};

export default ChatMessage;
