-- name: AssignRoleToUser :one
INSERT INTO user_roles (user_id, role_id)
VALUES (@user_id, @role_id)
RETURNING *;

-- name: RemoveRoleFromUser :exec
DELETE FROM user_roles
WHERE user_id = @user_id AND role_id = @role_id;