-- name: CreateItem :one
INSERT INTO items (collection_id)
VALUES (@collection_id)
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
SET updated_at = CURRENT_TIMESTAMP
WHERE id = @id
RETURNING *;

-- name: DeleteItem :exec
DELETE FROM items
WHERE id = @id;
