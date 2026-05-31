import { useListConversations } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function StudentChat() {
  const { data: conversations, isLoading } = useListConversations();

  return (
    <div className="min-h-[100dvh] pb-24 bg-background text-foreground p-6">
      <header className="mb-6">
        <h1 className="font-display text-4xl mb-4">MENSAGENS</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Buscar conversa..."
            className="h-12 bg-card border-none rounded-2xl pl-12 focus-visible:ring-primary"
          />
        </div>
      </header>

      <div className="space-y-4">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-card rounded-2xl" />
            <div className="h-20 bg-card rounded-2xl" />
          </div>
        ) : conversations?.length ? (
          conversations.map((conv) => (
            <Link key={conv.id} href={`/chat/${conv.id}`}>
              <div className="bg-card rounded-2xl p-4 flex items-center gap-4 hover:bg-card/80 transition-colors">
                <div className="w-12 h-12 rounded-full bg-secondary overflow-hidden shrink-0">
                  {conv.otherUserAvatarUrl ? <img src={conv.otherUserAvatarUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground">U</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-bold truncate">{conv.otherUserName || 'Treinador'}</div>
                  </div>
                  <div className="text-sm text-muted-foreground truncate">{conv.lastMessage || 'Nova conversa'}</div>
                </div>
                {conv.unreadCount > 0 && (
                  <div className="w-6 h-6 rounded-full bg-primary text-black font-bold text-xs flex items-center justify-center shrink-0">
                    {conv.unreadCount}
                  </div>
                )}
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">Nenhuma mensagem ainda.</div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-md border-t border-border flex items-center justify-around px-6">
        <Link href="/home" className="flex flex-col items-center text-muted-foreground">
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link href="/treinos" className="flex flex-col items-center text-muted-foreground">
          <span className="text-xs font-medium">Treino</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center text-primary">
          <span className="text-xs font-medium">Chat</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-muted-foreground">
          <span className="text-xs font-medium">Perfil</span>
        </Link>
      </div>
    </div>
  );
}
