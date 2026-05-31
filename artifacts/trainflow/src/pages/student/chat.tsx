import { useListConversations } from "@workspace/api-client-react";
import { Link } from "wouter";
import { StudentBottomNav } from "@/components/student-bottom-nav";
import { MOCK_CONVERSATIONS } from "@/lib/mock-data";

export default function StudentChat() {
  const { data: conversationsResponse, isLoading } = useListConversations();
  const conversations = conversationsResponse || MOCK_CONVERSATIONS;

  if (isLoading) {
    return <div className="min-h-[100dvh] flex items-center justify-center bg-black"><div className="animate-pulse w-8 h-8 rounded-full bg-primary" /></div>;
  }

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col pb-24">
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-3">
          <Link href="/home" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-all text-white">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </Link>
          <h1 className="font-display text-primary tracking-tighter text-3xl leading-none mt-1">MENSAGENS</h1>
        </div>
      </header>

      <main className="flex-1 pt-20 px-6 flex flex-col gap-4 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-2 mb-2 px-1">
           <span className="text-[10px] text-[#888888] uppercase font-black tracking-[0.3em]">Conversas Ativas</span>
        </div>

        <div className="flex flex-col gap-3">
          {conversations.map((conv) => (
            <Link key={conv.id} href={`/chat/${conv.id}`}>
              <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 flex gap-4 items-center cursor-pointer hover:bg-[#222222] transition-all group active:scale-[0.98]">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center overflow-hidden border border-white/5 group-hover:border-primary/30 transition-colors">
                    {conv.otherUserAvatarUrl ? (
                      <img alt={conv.otherUserName} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" src={conv.otherUserAvatarUrl} />
                    ) : (
                      <span className="material-symbols-outlined text-white/20 text-3xl">person</span>
                    )}
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="absolute top-0 right-0 w-5 h-5 bg-primary text-black text-[10px] font-black rounded-full border-2 border-[#1A1A1A] flex items-center justify-center">
                      {conv.unreadCount}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base text-white font-bold group-hover:text-primary transition-colors">{conv.otherUserName}</span>
                    <span className="text-[10px] text-[#888888] font-bold">{(conv as any).lastMessageTime || 'Agora'}</span>
                  </div>
                  <p className="text-sm text-[#888888] truncate group-hover:text-white/70 transition-colors leading-tight">
                    {conv.lastMessage}
                  </p>
                </div>
                
                <span className="material-symbols-outlined text-white/10 group-hover:text-primary group-hover:translate-x-1 transition-all">chevron_right</span>
              </div>
            </Link>
          ))}
        </div>

        {conversations.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-30">
             <span className="material-symbols-outlined text-7xl mb-4">forum</span>
             <p className="font-display text-xl uppercase">Nenhuma conversa encontrada</p>
          </div>
        )}
      </main>

      <StudentBottomNav />
    </div>
  );
}
