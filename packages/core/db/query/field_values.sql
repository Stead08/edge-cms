-- name: CreateFieldValue :one
INSERT INTO field_values (entry_id, field_id, value)
VALUES (@entry_id, @field_id, @value)
RETURNING *;

-- name: GetFieldValue :one
SELECT * FROM field_values
WHERE id = @id LIMIT 1;

-- name: ListFieldValues :many
SELECT * FROM field_values
WHERE entry_id = @entry_id
ORDER BY id;

-- name: UpdateFieldValue :one
UPDATE field_values
SET value = @value, updated_at = CURRENT_TIMESTAMP
WHERE id = @id
RETURNING *;

-- name: DeleteFieldValue :exec
DELETE FROM field_values
WHERE id = @id;