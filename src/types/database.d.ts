// types/database.d.ts
// Fichier d'exemple - les utilisateurs remplaceront avec leurs propres types
export interface Database {
  public: {
    Tables: Record<string, {
      Row: Record<string, any>
      Relationships: any[]
    }>
  }
}