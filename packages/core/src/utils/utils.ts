import { FieldType } from "../types/fieldTypes";

export function convertFieldTypeToJsonSchema(
	fieldType: FieldType,
	validation: Record<string, unknown> = {},
): object {
	let baseSchema: Record<string, unknown> = {};

	switch (fieldType) {
		case FieldType.TEXT:
			baseSchema = { type: "string" };
			break;
		case FieldType.NUMBER:
			baseSchema = { type: "number" };
			break;
		case FieldType.BOOLEAN:
			baseSchema = { type: "boolean" };
			break;
		case FieldType.DATE:
			baseSchema = { type: "string", format: "date" };
			break;
		case FieldType.EMAIL:
			baseSchema = { type: "string", format: "email" };
			break;
		case FieldType.URL:
			baseSchema = { type: "string", format: "uri" };
			break;
		default:
			baseSchema = { type: "string" };
	}

	// バリデーションルールの適用
	if (validation.minLength) baseSchema.minLength = validation.minLength;
	if (validation.maxLength) baseSchema.maxLength = validation.maxLength;
	if (validation.pattern) baseSchema.pattern = validation.pattern;
	if (validation.minimum) baseSchema.minimum = validation.minimum;
	if (validation.maximum) baseSchema.maximum = validation.maximum;

	return baseSchema;
}
