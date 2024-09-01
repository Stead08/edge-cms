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

-- テストワークスペースを作成
INSERT INTO workspaces (id, name, slug)
VALUES ('test-workspace_aabbccdd', 'Test Workspace', 'test-workspace');

-- テストコレクションを作成
INSERT INTO collections (id, workspace_id, name, slug, schema)
VALUES ('test-collection', 'test-workspace_aabbccdd', 'Test Collection', 'test-collection', '{"type": "object", "properties": {"title": {"type": "string"}, "content": {"type": "string"}}}');

-- テストアイテムを作成
INSERT INTO items (id, collection_id, data, status)
VALUES ('c851a41a-8ec6-41ac-bedc-73b2b2614f4d', 'test-collection', '{"title": "Test Item 1", "content": "This is a test item 1"}', 'published');

INSERT INTO items (id, collection_id, data, status)
VALUES ('2bd54eed-054a-41cf-8736-51ce6fb12f6b', 'test-collection', '{"title": "Test Item 2", "content": "This is a test item 2"}', 'draft');

