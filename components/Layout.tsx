
import React from 'react';
import { BookOpen } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <header className="w-full max-w-4xl mb-10 text-center">
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center justify-center gap-3">
            <BookOpen className="w-10 h-10 text-[#8b7355]" />
            <h1 className="text-5xl font-black text-[#d4af37] arabic-text leading-none py-1">
              المُعرِب
            </h1>
          </div>
          <div className="text-[11px] font-black text-[#4a3728] uppercase tracking-[0.4em] opacity-90 mt-2.5">
            Al-Mu'rab
          </div>
        </div>
        
        <p className="text-[#8b7355] font-medium text-lg italic mt-4">
          Asisten Pakar Nahwu Klasik & Analisis Sintaksis Turats
        </p>
        <div className="h-1 w-24 bg-[#d4af37] mx-auto mt-4 rounded-full"></div>
      </header>

      <main className="w-full max-w-4xl flex-grow">
        {children}
      </main>

      <footer className="mt-12 text-[#8b7355] text-sm text-center opacity-75 border-t border-[#e2e1d5] pt-8 w-full max-w-4xl">
        &copy; {new Date().getFullYear()} Al-Mu'rab • Berbasis Alfiyah Ibn Malik & Al-Ajurumiyyah
      </footer>
    </div>
  );
};
