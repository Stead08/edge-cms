-- name: CreateItem :one
INSERT INTO items (collection_id, data, version)
VALUES (@collection_id, @data, 1)
RETURNING *;

-- name: GetItem :one
SELECT * FROM items
WHERE id = @id LIMIT 1;

-- name: ListItems :many
SELECT * FROM items
WHERE collection_id = @collection_id
ORDER BY id;

-- name: UpdateItem :one
UPDATE items
SET data = COALESCE(@data, data),
    updated_at = CURRENT_TIMESTAMP
WHERE id = @id
RETURNING *;

-- name: DeleteItem :exec
DELETE FROM items
WHERE id = @id;

-- name: GetItemByCollectionAndId :one
SELECT * FROM items
WHERE collection_id = @collection_id AND id = @id LIMIT 1;

-- name: ListItemsForCollection :many
SELECT * FROM items
WHERE collection_id = @collection_id
ORDER BY created_at DESC
LIMIT @limit OFFSET @offset;

-- name: CountItemsForCollection :one
SELECT COUNT(*) AS count FROM items
WHERE collection_id = @collection_id;
