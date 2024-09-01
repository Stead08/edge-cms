CREATE TABLE users (
    id TEXT NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE workspaces (
  id TEXT NOT NULL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE collections (
  id TEXT NOT NULL PRIMARY KEY, 
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  schema JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(workspace_id, slug)
);

CREATE TABLE items (
  id TEXT NOT NULL PRIMARY KEY, --UUID
  collection_id TEXT NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  status VARCHAR(20) NOT NULL, -- ステータスカラムを追加
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
  id INTEGER PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB NOT NULL,
  assume_role_policy JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
  id INTEGER PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, role_id)
);

-- 事前定義されたロールを挿入
INSERT INTO roles (name, description, permissions, assume_role_policy) VALUES
('Viewer', 'Can view content', '{"view": true}', '{"view": true}'),
('Editor', 'Can view and edit content', '{"view": true, "edit": true}', '{"view": true, "edit": true}'),
('Admin', 'Has full access to all features', '{"view": true, "edit": true, "delete": true}', '{"view": true, "edit": true, "delete": true}');

-- インデックスの追加
CREATE INDEX idx_collections_slug ON collections(slug);
CREATE INDEX idx_items_collection_id ON items(collection_id);
CREATE INDEX idx_items_status ON items(status);