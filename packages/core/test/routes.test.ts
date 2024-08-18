import { SELF } from "cloudflare:test";

// ここではユーザ作成から、content typeの作成、フィールドの作成、エントリーの作成、フィールド値の作成まで
// テストを行う。
describe("should create field values", () => {
    it("should create field values", async () => {
        const collection_res = await SELF.fetch("https://example.com/collections", {
            method: "POST",
            body: JSON.stringify({
                slug: "create_field_values",
                label: "create_field_values",
                description: "create_field_values",
                access: true,
                default_sort: "created_at",
                list_searchable_fields: ["created_at"],
                pagination: false,
                default_limit: 10,
                max_limit: 100,
            }),
        });
        const collection = await collection_res.json() as { id?: string };
        const collection_id = collection.id;
        const content_type_res = await SELF.fetch("https://example.com/fields", {
            method: "POST",
            body: JSON.stringify({
                collection_id: collection_id,
                name: "create_field_values",
                type: "text",
                required: true,
            }),
        });
        const content_type = await content_type_res.json() as { id?: string };
        const content_type_id = content_type.id;
        const item_res = await SELF.fetch("https://example.com/items", {
            method: "POST",
            body: JSON.stringify({
                collection_id: collection_id,
                content_type_id: content_type_id,
            }),
        });
        const item = await item_res.json() as { id?: string };
        const item_id = item.id;
        const field_value_res = await SELF.fetch("https://example.com/field_values", {
            method: "POST",
            body: JSON.stringify({
                item_id: item_id,
                field_id: content_type_id,
                value: "test",
            }),
        });
        const field_value = await field_value_res.json() as { value?: string };
        expect(field_value.value).toBe("test");
    });
});