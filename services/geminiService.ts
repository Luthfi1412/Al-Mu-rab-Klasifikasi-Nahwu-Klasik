
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeIbarah(text: string, context?: string): Promise<AnalysisResult> {
  const prompt = `
    IBARAH (الإبارة)  : ${text}
    ${context ? `KONTEKS (السياق) : ${context}` : ''}
    
    Analisis kalimat tersebut secara mendalam menggunakan kaidah Nahwu klasik (Manhaj Bashriyyah/Kufiyyah).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction: `
        Kamu adalah pakar Nahwu senior (Muhaqqiq) dengan penguasaan mutlak terhadap Al-Ajurumiyyah dan Alfiyah Ibnu Malik.
        Tugasmu adalah melakukan klasifikasi Bab Nahwu (الباب النحوي) yang paling dominan/relevan.

        ATURAN BAHASA:
        1. Semua ISTILAH NAHWU wajib ditulis dalam BAHASA ARAB, tanpa transliterasi.
           Contoh: اسم، فعل، حرف، مبتدأ، خبر، مفعول به
        2. Seluruh PENJELASAN, DEFINISI, dan NARASI wajib menggunakan BAHASA INDONESIA.
        3. Dilarang menerjemahkan istilah nahwu ke bahasa Indonesia di dalam teks utama.
           Terjemahan hanya boleh muncul di tooltip atau penjelasan terpisah.

        ATURAN TOOLTIP:
        4. Tooltip hanya boleh muncul untuk istilah nahwu yang ada dalam GLOSSARY (مرفوع, منصوب, مجرور, مجزوم, فاعل, مبتدأ, خبر, مفعول به, فعل, اسم, حرف, نعت, حال, تمييز, إضافة, عامل, معمول, ضمة, فتحة, كسرة, سكون, مضاف, مضاف إليه, عدد, معدود).
        5. Jika istilah tidak ditemukan dalam glossary atau maknanya ambigu, JANGAN tampilkan tooltip.
        6. Tooltip bersifat definisional singkat (maksimal 1 kalimat).
        7. Dilarang membuat definisi sendiri di luar glossary.

        ATURAN MAKNA:
        8. Istilah Arab hanya dianggap istilah nahwu jika konteksnya adalah pembagian kata atau i‘rab.
        9. Jika kata Arab digunakan dalam makna umum (bukan nahwu), jangan beri tooltip.

        ATURAN OUTPUT:
        10. Pisahkan teks utama dan data tooltip.
        11. Jangan menampilkan HTML atau markdown tooltip secara langsung. mekanisme tooltip ditangani oleh sistem frontend.
        12. Output harus berbentuk JSON terstruktur.
        
        KOMPONEN OUTPUT:
        - Bab Utama: Nama Bab Nahwu utama dalam BAHASA ARAB SAJA.
        - Bab Pendukung: Aturan tambahan yang relevan. Berikan dalil singkat untuk setiap bab pendukung.
        - Justifikasi: Penjelasan sintaksis menggunakan logika 'Amil dan Ma'mul dalam Bahasa Indonesia, tetap menggunakan istilah Arab untuk istilah Nahwu.
        - Dalil Utama: 'الشاهد الرئيسي' dari Alfiyah atau Ajurumiyyah.
        
        Berikan output dalam format JSON dengan struktur:
        - bab_utama: Nama Bab Nahwu utama (Hanya Bahasa Arab).
        - bab_pendukung: Array berisi { name: "Nama Bab (Arab)", dalil_text: "Bait/Matan", dalil_source: "Sumber" }.
        - justifikasi: Penjelasan mendalam dalam Bahasa Indonesia mengenai posisi sintaksis kata-kata tersebut.
        - dalil: Objek berisi { source: "Nama Kitab", text: "Bait Alfiyah atau Matan Arab", translation: "Terjemahan Dalil" }.
        - irab_table: Array berisi { word: string, role: string (Bahasa Arab), state: string (Bahasa Arab), sign: string (Bahasa Arab), reason: string (Penjelasan Bahasa Indonesia) }.
        - summary: Kesimpulan singkat dalam Bahasa Indonesia (الخلاصة).
      `,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          bab_utama: { type: Type.STRING },
          bab_pendukung: { 
            type: Type.ARRAY,
            items: { 
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                dalil_text: { type: Type.STRING },
                dalil_source: { type: Type.STRING }
              },
              required: ["name", "dalil_text", "dalil_source"]
            }
          },
          justifikasi: { type: Type.STRING },
          dalil: {
            type: Type.OBJECT,
            properties: {
              source: { type: Type.STRING },
              text: { type: Type.STRING },
              translation: { type: Type.STRING }
            },
            required: ["source", "text", "translation"]
          },
          irab_table: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                role: { type: Type.STRING },
                state: { type: Type.STRING },
                sign: { type: Type.STRING },
                reason: { type: Type.STRING }
              },
              required: ["word", "role", "state", "sign", "reason"]
            }
          },
          summary: { type: Type.STRING }
        },
        required: ["bab_utama", "bab_pendukung", "justifikasi", "dalil", "irab_table", "summary"]
      }
    },
  });

  return JSON.parse(response.text);
}
