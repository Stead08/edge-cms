import { SELF } from "cloudflare:test";

// ここではユーザ作成から、content typeの作成、フィールドの作成、エントリーの作成、フィールド値の作成まで
// テストを行う。
describe("should create field values", () => {
    it("should create a user", async () => {
        const user_res = await SELF.fetch("https://example.com/users", {
            method: "POST",
            body: JSON.stringify({
                username: "create_field_values",
                email: "create_field_values@test.com",
                password: "test",
            }),
        });
        const user = await user_res.json();
        const content_type_res = await SELF.fetch("https://example.com/content-types", {
            method: "POST",
            body: JSON.stringify({
                name: "create_field_values",
                description: "create_field_values",
            }),
        });
        const content_type = await content_type_res.json();
        const content_type_id = content_type.id;
        const field_res = await SELF.fetch("https://example.com/fields", {
            method: "POST",
            body: JSON.stringify({
                content_type_id: content_type_id,
                name: "create_field_values",
                type: "text",
                required: true,
            }),
        });
        const field = await field_res.json();
        const entry_res = await SELF.fetch("https://example.com/entries", {
            method: "POST",
            body: JSON.stringify({
                content_type_id: content_type_id,
                created_by: user.id,
            }),
        });
        const entry = await entry_res.json();
        const entry_id = entry.id;
        const field_value_res = await SELF.fetch("https://example.com/field-values", {
            method: "POST",
            body: JSON.stringify({
                entry_id: entry_id,
                field_id: field.id,
                value: "test",
            }),
        });
        const field_value = await field_value_res.json();
        expect(field_value).toStrictEqual({
            id: 1,
            entryId: 1,
            fieldId: 1,
            value: "test",
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});