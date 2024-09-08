import type { ClientResponse } from "hono/client";
import { client } from "./client";

// biome-ignore lint/suspicious/noExplicitAny: utilのためanyを許容
type PromiseType<T extends Promise<any>> = T extends Promise<infer P>
	? P
	: never;

type WorkspaceType = PromiseType<ReturnType<typeof client.api.workspaces.$get>>;

export type WorkspaceResultsType = WorkspaceType extends ClientResponse<
	infer R,
	number,
	string
>
	? R extends { results: infer U }
		? U
		: never
	: never;

const collection = client.api.collection[":workspace_id"].$get({
	param: { workspace_id: "test-workspace_aabbccdd" },
});

type CollectionType = PromiseType<typeof collection>;

export type CollectionResultsType = CollectionType extends ClientResponse<
	infer R,
	number,
	string
>
	? R extends { results: infer U }
		? U
		: never
	: never;

export interface ItemType<T> {
	id: string;
	data: T;
	collectionId: string;
	createdAt: string;
	updatedAt: string;
}

export type ItemResultsType<T> = ItemType<T>[];
