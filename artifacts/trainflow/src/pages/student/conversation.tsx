import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "wouter";
import { useListMessages, useSendMessage } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { ArrowLeft, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function StudentConversation() {
  const { id } = useParams();
  const conversationId = Number(id);
  const { user } = useAuth();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], refetch } = useListMessages(conversationId, {
    query: {
      enabled: !!conversationId,
      queryKey: ["messages", conversationId],
      refetchInterval: 3000,
    },
  });

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
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <header className="shrink-0 px-6 py-4 border-b border-border flex items-center gap-4 bg-background/80 backdrop-blur-md">
        <Link href="/chat">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Link>
        <div>
          <div className="font-bold">{trainerName}</div>
          <div className="text-xs text-muted-foreground">Personal Trainer</div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-12">
            Nenhuma mensagem ainda. Diga olá!
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.senderId === user?.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isMe
                    ? "bg-primary text-black rounded-br-sm font-medium"
                    : "bg-card text-foreground rounded-bl-sm"
                }`}
              >
                {msg.content}
                <div className={`text-[10px] mt-1 ${isMe ? "text-black/50" : "text-muted-foreground"}`}>
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
        className="shrink-0 px-4 py-3 border-t border-border flex gap-3 items-center bg-background"
      >
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite uma mensagem..."
          className="flex-1 bg-card border-border rounded-full h-11 px-5"
        />
        <Button
          type="submit"
          disabled={!text.trim() || send.isPending}
          className="w-11 h-11 rounded-full bg-primary text-black p-0 shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
