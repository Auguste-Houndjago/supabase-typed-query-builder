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
/**
 * 🔹 Fonction principale : génère la requête `.select()` typée
 */
export function buildQuery(table, config) {
    const { select, include } = config;
    // Champs simples (id, name, email, etc.)
    const mainFields = select
        ? Object.entries(select)
            .filter(([_, value]) => value === true)
            .map(([key]) => key)
            .join(",")
        : "*";
    // Pas de relations
    if (!include || Object.keys(include).length === 0) {
        return mainFields;
    }
    // Génération récursive des relations
    const relations = Object.entries(include).map(([relationName, relationConfig]) => {
        const relationQuery = buildQuery(relationName, relationConfig);
        return `${relationName}(${relationQuery})`;
    });
    return `${mainFields},${relations.join(",")}`;
}
