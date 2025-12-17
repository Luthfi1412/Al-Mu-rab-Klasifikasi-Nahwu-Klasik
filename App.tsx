
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ResultCard } from './components/ResultCard';
import { analyzeIbarah } from './services/geminiService';
import { AnalysisResult } from './types';
import { EXAMPLES } from './constants';
import { Search, Loader2, Eraser, Sparkles, MessageSquare } from 'lucide-react';

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
      <div className="space-y-8">
        {/* Input Card */}
        <div className="bg-white p-8 rounded-xl shadow-2xl classic-border paper-texture">
          <form onSubmit={handleAnalyze} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <label 
                  htmlFor="ibarah-input" 
                  className="block text-sm font-bold text-[#2d1e12] mb-2 uppercase tracking-widest"
                >
                  الإبارة (Ibarah / Kalimat Arab)
                </label>
                <textarea
                  id="ibarah-input"
                  className="w-full p-4 text-2xl font-bold arabic-text border-2 border-[#8b7355]/40 rounded-lg focus:ring-4 focus:ring-[#d4af37]/20 focus:border-[#4a3728] transition-all min-h-[120px] bg-white/50 text-[#1a0f08] placeholder-gray-400"
                  placeholder="اكتب الإبارة هنا..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  dir="rtl"
                />
              </div>

              <div className="relative">
                <label 
                  htmlFor="context-input" 
                  className="flex items-center text-sm font-bold text-[#4a3728] mb-2 uppercase tracking-widest"
                >
                  <MessageSquare className="w-4 h-4 mr-1.5" /> السياق (Siyaq / Konteks)
                </label>
                <input
                  id="context-input"
                  type="text"
                  className="w-full p-3 text-base font-medium border-2 border-[#8b7355]/30 rounded-lg focus:ring-4 focus:ring-[#d4af37]/20 focus:border-[#4a3728] transition-all bg-white/50 text-[#1a0f08] placeholder-gray-400"
                  placeholder="Misal: Konteks kalimat ini dari kitab Fathul Mu'in..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                 <button
                  type="button"
                  onClick={clearAll}
                  className="flex items-center text-xs font-bold text-gray-500 hover:text-red-600 transition-colors uppercase tracking-wider"
                >
                  <Eraser className="w-3.5 h-3.5 mr-1" /> تنظيف (Bersihkan)
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex-grow bg-[#4a3728] hover:bg-[#2d1e12] text-white font-black py-4 px-6 rounded-lg shadow-lg flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed group text-lg tracking-wide"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    جاري التحليل (Menganalisis)...
                  </>
                ) : (
                  <>
                    <Search className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
                    تحليل النحو (ANALISIS NAHWU)
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Examples */}
          <div className="mt-8 pt-6 border-t border-[#e2e1d5]">
            <p className="text-xs font-bold text-[#8b7355] mb-4 uppercase tracking-widest flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> أمثلة (Contoh Ibārah Klasik)
            </p>
            <div className="flex flex-wrap gap-2.5">
              {EXAMPLES.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => handleExampleClick(ex.text)}
                  className="px-4 py-2 bg-white hover:bg-[#d4af37] hover:text-white border-2 border-[#e2e1d5] hover:border-[#d4af37] rounded-lg text-base transition-all arabic-text font-bold text-[#4a3728] shadow-sm active:scale-95"
                  title={ex.description}
                >
                  {ex.text}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border-2 border-red-200 text-red-800 rounded-lg text-center font-bold animate-pulse shadow-md">
            {error}
          </div>
        )}

        {/* Result Area */}
        {result && <ResultCard result={result} />}

        {!result && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center py-20 opacity-30 grayscale pointer-events-none">
            <BookIcon className="w-24 h-24 mb-4 text-[#4a3728]" />
            <p className="text-xl font-bold italic text-[#4a3728]">Bismillah, silakan masukkan ibarah untuk diurai...</p>
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
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

export default App;
