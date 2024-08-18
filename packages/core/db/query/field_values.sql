-- name: CreateFieldValue :one
INSERT INTO field_values (item_id, field_id, value)
VALUES (@item_id, @field_id, @value)
RETURNING id, item_id, field_id, value, created_at, updated_at;

-- name: GetFieldValue :one
SELECT id, item_id, field_id, value, created_at, updated_at
FROM field_values
WHERE id = @id LIMIT 1;

-- name: ListFieldValues :many
SELECT id, item_id, field_id, value, created_at, updated_at
FROM field_values
WHERE item_id = @item_id
ORDER BY id;

-- name: UpdateFieldValue :one
UPDATE field_values
SET value = @value, updated_at = CURRENT_TIMESTAMP
WHERE id = @id
RETURNING id, item_id, field_id, value, created_at, updated_at;

-- name: DeleteFieldValue :exec
DELETE FROM field_values
WHERE id = @id;