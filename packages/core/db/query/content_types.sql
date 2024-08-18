-- name: GetContentType :one
SELECT * FROM content_types
WHERE id = @id LIMIT 1;

-- name: CreateContentType :one
INSERT INTO content_types (name, description)
VALUES (@name, @description)
RETURNING *;

-- name: ListContentTypes :many
SELECT * FROM content_types
ORDER BY id;

-- name: UpdateContentType :one
UPDATE content_types
SET name = @name, description = @description, updated_at = CURRENT_TIMESTAMP
WHERE id = @id
RETURNING *;

-- name: DeleteContentType :exec
DELETE FROM content_types
WHERE id = @id;