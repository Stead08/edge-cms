// 各オブジェクトのkeyに対するvalueがundefinedの場合はnullに変換する関数
type UnionUndefinedToNull<T> = T extends undefined ? null : T;
type UndefinedToNull<T> = {
	[Prop in keyof T]-?: T[Prop] extends object
		? UndefinedToNull<T[Prop]>
		: UnionUndefinedToNull<T[Prop]>;
};

export function convertUndefinedToNull<T extends object>(
	obj: T,
): UndefinedToNull<T> {
	const result: Partial<UndefinedToNull<T>> = {};
	for (const [key, value] of Object.entries(obj)) {
		if (value === undefined) {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			result[key as keyof T] = null as any;
		} else if (typeof value === "object" && value !== null) {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			result[key as keyof T] = convertUndefinedToNull(value) as any;
		} else {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			result[key as keyof T] = value as any;
		}
	}
	return result as UndefinedToNull<T>;
}
