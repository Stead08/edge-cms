import { createHonoWithDB } from "../factory";
import * as sql from "../gen/sqlc/querier";

export const rootSlugApp = createHonoWithDB()
	.get("/:collection_slug/:item_id/full", async (c) => {
		const db = c.get("db");
		const collectionSlug = c.req.param("collection_slug");
		const itemId = c.req.param("item_id");

		// コレクション情報を取得
		const collection = await sql.getCollectionBySlug(db, {
			slug: collectionSlug,
		});
		if (!collection) {
			return c.json({ error: "コレクションが見つかりません" }, 404);
		}

		// アイテムの基本情報を取得
		const item = await sql.getItemByCollectionAndId(db, {
			collectionId: collection.id,
			id: Number(itemId),
		});
		if (!item) {
			return c.json({ error: "記事が見つかりません" }, 404);
		}

		// フィールド値を取得
		const fieldValues = await sql.getFieldValuesForItem(db, {
			itemId: item.id,
		});

		// フィールド情報を取得
		const fields = await sql.getFieldsByCollection(db, {
			collectionId: collection.id,
		});

		// フィールド値とフィールド情報を結合
		const content = fieldValues.results.map((fv) => {
			const field = fields.results.find((f) => f.id === fv.fieldId);
			return {
				name: field?.name,
				type: field?.type,
				value: fv.value,
			};
		});

		// 結果をJSONとして返却
		return c.json({
			id: item.id,
			collection: {
				id: collection.id,
				slug: collection.slug,
				label: collection.label,
			},
			createdAt: item.createdAt,
			updatedAt: item.updatedAt,
			content,
		});
	})
	.get("/:collection_slug", async (c) => {
		const db = c.get("db");
		const collectionSlug = c.req.param("collection_slug");
		const page = Number(c.req.query("page") || "1");
		const limit = Number(c.req.query("limit") || "10");
		const offset = (page - 1) * limit;

		// コレクション情報を取得
		const collection = await sql.getCollectionBySlug(db, {
			slug: collectionSlug,
		});
		if (!collection) {
			return c.json({ error: "コレクションが見つかりません" }, 404);
		}

		// アイテム一覧を取得
		const items = await sql.listItemsForCollection(db, {
			collectionId: collection.id,
			limit: limit,
			offset: offset,
		});

		// 総アイテム数を取得
		const totalItems = await sql.countItemsForCollection(db, {
			collectionId: collection.id,
		});
		if (!totalItems) {
			return c.json({ error: "アイテムが見つかりません" }, 404);
		}

		// フィールド情報を取得
		const fields = await sql.getFieldsByCollection(db, {
			collectionId: collection.id,
		});

		// アイテムごとにフィールド値を取得
		const itemsWithContent = await Promise.all(
			items.results.map(async (item) => {
				const fieldValues = await sql.getFieldValuesForItem(db, {
					itemId: item.id,
				});
				const content = fieldValues.results.map((fv) => {
					const field = fields.results.find((f) => f.id === fv.fieldId);
					return {
						name: field?.name,
						type: field?.type,
						value: fv.value,
					};
				});
				return {
					...item,
					content,
				};
			}),
		);

		// 結果をJSONとして返却
		return c.json({
			collection: {
				id: collection.id,
				slug: collection.slug,
				label: collection.label,
			},
			items: itemsWithContent,
			pagination: {
				page: page,
				limit: limit,
				totalItems: totalItems.count,
				totalPages: Math.ceil(totalItems.count / limit),
			},
		});
	});
