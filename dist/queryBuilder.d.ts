/**
 * ================================
 * Supabase Typed Query Builder
 * (Database-generic version)
 * ================================
 *
 * Cette version ne dépend pas d’un fichier `database.ts`.
 * L’utilisateur fournit son propre type `Database` généré
 * via `supabase gen types typescript --project-id ...`
 *
 * Exemple d’usage :
 *
 * import { buildQuery } from "supabase-typescript-query-builder"
 * import { Database } from "@/types/database"
 *
 * const query = buildQuery<Database>("User", {
 *   select: { id: true, email: true },
 *   include: {
 *     UserOrganization: {
 *       select: { role: true },
 *       include: {
 *         Organization: { select: { name: true } }
 *       }
 *     }
 *   }
 * })
 *
 * await supabase.from("User").select(query)
 */
import { AvailableRelations } from "./relationHelper";
export type GenericDatabase = {
    public: {
        Tables: Record<string, {
            Row: Record<string, any>;
            Relationships: {
                foreignKeyName?: string;
                columns?: string[];
                referencedRelation?: string;
                referencedColumns?: string[];
            }[];
        }>;
    };
};
/**
 * 🔸 Nom d'une table valide dans la DB
 */
export type TableName<DB extends GenericDatabase> = keyof DB["public"]["Tables"];
/**
 * 🔸 Ligne d'une table donnée
 */
export type TableRow<DB extends GenericDatabase, T extends TableName<DB>> = DB["public"]["Tables"][T]["Row"];
/**
 * 🔸 Champs sélectionnables d'une table
 */
export type SelectFields<DB extends GenericDatabase, T extends TableName<DB>> = {
    [K in keyof TableRow<DB, T>]?: boolean;
};
/**
 * 🔸 Relations disponibles pour une table (typées via `relationHelper`)
 */
export type IncludeRelations<DB extends GenericDatabase, T extends TableName<DB>> = {
    [K in AvailableRelations<DB, T>]?: K extends TableName<DB> ? QueryConfig<DB, K> : never;
};
/**
 * 🔸 Configuration de requête typée
 */
export type QueryConfig<DB extends GenericDatabase, T extends TableName<DB>> = {
    select?: SelectFields<DB, T>;
    include?: IncludeRelations<DB, T>;
};
/**
 * 🔹 Fonction principale : génère la requête `.select()` typée
 */
export declare function buildQuery<DB extends GenericDatabase, T extends TableName<DB>>(table: T, config: QueryConfig<DB, T>): string;
