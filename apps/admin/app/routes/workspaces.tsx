import { useLoaderData } from "@remix-run/react";
import { hc } from "hono/client";
import type { AppType } from "../../../sandbox/src/index";

export const clientLoader = async () => {
	const client = hc<AppType>("");
	const res = await client.api.workspaces.$get();
	const workspaces = await res.json();
	return { workspaces };
};

export default function Workspaces() {
	const { workspaces } = useLoaderData<typeof clientLoader>();
	return (
		<div>
			{workspaces.results.map((workspace) => (
				<div key={workspace.id}>{JSON.stringify(workspace)}</div>
			))}
		</div>
	);
}
