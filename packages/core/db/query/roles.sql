-- name: CreateRole :one
INSERT INTO roles (name, description)
VALUES (@name, @description)
RETURNING *;

-- name: GetRole :one
SELECT * FROM roles
WHERE id = @id LIMIT 1;

-- name: ListRoles :many
SELECT * FROM roles;

-- name: UpdateRole :one
UPDATE roles
SET name = @name, description = @description, updated_at = CURRENT_TIMESTAMP
WHERE id = @id
RETURNING *;

-- name: DeleteRole :exec
DELETE FROM roles WHERE id = @id;

-- name: GetUserRoles :many
SELECT r.* FROM roles r
JOIN user_roles ur ON r.id = ur.role_id
WHERE ur.user_id = @user_id;