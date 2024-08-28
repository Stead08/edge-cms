-- name: CreateField :one
INSERT INTO fields (collection_id, template_id, name, type, required, default_value, options)
VALUES (@collection_id, @template_id, @name, @type, @required, @default_value, @options)
RETURNING *;

-- name: GetField :one
SELECT * FROM fields
WHERE id = @id LIMIT 1;

-- name: ListFields :many
SELECT * FROM fields
WHERE collection_id = @collection_id
ORDER BY id;

-- name: UpdateField :one
UPDATE fields
SET template_id = COALESCE(@template_id, template_id),
    name = COALESCE(@name, name),
    type = COALESCE(@type, type),
    required = COALESCE(@required, required),
    default_value = COALESCE(@default_value, default_value),
    options = COALESCE(@options, options),
    updated_at = CURRENT_TIMESTAMP
WHERE id = @id
RETURNING *;

-- name: DeleteField :exec
DELETE FROM fields
WHERE id = @id;

-- name: GetFieldsByTemplate :many
SELECT * FROM fields
WHERE template_id = @template_id;

-- name: GetFieldsByCollection :many
SELECT * FROM fields
WHERE collection_id = @collection_id;