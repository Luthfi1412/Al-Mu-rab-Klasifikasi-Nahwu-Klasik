
import React, { useState, useEffect } from 'react';
import { BookOpen, Moon, Sun } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <header className="w-full max-w-4xl mb-10 text-center relative">
        <div className="absolute right-0 top-0">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-white dark:bg-[#2d241d] border border-[#e2e1d5] dark:border-[#4a3728] text-[#8b7355] dark:text-[#d4af37] shadow-sm hover:shadow-md transition-all active:scale-90"
            title={isDark ? "Aktifkan Mode Terang" : "Aktifkan Mode Gelap"}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center justify-center gap-3">
            <BookOpen className="w-10 h-10 text-[#8b7355] dark:text-[#d4af37]" />
            <h1 className="text-5xl font-black text-[#d4af37] arabic-text leading-none py-1">
              المُعرِب
            </h1>
          </div>
          <div className="text-[11px] font-black text-[#4a3728] dark:text-[#d4af37] uppercase tracking-[0.4em] opacity-90 dark:opacity-70 mt-2.5">
            Al-Mu'rab
          </div>
        </div>
        
        <p className="text-[#8b7355] dark:text-[#d4af37]/70 font-medium text-lg italic mt-4">
          Asisten Pakar Nahwu Klasik & Analisis Sintaksis Turats
        </p>
        <div className="h-1 w-24 bg-[#d4af37] mx-auto mt-4 rounded-full"></div>
      </header>

      <main className="w-full max-w-4xl flex-grow">
        {children}
      </main>

      <footer className="mt-12 text-[#8b7355] dark:text-[#d4af37]/40 text-sm text-center opacity-75 border-t border-[#e2e1d5] dark:border-[#2d241d] pt-8 w-full max-w-4xl transition-colors">
        &copy; {new Date().getFullYear()} Al-Mu'rab • Berbasis Alfiyah Ibn Malik & Al-Ajurumiyyah
      </footer>
    </div>
  );
};
