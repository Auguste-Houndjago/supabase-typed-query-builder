// src/query-builder.ts
import type { Database } from '@/types/database'
import type { DirectRelations, InverseRelations } from './relation-helper'

type TableName = keyof Database['public']['Tables']
type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row']

/**
 * Type pour la sélection de champs
 */
type SelectFields<T extends TableName> = {
  [K in keyof TableRow<T>]?: boolean
}

/**
 * Type pour les relations disponibles
 */
export type IncludeRelations<T extends TableName> = 
  & { [K in DirectRelations<T>]?: K extends TableName ? QueryConfig<K> : never }
  & { [K in InverseRelations<T>]?: K extends TableName ? QueryConfig<K> : never }

/**
 * Configuration de requête
 */
export type QueryConfig<T extends TableName> = {
  select?: SelectFields<T>
  include?: IncludeRelations<T>
}

/**
 * Construit une requête Supabase typée avec autocomplétion
 * 
 * @example
 * ```ts
 * const query = buildQuery("User", {
 *   select: {
 *     id: true,
 *     firstName: true,
 *     email: true
 *   },
 *   include: {
 *     UserOrganization: {
 *       select: {
 *         role: true
 *       },
 *       include: {
 *         Organization: {
 *           select: {
 *             name: true
 *           }
 *         }
 *       }
 *     }
 *   }
 * })
 * 
 * supabase.from("User").select(query)
 * ```
 */
export function buildQuery<T extends TableName>(
  table: T,
  config: QueryConfig<T>
): string {
  const { select, include } = config

  // Construire les champs principaux
  const mainFields = select
    ? Object.entries(select)
        .filter(([_, value]) => value === true)
        .map(([key]) => key)
        .join(',')
    : '*'

  // Si pas de relations, retourner uniquement les champs
  if (!include || Object.keys(include).length === 0) {
    return mainFields
  }

  // Construire les relations récursivement
  const relations = Object.entries(include).map(([relationName, relationConfig]) => {
    const relationQuery = buildQuery(
      relationName as TableName, 
      relationConfig as QueryConfig<TableName>
    )
    return `${relationName}(${relationQuery})`
  })

  return `${mainFields},${relations.join(',')}`
}