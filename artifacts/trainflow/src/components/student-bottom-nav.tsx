import { Link, useLocation } from "wouter";

export function StudentBottomNav() {
  const [location] = useLocation();
  
  return (
    <nav className="fixed bottom-0 w-full z-50 bg-black/90 backdrop-blur-xl border-t border-[#333333] flex justify-around items-center h-20 px-4 md:hidden pb-safe">
      <Link href="/home" className={`flex flex-col items-center justify-center font-bold rounded-full px-4 py-1 transition-colors duration-200 ${location === '/home' ? 'text-primary' : 'text-[#888888] hover:text-primary'}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: location === '/home' ? "'FILL' 1" : "'FILL' 0" }}>home</span>
        <span className="font-sans text-xs mt-0.5 font-medium">Home</span>
      </Link>
      
      <Link href="/treinos" className={`flex flex-col items-center justify-center font-bold rounded-full px-4 py-1 transition-colors duration-200 ${location.startsWith('/treinos') ? 'text-primary' : 'text-[#888888] hover:text-primary'}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: location.startsWith('/treinos') ? "'FILL' 1" : "'FILL' 0" }}>fitness_center</span>
        <span className="font-sans text-xs mt-0.5 font-medium">Workout</span>
      </Link>
      
      <Link href="/chat" className={`flex flex-col items-center justify-center font-bold rounded-full px-4 py-1 transition-colors duration-200 relative ${location.startsWith('/chat') ? 'text-primary' : 'text-[#888888] hover:text-primary'}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: location.startsWith('/chat') ? "'FILL' 1" : "'FILL' 0" }}>chat_bubble</span>
        <span className="font-sans text-xs mt-0.5 font-medium">Chat</span>
      </Link>
      
      <Link href="/profile" className={`flex flex-col items-center justify-center font-bold rounded-full px-4 py-1 transition-colors duration-200 ${location === '/profile' ? 'text-primary' : 'text-[#888888] hover:text-primary'}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: location === '/profile' ? "'FILL' 1" : "'FILL' 0" }}>person</span>
        <span className="font-sans text-xs mt-0.5 font-medium">Profile</span>
      </Link>
    </nav>
  );
}