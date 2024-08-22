-- このファイルはテスト用のデータベーススキーマです。

-- テストユーザーを作成
INSERT INTO users (id, name, email, emailVerified, passwordHash, image)
VALUES ('TestUser', 'Test User', 'test@test.com', '2024-01-01T00:00:00Z', ":b3effd8fc47d700fd2634c4e9732c60b70599108a889f4032b867f7429f45eed", 'https://example.com/image.png');

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

-- テストフィールドを作成
INSERT INTO fields (collection_id, name, type, required)
VALUES (1, 'test', 'text', true);

-- テストフィールド値を作成
INSERT INTO field_values (item_id, field_id, value)
VALUES (1, 1, 'test');