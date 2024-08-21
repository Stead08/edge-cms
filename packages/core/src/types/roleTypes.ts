export interface Policy {
	id: number;
	name: string;
	description: string;
	permissions: {
		actions: string[];
		resources: string[];
	};
}

export interface Role {
	id: number;
	name: string;
	description: string;
	assumeRolePolicy: {
		effect: "Allow" | "Deny";
		principal: {
			service?: string[];
			user?: string[];
		};
		action: string[];
	};
}

export interface RoleWithPolicies extends Role {
	policies: Policy[];
}
