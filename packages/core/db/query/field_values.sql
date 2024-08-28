-- name: CreateFieldValue :one
INSERT INTO field_values (item_id, field_id, value, version)
VALUES (@item_id, @field_id, @value, 1)
RETURNING *;

-- name: GetFieldValue :one
SELECT * FROM field_values
WHERE id = @id LIMIT 1;

-- name: ListFieldValues :many
SELECT * FROM field_values
WHERE item_id = @item_id
ORDER BY id;

-- name: UpdateFieldValue :one
UPDATE field_values
SET value = @value,
    version = version + 1,
    updated_at = CURRENT_TIMESTAMP
WHERE id = @id
RETURNING *;

-- name: DeleteFieldValue :exec
DELETE FROM field_values
WHERE id = @id;

-- name: GetFieldValuesForItem :many
SELECT * FROM field_values
WHERE item_id = @item_id;

-- name: GetFieldValueVersion :one
SELECT version FROM field_values
WHERE id = @id LIMIT 1;