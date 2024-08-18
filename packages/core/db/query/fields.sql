-- name: CreateField :one
INSERT INTO fields (content_type_id, name, type, required)
VALUES (@content_type_id, @name, @type, @required)
RETURNING *;

-- name: GetField :one
SELECT * FROM fields
WHERE id = @id LIMIT 1;

-- name: ListFields :many
SELECT * FROM fields
WHERE content_type_id = @content_type_id
ORDER BY id;

-- name: UpdateField :one
UPDATE fields
SET name = @name, type = @type, required = @required, updated_at = CURRENT_TIMESTAMP
WHERE id = @id
RETURNING *;

-- name: DeleteField :exec
DELETE FROM fields
WHERE id = @id;