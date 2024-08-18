-- このファイルはテスト用のデータベーススキーマです。

-- テストユーザーを作成
INSERT INTO users (username, email, password_hash)
VALUES ('test', 'test@test.com', 'test');

-- テストコレクションを作成
INSERT INTO collections (slug, label, description, access, default_sort, list_searchable_fields)
VALUES ('test', 'test', 'test', true, 'created_at', 'created_at');


