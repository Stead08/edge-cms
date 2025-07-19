/**
 * HTTPアダプター層の実装例
 * Honoを使った薄いアダプター層として実装
 */

import { Hono, Context } from 'hono'
import { z } from 'zod'
import { Result } from './result-monad'
import { 
  createCollectionWorkflow,
  CollectionId,
  WorkspaceId,
  UserId,
  DomainError,
  Collection,
  publishCollection,
  archiveCollection
} from './collection-domain'
import { CollectionRepository } from './collection-repository'

// ==================== リクエスト/レスポンスDTO ====================

const CreateCollectionRequestSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  schema: z.object({
    type: z.literal('object'),
    properties: z.record(z.any()),
    required: z.array(z.string()).optional(),
  }),
})

const UpdateCollectionRequestSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  schema: z.object({
    type: z.literal('object'),
    properties: z.record(z.any()),
    required: z.array(z.string()).optional(),
  }).optional(),
})

const PublishCollectionRequestSchema = z.object({
  message: z.string().optional(),
})

const ArchiveCollectionRequestSchema = z.object({
  reason: z.string().min(1),
})

// ==================== レスポンス変換 ====================

const formatCollection = (collection: Collection) => {
  const base = {
    id: collection.id.value,
    workspaceId: collection.workspaceId.value,
    name: collection.name,
    status: collection.type,
  }

  switch (collection.type) {
    case 'Draft':
      return {
        ...base,
        description: collection.description,
        schema: collection.schema,
        createdAt: collection.createdAt.toISOString(),
        createdBy: collection.createdBy.value,
      }
    
    case 'Published':
      return {
        ...base,
        description: collection.description,
        schema: collection.schema,
        publishedAt: collection.publishedAt.toISOString(),
        publishedBy: collection.publishedBy.value,
        version: collection.version,
      }
    
    case 'Archived':
      return {
        ...base,
        archivedAt: collection.archivedAt.toISOString(),
        archivedBy: collection.archivedBy.value,
        reason: collection.reason,
      }
  }
}

// エラーレスポンスの変換
const formatError = (error: DomainError | { type: string; message: string }) => {
  switch (error.type) {
    case 'InvalidCollectionId':
    case 'InvalidSchema':
      return { code: 'VALIDATION_ERROR', message: error.message, status: 400 }
    
    case 'CollectionNotFound':
    case 'WorkspaceNotFound':
      return { code: 'NOT_FOUND', message: `${error.type}`, status: 404 }
    
    case 'DuplicateCollectionName':
      return { code: 'CONFLICT', message: `Collection name already exists`, status: 409 }
    
    case 'InsufficientPermissions':
      return { code: 'FORBIDDEN', message: error.action, status: 403 }
    
    default:
      return { code: 'INTERNAL_ERROR', message: 'An error occurred', status: 500 }
  }
}

// ==================== HTTPアダプター ====================

export type CollectionRouterDependencies = {
  repository: CollectionRepository
  generateId: () => string
  getCurrentTime: () => Date
  publishEvent: (event: any) => Promise<void>
}

export const createCollectionRouter = (deps: CollectionRouterDependencies) => {
  const app = new Hono()

  // コレクション一覧取得
  app.get('/collections', async (c: Context) => {
    const workspaceId = c.req.header('X-Workspace-Id')
    if (!workspaceId) {
      return c.json({ error: 'Workspace ID required' }, 400)
    }

    const wsIdResult = WorkspaceId.create(workspaceId)
    if (wsIdResult.type === 'Error') {
      return c.json({ error: 'Invalid workspace ID' }, 400)
    }

    const query = {
      workspaceId: wsIdResult.value,
      status: c.req.query('status') as 'Draft' | 'Published' | 'Archived' | undefined,
      name: c.req.query('name'),
      limit: c.req.query('limit') ? parseInt(c.req.query('limit')!) : undefined,
      offset: c.req.query('offset') ? parseInt(c.req.query('offset')!) : undefined,
    }

    const result = await deps.repository.find(query)
    
    if (result.type === 'Error') {
      return c.json({ error: 'Failed to fetch collections' }, 500)
    }

    return c.json({
      collections: result.value.map(formatCollection),
      total: result.value.length,
    })
  })

  // コレクション詳細取得
  app.get('/collections/:id', async (c: Context) => {
    const idResult = CollectionId.create(c.req.param('id'))
    if (idResult.type === 'Error') {
      return c.json({ error: 'Invalid collection ID' }, 400)
    }

    const result = await deps.repository.findById(idResult.value)
    
    if (result.type === 'Error') {
      return c.json({ error: 'Failed to fetch collection' }, 500)
    }

    if (!result.value) {
      return c.json({ error: 'Collection not found' }, 404)
    }

    return c.json(formatCollection(result.value))
  })

  // コレクション作成
  app.post('/collections', async (c: Context) => {
    // リクエストボディのパース
    const body = await c.req.json()
    const validation = CreateCollectionRequestSchema.safeParse(body)
    
    if (!validation.success) {
      return c.json({ 
        error: 'Invalid request', 
        details: validation.error.flatten() 
      }, 400)
    }

    // ヘッダーから必要な情報を取得
    const workspaceId = c.req.header('X-Workspace-Id')
    const userId = c.req.header('X-User-Id')
    
    if (!workspaceId || !userId) {
      return c.json({ error: 'Missing required headers' }, 400)
    }

    // ワークフローの実行
    const workflow = createCollectionWorkflow({
      generateId: () => ({ _brand: 'CollectionId', value: deps.generateId() }),
      getCurrentTime: deps.getCurrentTime,
      checkNameUniqueness: async (name, wsId) => {
        const existing = await deps.repository.findByName(name, wsId)
        if (existing.type === 'Error') {
          return Result.error({
            type: 'WorkspaceNotFound',
            id: wsId,
          })
        }
        if (existing.value) {
          return Result.error({
            type: 'DuplicateCollectionName',
            name,
            workspaceId: wsId,
          })
        }
        return Result.ok(undefined)
      },
      saveCollection: deps.repository.save,
      publishEvent: deps.publishEvent,
    })

    const wsIdResult = WorkspaceId.create(workspaceId)
    const userIdResult = UserId.create(userId)
    
    if (wsIdResult.type === 'Error' || userIdResult.type === 'Error') {
      return c.json({ error: 'Invalid IDs' }, 400)
    }

    const result = await workflow({
      workspaceId: wsIdResult.value,
      name: validation.data.name,
      description: validation.data.description,
      schema: validation.data.schema,
      createdBy: userIdResult.value,
    })

    if (result.type === 'Error') {
      const error = formatError(result.error)
      return c.json({ error: error.message }, error.status)
    }

    return c.json(formatCollection(result.value), 201)
  })

  // コレクション公開
  app.post('/collections/:id/publish', async (c: Context) => {
    const idResult = CollectionId.create(c.req.param('id'))
    const userId = c.req.header('X-User-Id')
    
    if (idResult.type === 'Error' || !userId) {
      return c.json({ error: 'Invalid request' }, 400)
    }

    const userIdResult = UserId.create(userId)
    if (userIdResult.type === 'Error') {
      return c.json({ error: 'Invalid user ID' }, 400)
    }

    // コレクションを取得
    const collectionResult = await deps.repository.findById(idResult.value)
    if (collectionResult.type === 'Error') {
      return c.json({ error: 'Failed to fetch collection' }, 500)
    }

    if (!collectionResult.value) {
      return c.json({ error: 'Collection not found' }, 404)
    }

    if (collectionResult.value.type !== 'Draft') {
      return c.json({ error: 'Only draft collections can be published' }, 400)
    }

    // 公開処理
    const publishResult = publishCollection(
      collectionResult.value,
      userIdResult.value,
      deps.getCurrentTime()
    )

    if (publishResult.type === 'Error') {
      const error = formatError(publishResult.error)
      return c.json({ error: error.message }, error.status)
    }

    // 保存
    const saveResult = await deps.repository.save(publishResult.value)
    if (saveResult.type === 'Error') {
      return c.json({ error: 'Failed to save collection' }, 500)
    }

    // イベント発行
    await deps.publishEvent({
      type: 'CollectionPublished',
      collectionId: publishResult.value.id,
      publishedBy: publishResult.value.publishedBy,
      version: publishResult.value.version,
      occurredAt: publishResult.value.publishedAt,
    })

    return c.json(formatCollection(publishResult.value))
  })

  // コレクションアーカイブ
  app.post('/collections/:id/archive', async (c: Context) => {
    const body = await c.req.json()
    const validation = ArchiveCollectionRequestSchema.safeParse(body)
    
    if (!validation.success) {
      return c.json({ error: 'Invalid request' }, 400)
    }

    const idResult = CollectionId.create(c.req.param('id'))
    const userId = c.req.header('X-User-Id')
    
    if (idResult.type === 'Error' || !userId) {
      return c.json({ error: 'Invalid request' }, 400)
    }

    const userIdResult = UserId.create(userId)
    if (userIdResult.type === 'Error') {
      return c.json({ error: 'Invalid user ID' }, 400)
    }

    // 既存のコレクションを取得してアーカイブ
    const collectionResult = await deps.repository.findById(idResult.value)
    if (collectionResult.type === 'Error') {
      return c.json({ error: 'Failed to fetch collection' }, 500)
    }

    if (!collectionResult.value) {
      return c.json({ error: 'Collection not found' }, 404)
    }

    const archiveResult = archiveCollection(
      collectionResult.value,
      userIdResult.value,
      validation.data.reason,
      deps.getCurrentTime()
    )

    if (archiveResult.type === 'Error') {
      const error = formatError(archiveResult.error)
      return c.json({ error: error.message }, error.status)
    }

    const saveResult = await deps.repository.save(archiveResult.value)
    if (saveResult.type === 'Error') {
      return c.json({ error: 'Failed to save collection' }, 500)
    }

    return c.json(formatCollection(archiveResult.value))
  })

  return app
}

// ==================== ミドルウェア ====================

// 認証ミドルウェアの例
export const authMiddleware = () => {
  return async (c: Context, next: () => Promise<void>) => {
    const token = c.req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    // トークン検証ロジック（省略）
    // const user = await validateToken(token)
    // c.set('user', user)
    
    await next()
  }
}

// エラーハンドリングミドルウェア
export const errorHandler = () => {
  return async (c: Context, next: () => Promise<void>) => {
    try {
      await next()
    } catch (error) {
      console.error('Unhandled error:', error)
      return c.json({ 
        error: 'Internal server error',
        requestId: c.req.header('X-Request-Id') 
      }, 500)
    }
  }
}

// ==================== ヘルパー関数 ====================

const UserId = {
  create: (value: string): Result<UserId, DomainError> => {
    if (!value || value.length === 0) {
      return Result.error({
        type: 'InvalidSchema',
        field: 'userId',
        reason: 'User ID cannot be empty',
      })
    }
    return Result.ok({ _brand: 'UserId', value })
  }
}