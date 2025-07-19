# Edge CMS Core Package - 関数型DDD リファクタリング計画書

## 概要

この計画書は、Scott Wlaschin著「Domain Modeling Made Functional」の原則に基づいて、Edge CMSのcoreパッケージを関数型ドメイン駆動設計（DDD）でリファクタリングするための指針を提供します。

## 1. 現状分析

### 現在のアーキテクチャの課題

- **貧血ドメインモデル**: エンティティがデータ構造のみで振る舞いを持たない
- **ビジネスロジックの散在**: ルートハンドラー内に混在
- **エラーハンドリング**: 場当たり的なエラー処理
- **副作用の混在**: 純粋な関数とI/O操作が混在

### 強み

- sqlcによる型安全なSQL
- Zodによるスキーマバリデーション
- Cloudflareのエッジインフラストラクチャ

## 2. 関数型DDDの核心原則

### 2.1 型駆動開発

```typescript
// 違法な状態を表現不可能にする
type WorkspaceId = { readonly _brand: 'WorkspaceId'; value: string }
type WorkspaceSlug = { readonly _brand: 'WorkspaceSlug'; value: string }

// 完全な型で状態を表現
type Workspace = 
  | { type: 'Active'; id: WorkspaceId; slug: WorkspaceSlug; name: string }
  | { type: 'Suspended'; id: WorkspaceId; reason: string }
  | { type: 'Deleted'; id: WorkspaceId; deletedAt: Date }
```

### 2.2 ワークフロー中心設計

```typescript
// ワークフローを関数パイプラインとして定義
type CreateCollectionWorkflow = 
  (input: UnvalidatedCreateCollectionInput) => 
  Result<CollectionCreatedEvent, CreateCollectionError>
```

### 2.3 純粋関数とイミュータビリティ

```typescript
// 副作用のない純粋な関数
const validateCollectionSchema = (
  schema: unknown
): Result<CollectionSchema, ValidationError> => {
  // 純粋なバリデーションロジック
}
```

## 3. リファクタリング戦略

### Phase 1: ドメインモデルの強化（2週間）

#### 3.1.1 値オブジェクトの導入

```typescript
// packages/core/src/domain/shared/value-objects.ts
export const WorkspaceId = {
  create: (value: string): Result<WorkspaceId, DomainError> => {
    if (!isValidULID(value)) {
      return Result.error(new InvalidWorkspaceIdError(value))
    }
    return Result.ok({ _brand: 'WorkspaceId' as const, value })
  },
  toString: (id: WorkspaceId): string => id.value
}
```

#### 3.1.2 集約の定義

```typescript
// packages/core/src/domain/workspace/aggregate.ts
export type WorkspaceAggregate = {
  readonly workspace: Workspace
  readonly collections: ReadonlyArray<Collection>
  readonly memberCount: number
}

// 振る舞いを関数として定義
export const WorkspaceActions = {
  suspend: (workspace: WorkspaceAggregate, reason: string): Result<WorkspaceAggregate, DomainError> => {
    if (workspace.workspace.type === 'Deleted') {
      return Result.error(new CannotModifyDeletedWorkspaceError())
    }
    // イミュータブルな更新
    return Result.ok({
      ...workspace,
      workspace: { type: 'Suspended', id: workspace.workspace.id, reason }
    })
  }
}
```

### Phase 2: ワークフローの実装（3週間）

#### 3.2.1 ユースケースの関数パイプライン化

```typescript
// packages/core/src/application/use-cases/create-collection.ts
export const createCollectionWorkflow = (deps: Dependencies) => 
  flow(
    validateInput,
    andThen(checkWorkspaceExists(deps.workspaceRepo)),
    andThen(checkUserPermissions(deps.authService)),
    andThen(validateSchema),
    andThen(createCollection),
    andThen(persistCollection(deps.collectionRepo)),
    map(toCollectionCreatedEvent)
  )
```

#### 3.2.2 エラーハンドリングの統一

```typescript
// packages/core/src/domain/shared/result.ts
export type Result<T, E> = 
  | { type: 'Ok'; value: T }
  | { type: 'Error'; error: E }

// モナディックな操作
export const Result = {
  map: <T, U, E>(f: (t: T) => U) => 
    (result: Result<T, E>): Result<U, E> =>
      result.type === 'Ok' ? Result.ok(f(result.value)) : result,
  
  flatMap: <T, U, E>(f: (t: T) => Result<U, E>) => 
    (result: Result<T, E>): Result<U, E> =>
      result.type === 'Ok' ? f(result.value) : result
}
```

### Phase 3: インフラストラクチャの分離（2週間）

#### 3.3.1 ポートとアダプターパターン

```typescript
// packages/core/src/application/ports/workspace-repository.ts
export interface WorkspaceRepository {
  findById(id: WorkspaceId): Promise<Result<WorkspaceAggregate, RepositoryError>>
  save(workspace: WorkspaceAggregate): Promise<Result<void, RepositoryError>>
}

// packages/core/src/infrastructure/persistence/d1-workspace-repository.ts
export class D1WorkspaceRepository implements WorkspaceRepository {
  // D1特有の実装
}
```

#### 3.3.2 HTTPアダプターの実装

```typescript
// packages/core/src/infrastructure/http/collection-routes.ts
export const createCollectionRoute = (workflow: CreateCollectionWorkflow) => 
  async (c: Context) => {
    const input = await c.req.json()
    const result = await workflow(input)
    
    return match(result)
      .with({ type: 'Ok' }, ({ value }) => 
        c.json({ success: true, data: value }, 201))
      .with({ type: 'Error' }, ({ error }) => 
        c.json({ success: false, error: formatError(error) }, 400))
      .exhaustive()
  }
```

## 4. 実装の優先順位

### 高優先度

1. **Resultモナドの実装**: エラーハンドリングの基盤
2. **値オブジェクト**: WorkspaceId, CollectionId, ItemIdなどの強い型付け
3. **コレクション管理ワークフロー**: 最も複雑なドメインロジック

### 中優先度

1. **アイテム管理ワークフロー**: スキーマバリデーションとの統合
2. **権限管理**: ロールベースアクセス制御の関数型実装
3. **イベントシステム**: ドメインイベントの導入

### 低優先度

1. **キャッシング戦略**: KVストアの関数型ラッパー
2. **監査ログ**: イベントソーシングの部分的導入

## 5. 段階的移行戦略

### Step 1: 新機能での適用（1週間）

- 新しい機能から関数型DDDを適用
- 既存コードとの境界を明確に定義

### Step 2: コアドメインのリファクタリング（3週間）

- Collection管理を最初にリファクタリング
- 他のドメインへ段階的に展開

### Step 3: インフラストラクチャの抽象化（2週間）

- リポジトリパターンの導入
- 副作用の境界での管理

### Step 4: 既存ルートの移行（2週間）

- HTTPハンドラーを薄いアダプターに変換
- ビジネスロジックをワークフローに移動

## 6. テスト戦略

### ユニットテスト

```typescript
// 純粋関数は簡単にテスト可能
describe('CollectionSchema validation', () => {
  it('should reject invalid schema', () => {
    const result = validateCollectionSchema({ invalid: true })
    expect(result.type).toBe('Error')
  })
})
```

### 統合テスト

```typescript
// ワークフローのテスト
describe('CreateCollection workflow', () => {
  it('should create collection with valid input', async () => {
    const mockDeps = createMockDependencies()
    const workflow = createCollectionWorkflow(mockDeps)
    const result = await workflow(validInput)
    expect(result.type).toBe('Ok')
  })
})
```

## 7. 期待される効果

### 保守性の向上

- 明確な境界と責任分離
- 純粋関数によるテストの容易さ
- 型安全性の向上

### 拡張性の向上

- 新機能の追加が容易
- ワークフローの組み合わせによる複雑な処理

### エラーハンドリングの改善

- 予測可能なエラー処理
- ドメイン固有のエラー型

## 8. リスクと対策

### リスク

1. **学習曲線**: 関数型プログラミングの概念
2. **既存コードとの統合**: 段階的移行の複雑さ
3. **パフォーマンス**: イミュータブルデータ構造のオーバーヘッド

### 対策

1. **チーム教育**: ペアプログラミングとコードレビュー
2. **Anti-Corruption Layer**: 既存コードとの明確な境界
3. **パフォーマンス測定**: ボトルネックの特定と最適化

## 9. 成功の測定基準

- **コードカバレッジ**: 90%以上のドメインロジックカバレッジ
- **バグ削減**: ドメインロジック起因のバグ50%削減
- **開発速度**: 新機能開発時間の30%短縮
- **型安全性**: ランタイムエラーの80%削減

## 10. 次のステップ

1. このプランのレビューと承認
2. Resultモナドとコア型の実装
3. パイロット機能の選定と実装
4. チーム全体への展開

---

このリファクタリングは、Edge CMSをより堅牢で保守しやすく、拡張可能なシステムに変革します。関数型DDDの原則により、ビジネスロジックが明確に表現され、エッジ環境での高性能を維持しながら、開発者体験を大幅に向上させることができます。
