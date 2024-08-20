import { FieldType, fieldTypeConfigs } from "../types/fieldTypes";

export function validateFieldValue(type: FieldType, value: unknown): boolean {
	const config = fieldTypeConfigs[type];
	if (!config) {
		throw new Error(`Invalid field type: ${type}`);
	}
	return config.validate(value);
}

export function validateFieldType(type: string): type is FieldType {
	return Object.values(FieldType).includes(type as FieldType);
}
