
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ResultCard } from './components/ResultCard';
import { analyzeIbarah } from './services/geminiService';
import { AnalysisResult } from './types';
import { EXAMPLES } from './constants';
import { Search, Loader2, Eraser, Sparkles, MessageSquare, PenTool } from 'lucide-react';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await analyzeIbarah(input, context);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Gagal menganalisis. Pastikan input adalah kalimat bahasa Arab yang valid.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (text: string) => {
    setInput(text);
    setContext('');
    setIsLoading(true);
    setError(null);
    analyzeIbarah(text)
      .then(setResult)
      .catch(() => setError('Gagal menganalisis contoh.'))
      .finally(() => setIsLoading(false));
  };

  const clearAll = () => {
    setInput('');
    setContext('');
    setResult(null);
    setError(null);
  };

  return (
    <Layout>
      <div className="space-y-10">
        {/* Input Card - Styled like a book page */}
        <div className="bg-white dark:bg-[#2d241d] p-8 rounded-xl shadow-sm border border-[#e2e1d5] dark:border-[#4a3728] paper-texture transition-colors duration-300">
          <form onSubmit={handleAnalyze} className="space-y-8">
            <div className="space-y-6">
              {/* Main Arabic Input Area */}
              <div className="relative group">
                <div className="flex items-center gap-2 mb-3">
                  <PenTool className="w-4 h-4 text-[#8b7355] dark:text-[#d4af37] opacity-60" />
                  <label 
                    htmlFor="ibarah-input" 
                    className="block text-[10px] font-black text-[#8b7355] dark:text-[#d4af37] uppercase tracking-[0.2em]"
                  >
                    الإبارة • Masukkan Kalimat Arab
                  </label>
                </div>
                <textarea
                  id="ibarah-input"
                  className="w-full p-6 text-3xl font-medium arabic-text border border-[#e2e1d5] dark:border-[#4a3728] rounded-xl focus:ring-2 focus:ring-[#d4af37]/20 focus:border-[#8b7355] dark:focus:border-[#d4af37] transition-all min-h-[140px] bg-[#fcfbf7]/50 dark:bg-black/20 text-[#1a0f08] dark:text-[#fcfbf7] placeholder-[#8b7355]/30 leading-relaxed shadow-inner"
                  placeholder="اكتب الإبارة المرad إعرابها هنا..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  dir="rtl"
                />
              </div>

              {/* Context Input Area - Secondary Style */}
              <div className="relative group">
                <div className="flex items-center gap-2 mb-2.5">
                  <MessageSquare className="w-4 h-4 text-[#8b7355] dark:text-[#d4af37] opacity-60" />
                  <label 
                    htmlFor="context-input" 
                    className="block text-[10px] font-black text-[#8b7355] dark:text-[#d4af37] uppercase tracking-[0.2em]"
                  >
                    السياق • Konteks (Opsional)
                  </label>
                </div>
                <input
                  id="context-input"
                  type="text"
                  className="w-full p-4 text-sm font-medium border border-[#e2e1d5] dark:border-[#4a3728] rounded-lg focus:ring-2 focus:ring-[#d4af37]/20 focus:border-[#8b7355] dark:focus:border-[#d4af37] transition-all bg-[#fcfbf7]/30 dark:bg-black/10 text-[#4a3728] dark:text-[#fcfbf7]/80 placeholder-[#8b7355]/40"
                  placeholder="Contoh: Dari Bab Nikah kitab Fathul Mu'in..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                 <button
                  type="button"
                  onClick={clearAll}
                  className="flex items-center text-[10px] font-black text-[#8b7355] dark:text-[#d4af37]/60 hover:text-red-700 dark:hover:text-red-400 transition-colors uppercase tracking-widest opacity-60 hover:opacity-100"
                >
                  <Eraser className="w-3.5 h-3.5 mr-1.5" /> تنظيف • Bersihkan
                </button>
              </div>
            </div>

            {/* Action Button - Dark Brown Soft Style */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex-grow bg-[#4a3728] dark:bg-[#d4af37] hover:bg-[#2d1e12] dark:hover:bg-[#b8962d] text-[#fcfbf7] dark:text-[#1a140f] font-black py-4.5 px-8 rounded-xl shadow-md flex items-center justify-center transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group text-sm uppercase tracking-[0.15em] border-b-4 border-black/20 dark:border-black/10 active:translate-y-1 active:border-b-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin text-[#d4af37] dark:text-[#4a3728]" />
                    جاري التحليل... (Menganalisis)
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform text-[#d4af37] dark:text-[#4a3728]" />
                    تحليل النحو • Analisis Nahwu
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Examples - Reference Chips */}
          <div className="mt-10 pt-8 border-t border-[#e2e1d5] dark:border-[#4a3728]">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <p className="text-[10px] font-black text-[#8b7355] dark:text-[#d4af37] uppercase tracking-widest">
                أمثلة • Contoh Ibārah Klasik
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {EXAMPLES.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => handleExampleClick(ex.text)}
                  className="px-5 py-2.5 bg-[#fcfbf7] dark:bg-black/20 hover:bg-white dark:hover:bg-[#4a3728] hover:text-[#4a3728] dark:hover:text-[#fcfbf7] border border-[#e2e1d5] dark:border-[#4a3728] hover:border-[#d4af37]/40 rounded-lg text-sm transition-all arabic-text font-bold text-[#8b7355] dark:text-[#d4af37]/80 shadow-sm hover:shadow-md active:scale-95 group flex items-center gap-2"
                  title={ex.description}
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#d4af37] text-xs">«</span>
                  {ex.text}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#d4af37] text-xs">»</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 rounded-xl text-sm font-bold shadow-sm flex items-center justify-center gap-3 animate-in fade-in zoom-in duration-300">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
            {error}
          </div>
        )}

        {/* Result Area */}
        {result && <ResultCard result={result} />}

        {!result && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center py-24 opacity-20 dark:opacity-10 grayscale transition-all duration-1000">
            <BookIcon className="w-24 h-24 mb-6 text-[#4a3728] dark:text-[#d4af37] stroke-[1.5]" />
            <div className="text-center space-y-2">
              <p className="text-xl font-bold italic text-[#4a3728] dark:text-[#d4af37]">Bismillahirrohmanirrohim</p>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#8b7355] dark:text-[#d4af37]/70">Silakan masukkan ibarah untuk diurai</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

const BookIcon: React.FC<{className?: string}> = ({className}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

export default App;
