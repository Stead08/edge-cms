/**
 * リポジトリインターフェースと実装例
 * インフラストラクチャ層の関数型実装
 */

import { Result } from './result-monad'
import { 
  Collection, 
  CollectionId, 
  WorkspaceId, 
  DomainError,
  CollectionEvent 
} from './collection-domain'

// ==================== リポジトリエラー ====================

export type RepositoryError = 
  | { type: 'ConnectionError'; message: string }
  | { type: 'QueryError'; query: string; message: string }
  | { type: 'TransactionError'; message: string }

// ==================== クエリ条件 ====================

export type CollectionQuery = {
  workspaceId?: WorkspaceId
  status?: 'Draft' | 'Published' | 'Archived'
  name?: string
  limit?: number
  offset?: number
}

// ==================== リポジトリインターフェース ====================

export interface CollectionRepository {
  findById(id: CollectionId): Promise<Result<Collection | null, RepositoryError>>
  findByName(name: string, workspaceId: WorkspaceId): Promise<Result<Collection | null, RepositoryError>>
  find(query: CollectionQuery): Promise<Result<Collection[], RepositoryError>>
  save(collection: Collection): Promise<Result<void, RepositoryError>>
  delete(id: CollectionId): Promise<Result<void, RepositoryError>>
}

export interface EventStore {
  append(event: CollectionEvent): Promise<Result<void, RepositoryError>>
  getEvents(collectionId: CollectionId): Promise<Result<CollectionEvent[], RepositoryError>>
}

// ==================== D1実装例 ====================

import type { D1Database } from '@cloudflare/workers-types'

export class D1CollectionRepository implements CollectionRepository {
  constructor(private db: D1Database) {}

  async findById(id: CollectionId): Promise<Result<Collection | null, RepositoryError>> {
    try {
      const query = `
        SELECT 
          id, workspace_id, name, description, schema, 
          status, created_at, created_by, published_at, 
          published_by, version, archived_at, archived_by, 
          archived_reason
        FROM collections
        WHERE id = ?
      `
      
      const result = await this.db
        .prepare(query)
        .bind(id.value)
        .first()

      if (!result) {
        return Result.ok(null)
      }

      const collection = this.mapRowToCollection(result)
      return collection
    } catch (error) {
      return Result.error({
        type: 'QueryError',
        query: 'findById',
        message: String(error),
      })
    }
  }

  async findByName(
    name: string, 
    workspaceId: WorkspaceId
  ): Promise<Result<Collection | null, RepositoryError>> {
    try {
      const query = `
        SELECT * FROM collections
        WHERE name = ? AND workspace_id = ?
      `
      
      const result = await this.db
        .prepare(query)
        .bind(name, workspaceId.value)
        .first()

      if (!result) {
        return Result.ok(null)
      }

      return this.mapRowToCollection(result)
    } catch (error) {
      return Result.error({
        type: 'QueryError',
        query: 'findByName',
        message: String(error),
      })
    }
  }

  async find(query: CollectionQuery): Promise<Result<Collection[], RepositoryError>> {
    try {
      let sql = 'SELECT * FROM collections WHERE 1=1'
      const params: unknown[] = []

      if (query.workspaceId) {
        sql += ' AND workspace_id = ?'
        params.push(query.workspaceId.value)
      }

      if (query.status) {
        sql += ' AND status = ?'
        params.push(query.status)
      }

      if (query.name) {
        sql += ' AND name LIKE ?'
        params.push(`%${query.name}%`)
      }

      sql += ' ORDER BY created_at DESC'

      if (query.limit) {
        sql += ' LIMIT ?'
        params.push(query.limit)
      }

      if (query.offset) {
        sql += ' OFFSET ?'
        params.push(query.offset)
      }

      const results = await this.db
        .prepare(sql)
        .bind(...params)
        .all()

      const collections: Collection[] = []
      for (const row of results.results) {
        const mapped = this.mapRowToCollection(row)
        if (mapped.type === 'Error') {
          return mapped
        }
        collections.push(mapped.value)
      }

      return Result.ok(collections)
    } catch (error) {
      return Result.error({
        type: 'QueryError',
        query: 'find',
        message: String(error),
      })
    }
  }

  async save(collection: Collection): Promise<Result<void, RepositoryError>> {
    try {
      const data = this.mapCollectionToRow(collection)
      
      const query = `
        INSERT INTO collections (
          id, workspace_id, name, description, schema, status,
          created_at, created_by, published_at, published_by,
          version, archived_at, archived_by, archived_reason
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          description = excluded.description,
          schema = excluded.schema,
          status = excluded.status,
          published_at = excluded.published_at,
          published_by = excluded.published_by,
          version = excluded.version,
          archived_at = excluded.archived_at,
          archived_by = excluded.archived_by,
          archived_reason = excluded.archived_reason
      `

      await this.db
        .prepare(query)
        .bind(...Object.values(data))
        .run()

      return Result.ok(undefined)
    } catch (error) {
      return Result.error({
        type: 'QueryError',
        query: 'save',
        message: String(error),
      })
    }
  }

  async delete(id: CollectionId): Promise<Result<void, RepositoryError>> {
    try {
      await this.db
        .prepare('DELETE FROM collections WHERE id = ?')
        .bind(id.value)
        .run()

      return Result.ok(undefined)
    } catch (error) {
      return Result.error({
        type: 'QueryError',
        query: 'delete',
        message: String(error),
      })
    }
  }

  // ==================== マッピング関数 ====================

  private mapRowToCollection(row: any): Result<Collection, RepositoryError> {
    try {
      const baseData = {
        id: { _brand: 'CollectionId' as const, value: row.id },
        workspaceId: { _brand: 'WorkspaceId' as const, value: row.workspace_id },
        name: row.name,
        description: row.description,
        schema: JSON.parse(row.schema),
      }

      switch (row.status) {
        case 'Draft':
          return Result.ok({
            type: 'Draft',
            ...baseData,
            createdAt: new Date(row.created_at),
            createdBy: { _brand: 'UserId' as const, value: row.created_by },
          })

        case 'Published':
          return Result.ok({
            type: 'Published',
            ...baseData,
            publishedAt: new Date(row.published_at),
            publishedBy: { _brand: 'UserId' as const, value: row.published_by },
            version: row.version,
          })

        case 'Archived':
          return Result.ok({
            type: 'Archived',
            id: baseData.id,
            workspaceId: baseData.workspaceId,
            name: baseData.name,
            archivedAt: new Date(row.archived_at),
            archivedBy: { _brand: 'UserId' as const, value: row.archived_by },
            reason: row.archived_reason,
          })

        default:
          return Result.error({
            type: 'QueryError',
            query: 'mapRowToCollection',
            message: `Unknown collection status: ${row.status}`,
          })
      }
    } catch (error) {
      return Result.error({
        type: 'QueryError',
        query: 'mapRowToCollection',
        message: String(error),
      })
    }
  }

  private mapCollectionToRow(collection: Collection): Record<string, unknown> {
    const base = {
      id: collection.id.value,
      workspace_id: collection.workspaceId.value,
      name: collection.name,
      status: collection.type,
    }

    switch (collection.type) {
      case 'Draft':
        return {
          ...base,
          description: collection.description,
          schema: JSON.stringify(collection.schema),
          created_at: collection.createdAt.toISOString(),
          created_by: collection.createdBy.value,
          published_at: null,
          published_by: null,
          version: null,
          archived_at: null,
          archived_by: null,
          archived_reason: null,
        }

      case 'Published':
        return {
          ...base,
          description: collection.description,
          schema: JSON.stringify(collection.schema),
          created_at: null, // これは本来保持すべき
          created_by: null, // これは本来保持すべき
          published_at: collection.publishedAt.toISOString(),
          published_by: collection.publishedBy.value,
          version: collection.version,
          archived_at: null,
          archived_by: null,
          archived_reason: null,
        }

      case 'Archived':
        return {
          ...base,
          description: null,
          schema: null,
          created_at: null,
          created_by: null,
          published_at: null,
          published_by: null,
          version: null,
          archived_at: collection.archivedAt.toISOString(),
          archived_by: collection.archivedBy.value,
          archived_reason: collection.reason,
        }
    }
  }
}

// ==================== メモリ実装（テスト用） ====================

export class InMemoryCollectionRepository implements CollectionRepository {
  private collections: Map<string, Collection> = new Map()

  async findById(id: CollectionId): Promise<Result<Collection | null, RepositoryError>> {
    const collection = this.collections.get(id.value)
    return Result.ok(collection || null)
  }

  async findByName(
    name: string, 
    workspaceId: WorkspaceId
  ): Promise<Result<Collection | null, RepositoryError>> {
    const collection = Array.from(this.collections.values())
      .find(c => c.name === name && c.workspaceId.value === workspaceId.value)
    return Result.ok(collection || null)
  }

  async find(query: CollectionQuery): Promise<Result<Collection[], RepositoryError>> {
    let collections = Array.from(this.collections.values())

    if (query.workspaceId) {
      collections = collections.filter(c => c.workspaceId.value === query.workspaceId.value)
    }

    if (query.status) {
      collections = collections.filter(c => c.type === query.status)
    }

    if (query.name) {
      collections = collections.filter(c => c.name.includes(query.name))
    }

    if (query.offset) {
      collections = collections.slice(query.offset)
    }

    if (query.limit) {
      collections = collections.slice(0, query.limit)
    }

    return Result.ok(collections)
  }

  async save(collection: Collection): Promise<Result<void, RepositoryError>> {
    this.collections.set(collection.id.value, collection)
    return Result.ok(undefined)
  }

  async delete(id: CollectionId): Promise<Result<void, RepositoryError>> {
    this.collections.delete(id.value)
    return Result.ok(undefined)
  }
}