
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

        ATURAN PENULISAN PESANTREN & TIPOGRAFI BILINGUAL:
        1. Gunakan Bahasa Indonesia (LTR) untuk seluruh narasi penjelasan.
        2. Setiap istilah atau frasa Arab yang muncul di tengah kalimat WAJIB dibungkus dengan tanda ⟨ dan ⟩. Contoh: ⟨ مبتدأ ⟩ atau ⟨ فعل ماض ⟩.
        3. Selalu beri satu spasi sebelum ⟨ dan satu spasi setelah ⟩.
        4. Istilah Arab di tengah paragraf tidak boleh lebih dari satu frasa berturut-turut.
        5. Teks Arab dilarang mengawali atau mengakhiri paragraf narasi Bahasa Indonesia.
        6. Setiap paragraf narasi wajib memiliki indentasi awal sebesar lima spasi.
        7. Dilarang menggunakan bullet points (poin-poin) atau tabel untuk penjelasan konseptual (Justifikasi & Ringkasan). Gunakan paragraf mengalir yang rapi.
        8. Penjelasan harus mendalam, logis, dan menggunakan perataan rata kiri-kanan (justify).

        ATURAN NAHWU:
        9. Semua ISTILAH NAHWU wajib ditulis dalam BAHASA ARAB di dalam kurung ⟨ ⟩ tanpa transliterasi.
        10. Gunakan logika 'Amil dan Ma'mul untuk justifikasi sintaksis.

        KOMPONEN OUTPUT JSON:
        - bab_utama: Nama Bab Nahwu utama (Hanya Bahasa Arab, tanpa pembungkus).
        - bab_pendukung: Array berisi { name: "Nama Bab (Arab)", dalil_text: "Bait/Matan", dalil_source: "Sumber" }.
        - justifikasi: Penjelasan mendalam sesuai aturan tipografi di atas.
        - dalil: Objek berisi { source: "Nama Kitab", text: "Bait Alfiyah atau Matan Arab", translation: "Terjemahan" }.
        - irab_table: Array berisi { word: string, role: string (Arab), state: string (Arab), sign: string (Arab), reason: string (Indonesia sesuai aturan tipografi) }.
        - summary: Kesimpulan singkat sesuai aturan tipografi di atas.
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
