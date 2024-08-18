// Code generated by sqlc-gen-ts-d1. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
//   sqlc-gen-ts-d1 v0.0.0-a@dfd4bfef4736967ca17cc23d18de20920fbd196998fe7aa191a205439d63fb58

import {
	D1Database,
	D1PreparedStatement,
	D1Result,
} from "@cloudflare/workers-types/experimental";

type Query<T> = {
	then(
		onFulfilled?: (value: T) => void,
		onRejected?: (reason?: any) => void,
	): void;
	batch(): D1PreparedStatement;
};
const getContentTypeQuery = `-- name: GetContentType :one
SELECT id, name, description, created_at, updated_at FROM content_types
WHERE id = ?1 LIMIT 1`;

export type GetContentTypeParams = {
	id: number | string;
};

export type GetContentTypeRow = {
	id: number | string;
	name: number | string;
	description: string | null;
	createdAt: number | string | null;
	updatedAt: number | string | null;
};

type RawGetContentTypeRow = {
	id: number | string;
	name: number | string;
	description: string | null;
	created_at: number | string | null;
	updated_at: number | string | null;
};

export function getContentType(
	d1: D1Database,
	args: GetContentTypeParams,
): Query<GetContentTypeRow | null> {
	const ps = d1.prepare(getContentTypeQuery).bind(args.id);
	return {
		then(
			onFulfilled?: (value: GetContentTypeRow | null) => void,
			onRejected?: (reason?: any) => void,
		) {
			ps.first<RawGetContentTypeRow | null>()
				.then((raw: RawGetContentTypeRow | null) =>
					raw
						? {
								id: raw.id,
								name: raw.name,
								description: raw.description,
								createdAt: raw.created_at,
								updatedAt: raw.updated_at,
							}
						: null,
				)
				.then(onFulfilled)
				.catch(onRejected);
		},
		batch() {
			return ps;
		},
	};
}

const listContentTypesQuery = `-- name: ListContentTypes :many
SELECT id, name, description, created_at, updated_at FROM content_types
ORDER BY id`;

export type ListContentTypesRow = {
	id: number | string;
	name: number | string;
	description: string | null;
	createdAt: number | string | null;
	updatedAt: number | string | null;
};

type RawListContentTypesRow = {
	id: number | string;
	name: number | string;
	description: string | null;
	created_at: number | string | null;
	updated_at: number | string | null;
};

export function listContentTypes(
	d1: D1Database,
	p0: {},
): Query<D1Result<ListContentTypesRow>> {
	const ps = d1.prepare(listContentTypesQuery);
	return {
		then(
			onFulfilled?: (value: D1Result<ListContentTypesRow>) => void,
			onRejected?: (reason?: any) => void,
		) {
			ps.all<RawListContentTypesRow>()
				.then((r: D1Result<RawListContentTypesRow>) => {
					return {
						...r,
						results: r.results.map((raw: RawListContentTypesRow) => {
							return {
								id: raw.id,
								name: raw.name,
								description: raw.description,
								createdAt: raw.created_at,
								updatedAt: raw.updated_at,
							};
						}),
					};
				})
				.then(onFulfilled)
				.catch(onRejected);
		},
		batch() {
			return ps;
		},
	};
}

const updateContentTypeQuery = `-- name: UpdateContentType :one
UPDATE content_types
SET name = ?1, description = ?2, updated_at = CURRENT_TIMESTAMP
WHERE id = ?3
RETURNING id, name, description, created_at, updated_at`;

export type UpdateContentTypeParams = {
	name: number | string;
	description: string | null;
	id: number | string;
};

export type UpdateContentTypeRow = {
	id: number | string;
	name: number | string;
	description: string | null;
	createdAt: number | string | null;
	updatedAt: number | string | null;
};

type RawUpdateContentTypeRow = {
	id: number | string;
	name: number | string;
	description: string | null;
	created_at: number | string | null;
	updated_at: number | string | null;
};

export function updateContentType(
	d1: D1Database,
	args: UpdateContentTypeParams,
): Query<UpdateContentTypeRow | null> {
	const ps = d1
		.prepare(updateContentTypeQuery)
		.bind(args.name, args.description, args.id);
	return {
		then(
			onFulfilled?: (value: UpdateContentTypeRow | null) => void,
			onRejected?: (reason?: any) => void,
		) {
			ps.first<RawUpdateContentTypeRow | null>()
				.then((raw: RawUpdateContentTypeRow | null) =>
					raw
						? {
								id: raw.id,
								name: raw.name,
								description: raw.description,
								createdAt: raw.created_at,
								updatedAt: raw.updated_at,
							}
						: null,
				)
				.then(onFulfilled)
				.catch(onRejected);
		},
		batch() {
			return ps;
		},
	};
}

const deleteContentTypeQuery = `-- name: DeleteContentType :exec
DELETE FROM content_types
WHERE id = ?1`;

export type DeleteContentTypeParams = {
	id: number | string;
};

export function deleteContentType(
	d1: D1Database,
	args: DeleteContentTypeParams,
): Query<D1Result> {
	const ps = d1.prepare(deleteContentTypeQuery).bind(args.id);
	return {
		then(
			onFulfilled?: (value: D1Result) => void,
			onRejected?: (reason?: any) => void,
		) {
			ps.run().then(onFulfilled).catch(onRejected);
		},
		batch() {
			return ps;
		},
	};
}

const createEntryQuery = `-- name: CreateEntry :one
INSERT INTO entries (content_type_id, created_by)
VALUES (?1, ?2)
RETURNING id, content_type_id, created_by, created_at, updated_at`;

export type CreateEntryParams = {
	contentTypeId: number | null;
	createdBy: number | null;
};

export type CreateEntryRow = {
	id: number | string;
	contentTypeId: number | null;
	createdBy: number | null;
	createdAt: number | string | null;
	updatedAt: number | string | null;
};

type RawCreateEntryRow = {
	id: number | string;
	content_type_id: number | null;
	created_by: number | null;
	created_at: number | string | null;
	updated_at: number | string | null;
};

export function createEntry(
	d1: D1Database,
	args: CreateEntryParams,
): Query<CreateEntryRow | null> {
	const ps = d1
		.prepare(createEntryQuery)
		.bind(args.contentTypeId, args.createdBy);
	return {
		then(
			onFulfilled?: (value: CreateEntryRow | null) => void,
			onRejected?: (reason?: any) => void,
		) {
			ps.first<RawCreateEntryRow | null>()
				.then((raw: RawCreateEntryRow | null) =>
					raw
						? {
								id: raw.id,
								contentTypeId: raw.content_type_id,
								createdBy: raw.created_by,
								createdAt: raw.created_at,
								updatedAt: raw.updated_at,
							}
						: null,
				)
				.then(onFulfilled)
				.catch(onRejected);
		},
		batch() {
			return ps;
		},
	};
}

const getEntryQuery = `-- name: GetEntry :one
SELECT id, content_type_id, created_by, created_at, updated_at FROM entries
WHERE id = ?1 LIMIT 1`;

export type GetEntryParams = {
	id: number | string;
};

export type GetEntryRow = {
	id: number | string;
	contentTypeId: number | null;
	createdBy: number | null;
	createdAt: number | string | null;
	updatedAt: number | string | null;
};

type RawGetEntryRow = {
	id: number | string;
	content_type_id: number | null;
	created_by: number | null;
	created_at: number | string | null;
	updated_at: number | string | null;
};

export function getEntry(
	d1: D1Database,
	args: GetEntryParams,
): Query<GetEntryRow | null> {
	const ps = d1.prepare(getEntryQuery).bind(args.id);
	return {
		then(
			onFulfilled?: (value: GetEntryRow | null) => void,
			onRejected?: (reason?: any) => void,
		) {
			ps.first<RawGetEntryRow | null>()
				.then((raw: RawGetEntryRow | null) =>
					raw
						? {
								id: raw.id,
								contentTypeId: raw.content_type_id,
								createdBy: raw.created_by,
								createdAt: raw.created_at,
								updatedAt: raw.updated_at,
							}
						: null,
				)
				.then(onFulfilled)
				.catch(onRejected);
		},
		batch() {
			return ps;
		},
	};
}

const listEntriesQuery = `-- name: ListEntries :many
SELECT id, content_type_id, created_by, created_at, updated_at FROM entries
WHERE content_type_id = ?1
ORDER BY id`;

export type ListEntriesParams = {
	contentTypeId: number | null;
};

export type ListEntriesRow = {
	id: number | string;
	contentTypeId: number | null;
	createdBy: number | null;
	createdAt: number | string | null;
	updatedAt: number | string | null;
};

type RawListEntriesRow = {
	id: number | string;
	content_type_id: number | null;
	created_by: number | null;
	created_at: number | string | null;
	updated_at: number | string | null;
};

export function listEntries(
	d1: D1Database,
	args: ListEntriesParams,
): Query<D1Result<ListEntriesRow>> {
	const ps = d1.prepare(listEntriesQuery).bind(args.contentTypeId);
	return {
		then(
			onFulfilled?: (value: D1Result<ListEntriesRow>) => void,
			onRejected?: (reason?: any) => void,
		) {
			ps.all<RawListEntriesRow>()
				.then((r: D1Result<RawListEntriesRow>) => {
					return {
						...r,
						results: r.results.map((raw: RawListEntriesRow) => {
							return {
								id: raw.id,
								contentTypeId: raw.content_type_id,
								createdBy: raw.created_by,
								createdAt: raw.created_at,
								updatedAt: raw.updated_at,
							};
						}),
					};
				})
				.then(onFulfilled)
				.catch(onRejected);
		},
		batch() {
			return ps;
		},
	};
}

const updateEntryQuery = `-- name: UpdateEntry :one
UPDATE entries
SET updated_at = CURRENT_TIMESTAMP
WHERE id = ?1
RETURNING id, content_type_id, created_by, created_at, updated_at`;

export type UpdateEntryParams = {
	id: number | string;
};

export type UpdateEntryRow = {
	id: number | string;
	contentTypeId: number | null;
	createdBy: number | null;
	createdAt: number | string | null;
	updatedAt: number | string | null;
};

type RawUpdateEntryRow = {
	id: number | string;
	content_type_id: number | null;
	created_by: number | null;
	created_at: number | string | null;
	updated_at: number | string | null;
};

export function updateEntry(
	d1: D1Database,
	args: UpdateEntryParams,
): Query<UpdateEntryRow | null> {
	const ps = d1.prepare(updateEntryQuery).bind(args.id);
	return {
		then(
			onFulfilled?: (value: UpdateEntryRow | null) => void,
			onRejected?: (reason?: any) => void,
		) {
			ps.first<RawUpdateEntryRow | null>()
				.then((raw: RawUpdateEntryRow | null) =>
					raw
						? {
								id: raw.id,
								contentTypeId: raw.content_type_id,
								createdBy: raw.created_by,
								createdAt: raw.created_at,
								updatedAt: raw.updated_at,
							}
						: null,
				)
				.then(onFulfilled)
				.catch(onRejected);
		},
		batch() {
			return ps;
		},
	};
}

const deleteEntryQuery = `-- name: DeleteEntry :exec
DELETE FROM entries
WHERE id = ?1`;

export type DeleteEntryParams = {
	id: number | string;
};

export function deleteEntry(
	d1: D1Database,
	args: DeleteEntryParams,
): Query<D1Result> {
	const ps = d1.prepare(deleteEntryQuery).bind(args.id);
	return {
		then(
			onFulfilled?: (value: D1Result) => void,
			onRejected?: (reason?: any) => void,
		) {
			ps.run().then(onFulfilled).catch(onRejected);
		},
		batch() {
			return ps;
		},
	};
}

const createFieldValueQuery = `-- name: CreateFieldValue :one
INSERT INTO field_values (entry_id, field_id, value)
VALUES (?1, ?2, ?3)
RETURNING id, entry_id, field_id, value, created_at, updated_at`;

export type CreateFieldValueParams = {
	entryId: number | null;
	fieldId: number | null;
	value: string | null;
};

export type CreateFieldValueRow = {
	id: number | string;
	entryId: number | null;
	fieldId: number | null;
	value: string | null;
	createdAt: number | string | null;
	updatedAt: number | string | null;
};

type RawCreateFieldValueRow = {
	id: number | string;
	entry_id: number | null;
	field_id: number | null;
	value: string | null;
	created_at: number | string | null;
	updated_at: number | string | null;
};

export function createFieldValue(
	d1: D1Database,
	args: CreateFieldValueParams,
): Query<CreateFieldValueRow | null> {
	const ps = d1
		.prepare(createFieldValueQuery)
		.bind(args.entryId, args.fieldId, args.value);
	return {
		then(
			onFulfilled?: (value: CreateFieldValueRow | null) => void,
			onRejected?: (reason?: any) => void,
		) {
			ps.first<RawCreateFieldValueRow | null>()
				.then((raw: RawCreateFieldValueRow | null) =>
					raw
						? {
								id: raw.id,
								entryId: raw.entry_id,
								fieldId: raw.field_id,
								value: raw.value,
								createdAt: raw.created_at,
								updatedAt: raw.updated_at,
							}
						: null,
				)
				.then(onFulfilled)
				.catch(onRejected);
		},
		batch() {
			return ps;
		},
	};
}

const getFieldValueQuery = `-- name: GetFieldValue :one
SELECT id, entry_id, field_id, value, created_at, updated_at FROM field_values
WHERE id = ?1 LIMIT 1`;

export type GetFieldValueParams = {
	id: number | string;
};

export type GetFieldValueRow = {
	id: number | string;
	entryId: number | null;
	fieldId: number | null;
	value: string | null;
	createdAt: number | string | null;
	updatedAt: number | string | null;
};

type RawGetFieldValueRow = {
	id: number | string;
	entry_id: number | null;
	field_id: number | null;
	value: string | null;
	created_at: number | string | null;
	updated_at: number | string | null;
};

export function getFieldValue(
	d1: D1Database,
	args: GetFieldValueParams,
): Query<GetFieldValueRow | null> {
	const ps = d1.prepare(getFieldValueQuery).bind(args.id);
	return {
		then(
			onFulfilled?: (value: GetFieldValueRow | null) => void,
			onRejected?: (reason?: any) => void,
		) {
			ps.first<RawGetFieldValueRow | null>()
				.then((raw: RawGetFieldValueRow | null) =>
					raw
						? {
								id: raw.id,
								entryId: raw.entry_id,
								fieldId: raw.field_id,
								value: raw.value,
								createdAt: raw.created_at,
								updatedAt: raw.updated_at,
							}
						: null,
				)
				.then(onFulfilled)
				.catch(onRejected);
		},
		batch() {
			return ps;
		},
	};
}

const listFieldValuesQuery = `-- name: ListFieldValues :many
SELECT id, entry_id, field_id, value, created_at, updated_at FROM field_values
WHERE entry_id = ?1
ORDER BY id`;

export type ListFieldValuesParams = {
	entryId: number | null;
};

export type ListFieldValuesRow = {
	id: number | string;
	entryId: number | null;
	fieldId: number | null;
	value: string | null;
	createdAt: number | string | null;
	updatedAt: number | string | null;
};

type RawListFieldValuesRow = {
	id: number | string;
	entry_id: number | null;
	field_id: number | null;
	value: string | null;
	created_at: number | string | null;
	updated_at: number | string | null;
};

export function listFieldValues(
	d1: D1Database,
	args: ListFieldValuesParams,
): Query<D1Result<ListFieldValuesRow>> {
	const ps = d1.prepare(listFieldValuesQuery).bind(args.entryId);
	return {
		then(
			onFulfilled?: (value: D1Result<ListFieldValuesRow>) => void,
			onRejected?: (reason?: any) => void,
		) {
			ps.all<RawListFieldValuesRow>()
				.then((r: D1Result<RawListFieldValuesRow>) => {
					return {
						...r,
						results: r.results.map((raw: RawListFieldValuesRow) => {
							return {
								id: raw.id,
								entryId: raw.entry_id,
								fieldId: raw.field_id,
								value: raw.value,
								createdAt: raw.created_at,
								updatedAt: raw.updated_at,
							};
						}),
					};
				})
				.then(onFulfilled)
				.catch(onRejected);
		},
		batch() {
			return ps;
		},
	};
}

const updateFieldValueQuery = `-- name: UpdateFieldValue :one
UPDATE field_values
SET value = ?1, updated_at = CURRENT_TIMESTAMP
WHERE id = ?2
RETURNING id, entry_id, field_id, value, created_at, updated_at`;

export type UpdateFieldValueParams = {
	value: string | null;
	id: number | string;
};

export type UpdateFieldValueRow = {
	id: number | string;
	entryId: number | null;
	fieldId: number | null;
	value: string | null;
	createdAt: number | string | null;
	updatedAt: number | string | null;
};

type RawUpdateFieldValueRow = {
	id: number | string;
	entry_id: number | null;
	field_id: number | null;
	value: string | null;
	created_at: number | string | null;
	updated_at: number | string | null;
};

export function updateFieldValue(
	d1: D1Database,
	args: UpdateFieldValueParams,
): Query<UpdateFieldValueRow | null> {
	const ps = d1.prepare(updateFieldValueQuery).bind(args.value, args.id);
	return {
		then(
			onFulfilled?: (value: UpdateFieldValueRow | null) => void,
			onRejected?: (reason?: any) => void,
		) {
			ps.first<RawUpdateFieldValueRow | null>()
				.then((raw: RawUpdateFieldValueRow | null) =>
					raw
						? {
								id: raw.id,
								entryId: raw.entry_id,
								fieldId: raw.field_id,
								value: raw.value,
								createdAt: raw.created_at,
								updatedAt: raw.updated_at,
							}
						: null,
				)
				.then(onFulfilled)
				.catch(onRejected);
		},
		batch() {
			return ps;
		},
	};
}

const deleteFieldValueQuery = `-- name: DeleteFieldValue :exec
DELETE FROM field_values
WHERE id = ?1`;

export type DeleteFieldValueParams = {
	id: number | string;
};

export function deleteFieldValue(
	d1: D1Database,
	args: DeleteFieldValueParams,
): Query<D1Result> {
	const ps = d1.prepare(deleteFieldValueQuery).bind(args.id);
	return {
		then(
			onFulfilled?: (value: D1Result) => void,
			onRejected?: (reason?: any) => void,
		) {
			ps.run().then(onFulfilled).catch(onRejected);
		},
		batch() {
			return ps;
		},
	};
}

const createFieldQuery = `-- name: CreateField :one
INSERT INTO fields (content_type_id, name, type, required)
VALUES (?1, ?2, ?3, ?4)
RETURNING id, content_type_id, name, type, required, created_at, updated_at`;

export type CreateFieldParams = {
	contentTypeId: number | null;
	name: number | string;
	type: number | string;
	required: number | string | null;
};

export type CreateFieldRow = {
	id: number | string;
	contentTypeId: number | null;
	name: number | string;
	type: number | string;
	required: number | string | null;
	createdAt: number | string | null;
	updatedAt: number | string | null;
};

type RawCreateFieldRow = {
	id: number | string;
	content_type_id: number | null;
	name: number | string;
	type: number | string;
	required: number | string | null;
	created_at: number | string | null;
	updated_at: number | string | null;
};

export function createField(
	d1: D1Database,
	args: CreateFieldParams,
): Query<CreateFieldRow | null> {
	const ps = d1
		.prepare(createFieldQuery)
		.bind(args.contentTypeId, args.name, args.type, args.required);
	return {
		then(
			onFulfilled?: (value: CreateFieldRow | null) => void,
			onRejected?: (reason?: any) => void,
		) {
			ps.first<RawCreateFieldRow | null>()
				.then((raw: RawCreateFieldRow | null) =>
					raw
						? {
								id: raw.id,
								contentTypeId: raw.content_type_id,
								name: raw.name,
								type: raw.type,
								required: raw.required,
								createdAt: raw.created_at,
								updatedAt: raw.updated_at,
							}
						: null,
				)
				.then(onFulfilled)
				.catch(onRejected);
		},
		batch() {
			return ps;
		},
	};
}

const getFieldQuery = `-- name: GetField :one
SELECT id, content_type_id, name, type, required, created_at, updated_at FROM fields
WHERE id = ?1 LIMIT 1`;

export type GetFieldParams = {
	id: number | string;
};

export type GetFieldRow = {
	id: number | string;
	contentTypeId: number | null;
	name: number | string;
	type: number | string;
	required: number | string | null;
	createdAt: number | string | null;
	updatedAt: number | string | null;
};

type RawGetFieldRow = {
	id: number | string;
	content_type_id: number | null;
	name: number | string;
	type: number | string;
	required: number | string | null;
	created_at: number | string | null;
	updated_at: number | string | null;
};

export function getField(
	d1: D1Database,
	args: GetFieldParams,
): Query<GetFieldRow | null> {
	const ps = d1.prepare(getFieldQuery).bind(args.id);
	return {
		then(
			onFulfilled?: (value: GetFieldRow | null) => void,
			onRejected?: (reason?: any) => void,
		) {
			ps.first<RawGetFieldRow | null>()
				.then((raw: RawGetFieldRow | null) =>
					raw
						? {
								id: raw.id,
								contentTypeId: raw.content_type_id,
								name: raw.name,
								type: raw.type,
								required: raw.required,
								createdAt: raw.created_at,
								updatedAt: raw.updated_at,
							}
						: null,
				)
				.then(onFulfilled)
				.catch(onRejected);
		},
		batch() {
			return ps;
		},
	};
}

const listFieldsQuery = `-- name: ListFields :many
SELECT id, content_type_id, name, type, required, created_at, updated_at FROM fields
WHERE content_type_id = ?1
ORDER BY id`;

export type ListFieldsParams = {
	contentTypeId: number | null;
};

export type ListFieldsRow = {
	id: number | string;
	contentTypeId: number | null;
	name: number | string;
	type: number | string;
	required: number | string | null;
	createdAt: number | string | null;
	updatedAt: number | string | null;
};

type RawListFieldsRow = {
	id: number | string;
	content_type_id: number | null;
	name: number | string;
	type: number | string;
	required: number | string | null;
	created_at: number | string | null;
	updated_at: number | string | null;
};

export function listFields(
	d1: D1Database,
	args: ListFieldsParams,
): Query<D1Result<ListFieldsRow>> {
	const ps = d1.prepare(listFieldsQuery).bind(args.contentTypeId);
	return {
		then(
			onFulfilled?: (value: D1Result<ListFieldsRow>) => void,
			onRejected?: (reason?: any) => void,
		) {
			ps.all<RawListFieldsRow>()
				.then((r: D1Result<RawListFieldsRow>) => {
					return {
						...r,
						results: r.results.map((raw: RawListFieldsRow) => {
							return {
								id: raw.id,
								contentTypeId: raw.content_type_id,
								name: raw.name,
								type: raw.type,
								required: raw.required,
								createdAt: raw.created_at,
								updatedAt: raw.updated_at,
							};
						}),
					};
				})
				.then(onFulfilled)
				.catch(onRejected);
		},
		batch() {
			return ps;
		},
	};
}

const updateFieldQuery = `-- name: UpdateField :one
UPDATE fields
SET name = ?1, type = ?2, required = ?3, updated_at = CURRENT_TIMESTAMP
WHERE id = ?4
RETURNING id, content_type_id, name, type, required, created_at, updated_at`;

export type UpdateFieldParams = {
	name: number | string;
	type: number | string;
	required: number | string | null;
	id: number | string;
};

export type UpdateFieldRow = {
	id: number | string;
	contentTypeId: number | null;
	name: number | string;
	type: number | string;
	required: number | string | null;
	createdAt: number | string | null;
	updatedAt: number | string | null;
};

type RawUpdateFieldRow = {
	id: number | string;
	content_type_id: number | null;
	name: number | string;
	type: number | string;
	required: number | string | null;
	created_at: number | string | null;
	updated_at: number | string | null;
};

export function updateField(
	d1: D1Database,
	args: UpdateFieldParams,
): Query<UpdateFieldRow | null> {
	const ps = d1
		.prepare(updateFieldQuery)
		.bind(args.name, args.type, args.required, args.id);
	return {
		then(
			onFulfilled?: (value: UpdateFieldRow | null) => void,
			onRejected?: (reason?: any) => void,
		) {
			ps.first<RawUpdateFieldRow | null>()
				.then((raw: RawUpdateFieldRow | null) =>
					raw
						? {
								id: raw.id,
								contentTypeId: raw.content_type_id,
								name: raw.name,
								type: raw.type,
								required: raw.required,
								createdAt: raw.created_at,
								updatedAt: raw.updated_at,
							}
						: null,
				)
				.then(onFulfilled)
				.catch(onRejected);
		},
		batch() {
			return ps;
		},
	};
}

const deleteFieldQuery = `-- name: DeleteField :exec
DELETE FROM fields
WHERE id = ?1`;

export type DeleteFieldParams = {
	id: number | string;
};

export function deleteField(
	d1: D1Database,
	args: DeleteFieldParams,
): Query<D1Result> {
	const ps = d1.prepare(deleteFieldQuery).bind(args.id);
	return {
		then(
			onFulfilled?: (value: D1Result) => void,
			onRejected?: (reason?: any) => void,
		) {
			ps.run().then(onFulfilled).catch(onRejected);
		},
		batch() {
			return ps;
		},
	};
}

const createUserQuery = `-- name: CreateUser :one
INSERT INTO users (username, email, password_hash)
VALUES (?1, ?2, ?3)
RETURNING id, username, email, password_hash, created_at, updated_at`;

export type CreateUserParams = {
	username: number | string;
	email: number | string;
	passwordHash: number | string;
};

export type CreateUserRow = {
	id: number | string;
	username: number | string;
	email: number | string;
	passwordHash: number | string;
	createdAt: number | string | null;
	updatedAt: number | string | null;
};

type RawCreateUserRow = {
	id: number | string;
	username: number | string;
	email: number | string;
	password_hash: number | string;
	created_at: number | string | null;
	updated_at: number | string | null;
};

export function createUser(
	d1: D1Database,
	args: CreateUserParams,
): Query<CreateUserRow | null> {
	const ps = d1
		.prepare(createUserQuery)
		.bind(args.username, args.email, args.passwordHash);
	return {
		then(
			onFulfilled?: (value: CreateUserRow | null) => void,
			onRejected?: (reason?: any) => void,
		) {
			ps.first<RawCreateUserRow | null>()
				.then((raw: RawCreateUserRow | null) =>
					raw
						? {
								id: raw.id,
								username: raw.username,
								email: raw.email,
								passwordHash: raw.password_hash,
								createdAt: raw.created_at,
								updatedAt: raw.updated_at,
							}
						: null,
				)
				.then(onFulfilled)
				.catch(onRejected);
		},
		batch() {
			return ps;
		},
	};
}

const getUserQuery = `-- name: GetUser :one
SELECT id, username, email, password_hash, created_at, updated_at FROM users
WHERE id = ?1 LIMIT 1`;

export type GetUserParams = {
	id: number | string;
};

export type GetUserRow = {
	id: number | string;
	username: number | string;
	email: number | string;
	passwordHash: number | string;
	createdAt: number | string | null;
	updatedAt: number | string | null;
};

type RawGetUserRow = {
	id: number | string;
	username: number | string;
	email: number | string;
	password_hash: number | string;
	created_at: number | string | null;
	updated_at: number | string | null;
};

export function getUser(
	d1: D1Database,
	args: GetUserParams,
): Query<GetUserRow | null> {
	const ps = d1.prepare(getUserQuery).bind(args.id);
	return {
		then(
			onFulfilled?: (value: GetUserRow | null) => void,
			onRejected?: (reason?: any) => void,
		) {
			ps.first<RawGetUserRow | null>()
				.then((raw: RawGetUserRow | null) =>
					raw
						? {
								id: raw.id,
								username: raw.username,
								email: raw.email,
								passwordHash: raw.password_hash,
								createdAt: raw.created_at,
								updatedAt: raw.updated_at,
							}
						: null,
				)
				.then(onFulfilled)
				.catch(onRejected);
		},
		batch() {
			return ps;
		},
	};
}

const listUsersQuery = `-- name: ListUsers :many
SELECT id, username, email, password_hash, created_at, updated_at FROM users
ORDER BY id`;

export type ListUsersRow = {
	id: number | string;
	username: number | string;
	email: number | string;
	passwordHash: number | string;
	createdAt: number | string | null;
	updatedAt: number | string | null;
};

type RawListUsersRow = {
	id: number | string;
	username: number | string;
	email: number | string;
	password_hash: number | string;
	created_at: number | string | null;
	updated_at: number | string | null;
};

export function listUsers(d1: D1Database): Query<D1Result<ListUsersRow>> {
	const ps = d1.prepare(listUsersQuery);
	return {
		then(
			onFulfilled?: (value: D1Result<ListUsersRow>) => void,
			onRejected?: (reason?: any) => void,
		) {
			ps.all<RawListUsersRow>()
				.then((r: D1Result<RawListUsersRow>) => {
					return {
						...r,
						results: r.results.map((raw: RawListUsersRow) => {
							return {
								id: raw.id,
								username: raw.username,
								email: raw.email,
								passwordHash: raw.password_hash,
								createdAt: raw.created_at,
								updatedAt: raw.updated_at,
							};
						}),
					};
				})
				.then(onFulfilled)
				.catch(onRejected);
		},
		batch() {
			return ps;
		},
	};
}

const updateUserQuery = `-- name: UpdateUser :one
UPDATE users
SET username = ?1, email = ?2, updated_at = CURRENT_TIMESTAMP
WHERE id = ?3
RETURNING id, username, email, password_hash, created_at, updated_at`;

export type UpdateUserParams = {
	username: number | string;
	email: number | string;
	id: number | string;
};

export type UpdateUserRow = {
	id: number | string;
	username: number | string;
	email: number | string;
	passwordHash: number | string;
	createdAt: number | string | null;
	updatedAt: number | string | null;
};

type RawUpdateUserRow = {
	id: number | string;
	username: number | string;
	email: number | string;
	password_hash: number | string;
	created_at: number | string | null;
	updated_at: number | string | null;
};

export function updateUser(
	d1: D1Database,
	args: UpdateUserParams,
): Query<UpdateUserRow | null> {
	const ps = d1
		.prepare(updateUserQuery)
		.bind(args.username, args.email, args.id);
	return {
		then(
			onFulfilled?: (value: UpdateUserRow | null) => void,
			onRejected?: (reason?: any) => void,
		) {
			ps.first<RawUpdateUserRow | null>()
				.then((raw: RawUpdateUserRow | null) =>
					raw
						? {
								id: raw.id,
								username: raw.username,
								email: raw.email,
								passwordHash: raw.password_hash,
								createdAt: raw.created_at,
								updatedAt: raw.updated_at,
							}
						: null,
				)
				.then(onFulfilled)
				.catch(onRejected);
		},
		batch() {
			return ps;
		},
	};
}

const deleteUserQuery = `-- name: DeleteUser :exec
DELETE FROM users
WHERE id = ?1`;

export type DeleteUserParams = {
	id: number | string;
};

export function deleteUser(
	d1: D1Database,
	args: DeleteUserParams,
): Query<D1Result> {
	const ps = d1.prepare(deleteUserQuery).bind(args.id);
	return {
		then(
			onFulfilled?: (value: D1Result) => void,
			onRejected?: (reason?: any) => void,
		) {
			ps.run().then(onFulfilled).catch(onRejected);
		},
		batch() {
			return ps;
		},
	};
}