-- このファイルはテスト用のデータベーススキーマです。

-- テストユーザーを作成
INSERT INTO users (id, name, email)
VALUES ('TestUser', 'Test User', 'test@test.com');

-- テストロールを作成
INSERT INTO roles (name, description, permissions, assume_role_policy)
VALUES ('TestAdmin', 'Administrator role', '{"manage": true}', '{"allow": true}');

-- テストユーザーにテストロールを割り当てる
INSERT INTO user_roles (user_id, role_id)
VALUES ('TestUser', 1);

-- テストコレクションを作成
INSERT INTO collections (slug, label, description, access, default_sort, list_searchable_fields)
VALUES ('test', 'Test Collection', 'This is a test collection', true, 'created_at', 'created_at');

-- テストアイテムを作成
INSERT INTO items (collection_id, status)
VALUES (1, 'published');

INSERT INTO items (collection_id, status)
VALUES (1, 'draft');

INSERT INTO items (collection_id, status)
VALUES (1, 'unpublished');


-- テストフィールドテンプレートを作成
INSERT INTO field_templates (name, type, required)
VALUES ('test', 'text', true);
