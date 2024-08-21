-- name: CreateRole :one
INSERT INTO roles (name, description, permissions, assume_role_policy)
VALUES (@name, @description, @permissions, @assume_role_policy)
RETURNING *;

-- name: GetRole :one
SELECT * FROM roles
WHERE id = @id LIMIT 1;

-- name: ListRoles :many
SELECT * FROM roles;

-- name: UpdateRole :one
UPDATE roles
SET name = @name, description = @description, permissions = @permissions, assume_role_policy = @assume_role_policy, updated_at = CURRENT_TIMESTAMP
WHERE id = @id
RETURNING *;

-- name: DeleteRole :exec
DELETE FROM roles WHERE id = @id;

-- name: GetUserRoles :many
SELECT r.* FROM roles r
JOIN user_roles ur ON r.id = ur.role_id
WHERE ur.user_id = @user_id;

-- name: HasRole :one
SELECT EXISTS (
  SELECT 1
  FROM user_roles ur
  JOIN roles r ON ur.role_id = r.id
  WHERE ur.user_id = @user_id AND r.name = @role_name
) as has_role;

-- name: UpdateRoleAssumeRolePolicy :one
UPDATE roles
SET assume_role_policy = @assume_role_policy, updated_at = CURRENT_TIMESTAMP
WHERE id = @id
RETURNING *;