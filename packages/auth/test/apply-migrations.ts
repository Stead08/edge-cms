import { applyD1Migrations, env } from "cloudflare:test";

// セットアップファイルは分離されたストレージの外で実行され、複数回実行される可能性があります。
// `applyD1Migrations()` は既に適用されていないマイグレーションのみを適用するため、
// ここでこの関数を呼び出すことは安全です。
await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);