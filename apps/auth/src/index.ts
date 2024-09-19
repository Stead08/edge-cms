import { createAuth } from "@repo/auth";
import { Hono } from "hono/tiny";

const app = new Hono().basePath("/auth").route("/", createAuth());

export default app;
