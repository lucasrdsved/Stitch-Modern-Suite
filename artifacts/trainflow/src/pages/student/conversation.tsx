import { useState, useRef, useEffect } from "react";
import { useListMessages, useSendMessage } from "@workspace/api-client-react";
import { useRoute, Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { MOCK_MESSAGES } from "@/lib/mock-data";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentConversation() {
  const [, params] = useRoute("/chat/:id");
  const conversationId = parseInt(params?.id || "0");
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messagesResponse, isLoading } = useListMessages({ conversationId });
  const sendMessage = useSendMessage();

  const messages = messagesResponse || MOCK_MESSAGES;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!content.trim()) return;
    try {
      await sendMessage.mutateAsync({ conversationId, content });
      setContent("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  if (isLoading) {
    return <div className="min-h-[100dvh] flex items-center justify-center bg-black"><div className="animate-pulse w-8 h-8 rounded-full bg-primary" /></div>;
  }

  return (
    <div className="bg-black text-white font-sans h-[100dvh] flex flex-col selection:bg-primary selection:text-black overflow-hidden">
      {/* Chat Header */}
      <header className="shrink-0 bg-black/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 h-16 z-50">
        <div className="flex items-center gap-4">
          <Link href="/chat" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors active:scale-95 text-white">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </Link>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=marcos" className="w-full h-full object-cover grayscale" alt="Coach" />
             </div>
             <div className="flex flex-col">
                <span className="text-sm font-bold leading-tight">Coach Marcos</span>
                <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Online</span>
             </div>
          </div>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors active:scale-95 text-white/50">
          <span className="material-symbols-outlined text-2xl">more_vert</span>
        </button>
      </header>

      {/* Messages Area */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        <div className="flex flex-col items-center py-8 opacity-20">
           <span className="text-[10px] font-black uppercase tracking-[0.4em]">Início da conversa</span>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => {
            const isMe = msg.senderId === user?.id;
            return (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`px-5 py-3 rounded-[24px] text-sm leading-relaxed shadow-lg ${
                    isMe 
                      ? 'bg-primary text-black font-medium rounded-tr-none' 
                      : 'bg-[#1A1A1A] text-white border border-white/5 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-[9px] text-[#888888] font-bold mt-1.5 uppercase tracking-tighter">
                    {new Date(msg.sentAt).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </main>

      {/* Message Composer */}
      <footer className="shrink-0 p-6 pt-2 bg-gradient-to-t from-black via-black to-transparent">
        <div className="max-w-2xl mx-auto flex gap-3 items-end">
          <div className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-[28px] p-1.5 flex items-center focus-within:border-primary/50 transition-colors">
            <input 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 py-2 placeholder:text-[#444]"
            />
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-white/40">
              <span className="material-symbols-outlined text-xl">attach_file</span>
            </button>
          </div>
          <Button 
            onClick={handleSend}
            disabled={!content.trim()}
            className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center p-0 hover:scale-105 active:scale-95 transition-all shadow-xl electric-glow disabled:opacity-50 disabled:grayscale"
          >
            <span className="material-symbols-outlined font-bold text-2xl">send</span>
          </Button>
        </div>
        <div className="h-4" /> {/* Safe area spacing */}
      </footer>
    </div>
  );
}
