import { SELF } from "cloudflare:test";
import { it, describe, expect } from "vitest";

describe("users", () => {
    it("creates a user", async () => {
        const res = await SELF.fetch("https://example.com/users", {
            method: "POST",
            body: JSON.stringify({
                username: "John Doe",
                email: "john.doe@example.com",
                password: "password",
            }),
        });
        expect(res.status).toBe(201);
        expect(await res.json()).toEqual({
            id: 2,
            username: "John Doe",
            email: "john.doe@example.com",
            passwordHash: "password",
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
    it("returns a user", async () => {
        const res = await SELF.fetch("https://example.com/users/1");
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({
            id: 1,
            username: "test",
            email: "test@test.com",
            passwordHash: "test",
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
    it("updates a user", async () => {
        const res = await SELF.fetch("https://example.com/users/1", {
            method: "PUT",
            body: JSON.stringify({
                username: "test2",
                email: "test2@test.com",
            }),
        });
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({
            id: 1,
            username: "test2",
            email: "test2@test.com",
            passwordHash: "test",
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
    it("deletes a user", async () => {
        const res = await SELF.fetch("https://example.com/users/1", {
            method: "DELETE",
        });
        expect(res.status).toBe(200);
        expect(await res.text()).toBe("ユーザーが削除されました");
    });

});