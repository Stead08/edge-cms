# Edge-cms

## 　モチベーション

- DB、Admin UI、API全てエッジで完結させてみたい。
- Cloudflareのエッジで展開されるサービス(Workkers, Pages, D1, R2等)でどの程度CMSを運用できるか試してみたい。

## 採用技術

- Cloudflare群
  - Cloudflare workers
  - Cloudflare D1 (Sqlite)
  - Cloudflare R2
  - Cloudflare Pages
- 言語
  - Typescript
  - SQL
- フレームワーク
  - Hono
  - vite
- ライブラリ
  - テストライブラリ
    - vitest
  - バリデーションライブラリ
    - zod
  - モノレポツール
    - turbo
  - リンタ&フォーマッタ
    - biome
  - DB
    - sqlc

memo: 高速なD1

```shell
wrangler d1 create your-database --exprerimental-backend
```
