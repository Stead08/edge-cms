import { useEffect, useLayoutEffect, useState } from "react";

interface LocalStorageProps<T> {
	key: string;
	defaultValue: T;
}

export default function useLocalStorage<T>({
	key,
	defaultValue,
}: LocalStorageProps<T>) {
	const [value, setValue] = useState<T>(defaultValue);

	useEffect(() => {
		const storedValue = window.localStorage.getItem(key);
		if (storedValue !== null) {
			setValue(JSON.parse(storedValue) as T);
		}
	}, [key]);

	useEffect(() => {
		window.localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);

	return [value, setValue] as const;
}
