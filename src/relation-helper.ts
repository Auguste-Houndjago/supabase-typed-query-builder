// src/relation-helper.ts
import type { Database } from '@/types/database'

type TableName = keyof Database['public']['Tables']

/**
 * Relations directes : foreign keys de cette table vers d'autres tables
 */
export type DirectRelations<T extends TableName> = 
  Database['public']['Tables'][T]['Relationships'][number] extends never
    ? never
    : Database['public']['Tables'][T]['Relationships'][number] extends { referencedRelation: infer R }
      ? R extends TableName
        ? R
        : never
      : never

/**
 * Relations inverses : tables qui ont des foreign keys vers cette table
 */
export type InverseRelations<T extends TableName> = {
  [K in TableName]: 
    Database['public']['Tables'][K]['Relationships'][number] extends never
      ? never
      : Database['public']['Tables'][K]['Relationships'][number] extends { referencedRelation: infer R }
        ? T extends R
          ? K
          : never
        : never
}[TableName]

/**
 * Toutes les relations disponibles pour une table
 */
export type AvailableRelations<T extends TableName> = 
  DirectRelations<T> | InverseRelations<T>