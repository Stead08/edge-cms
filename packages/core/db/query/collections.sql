-- name: CreateCollection :one
INSERT INTO collections (id, workspace_id, name, slug, schema)
VALUES (@id, @workspace_id, @name, @slug, @schema)
RETURNING *;

-- name: GetCollection :one
SELECT * FROM collections
WHERE id = @id LIMIT 1;

-- name: ListCollections :many
SELECT * FROM collections
WHERE workspace_id = @workspace_id
ORDER BY id;

-- name: UpdateCollection :one
UPDATE collections
SET name = COALESCE(@name, name),
    slug = COALESCE(@slug, slug),
    schema = COALESCE(@schema, schema)
WHERE id = @id
RETURNING *;

-- name: DeleteCollection :exec
DELETE FROM collections
WHERE id = @id;