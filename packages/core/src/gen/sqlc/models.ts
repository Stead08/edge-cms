// Code generated by sqlc-gen-ts-d1. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
//   sqlc-gen-ts-d1 v0.0.0-a@dfd4bfef4736967ca17cc23d18de20920fbd196998fe7aa191a205439d63fb58

export type Users = {
	id: string;
	name: string | null;
	email: string | null;
	passwordhash: string;
};

export type Collections = {
	id: number;
	slug: number | string;
	label: number | string;
	description: string | null;
	createdAt: number | string | null;
	updatedAt: number | string | null;
	access: number | string | null;
	defaultSort: number | string | null;
	listSearchableFields: number | string | null;
	pagination: number | string | null;
	defaultLimit: number | null;
	maxLimit: number | null;
	metadata: number | string | null;
};

export type FieldTemplates = {
	id: number;
	name: number | string;
	type: number | string;
	required: number | string | null;
	defaultValue: string | null;
	options: number | string | null;
	metadata: number | string | null;
	createdAt: number | string | null;
	updatedAt: number | string | null;
	version: number | null;
};

export type Fields = {
	id: number;
	collectionId: number | null;
	templateId: number | null;
	name: number | string;
	type: number | string;
	required: number | string | null;
	defaultValue: string | null;
	options: number | string | null;
	createdAt: number | string | null;
	updatedAt: number | string | null;
};

export type Items = {
	id: number;
	collectionId: number | null;
	status: number | string | null;
	createdAt: number | string | null;
	updatedAt: number | string | null;
	publishedAt: number | string | null;
	version: number | null;
	metadata: number | string | null;
};

export type FieldValues = {
	id: number;
	itemId: number | null;
	fieldId: number | null;
	value: string | null;
	createdAt: number | string | null;
	updatedAt: number | string | null;
	version: number | null;
};

export type Roles = {
	id: number;
	name: number | string;
	description: string | null;
	permissions: number | string;
	assumeRolePolicy: number | string | null;
	createdAt: number | string | null;
	updatedAt: number | string | null;
};

export type UserRoles = {
	id: number;
	userId: string | null;
	roleId: number | null;
	createdAt: number | string | null;
	updatedAt: number | string | null;
};
