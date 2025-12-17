
import React, { useState } from 'react';
import { AnalysisResult, SupportingBab } from '../types';
import { Quote, Table, Info, Book, Layers, HelpCircle, GraduationCap } from 'lucide-react';

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
      <span className="cursor-help border-b border-dotted border-[#8b7355] hover:bg-[#d4af37]/10 transition-colors px-0.5 rounded">
        {children}
      </span>
      {isVisible && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-[#4a3728] text-white text-[10px] rounded shadow-2xl z-50 pointer-events-none animate-in fade-in zoom-in duration-200 border border-[#d4af37]/30">
          <strong className="block border-b border-[#d4af37]/50 mb-1 pb-1 text-[#d4af37] text-xs">{term}</strong>
          <span className="leading-relaxed opacity-90">{definition}</span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#4a3728]"></span>
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
        <span className={`absolute ${isMain ? 'top-full left-0' : 'top-full left-1/2 -translate-x-1/2'} mt-2 w-72 p-4 bg-white text-[#2d1e12] rounded-lg shadow-2xl z-50 pointer-events-none animate-in fade-in slide-in-from-top-2 duration-200 border-2 border-[#d4af37]`}>
          <div className="flex items-center gap-1.5 mb-2 border-b border-[#d4af37]/20 pb-2">
            <GraduationCap className="w-4 h-4 text-[#d4af37]" />
            <span className="font-black text-[10px] uppercase tracking-tighter text-[#8b7355]">
              {isMain ? 'Dalil Utama (الشاهد الرئيسي)' : 'Dalil Pendukung'}
            </span>
          </div>
          <div className="arabic-text text-justify text-xl mb-2 font-bold leading-relaxed text-[#1a0f08]" lang="ar">
            {bab.dalil_text}
          </div>
          <div className="text-[10px] font-bold italic text-[#8b7355] text-right">— {bab.dalil_source}</div>
          
          <span className={`absolute bottom-full ${isMain ? 'left-8' : 'left-1/2 -translate-x-1/2'} border-8 border-transparent border-b-white`}></span>
          <span className={`absolute bottom-full ${isMain ? 'left-8' : 'left-1/2 -translate-x-1/2'} border-[10px] border-transparent border-b-[#d4af37] -z-10 -mt-[2px]`}></span>
        </span>
      )}
    </span>
  );
};

const renderTextWithTooltips = (text: string) => {
  if (!text) return null;

  // Sort keys by length descending to match longer terms first (e.g., 'مضاف إليه' before 'مضاف')
  const sortedKeys = Object.keys(NAHWU_DICTIONARY).sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${sortedKeys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');

  const parts = text.split(pattern);

  return parts.map((part, i) => {
    const matchedTerm = sortedKeys.find(key => key === part);
    if (matchedTerm) {
      return (
        <Tooltip key={i} term={matchedTerm} definition={NAHWU_DICTIONARY[matchedTerm]}>
          {part}
        </Tooltip>
      );
    }
    return part;
  });
};

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const mainBabWithDalil = {
    name: result.bab_utama,
    dalil_text: result.dalil.text,
    dalil_source: result.dalil.source
  };

  return (
    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Classification Banner */}
      <div className="bg-[#4a3728] text-white p-6 rounded-lg shadow-xl classic-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex-grow">
          <span className="text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-1 block">الباب • Bab</span>
          
          <BabTooltip bab={mainBabWithDalil} isMain={true}>
            <div className="group cursor-help">
              <h2 className="text-3xl font-bold mb-3 border-b border-white/10 pb-2 tracking-tight flex items-center gap-3 group-hover:text-[#d4af37] transition-colors arabic-text" dir="rtl">
                {result.bab_utama}
                <Book className="w-5 h-5 text-[#d4af37] opacity-40 group-hover:opacity-100 transition-opacity" />
              </h2>
            </div>
          </BabTooltip>

          <div className="flex flex-wrap gap-2.5 mt-2">
            {result.bab_pendukung.map((bab, idx) => (
              <BabTooltip key={idx} bab={bab}>
                <span className="bg-[#8b7355]/40 text-[#d4af37] text-[11px] font-bold px-3 py-1.5 rounded-full border border-[#d4af37]/30 flex items-center hover:bg-[#d4af37]/20 transition-colors cursor-help arabic-text">
                  <Layers className="w-3 h-3 ml-1.5 opacity-70" /> {bab.name}
                </span>
              </BabTooltip>
            ))}
          </div>
        </div>
        
        <div className="text-left sm:text-right sm:max-w-[400px] bg-black/10 p-5 rounded-lg border border-white/5 self-stretch flex flex-col justify-center">
          <div className="flex items-center justify-start sm:justify-end gap-2 mb-2">
            <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-tighter">الخلاصة • RINGKASAN</span>
            <Book className="w-4 h-4 text-[#d4af37] opacity-60" />
          </div>
          <p className="text-base leading-relaxed text-justify text-white/95 font-medium">
            {renderTextWithTooltips(result.summary)}
          </p>
        </div>
      </div>

      {/* I'rab Table */}
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#8b7355] overflow-hidden paper-texture">
        <div className="flex justify-between items-center border-b border-[#e2e1d5] pb-2 mb-4">
          <h3 className="flex items-center text-[#2d1e12] font-black uppercase tracking-tighter text-sm">
            <Table className="w-4 h-4 mr-2" /> تفصيل الإعراب (Detail I'rab)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed min-w-[750px]">
            <thead>
              <tr className="bg-[#fcfbf7] text-[#4a3728] border-b-2 border-[#8b7355]">
                <th className="w-1/5 px-4 py-3 text-right arabic-text font-bold text-xl">الكلمة</th>
                <th className="w-1/5 px-4 py-3 text-left font-bold uppercase tracking-wider text-[11px] text-[#4a3728]">الموقع (Jabatan)</th>
                <th className="w-1/4 px-4 py-3 text-left font-bold uppercase tracking-wider text-[11px] text-[#4a3728]">الإعراب (Status)</th>
                <th className="w-auto px-4 py-3 text-left font-bold uppercase tracking-wider text-[11px] text-[#4a3728]">السبب (Alasan)</th>
              </tr>
            </thead>
            <tbody>
              {result.irab_table.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-[#fffdf8] transition-colors align-top">
                  <td className="px-4 py-5 text-right font-black arabic-text text-2xl text-[#8b7355] break-words">{item.word}</td>
                  <td className="px-4 py-5 whitespace-normal break-words">
                    <div className="font-bold text-[#1a0f08] text-base leading-snug arabic-text" dir="rtl">
                      {item.role}
                    </div>
                  </td>
                  <td className="px-4 py-5 whitespace-normal">
                    <span className={`px-3 py-1.5 rounded text-[11px] font-black mr-1 shadow-sm inline-block mb-2 arabic-text ${
                      item.state.includes('مرفوع') ? 'bg-blue-100 text-blue-900' :
                      item.state.includes('منصوب') ? 'bg-green-100 text-green-900' :
                      item.state.includes('مجرور') ? 'bg-red-100 text-red-900' :
                      'bg-gray-100 text-gray-900'
                    }`} dir="rtl">
                      {item.state}
                    </span>
                    <div className="text-[11px] text-gray-800 font-bold mt-1 leading-tight break-words">
                      العلامة: <span className="arabic-text" dir="rtl">{item.sign}</span>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <div className="text-xs text-[#4a3728] font-medium italic bg-[#fcfbf7] p-3 rounded border border-[#e2e1d5]/50 text-justify leading-relaxed break-words whitespace-normal shadow-inner">
                      {item.reason}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Justifikasi & Dalil Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#8b7355] paper-texture flex flex-col">
          <h3 className="flex items-center text-[#2d1e12] font-black mb-4 uppercase tracking-tighter text-sm border-b border-[#e2e1d5] pb-2">
            <Info className="w-4 h-4 mr-2" /> التعليل النحوي • Justifikasi
          </h3>
          <p className="text-[#1a0f08] font-medium leading-relaxed text-sm whitespace-pre-wrap text-justify flex-grow">
            {renderTextWithTooltips(result.justifikasi)}
          </p>
        </div>

        <div className="bg-[#fdfcf0] p-6 rounded-lg shadow-md border-l-4 border-[#d4af37] flex flex-col">
          <h3 className="flex items-center text-[#2d1e12] font-black mb-4 uppercase tracking-tighter text-sm border-b border-[#d4af37]/20 pb-2">
            <Quote className="w-4 h-4 mr-2" /> الشاهد الرئيسي (Dalil): {result.dalil.source}
          </h3>
          <div className="arabic-text text-3xl text-justify mb-4 text-[#1a0f08] leading-loose font-bold flex-grow" lang="ar">
            {result.dalil.text}
          </div>
          <p className="text-xs text-gray-700 italic border-t border-[#d4af37]/20 pt-3 font-medium text-justify">
            "{result.dalil.translation}"
          </p>
        </div>
      </div>
    </div>
  );
};
