-- name: CreateItem :one
INSERT INTO items (collection_id, status)
VALUES (@collection_id, @status)
RETURNING *;

-- name: GetItem :one
SELECT * FROM items
WHERE id = @id LIMIT 1;

-- name: ListItems :many
SELECT * FROM items
WHERE collection_id = @collection_id AND (status = @status OR @status IS NULL)
ORDER BY id;

-- name: UpdateItem :one
UPDATE items
SET status = @status, updated_at = CURRENT_TIMESTAMP
WHERE id = @id
RETURNING *;

-- name: DeleteItem :exec
DELETE FROM items
WHERE id = @id;

-- name: GetFieldValuesForItem :many
SELECT * FROM field_values
WHERE item_id = @item_id;

-- name: GetFieldsForCollection :many
SELECT * FROM fields
WHERE collection_id = @collection_id;

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