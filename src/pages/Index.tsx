import React, { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import FloatingHearts from '@/components/FloatingHearts';
import { sendMessageToGemini } from '@/services/chatService';
interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
}
const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting from the bot
  useEffect(() => {
    const initialGreeting = {
      content: 'হ্যালো প্রিয়তম! আমি শ্রাবন্তী। তোমার সাথে কথা বলতে পেরে খুব খুশি! তোমার দিনটা কেমন কাটছে?',
      isUser: false,
      timestamp: new Date()
    };
    setMessages([initialGreeting]);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (message: string) => {
    // Add user message to the chat
    const userMessage = {
      content: message,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    try {
      // Prepare messages for API in the format it expects
      const apiMessages = messages.map(msg => ({
        content: msg.content,
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        timestamp: msg.timestamp
      }));

      // Add the new user message
      apiMessages.push({
        content: message,
        role: 'user' as const,
        timestamp: new Date()
      });

      // Get response from API
      const response = await sendMessageToGemini(apiMessages);

      // Add AI response to the chat
      const botMessage = {
        content: response,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background */}
      <FloatingHearts />
      
      {/* Header */}
      <header className="fixed top-0 inset-x-0 bg-background/80 backdrop-blur-sm border-b border-primary/20 z-10">
        <div className="container py-4 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-lover-DEFAULT animate-heart-beat" />
            <h1 className="text-xl md:text-2xl font-bold bengali-text text-foreground">প্রিয়তমা</h1>
          </div>
        </div>
      </header>
      
      {/* Main chat area */}
      <main className="flex-1 pt-20 pb-24 container max-w-2xl mx-auto">
        <div className="space-y-2 p-4">
          {messages.map((message, index) => <ChatMessage key={index} message={message.content} isUser={message.isUser} timestamp={message.timestamp} />)}
          
          {isLoading && <div className="flex items-center gap-2 message-bubble message-bubble-bot w-24">
              <span className="animate-pulse">•</span>
              <span className="animate-pulse delay-100">•</span>
              <span className="animate-pulse delay-200">•</span>
            </div>}
          
          <div ref={messagesEndRef} />
        </div>
      </main>
      
      {/* Chat input area */}
      <footer className="fixed bottom-0 inset-x-0 bg-background/80 backdrop-blur-sm border-t border-primary/20 p-4 z-10">
        <div className="container max-w-2xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </footer>
    </div>;
};
export default Index;