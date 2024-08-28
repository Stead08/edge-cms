-- name: CreateCollection :one
INSERT INTO collections (slug, label, description, access, default_sort, list_searchable_fields, pagination, default_limit, max_limit, metadata)
VALUES (@slug, @label, @description, @access, @default_sort, @list_searchable_fields, @pagination, @default_limit, @max_limit, @metadata)
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
    access = COALESCE(@access, access),
    default_sort = COALESCE(@default_sort, default_sort),
    list_searchable_fields = COALESCE(@list_searchable_fields, list_searchable_fields),
    pagination = COALESCE(@pagination, pagination),
    default_limit = COALESCE(@default_limit, default_limit),
    max_limit = COALESCE(@max_limit, max_limit),
    metadata = COALESCE(@metadata, metadata),
    updated_at = CURRENT_TIMESTAMP
WHERE id = @id
RETURNING *;

-- name: DeleteCollection :exec
DELETE FROM collections WHERE id = @id;

-- name: ListCollections :many
SELECT * FROM collections;

-- name: CountCollections :one
SELECT COUNT(id) AS count FROM collections;