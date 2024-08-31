-- name: CreateWorkspace :one
INSERT INTO workspaces (id, name, slug)
VALUES (@id, @name, @slug)
RETURNING *;

-- name: GetWorkspaceById :one
SELECT * FROM workspaces
WHERE id = @id LIMIT 1;

-- name: GetWorkspaceBySlug :one
SELECT * FROM workspaces
WHERE slug = @slug LIMIT 1;

-- name: ListWorkspaces :many
SELECT * FROM workspaces
ORDER BY id;

-- name: UpdateWorkspace :one
UPDATE workspaces
SET name = COALESCE(@name, name),
    slug = COALESCE(@slug, slug)
WHERE id = @id
RETURNING *;

-- name: DeleteWorkspace :exec
DELETE FROM workspaces
WHERE id = @id;
