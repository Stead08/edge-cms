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
        const field_res = await SELF.fetch("https://example.com/fields", {
            method: "POST",
            body: JSON.stringify({
                collection_id: collection_id,
                name: "create_field_values",
                type: "text",
                required: true,
            }),
        });
        const field = await field_res.json() as { id?: string };
        const field_id = field.id;
        const item_res = await SELF.fetch("https://example.com/items", {
            method: "POST",
            body: JSON.stringify({
                collection_id: collection_id,
                field_id: field_id,
            }),
        });
        const item = await item_res.json() as { id?: string };
        const item_id = item.id;
        const field_value_res = await SELF.fetch("https://example.com/field_values", {
            method: "POST",
            body: JSON.stringify({
                item_id: item_id,
                field_id: field_id,
                value: "test",
            }),
        });
        const field_value = await field_value_res.json() as { value?: string };
        expect(field_value.value).toBe("test");
    });
    it("should create field values with template", async () => {
        const collection_res = await SELF.fetch("https://example.com/collections", {
            method: "POST",
            body: JSON.stringify({
                slug: "create_field_values_with_template",
                label: "create_field_values_with_template",
                description: "create_field_values_with_template",
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
        if (!collection_id) {
            throw new Error("collection_id is not found");
        }
        const field_res = await SELF.fetch("https://example.com/fields", {
            method: "POST",
            body: JSON.stringify({
                collection_id: collection_id,
                name: "create_field_values_with_template",
                type: "text",
                required: true,
            }),
        });
        const field = await field_res.json() as { id?: string };
        const field_id = field.id;
        if (!field_id) {
            throw new Error("field_id is not found");
        }
        const field_template_res = await SELF.fetch("https://example.com/field_templates", {
            method: "POST",
            body: JSON.stringify({
                name: "create_field_values_with_template",
                field_id: field_id,
                type: "text",
                required: true,
                default_value: "default",
                options: { option1: "value1" },
                matadata: { key: "value" },
            }),
        });
        const field_template = await field_template_res.json() as { id?: string };
        const field_template_id = field_template.id;
        if (!field_template_id) {
            throw new Error("field_template_id is not found");
        }
        const item_res = await SELF.fetch("https://example.com/items", {
            method: "POST",
            body: JSON.stringify({
                collection_id: collection_id,
                field_id: field_id,
            }),
        });
        const item = await item_res.json() as { id?: string };
        const item_id = item.id;
        const field_value_res = await SELF.fetch("https://example.com/field_values", {
            method: "POST",
            body: JSON.stringify({
                item_id: item_id,
                field_id: field_id,
                value: "test",
                field_template_id: field_template_id,
            }),
        });
        const field_value = await field_value_res.json() as { value?: string };
        expect(field_value.value).toBe("test");

    });
}
)