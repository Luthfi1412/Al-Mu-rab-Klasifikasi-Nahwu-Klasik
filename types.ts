
export interface IrabDetail {
  word: string;
  role: string;
  state: string; // Marfu', Manshub, etc.
  sign: string; // Dhammah, Fathah, etc.
  reason: string;
}

export interface SupportingBab {
  name: string;
  dalil_text: string;
  dalil_source: string;
}

export interface AnalysisResult {
  bab_utama: string;
  bab_pendukung: SupportingBab[];
  justifikasi: string;
  dalil: {
    source: string;
    text: string;
    translation: string;
  };
  irab_table: IrabDetail[];
  summary: string;
}

export interface ExampleSentence {
  text: string;
  description: string;
}
