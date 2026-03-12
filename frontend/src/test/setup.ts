import "@testing-library/jest-dom";

type StorageMock = {
	clear: () => void;
	getItem: (key: string) => string | null;
	key: (index: number) => string | null;
	removeItem: (key: string) => void;
	setItem: (key: string, value: string) => void;
	readonly length: number;
};

function createStorageMock(): StorageMock {
	const store = new Map<string, string>();

	return {
		clear: () => {
			store.clear();
		},
		getItem: (key: string) => store.get(String(key)) ?? null,
		key: (index: number) => Array.from(store.keys())[index] ?? null,
		removeItem: (key: string) => {
			store.delete(String(key));
		},
		setItem: (key: string, value: string) => {
			store.set(String(key), String(value));
		},
		get length() {
			return store.size;
		},
	};
}

function ensureStorage(name: "localStorage" | "sessionStorage") {
	const storage = globalThis[name] as Partial<StorageMock> | undefined;

	if (
		storage &&
		typeof storage.clear === "function" &&
		typeof storage.getItem === "function" &&
		typeof storage.setItem === "function" &&
		typeof storage.removeItem === "function"
	) {
		return;
	}

	Object.defineProperty(globalThis, name, {
		configurable: true,
		writable: true,
		value: createStorageMock(),
	});
}

ensureStorage("localStorage");
ensureStorage("sessionStorage");
