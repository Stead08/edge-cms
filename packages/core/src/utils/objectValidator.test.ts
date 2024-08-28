import { convertUndefinedToNull } from "./objectValidator";

describe("convertUndefinedToNull", () => {
	it("should convert undefined to null", () => {
		const obj = { a: "a", b: undefined };
		const result = convertUndefinedToNull(obj);
		expect(result.b).toBe(null);
	});
	it("type check: should convert undefined to null", () => {
		interface A {
			a: string;
			b?: number | undefined;
		}
		const a: A = { a: "a", b: undefined };
		const b = convertUndefinedToNull(a);
		expect(b).toMatchObject({ a: "a", b: null });
		expectTypeOf(b).toMatchTypeOf<{ a: string; b: number | null }>();
	});
});
