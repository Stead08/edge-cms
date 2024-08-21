export enum Role {
	VIEWER = "Viewer",
	EDITOR = "Editor",
	ADMIN = "Admin",
}

export interface RoleTypeConfig {
	type: Role;
	validate: (value: unknown) => boolean;
}

export const roleTypeConfigs: Record<Role, RoleTypeConfig> = {
	[Role.VIEWER]: {
		type: Role.VIEWER,
		validate: (value: unknown) => typeof value === "string",
	},
	[Role.EDITOR]: {
		type: Role.EDITOR,
		validate: (value: unknown) => typeof value === "string",
	},
	[Role.ADMIN]: {
		type: Role.ADMIN,
		validate: (value: unknown) => typeof value === "string",
	},
};
