-- name: CreateItem :one
INSERT INTO items (id, collection_id, data, status)
VALUES (@id, @collection_id, @data, @status)
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
SET data = COALESCE(@data, data)
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
