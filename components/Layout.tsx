
import React from 'react';
import { BookOpen } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <header className="w-full max-w-4xl mb-8 text-center">
        <div className="flex justify-center items-center mb-4">
          <BookOpen className="w-10 h-10 text-[#8b7355] mr-3" />
          <h1 className="text-4xl font-extrabold text-[#4a3728] tracking-tight">
            Al-Mu'rab <span className="text-[#d4af37]">المُعرِب</span>
          </h1>
        </div>
        <p className="text-[#8b7355] font-medium text-lg italic">
          Asisten Pakar Nahwu Klasik & Analisis Sintaksis Turats
        </p>
        <div className="h-1 w-24 bg-[#d4af37] mx-auto mt-4 rounded-full"></div>
      </header>

      <main className="w-full max-w-4xl flex-grow">
        {children}
      </main>

      <footer className="mt-12 text-[#8b7355] text-sm text-center opacity-75">
        &copy; {new Date().getFullYear()} Al-Mu'rab • Berbasis Alfiyah Ibn Malik & Al-Ajurumiyyah
      </footer>
    </div>
  );
};
