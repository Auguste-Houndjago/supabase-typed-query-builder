/**
 * relationHelper.ts — version générique
 */

import { GenericDatabase, TableName } from "./queryBuilder"

/**
 *  Relations directes (les tables référencées par T)
 */
export type DirectRelations<
  DB extends GenericDatabase,
  T extends TableName<DB>
> = DB["public"]["Tables"][T]["Relationships"][number] extends never
  ? never
  : DB["public"]["Tables"][T]["Relationships"][number] extends {
      referencedRelation: infer R
    }
  ? R extends TableName<DB>
    ? R
    : never
  : never

/**
 * 🔹 Relations inverses (les tables qui référencent T)
 */
export type InverseRelations<
  DB extends GenericDatabase,
  T extends TableName<DB>
> = {
  [K in TableName<DB>]: DB["public"]["Tables"][K]["Relationships"][number] extends never
    ? never
    : DB["public"]["Tables"][K]["Relationships"][number] extends {
        referencedRelation: infer R
      }
    ? T extends R
      ? K
      : never
    : never
}[TableName<DB>]

/**
 *  Combine relations directes et inverses
 */
export type AvailableRelations<
  DB extends GenericDatabase,
  T extends TableName<DB>
> = DirectRelations<DB, T> | InverseRelations<DB, T>
