CREATE TABLE users (
    id text NOT NULL DEFAULT '',
    name text DEFAULT NULL,
    email text DEFAULT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE collections (
  id INTEGER PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  label VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  access BOOLEAN DEFAULT true,
  default_sort VARCHAR(50),
  list_searchable_fields JSONB,  
  pagination BOOLEAN DEFAULT false,
  default_limit INTEGER DEFAULT 10,  
  max_limit INTEGER DEFAULT 100,  
  metadata JSONB
);

CREATE TABLE field_templates (
  id INTEGER PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  type VARCHAR(20) NOT NULL,
  required BOOLEAN DEFAULT false,
  default_value TEXT,
  options JSONB,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  version INTEGER DEFAULT 1
);

CREATE TABLE fields (
  id INTEGER PRIMARY KEY,
  collection_id INTEGER REFERENCES collections(id) ON DELETE CASCADE,
  template_id INTEGER REFERENCES field_templates(id),
  name VARCHAR(50) NOT NULL,
  type VARCHAR(20) NOT NULL,  -- 例: 'text', 'number', 'boolean' など
  required BOOLEAN DEFAULT false,
  default_value TEXT,
  options JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
  id INTEGER PRIMARY KEY,
  collection_id INTEGER REFERENCES collections(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'unpublished')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP WITH TIME ZONE,
  version INTEGER DEFAULT 1,
  metadata JSONB
);

CREATE TABLE field_values (
  id INTEGER PRIMARY KEY,
  item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
  field_id INTEGER REFERENCES fields(id) ON DELETE CASCADE,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  version INTEGER DEFAULT 1
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
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
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
CREATE INDEX idx_field_values_item_id ON field_values(item_id);
CREATE INDEX idx_field_values_field_id ON field_values(field_id);