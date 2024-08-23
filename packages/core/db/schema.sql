CREATE TABLE users (
    id text NOT NULL DEFAULT '',
    name text DEFAULT NULL,
    email text DEFAULT NULL,
    emailVerified datetime DEFAULT NULL,
    passwordhash text NOT NULL,
    image text DEFAULT NULL, 
    PRIMARY KEY (id)
);

CREATE TABLE accounts (
    id text NOT NULL,
    userId text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    providerAccountId text NOT NULL,
    refresh_token text DEFAULT NULL,
    access_token text DEFAULT NULL,
    expires_at number DEFAULT NULL,
    token_type text DEFAULT NULL,
    scope text DEFAULT NULL,
    id_token text DEFAULT NULL,
    session_state text DEFAULT NULL,
    oauth_token_secret text DEFAULT NULL,
    oauth_token text DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE sessions (
    id text NOT NULL,
    sessionToken text NOT NULL,
    userId text NOT NULL,
    expires datetime NOT NULL, 
    PRIMARY KEY (sessionToken),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE verification_tokens (
    identifier text NOT NULL,
    token text NOT NULL DEFAULT NULL,
    expires datetime NOT NULL DEFAULT NULL, 
    PRIMARY KEY (token)
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
  max_limit INTEGER DEFAULT 100  
);

CREATE TABLE items (
  id INTEGER PRIMARY KEY,
  collection_id INTEGER REFERENCES collections(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'unpublished')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fields (
  id INTEGER PRIMARY KEY,
  collection_id INTEGER REFERENCES collections(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  type VARCHAR(20) NOT NULL,  -- 例: 'text', 'number', 'boolean' など
  required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE field_values (
  id INTEGER PRIMARY KEY,
  item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
  field_id INTEGER REFERENCES fields(id) ON DELETE CASCADE,
  value TEXT,
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