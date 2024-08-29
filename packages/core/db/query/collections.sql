-- name: CreateCollection :one
INSERT INTO collections (slug, label, description, fields)
VALUES (@slug, @label, @description, @fields)
RETURNING *;

-- name: GetCollection :one
SELECT * FROM collections WHERE id = @id LIMIT 1;

-- name: GetCollectionBySlug :one
SELECT * FROM collections WHERE slug = @slug LIMIT 1;

-- name: UpdateCollection :one
UPDATE collections
SET slug = COALESCE(@slug, slug),
    label = COALESCE(@label, label),
    description = COALESCE(@description, description),
    fields = COALESCE(@fields, fields),
    updated_at = CURRENT_TIMESTAMP
WHERE id = @id
RETURNING *;

-- name: DeleteCollection :exec
DELETE FROM collections WHERE id = @id;

-- name: ListCollections :many
SELECT * FROM collections;

-- name: CountCollections :one
SELECT COUNT(id) AS count FROM collections;