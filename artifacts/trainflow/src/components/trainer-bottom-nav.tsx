import { Link, useLocation } from "wouter";

export function TrainerBottomNav() {
  const [location] = useLocation();
  
  return (
    <nav className="fixed bottom-0 w-full z-50 bg-black/90 backdrop-blur-xl border-t border-[#333333] flex justify-around items-center h-20 px-4 md:hidden pb-safe">
      <Link href="/t/dashboard" className={`flex flex-col items-center justify-center font-bold rounded-full px-4 py-1 transition-colors duration-200 ${location === '/t/dashboard' ? 'text-primary' : 'text-[#888888] hover:text-primary'}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: location === '/t/dashboard' ? "'FILL' 1" : "'FILL' 0" }}>home</span>
        <span className="font-sans text-xs mt-0.5 font-medium">Home</span>
      </Link>
      
      <Link href="/t/students" className={`flex flex-col items-center justify-center font-bold rounded-full px-4 py-1 transition-colors duration-200 ${location.startsWith('/t/students') ? 'text-primary' : 'text-[#888888] hover:text-primary'}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: location.startsWith('/t/students') ? "'FILL' 1" : "'FILL' 0" }}>groups</span>
        <span className="font-sans text-xs mt-0.5 font-medium">Alunos</span>
      </Link>
      
      <Link href="/t/exercises" className={`flex flex-col items-center justify-center font-bold rounded-full px-4 py-1 transition-colors duration-200 ${location.startsWith('/t/exercises') ? 'text-primary' : 'text-[#888888] hover:text-primary'}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: location.startsWith('/t/exercises') ? "'FILL' 1" : "'FILL' 0" }}>fitness_center</span>
        <span className="font-sans text-xs mt-0.5 font-medium">Biblioteca</span>
      </Link>
    </nav>
  );
}