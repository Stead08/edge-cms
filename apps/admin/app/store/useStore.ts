import { hc } from "hono/client";
import { create } from "zustand";
import type { AppType } from "../../../sandbox/src/index";

const client = hc<AppType>("");

export interface Collection {
	id: string;
	name: string;
	slug: string;
	schema: Record<string, unknown>;
}

interface Workspace {
	id: string;
	name: string | number;
	slug: string | number;
	createdAt: string | number | null;
	updatedAt: string | number | null;
}

interface Store {
	workspaces: Workspace[];
	selectedWorkspaceId: string | null;
	collections: Collection[];
	items: Record<string, unknown>[];
	setSelectedWorkspaceId: (id: string | null) => void;
	fetchWorkspaces: () => Promise<void>;
	createWorkspace: (name: string, slug: string) => Promise<void>;
	updateWorkspace: (id: string, name: string, slug: string) => Promise<void>;
	deleteWorkspace: (id: string) => Promise<void>;
	fetchCollections: (workspaceId: string) => Promise<void>;
	createCollection: (
		workspaceId: string,
		name: string,
		slug: string,
		schema: Record<string, unknown>,
	) => Promise<void>;
	updateCollection: (
		id: string,
		name: string,
		slug: string,
		schema: Record<string, unknown>,
	) => Promise<void>;
	deleteCollection: (id: string) => Promise<void>;
	fetchItems: (collectionId: string) => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
	workspaces: [],
	selectedWorkspaceId: null,
	collections: [],
	items: [],
	setSelectedWorkspaceId: (id) => set({ selectedWorkspaceId: id }),
	fetchWorkspaces: async () => {
		const res = await client.api.workspaces.$get();
		const workspaces = await res.json();
		set({ workspaces: workspaces.results as Workspace[] });
	},
	createWorkspace: async (name, slug) => {
		const res = await client.api.workspaces.$post({
			json: { name, slug },
		});
		if (res.ok) {
			get().fetchWorkspaces();
		}
	},
	updateWorkspace: async (id, name, slug) => {
		const res = await client.api.workspaces[id].$put({
			json: { name, slug },
		});
		if (res.ok) {
			get().fetchWorkspaces();
		}
	},
	deleteWorkspace: async (id) => {
		const res = await client.api.workspaces[id].$delete();
		if (res.ok) {
			get().fetchWorkspaces();
		}
	},
	fetchCollections: async (workspaceId) => {
		const res = await client.api.collection[":workspace_id"].$get({
			param: { workspace_id: workspaceId },
		});
		const collections = await res.json();
		set({ collections: collections.results });
	},
	createCollection: async (workspaceId, name, slug, schema) => {
		const res = await client.api.workspaces[workspaceId].collections.$post({
			json: { name, slug, schema },
		});
		if (res.ok) {
			get().fetchCollections(workspaceId);
		}
	},
	updateCollection: async (id, name, slug, schema) => {
		const res = await client.api.collections[id].$put({
			json: { name, slug, schema },
		});
		if (res.ok) {
			const { selectedWorkspaceId } = get();
			if (selectedWorkspaceId) {
				get().fetchCollections(selectedWorkspaceId);
			}
		}
	},
	deleteCollection: async (id) => {
		const res = await client.api.collections[id].$delete();
		if (res.ok) {
			const { selectedWorkspaceId } = get();
			if (selectedWorkspaceId) {
				get().fetchCollections(selectedWorkspaceId);
			}
		}
	},
	fetchItems: async (collectionId) => {
		const { selectedWorkspaceId } = get();
		if (!selectedWorkspaceId) {
			return;
		}
		const res = await client.api.workspaces[":workspace_id"][":id"].$get({
			param: { workspace_id: selectedWorkspaceId, id: collectionId },
		});
		console.log(res);
		const items = await res.json();
		set({ items: items.results });
	},
}));
