-- name: CreateFieldTemplate :one
INSERT INTO field_templates (name, type, required, default_value, options, metadata)
VALUES (@name, @type, @required, @default_value, @options, @metadata)
RETURNING *;

-- name: GetFieldTemplate :one
SELECT * FROM field_templates WHERE id = @id LIMIT 1;

-- name: ListFieldTemplates :many
SELECT * FROM field_templates ORDER BY name;

-- name: UpdateFieldTemplate :one
UPDATE field_templates
SET name = COALESCE(@name, name),
    type = COALESCE(@type, type),
    required = COALESCE(@required, required),
    default_value = COALESCE(@default_value, default_value),
    options = COALESCE(@options, options),
    metadata = COALESCE(@metadata, metadata),
    version = version + 1,
    updated_at = CURRENT_TIMESTAMP
WHERE id = @id
RETURNING *;

-- name: DeleteFieldTemplate :exec
DELETE FROM field_templates WHERE id = @id;

-- name: GetFieldTemplateVersion :one
SELECT version FROM field_templates WHERE id = @id LIMIT 1;

