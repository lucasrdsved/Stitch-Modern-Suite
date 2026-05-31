import { useListConversations } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { StudentBottomNav } from "@/components/student-bottom-nav";
import { MOCK_CONVERSATIONS } from "@/lib/mock-data";

export default function StudentChat() {
  const { data: conversationsResponse, isLoading, isError } = useListConversations();
  const conversations = conversationsResponse || (isError || !conversationsResponse ? MOCK_CONVERSATIONS : undefined);

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col pb-24">
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-[#333333] flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-primary tracking-tighter text-3xl leading-none mt-1">CHAT</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors active:scale-95 text-white">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </header>

      <main className="flex-1 pt-24 px-6 flex flex-col gap-6 max-w-2xl mx-auto w-full">
        <section className="flex flex-col gap-1">
          <h2 className="font-display text-white text-[32px] uppercase tracking-wider leading-none">
            MENSAGENS
          </h2>
          <p className="text-[#888888] text-base">Suas conversas com o personal.</p>
        </section>

        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#888888]">
            search
          </span>
          <Input
            placeholder="Buscar conversa..."
            className="h-14 bg-[#121212] border border-[#222222] rounded-xl pl-12 pr-4 text-white placeholder:text-[#666666] focus-visible:ring-0 focus-visible:border-primary transition-colors"
          />
        </div>

        <section className="space-y-4">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-20 bg-[#1A1A1A] rounded-2xl border border-[#333333]" />
              <div className="h-20 bg-[#1A1A1A] rounded-2xl border border-[#333333]" />
            </div>
          ) : conversations?.length ? (
            conversations.map((conv) => (
              <Link key={conv.id} href={`/chat/${conv.id}`}>
                <div className="bg-[#1A1A1A] border border-[#333333] rounded-2xl p-4 flex items-center gap-4 hover:border-primary/40 hover:bg-[#1A1A1A]/80 transition-colors">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-black/40 border border-[#333333] flex items-center justify-center">
                    {conv.otherUserAvatarUrl ? (
                      <img
                        src={conv.otherUserAvatarUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-white/70">
                        person
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1 gap-3">
                      <div className="font-display text-xl text-white truncate">
                        {conv.otherUserName || "Treinador"}
                      </div>
                    </div>
                    <div className="text-sm text-[#888888] truncate">
                      {conv.lastMessage || "Nova conversa"}
                    </div>
                  </div>

                  {conv.unreadCount > 0 && (
                    <div className="min-w-7 h-7 px-2 rounded-full bg-primary text-black font-bold text-xs flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </div>
                  )}
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-14 bg-[#1A1A1A] border border-[#333333] rounded-2xl">
              <span className="material-symbols-outlined text-4xl text-[#888888]">
                chat_bubble
              </span>
              <div className="mt-3 text-[#888888]">Nenhuma mensagem ainda.</div>
            </div>
          )}
        </section>
      </main>

      <StudentBottomNav />
    </div>
  );
}
