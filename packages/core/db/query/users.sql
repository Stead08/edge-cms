-- name: CreateUser :one
INSERT INTO users (id, name, email, passwordhash)
VALUES (@id, @name, @email, @passwordhash)
RETURNING *;

-- name: GetUser :one
SELECT id, name, email FROM users
WHERE id = @id LIMIT 1;

-- name: GetUserWithPasswordHash :one
SELECT * FROM users
WHERE id = @id LIMIT 1;

-- name: ListUsers :many
SELECT id, name, email FROM users
ORDER BY id;

-- name: UpdateUser :one
UPDATE users
SET name = COALESCE(@name, name),
    email = COALESCE(@email, email),
    passwordhash = COALESCE(@passwordhash, passwordhash)
WHERE id = @id
RETURNING id, name, email;

-- name: DeleteUser :exec
DELETE FROM users
WHERE id = @id;

-- name: GetUserByEmail :one
SELECT id, name, email FROM users
WHERE email = @email LIMIT 1;

-- name: GetUserWithRoles :one
SELECT u.id, u.name, u.email, json_group_array(
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