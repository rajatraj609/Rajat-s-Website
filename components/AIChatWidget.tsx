import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { createChatSession, generateSystemInstruction } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Chat, GenerateContentResponse } from '@google/genai';
import { usePortfolio } from '../context/PortfolioContext';

const AIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi! I'm Rajat's AI assistant. Ask me anything about his work or skills!" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get live data from context
  const { aboutMe, experiences, skills, education, certifications, resumeBookData } = usePortfolio();

  useEffect(() => {
    if (isOpen && !chatSessionRef.current) {
      try {
        const instruction = generateSystemInstruction(
          aboutMe, 
          experiences, 
          certifications, 
          skills, 
          education, 
          resumeBookData.cvLink
        );
        chatSessionRef.current = createChatSession(instruction);
      } catch (e) {
        console.error("Failed to init chat", e);
        setMessages(prev => [...prev, { role: 'model', text: "Error: API Key missing or invalid." }]);
      }
    }
  }, [isOpen, aboutMe, experiences, skills, education, certifications, resumeBookData]); // Re-init if data changes could be handled more gracefully, but for now simple init is fine.

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !chatSessionRef.current || isLoading) return;

    const userMsg = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const resultStream = await chatSessionRef.current.sendMessageStream({ message: userMsg });
      
      let fullResponse = "";
      setMessages(prev => [...prev, { role: 'model', text: "", isStreaming: true }]);

      for await (const chunk of resultStream) {
         const c = chunk as GenerateContentResponse;
         const text = c.text;
         if (text) {
             fullResponse += text;
             setMessages(prev => {
                const newArr = [...prev];
                const lastMsg = newArr[newArr.length - 1];
                if (lastMsg.role === 'model' && lastMsg.isStreaming) {
                    lastMsg.text = fullResponse;
                }
                return newArr;
             });
         }
      }
       // Finalize
       setMessages(prev => {
          const newArr = [...prev];
          const lastMsg = newArr[newArr.length - 1];
          lastMsg.isStreaming = false;
          return newArr;
       });

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="bg-card border border-neutral-800 rounded-2xl shadow-2xl w-80 sm:w-96 mb-4 overflow-hidden flex flex-col h-[500px] animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-neutral-900 p-4 border-b border-neutral-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-accent/10 rounded-full">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <span className="font-medium text-white">Ask AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-accent text-white rounded-br-none'
                      : 'bg-neutral-800 text-neutral-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && !messages[messages.length -1].isStreaming && (
               <div className="flex justify-start">
                   <div className="bg-neutral-800 text-neutral-200 rounded-2xl rounded-bl-none px-4 py-2.5">
                       <Loader2 className="w-4 h-4 animate-spin" />
                   </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-neutral-900 border-t border-neutral-800">
            <div className="relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about my projects..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-full py-2.5 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-accent transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !inputText.trim()}
                className="absolute right-1.5 top-1.5 p-1.5 bg-accent text-white rounded-full hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-accent transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 bg-accent hover:bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!isOpen && (
            <span className="absolute right-full mr-3 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Chat with AI
            </span>
        )}
      </button>
    </div>
  );
};

export default AIChatWidget;
