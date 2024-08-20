import type { CreateCollectionRow } from "./gen/sqlc/querier";

export function defineCollection(collection: CreateCollectionRow) {
	if (!collection.slug) {
		throw new Error("slug is required");
	}
	if (!collection.label) {
		throw new Error("label is required");
	}
	return collection;
}
