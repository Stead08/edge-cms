import type {
	CollectionResultsType,
	ItemResultsType,
	WorkspaceResultsType,
} from "@/lib/types";
import { hc } from "hono/client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
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
	deleteCollection: (collectionId: string) => Promise<void>;
	fetchItems: (collectionId: string) => Promise<void>;
	createItem: (
		collectionId: string,
		item: Record<string, unknown>,
	) => Promise<Error | null>;
	editItem: (
		itemId: string,
		collectionId: string,
		item: Record<string, unknown>,
		status?: string,
	) => Promise<Error | null>;
	deleteItem: (itemId: string, collectionId: string) => Promise<void>;
}

export const useStore = create<Store>()(
	persist(
		(set, get) => ({
			workspaces: [],
			selectedWorkspaceId: null,
			collections: [],
			selectedCollection: null,
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
			deleteCollection: async (collectionId) => {
				const { selectedWorkspaceId } = get();
				if (!selectedWorkspaceId) {
					return;
				}
				const res = await client.api.workspaces[":workspace_id"][":id"].$delete(
					{
						param: { workspace_id: selectedWorkspaceId, id: collectionId },
					},
				);
				if (res.ok) {
					get().fetchCollections(selectedWorkspaceId);
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
					return new Error("ワークスペースが選択されていません。");
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
				console.log(res);
				if (res.ok) {
					get().fetchItems(collectionId);
					return null;
				}
				if (res.status === 400) {
					const error = await res.json();
					return new Error(error as string);
				}
				return new Error("アイテムの作成に失敗しました。");
			},
			editItem: async (itemId, collectionId, item, status?) => {
				const { selectedWorkspaceId } = get();
				if (!selectedWorkspaceId) {
					return new Error("ワークスペースが選択されていません。");
				}
				const res = await client.api.workspaces[":workspace_id"][":id"][
					":item_id"
				].$put({
					param: {
						workspace_id: selectedWorkspaceId,
						id: collectionId,
						item_id: itemId,
					},
					// @ts-ignore hono hcの型が間違っている
					json: {
						data: item,
						status: status ?? "draft",
					},
				});
				if (res.ok) {
					get().fetchItems(collectionId);
					return null;
				}
				return new Error("アイテムの編集に失敗しました。");
			},
			deleteItem: async (itemId, collectionId) => {
				const { selectedWorkspaceId } = get();
				if (!selectedWorkspaceId) {
					return;
				}
				const res = await client.api.workspaces[":workspace_id"][":id"][
					":item_id"
				].$delete({
					param: {
						workspace_id: selectedWorkspaceId,
						id: collectionId,
						item_id: itemId,
					},
				});
				if (res.ok) {
					get().fetchItems(collectionId);
				}
			},
		}),
		{
			name: "store-storage",
			storage: createJSONStorage(() => sessionStorage),
			partialize: (state) => ({
				selectedWorkspaceId: state.selectedWorkspaceId,
			}),
		},
	),
);
