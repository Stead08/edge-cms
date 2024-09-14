import { hc } from "hono/client";
import type { AppType } from "../../../sandbox/src/index";

export const client = hc<AppType>("");
