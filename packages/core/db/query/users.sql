-- name: CreateUser :one
INSERT INTO users (username, email, password_hash, is_admin)
VALUES (@username, @email, @password_hash, @is_admin)
RETURNING *;

-- name: GetUser :one
SELECT * FROM users
WHERE id = @id LIMIT 1;

-- name: ListUsers :many
SELECT * FROM users
ORDER BY id;

-- name: UpdateUser :one
UPDATE users
SET username = COALESCE(@username, username),
    email = COALESCE(@email, email),
    is_admin = COALESCE(@is_admin, is_admin),
    updated_at = CURRENT_TIMESTAMP
WHERE id = @id
RETURNING *;

-- name: DeleteUser :exec
DELETE FROM users
WHERE id = @id;

-- name: GetUserByEmail :one
SELECT * FROM users
WHERE email = @email LIMIT 1;

-- name: UpdateUserPassword :exec
UPDATE users
SET password_hash = @password_hash, updated_at = CURRENT_TIMESTAMP
WHERE id = @id;