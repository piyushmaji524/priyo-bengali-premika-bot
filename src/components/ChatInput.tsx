
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Send, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [hasVoiceSupport, setHasVoiceSupport] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Set up speech recognition
  useEffect(() => {
    // Check if SpeechRecognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setHasVoiceSupport(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'bn-BD'; // Bengali language
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage(prev => prev + ' ' + transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        toast.error('ভয়েস কমান্ড শুনতে সমস্যা হয়েছে!');
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleToggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        toast.success('আমি আপনার কথা শুনছি...', {
          duration: 2000,
        });
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        toast.error('ভয়েস কমান্ড শুরু করতে সমস্যা হয়েছে!');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      
      // Focus back on input after sending
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-background/50 backdrop-blur-sm p-2 rounded-xl border border-primary/30">
      {hasVoiceSupport && (
        <Button 
          type="button" 
          size="icon" 
          variant={isListening ? "default" : "outline"}
          className={cn(
            "rounded-full flex-shrink-0 transition-all duration-300",
            isListening && "bg-lover-DEFAULT animate-pulse-slow"
          )}
          onClick={handleToggleListening}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
      )}
      
      <Input
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="আপনার বার্তা লিখুন..."
        className="bengali-text flex-1 bg-transparent border-primary/30 focus-visible:ring-primary/30"
        disabled={isLoading}
      />
      
      <Button 
        type="submit" 
        size="icon" 
        disabled={!message.trim() || isLoading}
        className="rounded-full flex-shrink-0 bg-lover-DEFAULT hover:bg-lover-dark transition-all duration-300"
      >
        {isLoading ? (
          <Heart className="h-4 w-4 animate-heart-beat" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};

export default ChatInput;

// Import local utils to fix TypeScript error
import { cn } from '@/lib/utils';
