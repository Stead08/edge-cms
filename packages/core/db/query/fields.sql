-- name: CreateField :one
INSERT INTO fields (collection_id, name, type, required)
VALUES (@collection_id, @name, @type, @required)
RETURNING id, collection_id, name, type, required, created_at, updated_at;

-- name: GetField :one
SELECT id, collection_id, name, type, required, created_at, updated_at
FROM fields
WHERE id = @id LIMIT 1;

-- name: ListFields :many
SELECT id, collection_id, name, type, required, created_at, updated_at
FROM fields
WHERE collection_id = @collection_id
ORDER BY id;

-- name: UpdateField :one
UPDATE fields
SET name = COALESCE(@name, name), type = COALESCE(@type, type), required = COALESCE(@required, required), updated_at = CURRENT_TIMESTAMP
WHERE id = @id
RETURNING id, collection_id, name, type, required, created_at, updated_at;

-- name: DeleteField :exec
DELETE FROM fields
WHERE id = @id;