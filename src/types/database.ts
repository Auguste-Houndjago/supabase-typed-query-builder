// src/types/database.ts
/**
 * Exemple minimal du type Database
 * ⚠️ À remplacer par le vrai type généré par Supabase (`supabase gen types ...`)
 */
export interface Database {
  public: {
    Tables: Record<
      string,
      {
        Row: Record<string, any>
        Relationships: any[]
      }
    >
  }
}
