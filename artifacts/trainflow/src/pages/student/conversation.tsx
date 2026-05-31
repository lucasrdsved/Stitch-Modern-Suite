import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "wouter";
import { useListMessages, useSendMessage } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MOCK_MESSAGES } from "@/lib/mock-data";

export default function StudentConversation() {
  const { id } = useParams();
  const conversationId = Number(id);
  const { user } = useAuth();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: messagesResponse, refetch, isError } = useListMessages(conversationId, {
    query: {
      enabled: !!conversationId,
      queryKey: ["messages", conversationId],
      refetchInterval: 3000,
    },
  });
  const messages = messagesResponse || (isError || !messagesResponse ? MOCK_MESSAGES : []);

  const send = useSendMessage();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const content = text.trim();
    if (!content || send.isPending) return;
    setText("");
    send.mutate(
      { conversationId, data: { content } },
      { onSuccess: () => refetch() }
    );
  };

  const trainerName = messages.find((m) => m.senderId !== user?.id)?.senderName ?? "Treinador";

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col">
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-[#333333] h-14">
        <div className="h-full px-4 md:px-6 max-w-2xl mx-auto w-full flex items-center gap-3">
          <Link
            href="/chat"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors active:scale-95 text-white"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="min-w-0">
            <div className="font-display text-xl text-white truncate">{trainerName}</div>
            <div className="text-xs text-[#888888]">Personal Trainer</div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-20 pb-28 space-y-3 max-w-2xl mx-auto w-full">
        {messages.length === 0 && (
          <div className="text-center text-sm py-14 bg-[#1A1A1A] border border-[#333333] rounded-2xl text-[#888888]">
            Nenhuma mensagem ainda. Diga olá!
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.senderId === user?.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  isMe
                    ? "bg-primary text-black rounded-br-sm font-medium"
                    : "bg-[#1A1A1A] border border-[#333333] text-white rounded-bl-sm"
                }`}
              >
                {msg.content}
                <div className={`text-[10px] mt-1 ${isMe ? "text-black/60" : "text-[#888888]"}`}>
                  {new Date(msg.sentAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-[#333333] px-4 md:px-6 py-4 pb-safe"
      >
        <div className="max-w-2xl mx-auto w-full flex gap-3 items-center">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite uma mensagem..."
            className="flex-1 h-12 bg-[#121212] border border-[#222222] rounded-full px-5 text-white placeholder:text-[#666666] focus-visible:ring-0 focus-visible:border-primary transition-colors"
          />
          <Button
            type="submit"
            disabled={!text.trim() || send.isPending}
            className="w-12 h-12 rounded-full bg-primary text-black p-0 shrink-0 hover:brightness-110 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
