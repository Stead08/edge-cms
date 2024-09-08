import type {
	CollectionResultsType,
	ItemResultsType,
	WorkspaceResultsType,
} from "@/lib/types";
import { hc } from "hono/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppType } from "../../../sandbox/src/index";

const client = hc<AppType>("");

interface Store {
	workspaces: WorkspaceResultsType;
	selectedWorkspaceId: string | null;
	collections: CollectionResultsType;
	// biome-ignore lint/suspicious/noExplicitAny: 一旦anyだが後でパズルする
	items: ItemResultsType<any>;
	setSelectedWorkspaceId: (id: string | null) => void;
	fetchWorkspaces: () => Promise<void>;
	createWorkspace: (name: string, slug: string) => Promise<void>;
	fetchCollections: (workspaceId: string) => Promise<void>;
	createCollection: (
		workspaceId: string,
		name: string,
		slug: string,
		schema: Record<string, unknown>,
	) => Promise<void>;
	fetchItems: (collectionId: string) => Promise<void>;
	createItem: (
		collectionId: string,
		item: Record<string, unknown>,
	) => Promise<void>;
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
		set({ workspaces: workspaces.results });
	},
	createWorkspace: async (name, slug) => {
		const res = await client.api.workspaces.$post({
			json: { name, slug },
		});
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
		const res = await client.api.collection.$post({
			json: { workspace_id: workspaceId, name, slug, schema },
		});
		if (res.ok) {
			get().fetchCollections(workspaceId);
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
		if (res.ok) {
			const items = await res.json();
			// biome-ignore lint/suspicious/noExplicitAny: 一旦anyだが後でパズルする
			set({ items: items.results as ItemResultsType<any> });
		}
	},
	createItem: async (collectionId, item) => {
		const { selectedWorkspaceId } = get();
		if (!selectedWorkspaceId) {
			return;
		}
		const res = await fetch(
			`/api/workspaces/${selectedWorkspaceId}/${collectionId}/items`,
			{
				method: "POST",
				body: JSON.stringify({
					collection_id: collectionId,
					data: item,
					status: "draft",
				}),
			},
		);
		if (res.ok) {
			get().fetchItems(collectionId);
		}
	},
}));
