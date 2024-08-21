import { Role } from "../types/roleTypes";

export function validateRole(role: string): role is Role {
	return Object.values(Role).includes(role as Role);
}

export function parseRole(role: string): Role {
	if (!validateRole(role)) {
		throw new Error(`Invalid role: ${role}`);
	}
	return role as Role;
}
