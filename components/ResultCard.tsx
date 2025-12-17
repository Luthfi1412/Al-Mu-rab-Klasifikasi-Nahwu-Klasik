
import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { Quote, Table, Info, Book, Layers, HelpCircle } from 'lucide-react';

interface ResultCardProps {
  result: AnalysisResult;
}

const NAHWU_DICTIONARY: Record<string, string> = {
  "Marfu'": "Status i'rab yang menunjukkan kedudukan utama (seperti subjek). Tanda aslinya adalah Dhommah.",
  "Manshub": "Status i'rab yang menunjukkan kedudukan pelengkap (seperti objek atau keterangan). Tanda aslinya adalah Fathah.",
  "Majrur": "Status i'rab yang terjadi karena didahului huruf jar atau penyandaran (idhofah). Tanda aslinya adalah Kasrah.",
  "Majzum": "Status i'rab khusus untuk fi'il mudhari' yang didahului amil jazm. Tanda aslinya adalah Sukun.",
  "Fa'il": "Isim marfu' yang terletak setelah fi'il mabni ma'lum untuk menunjukkan pelaku pekerjaan.",
  "Mubtada'": "Isim marfu' yang biasanya terletak di awal kalimat sebagai subjek dalam jumlah ismiyyah.",
  "Khabar": "Bagian yang menyempurnakan makna bersama mubtada' dalam jumlah ismiyyah.",
  "Maf'ul Bih": "Isim manshub yang menjadi objek dari sebuah perbuatan fi'il muta'addi.",
  "Fi'il": "Kata yang menunjukkan arti pada dirinya sendiri dan terikat dengan waktu (Kata Kerja).",
  "Isim": "Kata yang menunjukkan arti pada dirinya sendiri dan tidak terikat dengan waktu (Kata Benda).",
  "Harf": "Kata yang tidak memiliki arti sempurna kecuali jika bersambung dengan kata lain.",
  "Na'at": "Kata sifat yang mengikuti isim sebelumnya (Man'ut) dalam i'rab dan sifatnya.",
  "Hal": "Isim manshub yang menjelaskan keadaan fa'il atau maf'ul bih saat pekerjaan terjadi.",
  "Tamyiz": "Isim manshub yang berfungsi menghilangkan kesamaran pada isim sebelumnya.",
  "Idhofah": "Penyandaran sebuah isim (mudhaf) kepada isim lain (mudhaf ilaih) yang mengakibatkan jar.",
  "Amil": "Faktor yang menyebabkan perubahan i'rab pada akhir sebuah kata.",
  "Ma'mul": "Kata yang i'rabnya berubah karena pengaruh dari amil.",
  "Dhommah": "Tanda i'rab rafa' yang asli.",
  "Fathah": "Tanda i'rab nashab yang asli.",
  "Kasrah": "Tanda i'rab jar yang asli.",
  "Sukun": "Tanda i'rab jazm yang asli pada fi'il mudhari' shahih akhir.",
  "Mudhaf": "Isim pertama dalam susunan idhofah yang disandarkan.",
  "Mudhaf Ilaih": "Isim kedua dalam susunan idhofah yang i'rabnya selalu majrur.",
  "Adad": "Kata bilangan.",
  "Ma'dud": "Benda yang dihitung setelah adad."
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
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#4a3728] text-white text-[10px] rounded shadow-xl z-50 pointer-events-none animate-in fade-in zoom-in duration-200">
          <strong className="block border-b border-[#d4af37]/50 mb-1 pb-1 text-[#d4af37]">{term}</strong>
          {definition}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#4a3728]"></span>
        </span>
      )}
    </span>
  );
};

const renderTextWithTooltips = (text: string) => {
  if (!text) return null;

  const sortedKeys = Object.keys(NAHWU_DICTIONARY).sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${sortedKeys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');

  const parts = text.split(pattern);

  return parts.map((part, i) => {
    const matchedTerm = sortedKeys.find(key => key.toLowerCase() === part.toLowerCase());
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
  return (
    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Classification Banner */}
      <div className="bg-[#4a3728] text-white p-6 rounded-lg shadow-xl classic-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex-grow">
          <span className="text-[#d4af37] text-xs font-bold uppercase tracking-widest">الباب الرئيسي • Bab Utama</span>
          <h2 className="text-3xl font-bold mb-3 border-b border-white/10 pb-2">{result.bab_utama}</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {result.bab_pendukung.map((bab, idx) => (
              <span key={idx} className="bg-[#8b7355]/30 text-[#d4af37] text-[11px] font-bold px-3 py-1 rounded-full border border-[#d4af37]/40 flex items-center">
                <Layers className="w-3 h-3 mr-1.5" /> {bab}
              </span>
            ))}
          </div>
        </div>
        
        {/* Updated Khulasoh Section */}
        <div className="text-right sm:max-w-[380px] bg-black/10 p-4 rounded-lg border border-white/5 self-stretch flex flex-col justify-center">
          <div className="flex items-center justify-end gap-2 mb-2">
            <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-tighter">الخلاصة • RINGKASAN</span>
            <Book className="w-4 h-4 text-[#d4af37] opacity-60" />
          </div>
          <p className="text-xl leading-loose text-justify arabic-text font-medium text-white/90">
            {result.summary}
          </p>
        </div>
      </div>

      {/* I'rab Table - Full Width (Memanjang) */}
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#8b7355] overflow-hidden paper-texture">
        <div className="flex justify-between items-center border-b border-[#e2e1d5] pb-2 mb-4">
          <h3 className="flex items-center text-[#2d1e12] font-black uppercase tracking-tighter text-sm">
            <Table className="w-4 h-4 mr-2" /> تفصيل الإعراب (Detail I'rab)
          </h3>
          <span className="text-[10px] text-[#8b7355] flex items-center italic">
            <HelpCircle className="w-3 h-3 mr-1" /> Arahkan kursor ke istilah untuk penjelasan
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed min-w-[700px]">
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
                    <div className="font-bold text-[#1a0f08] text-base leading-snug">
                      {renderTextWithTooltips(item.role)}
                    </div>
                  </td>
                  <td className="px-4 py-5 whitespace-normal">
                    <span className={`px-3 py-1.5 rounded text-[11px] font-black mr-1 shadow-sm inline-block mb-2 ${
                      item.state.toLowerCase().includes('marfu') ? 'bg-blue-100 text-blue-900' :
                      item.state.toLowerCase().includes('manshub') ? 'bg-green-100 text-green-900' :
                      item.state.toLowerCase().includes('majrur') ? 'bg-red-100 text-red-900' :
                      'bg-gray-100 text-gray-900'
                    }`}>
                      {renderTextWithTooltips(item.state)}
                    </span>
                    <div className="text-[11px] text-gray-800 font-bold mt-1 leading-tight break-words">
                      العلامة: {renderTextWithTooltips(item.sign)}
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <div className="text-xs text-[#4a3728] font-medium italic bg-[#fcfbf7] p-3 rounded border border-[#e2e1d5]/50 text-justify leading-relaxed break-words whitespace-normal">
                      {renderTextWithTooltips(item.reason)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Justifikasi & Dalil Section - Placed Below the Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#8b7355] paper-texture">
          <h3 className="flex items-center text-[#2d1e12] font-black mb-4 uppercase tracking-tighter text-sm border-b border-[#e2e1d5] pb-2">
            <Info className="w-4 h-4 mr-2" /> التعليل النحوي (Justifikasi)
          </h3>
          <p className="text-[#1a0f08] font-medium leading-relaxed text-sm whitespace-pre-wrap text-justify">
            {renderTextWithTooltips(result.justifikasi)}
          </p>
        </div>

        <div className="bg-[#fdfcf0] p-6 rounded-lg shadow-md border-l-4 border-[#d4af37]">
          <h3 className="flex items-center text-[#2d1e12] font-black mb-4 uppercase tracking-tighter text-sm border-b border-[#d4af37]/20 pb-2">
            <Quote className="w-4 h-4 mr-2" /> الشاهد (Dalil): {result.dalil.source}
          </h3>
          <div className="arabic-text text-3xl text-right mb-4 text-[#1a0f08] leading-loose font-bold">
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
