-- このファイルはテスト用のデータベーススキーマです。

-- テストユーザーを作成
INSERT INTO users (username, email, password_hash)
VALUES ('test', 'test@test.com', 'test');

-- テストコレクションを作成
INSERT INTO collections (slug, label, description, access, default_sort, list_searchable_fields)
VALUES ('test', 'test', 'test', true, 'created_at', 'created_at');

-- テストアイテムを作成
INSERT INTO items (collection_id)
VALUES (1);

-- テストフィールドを作成
INSERT INTO fields (collection_id, name, type, required)
VALUES (1, 'test', 'text', true);

-- テストフィールド値を作成
INSERT INTO field_values (item_id, field_id, value)
VALUES (1, 1, 'test');