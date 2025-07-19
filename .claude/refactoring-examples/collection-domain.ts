/**
 * コレクションドメインの関数型DDD実装例
 */

import { Result } from './result-monad'

// ==================== 値オブジェクト ====================

// ブランド型による強い型付け
export type CollectionId = { readonly _brand: 'CollectionId'; value: string }
export type WorkspaceId = { readonly _brand: 'WorkspaceId'; value: string }
export type UserId = { readonly _brand: 'UserId'; value: string }

// 値オブジェクトのスマートコンストラクタ
export const CollectionId = {
  create: (value: string): Result<CollectionId, DomainError> => {
    if (!isValidULID(value)) {
      return Result.error({
        type: 'InvalidCollectionId',
        message: `Invalid collection ID: ${value}`,
      })
    }
    return Result.ok({ _brand: 'CollectionId', value })
  },
  toString: (id: CollectionId): string => id.value,
}

// JSONスキーマの型
export type CollectionSchema = {
  readonly type: 'object'
  readonly properties: Record<string, FieldSchema>
  readonly required?: readonly string[]
}

export type FieldSchema = 
  | { type: 'string'; format?: 'email' | 'url' | 'date' }
  | { type: 'number'; minimum?: number; maximum?: number }
  | { type: 'boolean' }
  | { type: 'array'; items: FieldSchema }
  | { type: 'reference'; collection: CollectionId }

// ==================== ドメインエラー ====================

export type DomainError = 
  | { type: 'InvalidCollectionId'; message: string }
  | { type: 'InvalidSchema'; field: string; reason: string }
  | { type: 'CollectionNotFound'; id: CollectionId }
  | { type: 'DuplicateCollectionName'; name: string; workspaceId: WorkspaceId }
  | { type: 'InsufficientPermissions'; action: string; userId: UserId }
  | { type: 'WorkspaceNotFound'; id: WorkspaceId }

// ==================== ドメインモデル ====================

// コレクションの状態を型で表現
export type Collection = 
  | DraftCollection
  | PublishedCollection
  | ArchivedCollection

export type DraftCollection = {
  readonly type: 'Draft'
  readonly id: CollectionId
  readonly workspaceId: WorkspaceId
  readonly name: string
  readonly description?: string
  readonly schema: CollectionSchema
  readonly createdAt: Date
  readonly createdBy: UserId
}

export type PublishedCollection = {
  readonly type: 'Published'
  readonly id: CollectionId
  readonly workspaceId: WorkspaceId
  readonly name: string
  readonly description?: string
  readonly schema: CollectionSchema
  readonly publishedAt: Date
  readonly publishedBy: UserId
  readonly version: number
}

export type ArchivedCollection = {
  readonly type: 'Archived'
  readonly id: CollectionId
  readonly workspaceId: WorkspaceId
  readonly name: string
  readonly archivedAt: Date
  readonly archivedBy: UserId
  readonly reason: string
}

// ==================== ドメインイベント ====================

export type CollectionEvent = 
  | CollectionCreated
  | CollectionPublished
  | CollectionUpdated
  | CollectionArchived

export type CollectionCreated = {
  readonly type: 'CollectionCreated'
  readonly collectionId: CollectionId
  readonly workspaceId: WorkspaceId
  readonly name: string
  readonly schema: CollectionSchema
  readonly createdBy: UserId
  readonly occurredAt: Date
}

export type CollectionPublished = {
  readonly type: 'CollectionPublished'
  readonly collectionId: CollectionId
  readonly publishedBy: UserId
  readonly version: number
  readonly occurredAt: Date
}

// ==================== ドメインロジック（純粋関数） ====================

// スキーマバリデーション
export const validateSchema = (
  schema: unknown
): Result<CollectionSchema, DomainError> => {
  // 純粋なバリデーションロジック
  if (!isObject(schema) || schema.type !== 'object') {
    return Result.error({
      type: 'InvalidSchema',
      field: 'root',
      reason: 'Schema must be an object type',
    })
  }
  
  // プロパティの検証
  const validatedProperties = validateProperties(schema.properties)
  if (validatedProperties.type === 'Error') {
    return validatedProperties
  }

  return Result.ok({
    type: 'object',
    properties: validatedProperties.value,
    required: schema.required,
  })
}

// コレクション名の検証
export const validateCollectionName = (
  name: string
): Result<string, DomainError> => {
  if (name.length < 3) {
    return Result.error({
      type: 'InvalidSchema',
      field: 'name',
      reason: 'Collection name must be at least 3 characters',
    })
  }
  
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(name)) {
    return Result.error({
      type: 'InvalidSchema',
      field: 'name',
      reason: 'Collection name must start with a letter and contain only letters, numbers, and underscores',
    })
  }
  
  return Result.ok(name)
}

// ドラフトからパブリッシュへの状態遷移
export const publishCollection = (
  draft: DraftCollection,
  publishedBy: UserId,
  now: Date
): Result<PublishedCollection, DomainError> => {
  return Result.ok({
    type: 'Published',
    id: draft.id,
    workspaceId: draft.workspaceId,
    name: draft.name,
    description: draft.description,
    schema: draft.schema,
    publishedAt: now,
    publishedBy,
    version: 1,
  })
}

// アーカイブへの状態遷移
export const archiveCollection = (
  collection: Collection,
  archivedBy: UserId,
  reason: string,
  now: Date
): Result<ArchivedCollection, DomainError> => {
  if (collection.type === 'Archived') {
    return Result.error({
      type: 'InvalidSchema',
      field: 'status',
      reason: 'Collection is already archived',
    })
  }

  return Result.ok({
    type: 'Archived',
    id: collection.id,
    workspaceId: collection.workspaceId,
    name: collection.name,
    archivedAt: now,
    archivedBy,
    reason,
  })
}

// ==================== ワークフロー ====================

// 依存性の型定義
export type CreateCollectionDependencies = {
  generateId: () => CollectionId
  getCurrentTime: () => Date
  checkNameUniqueness: (name: string, workspaceId: WorkspaceId) => Promise<Result<void, DomainError>>
  saveCollection: (collection: Collection) => Promise<Result<void, DomainError>>
  publishEvent: (event: CollectionEvent) => Promise<void>
}

// コレクション作成ワークフロー
export const createCollectionWorkflow = (deps: CreateCollectionDependencies) => 
  async (input: {
    workspaceId: WorkspaceId
    name: string
    description?: string
    schema: unknown
    createdBy: UserId
  }): Promise<Result<Collection, DomainError>> => {
    // 1. 名前の検証
    const nameResult = validateCollectionName(input.name)
    if (nameResult.type === 'Error') {
      return nameResult
    }

    // 2. スキーマの検証
    const schemaResult = validateSchema(input.schema)
    if (schemaResult.type === 'Error') {
      return schemaResult
    }

    // 3. 名前の一意性チェック
    const uniquenessResult = await deps.checkNameUniqueness(input.name, input.workspaceId)
    if (uniquenessResult.type === 'Error') {
      return uniquenessResult
    }

    // 4. ドラフトコレクションの作成
    const collection: DraftCollection = {
      type: 'Draft',
      id: deps.generateId(),
      workspaceId: input.workspaceId,
      name: input.name,
      description: input.description,
      schema: schemaResult.value,
      createdAt: deps.getCurrentTime(),
      createdBy: input.createdBy,
    }

    // 5. 永続化
    const saveResult = await deps.saveCollection(collection)
    if (saveResult.type === 'Error') {
      return saveResult
    }

    // 6. イベントの発行
    await deps.publishEvent({
      type: 'CollectionCreated',
      collectionId: collection.id,
      workspaceId: collection.workspaceId,
      name: collection.name,
      schema: collection.schema,
      createdBy: collection.createdBy,
      occurredAt: collection.createdAt,
    })

    return Result.ok(collection)
  }

// ==================== ヘルパー関数 ====================

const isValidULID = (value: string): boolean => {
  return /^[0-9A-HJKMNP-TV-Z]{26}$/.test(value)
}

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const validateProperties = (
  properties: unknown
): Result<Record<string, FieldSchema>, DomainError> => {
  // プロパティ検証の実装（省略）
  return Result.ok({} as Record<string, FieldSchema>)
}