-- name: CreateEntry :one
INSERT INTO entries (content_type_id, created_by)
VALUES (@content_type_id, @created_by)
RETURNING *;

-- name: GetEntry :one
SELECT * FROM entries
WHERE id = @id LIMIT 1;

-- name: ListEntries :many
SELECT * FROM entries
WHERE content_type_id = @content_type_id
ORDER BY id;

-- name: UpdateEntry :one
UPDATE entries
SET updated_at = CURRENT_TIMESTAMP
WHERE id = @id
RETURNING *;

-- name: DeleteEntry :exec
DELETE FROM entries
WHERE id = @id;