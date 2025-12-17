
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

        Gunakan istilah teknis Arab yang baku dalam penjelasan:
        - Bab Utama: 'الباب الرئيسي' (Al-Bab al-Ra'isi)
        - Bab Pendukung: 'الأبواب المتممة' (Al-Abwab al-Mutammimah)
        - Justifikasi: 'التعليل النحوي' (At-Ta'lil al-Nahwi) atau 'وجه الاستدلال'
        - Dalil: 'الشاهد' (As-Syahid)
        
        Berikan output dalam format JSON dengan struktur:
        - bab_utama: Nama Bab Nahwu utama (dalam Bahasa Arab dan Indonesia).
        - bab_pendukung: Daftar bab-bab nahwu pendukung (Arab + Indonesia).
        - justifikasi: Penjelasan sintaksis mendalam menggunakan logika 'Amil dan Ma'mul.
        - dalil: Objek berisi { source: "Nama Kitab", text: "Bait Alfiyah atau Matan Ajurumiyyah", translation: "Terjemahan Dalil" }.
        - irab_table: Array berisi { word: string, role: string (الموقع الإعرابي), state: string (الحالة الإعرابية), sign: string (علامة الإعراب), reason: string (السبب) }.
        - summary: Kesimpulan singkat (الخلاصة).
        
        Pastikan analisis akurat sesuai kaidah i'rab.
      `,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          bab_utama: { type: Type.STRING },
          bab_pendukung: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
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
