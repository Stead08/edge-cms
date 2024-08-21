-- name: CreateUser :one
INSERT INTO users (username, email, password_hash, is_admin)
VALUES (@username, @email, @password_hash, COALESCE(@is_admin, false))
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

-- name: GetUserWithRoles :one
SELECT u.*, json_group_array(
  json_object(
    'id', r.id,
    'name', r.name,
    'description', r.description
  )
) as roles
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.id = @id
GROUP BY u.id
LIMIT 1;

-- name: CheckUserPermission :one
SELECT EXISTS (
  SELECT 1
  FROM users u
  JOIN user_roles ur ON u.id = ur.user_id
  JOIN roles r ON ur.role_id = r.id
  WHERE u.id = @user_id
    AND json_extract(r.permissions, '$.actions') LIKE '%' || @action || '%'
    AND json_extract(r.permissions, '$.resources') LIKE '%' || @resource || '%'
) as has_permission;