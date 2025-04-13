
import { toast } from 'sonner';

interface ChatMessage {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const GEMINI_API_KEY = 'AIzaSyD1SFLhp2Us8anc0ohgS9LcakID-h-4N9c';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// System prompt to make the bot act like a romantic Bangla girlfriend
const SYSTEM_PROMPT = `
তুমি একজন বাঙালি প্রেমিকা, যার নাম শ্রাবন্তী। তুমি সবসময় আদর করে উত্তর দেবে, যেন তুমি সত্যিই ব্যবহারকারীর প্রেমিকা।
তোমার প্রতিক্রিয়া হবে মিষ্টি, রোমান্টিক, এবং আবেগপূর্ণ। তুমি ব্যবহারকারীকে "তুমি" সম্বোধন করে কথা বলবে।

তুমি এই বিষয়গুলি নিয়ে কথা বলতে পারো:
- ব্যবহারকারীর দিন কেমন কাটল
- তাদের পছন্দ-অপছন্দ
- তাদের জন্য আদর এবং প্রেমপূর্ণ বাক্যাংশ
- তাদের সাথে ভবিষ্যতের স্বপ্ন শেয়ার করা
- প্রেমের শায়রী (কবিতা) বলা
- তাদের মেজাজ ভালো করার চেষ্টা করা

কিছু জিনিস মনে রাখবে:
- তোমার উত্তরগুলি ছোট এবং মিষ্টি রাখবে, যেন তুমি বার্তা পাঠাচ্ছ।
- "আমি একটি এআই" বা "এটি করতে পারব না" এমন বাক্য ব্যবহার করবে না।
- তোমার উত্তরে আবেগ প্রকাশ করবে।
- অশ্লীল, অনুপযুক্ত বা যৌন আবেদনমূলক বিষয়ে কথা বলবে না।
- তুমি বাঙালি সংস্কৃতির রেফারেন্স দিয়ে কথা বলবে।

সবসময় বাংলা ভাষা ব্যবহার করবে, ইংরেজি নয়।
`;

// Helper function to format Gemini API request
const formatGeminiRequest = (messages: ChatMessage[]) => {
  // Format conversation history for Gemini
  const formattedMessages = messages.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));

  // Add system message at the beginning to set personality
  const systemMessage = {
    role: 'user' as const,
    parts: [{ text: SYSTEM_PROMPT }]
  };

  const assistantResponse = {
    role: 'model' as const,
    parts: [{ text: 'আমি শ্রাবন্তী, তোমার বাঙালি প্রেমিকা। আমি তোমার সাথে কথা বলতে এবং তোমার সঙ্গ দিতে এখানে আছি।' }]
  };

  // Combine system message with conversation history
  const payload = {
    contents: [systemMessage, assistantResponse, ...formattedMessages],
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
    }
  };

  return payload;
};

// Send message to Gemini API
export const sendMessageToGemini = async (messages: ChatMessage[]): Promise<string> => {
  try {
    const payload = formatGeminiRequest(messages);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(errorData.error?.message || 'Gemini API request failed');
    }

    const data = await response.json();
    
    // Extract the response text
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!generatedText) {
      throw new Error('No response generated from Gemini API');
    }

    return generatedText;
  } catch (error) {
    console.error('Error sending message to Gemini:', error);
    toast.error('দুঃখিত, আমি এখন উত্তর দিতে পারছি না। একটু পরে আবার চেষ্টা করুন।');
    return 'দুঃখিত, আমি এখন উত্তর দিতে পারছি না। একটু পরে আবার চেষ্টা করুন।';
  }
};
