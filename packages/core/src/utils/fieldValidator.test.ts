import { FieldType } from "../types/fieldTypes";
import { validateFieldValue } from "./fieldValidator";

describe("fieldValidator", () => {
	it("should validate a field value with text type", () => {
		expect(validateFieldValue(FieldType.TEXT, "test")).toBe(true);
	});
	it("should validate a field value with number type", () => {
		expect(validateFieldValue(FieldType.NUMBER, 1)).toBe(true);
	});
	it("should validate a field value with boolean type", () => {
		expect(validateFieldValue(FieldType.BOOLEAN, true)).toBe(true);
	});
	it("should validate a field value with date type", () => {
		expect(validateFieldValue(FieldType.DATE, new Date())).toBe(true);
	});
	it("should validate a field value with email type", () => {
		expect(validateFieldValue(FieldType.EMAIL, "test@example.com")).toBe(true);
	});
	it("should validate a field value with url type", () => {
		expect(validateFieldValue(FieldType.URL, "https://example.com")).toBe(true);
	});
	it("should not validate a field value with invalid text", () => {
		expect(validateFieldValue(FieldType.TEXT, 1)).toBe(false);
	});
	it("should not validate a field value with invalid number", () => {
		expect(validateFieldValue(FieldType.NUMBER, "test")).toBe(false);
	});
	it("should not validate a field value with invalid boolean", () => {
		expect(validateFieldValue(FieldType.BOOLEAN, "test")).toBe(false);
	});
	it("should not validate a field value with invalid date", () => {
		expect(validateFieldValue(FieldType.DATE, "test")).toBe(false);
	});
	it("should not validate a field value with invalid email", () => {
		expect(validateFieldValue(FieldType.EMAIL, "test@example")).toBe(false);
	});
	it("should not validate a field value with invalid url", () => {
		expect(validateFieldValue(FieldType.URL, "example.com")).toBe(false);
	});
});
