
import React, { useState } from 'react';
import { AnalysisResult, SupportingBab } from '../types';
import { Quote, Info, Book, Layers, GraduationCap, SpellCheck } from 'lucide-react';

interface ResultCardProps {
  result: AnalysisResult;
}

const NAHWU_DICTIONARY: Record<string, string> = {
  "مرفوع": "Status i'rab yang menunjukkan kedudukan utama (seperti subjek). Tanda aslinya adalah dhommah.",
  "منصوب": "Status i'rab yang menunjukkan kedudukan pelengkap (seperti objek atau keterangan). Tanda aslinya adalah fathah.",
  "مجرور": "Status i'rab yang terjadi karena didahului huruf jar atau penyandaran (idhofah). Tanda aslinya adalah kasrah.",
  "مجزوم": "Status i'rab khusus untuk fi'il mudhari' yang didahului amil jazm. Tanda aslinya adalah sukun.",
  "فاعل": "Isim marfu' yang terletak setelah fi'il mabni ma'lum untuk menunjukkan pelaku pekerjaan.",
  "مبتدأ": "Isim marfu' yang biasanya terletak di awal kalimat sebagai subjek dalam jumlah ismiyyah.",
  "خبر": "Bagian yang menyempurnakan makna bersama mubtada' dalam jumlah ismiyyah.",
  "مفعول به": "Isim manshub yang menjadi objek dari sebuah perbuatan fi'il muta'addi.",
  "فعل": "Kata yang menunjukkan arti pada dirinya sendiri dan terikat dengan waktu (Kata Kerja).",
  "اسم": "Kata yang menunjukkan arti pada dirinya sendiri dan tidak terikat dengan waktu (Kata Benda).",
  "حرف": "Kata yang tidak memiliki arti sempurna kecuali jika bersambung dengan kata lain.",
  "نعت": "Kata sifat yang mengikuti isim sebelumnya (Man'ut) dalam i'rab dan sifatnya.",
  "حال": "Isim manshub yang menjelaskan keadaan fa'il atau maf'ul bih saat pekerjaan terjadi.",
  "تمييز": "Isim manshub yang berfungsi menghilangkan kesamaran pada isim sebelumnya.",
  "إضافة": "Penyandaran sebuah isim (mudhaf) kepada isim lain (mudhaf ilaih) yang mengakibatkan jar.",
  "عامل": "Faktor yang menyebabkan perubahan i'rab pada akhir sebuah kata.",
  "معمول": "Kata yang i'rabnya berubah karena pengaruh dari amil.",
  "ضمة": "Tanda i'rab rafa' yang asli.",
  "فتحة": "Tanda i'rab nashab yang asli.",
  "كسرة": "Tanda i'rab jar yang asli.",
  "سكون": "Tanda i'rab jazm yang asli pada fi'il mudhari' shahih akhir.",
  "مضاف": "Isim pertama dalam susunan idhofah yang disandarkan.",
  "مضاف إليه": "Isim kedua dalam susunan idhofah yang i'rabnya selalu majrur.",
  "عدد": "Kata bilangan.",
  "معدود": "Benda yang dihitung setelah adad."
};

const Tooltip: React.FC<{ term: string; definition: string; children: React.ReactNode }> = ({ term, definition, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <span className="cursor-help border-b border-dotted border-[#8b7355] dark:border-[#d4af37] hover:bg-[#d4af37]/10 transition-colors px-0.5 rounded" dir="rtl">
        {children}
      </span>
      {isVisible && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-[#4a3728] dark:bg-[#d4af37] text-white dark:text-[#1a140f] text-[10px] rounded shadow-2xl z-50 pointer-events-none animate-in fade-in zoom-in duration-200 border border-[#d4af37]/30 text-left" dir="ltr">
          <strong className="block border-b border-[#d4af37]/50 dark:border-black/10 mb-1 pb-1 text-[#d4af37] dark:text-inherit text-xs arabic-text text-right" dir="rtl">{term}</strong>
          <span className="leading-relaxed opacity-90">{definition}</span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#4a3728] dark:border-t-[#d4af37]"></span>
        </span>
      )}
    </span>
  );
};

const BabTooltip: React.FC<{ bab: SupportingBab | { name: string; dalil_text: string; dalil_source: string }; children: React.ReactNode; isMain?: boolean }> = ({ bab, children, isMain }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <span className={`absolute ${isMain ? 'top-full left-0' : 'top-full left-1/2 -translate-x-1/2'} mt-2 w-72 p-4 bg-white dark:bg-[#2d241d] text-[#2d1e12] dark:text-[#fcfbf7] rounded-lg shadow-2xl z-50 pointer-events-none animate-in fade-in slide-in-from-top-2 duration-200 border-2 border-[#d4af37]`}>
          <div className="flex items-center gap-1.5 mb-2 border-b border-[#d4af37]/20 pb-2">
            <GraduationCap className="w-4 h-4 text-[#d4af37]" />
            <span className="font-black text-[10px] uppercase tracking-tighter text-[#8b7355] dark:text-[#d4af37]" dir="ltr">
              {isMain ? 'Dalil Utama (الشاهد الرئيسي)' : 'Dalil Pendukung'}
            </span>
          </div>
          <div className="arabic-text text-justify text-xl mb-2 font-bold leading-relaxed text-[#1a0f08] dark:text-[#fcfbf7]" lang="ar" dir="rtl">
            {bab.dalil_text}
          </div>
          <div className="text-[10px] font-bold italic text-[#8b7355] dark:text-[#d4af37]/60 text-left" dir="ltr">— {bab.dalil_source}</div>
          
          <span className={`absolute bottom-full ${isMain ? 'left-8' : 'left-1/2 -translate-x-1/2'} border-8 border-transparent border-b-white dark:border-b-[#2d241d]`}></span>
          <span className={`absolute bottom-full ${isMain ? 'left-8' : 'left-1/2 -translate-x-1/2'} border-[10px] border-transparent border-b-[#d4af37] -z-10 -mt-[2px]`}></span>
        </span>
      )}
    </span>
  );
};

const renderTextWithBilingualRules = (text: string) => {
  if (!text) return null;
  const pattern = /(⟨\s*[^⟩]+\s*⟩)/g;
  const parts = text.split(pattern);

  return parts.map((part, i) => {
    if (part.startsWith('⟨') && part.endsWith('⟩')) {
      const term = part.slice(1, -1).trim();
      const matchedDefinition = NAHWU_DICTIONARY[term];
      
      return (
        <span key={i} className="mx-1 inline-block">
          {matchedDefinition ? (
            <Tooltip term={term} definition={matchedDefinition}>
              <span className="font-bold text-[#8b7355] dark:text-[#d4af37] arabic-text text-lg">{term}</span>
            </Tooltip>
          ) : (
            <span className="font-bold text-[#8b7355] dark:text-[#d4af37] arabic-text text-lg">{term}</span>
          )}
        </span>
      );
    }
    return part;
  });
};

const renderPesantrenParagraphs = (text: string, extraClasses: string = "") => {
  if (!text) return null;
  return text.split('\n').filter(p => p.trim() !== '').map((para, idx) => (
    <p key={idx} className={`text-justify indent-10 mb-4 last:mb-0 leading-relaxed ${extraClasses}`} dir="ltr">
      {renderTextWithBilingualRules(para)}
    </p>
  ));
};

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const mainBabWithDalil = {
    name: result.bab_utama,
    dalil_text: result.dalil.text,
    dalil_source: result.dalil.source
  };

  return (
    <div className="mt-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Classification Banner */}
      <div className="bg-[#4a3728] dark:bg-[#1a140f] text-white p-6 rounded-lg shadow-xl classic-border flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-[#d4af37]/30">
        <div className="flex-grow">
          <span className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.2em] mb-2 block opacity-80">الباب الرئيسي • Bab Utama</span>
          
          <BabTooltip bab={mainBabWithDalil} isMain={true}>
            <div className="group cursor-help">
              <h2 className="text-4xl font-bold mb-4 border-b border-white/10 dark:border-white/5 pb-3 tracking-tight flex items-center gap-4 group-hover:text-[#d4af37] transition-colors arabic-text" dir="rtl">
                {result.bab_utama}
                <Book className="w-6 h-6 text-[#d4af37] opacity-40 group-hover:opacity-100 transition-opacity" />
              </h2>
            </div>
          </BabTooltip>

          <div className="flex flex-wrap gap-3 mt-3" dir="rtl">
            {result.bab_pendukung.map((bab, idx) => (
              <BabTooltip key={idx} bab={bab}>
                <span className="bg-[#8b7355]/30 dark:bg-[#d4af37]/10 text-[#d4af37] text-[11px] font-bold px-4 py-2 rounded-md border border-[#d4af37]/20 flex items-center hover:bg-[#d4af37]/20 transition-all cursor-help arabic-text shadow-sm" dir="rtl">
                  <Layers className="w-3.5 h-3.5 ml-2 opacity-60" /> {bab.name}
                </span>
              </BabTooltip>
            ))}
          </div>
        </div>
        
        <div className="lg:max-w-[360px] bg-black/10 p-6 rounded-lg border border-white/5 self-stretch flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest">Khulasah (الخلاصة)</span>
          </div>
          <div className="text-sm text-white/90 dark:text-[#fcfbf7]/80 font-medium leading-relaxed italic">
            {renderPesantrenParagraphs(result.summary, "!indent-0 text-center")}
          </div>
        </div>
      </div>

      {/* Analysis Word Cards */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-[#e2e1d5] dark:border-[#4a3728] pb-3 mb-6">
          <div className="p-2 bg-[#8b7355]/10 dark:bg-[#d4af37]/10 rounded-lg">
            <SpellCheck className="w-5 h-5 text-[#8b7355] dark:text-[#d4af37]" />
          </div>
          <h3 className="text-[#2d1e12] dark:text-[#d4af37] font-black uppercase tracking-tighter text-sm">
            تفصيل الإعراب • Detail Analisis Kata
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {result.irab_table.map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-[#2d241d] rounded-xl border border-[#e2e1d5] dark:border-[#4a3728] shadow-sm overflow-hidden hover:shadow-md transition-all paper-texture">
              <div className="flex flex-col md:flex-row-reverse">
                {/* Visual Anchor: The Arabic Word */}
                <div className="md:w-[220px] bg-[#fcfbf7] dark:bg-black/20 border-b md:border-b-0 md:border-r border-[#e2e1d5] dark:border-[#4a3728] p-6 flex flex-col items-center justify-center">
                  <div className="arabic-text text-5xl font-bold text-[#1a0f08] dark:text-[#fcfbf7]" dir="rtl">{item.word}</div>
                </div>

                {/* Analysis Content */}
                <div className="flex-grow p-6">
                  {/* Badges Row */}
                  <div className="flex flex-wrap gap-y-4 gap-x-6 mb-6">
                    {/* Role */}
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-[#8b7355] dark:text-[#d4af37]/60 uppercase tracking-widest mb-1.5 opacity-70">Kedudukan (Jabatan)</span>
                      <div className="bg-[#4a3728] dark:bg-[#d4af37] text-white dark:text-[#1a140f] px-3.5 py-1.5 rounded-md text-sm font-bold arabic-text shadow-sm" dir="rtl">
                        {item.role}
                      </div>
                    </div>
                    {/* State */}
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-[#8b7355] dark:text-[#d4af37]/60 uppercase tracking-widest mb-1.5 opacity-70">Status (I'rab)</span>
                      <div className={`px-3.5 py-1.5 rounded-md text-sm font-bold border arabic-text shadow-sm ${
                        item.state.includes('مرفوع') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-300 border-blue-100 dark:border-blue-900/40' :
                        item.state.includes('منصوب') ? 'bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-300 border-green-100 dark:border-green-900/40' :
                        item.state.includes('مجرور') ? 'bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-300 border-red-100 dark:border-red-900/40' :
                        'bg-gray-50 dark:bg-gray-900/20 text-gray-900 dark:text-gray-300 border-gray-100 dark:border-gray-900/40'
                      }`} dir="rtl">
                        {item.state}
                      </div>
                    </div>
                    {/* Sign */}
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-[#8b7355] dark:text-[#d4af37]/60 uppercase tracking-widest mb-1.5 opacity-70">Tanda (Al-Alamah)</span>
                      <div className="bg-[#fdfcf0] dark:bg-black/30 text-[#1a0f08] dark:text-[#fcfbf7]/90 border border-[#d4af37]/30 dark:border-[#d4af37]/10 px-3.5 py-1.5 rounded-md text-sm font-bold arabic-text shadow-sm" dir="rtl">
                        {item.sign}
                      </div>
                    </div>
                  </div>

                  {/* Reason Box */}
                  <div className="bg-[#fcfbf7] dark:bg-black/10 p-5 rounded-lg border border-[#f0eee0] dark:border-[#4a3728] relative group">
                    <div className="absolute top-0 right-0 p-1.5 bg-[#f0eee0] dark:bg-[#4a3728] rounded-bl-lg">
                        <Info className="w-3.5 h-3.5 text-[#8b7355] dark:text-[#d4af37] opacity-40 dark:opacity-60" />
                    </div>
                    <div className="text-xs italic text-[#4a3728] dark:text-[#fcfbf7]/70">
                      {renderPesantrenParagraphs(item.reason, "!indent-6")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Justifikasi & Dalil Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-[#e2e1d5] dark:border-[#4a3728]">
        <div className="bg-white dark:bg-[#2d241d] p-8 rounded-xl shadow-sm border border-[#e2e1d5] dark:border-[#4a3728] paper-texture flex flex-col transition-all">
          <div className="flex items-center gap-2.5 mb-6 border-b border-[#e2e1d5] dark:border-[#4a3728] pb-3">
            <Info className="w-5 h-5 text-[#8b7355] dark:text-[#d4af37]" />
            <h3 className="text-[#2d1e12] dark:text-[#d4af37] font-black uppercase tracking-tighter text-sm">
              التعليل النحوي • Justifikasi Kaidah
            </h3>
          </div>
          <div className="text-[#1a0f08] dark:text-[#fcfbf7]/90 font-medium text-base flex-grow">
            {renderPesantrenParagraphs(result.justifikasi)}
          </div>
        </div>

        <div className="bg-[#fdfcf0] dark:bg-[#1a140f] p-8 rounded-xl shadow-sm border border-[#d4af37]/30 flex flex-col relative overflow-hidden transition-all">
          <div className="absolute top-0 right-0 opacity-5 dark:opacity-10 -mr-4 -mt-4 text-[#8b7355] dark:text-[#d4af37]">
             <Quote className="w-32 h-32" />
          </div>
          <div className="flex items-center gap-2.5 mb-6 border-b border-[#d4af37]/20 pb-3">
            <Quote className="w-5 h-5 text-[#8b7355] dark:text-[#d4af37]" />
            <h3 className="text-[#2d1e12] dark:text-[#d4af37] font-black uppercase tracking-tighter text-sm">
              Asy-Syahid (Dalil): {result.dalil.source}
            </h3>
          </div>
          <div className="arabic-text text-3xl text-right mb-6 text-[#1a0f08] dark:text-[#fcfbf7] leading-loose font-bold flex-grow" lang="ar" dir="rtl">
            {result.dalil.text}
          </div>
          <div className="bg-white/50 dark:bg-white/5 p-5 rounded-lg border border-[#d4af37]/10">
             <p className="text-[10px] font-black text-[#8b7355] dark:text-[#d4af37] uppercase tracking-widest mb-2 border-b border-[#8b7355]/10 dark:border-[#d4af37]/10 pb-1">Terjemahan Ma'na</p>
             {renderPesantrenParagraphs(result.dalil.translation, "!indent-6 text-sm italic text-gray-700 dark:text-gray-400")}
          </div>
        </div>
      </div>
    </div>
  );
};
