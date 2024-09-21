# Edge-cms

Work in progress

## Motivation

- I want to complete everything (DB, Admin UI, API) at the edge.
- I want to test how well a CMS can be operated using services deployed at the edge of Cloudflare (Workers, Pages, D1, R2, etc.).

## Adopted Technologies

- Cloudflare Suite
  - Cloudflare Workers (with service bindings)
  - Cloudflare D1 (Sqlite)
  - Cloudflare R2
  - Cloudflare Pages
- Languages
  - Typescript
  - SQL
- Frameworks
  - Hono
  - Vite
- Libraries
  - Testing Libraries
    - Vitest
  - Validation Libraries
    - Zod
  - Monorepo Tools
    - Turbo
  - Linter & Formatter
    - Biome
  - Database
    - sqlc

## 　モチベーション

- DB、Admin UI、API全てエッジで完結させてみたい。
- Cloudflareのエッジで展開されるサービス(Workkers, Pages, D1, R2等)でどの程度CMSを運用できるか試してみたい。

## 採用技術

- Cloudflare群
  - Cloudflare workers (with service bindings)
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
