export enum FieldType {
	TEXT = "text",
	NUMBER = "number",
	BOOLEAN = "boolean",
	DATE = "date",
	EMAIL = "email",
	URL = "url",
}

export interface FieldTypeConfig {
	type: FieldType;
	validate: (value: unknown) => boolean;
}

export const fieldTypeConfigs: Record<FieldType, FieldTypeConfig> = {
	[FieldType.TEXT]: {
		type: FieldType.TEXT,
		validate: (value: unknown) => typeof value === "string",
	},
	[FieldType.NUMBER]: {
		type: FieldType.NUMBER,
		validate: (value: unknown) =>
			typeof value === "number" && !Number.isNaN(value),
	},
	[FieldType.BOOLEAN]: {
		type: FieldType.BOOLEAN,
		validate: (value: unknown) => typeof value === "boolean",
	},
	[FieldType.DATE]: {
		type: FieldType.DATE,
		validate: (value: unknown) => !Number.isNaN(Date.parse(value as string)),
	},
	[FieldType.EMAIL]: {
		type: FieldType.EMAIL,
		validate: (value: unknown) =>
			typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
	},
	[FieldType.URL]: {
		type: FieldType.URL,
		validate: (value: unknown) => {
			try {
				new URL(value as string);
				return true;
			} catch {
				return false;
			}
		},
	},
};
