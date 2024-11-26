import { hc } from "hono/client";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { Button } from "~/components/ui/button";
import type { AppType } from "../../../sandbox/src/index";

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{
			name: "description",
			content: "Welcome to Remix on Cloudflare Workers!",
		},
	];
};

export const clientLoader = async () => {
	const client = hc<AppType>("");
	const res = await client.api.hello.$get({ query: { name: "world" } });
	const text = await res.text();
	return { data: text };
};

export default function Index() {
	const data = useLoaderData<typeof clientLoader>();
	return (
		<div className="font-sans p-4">
			<h1 className="text-3xl">Welcome to Remix on Cloudflare Workers</h1>
			<ul className="list-disc mt-4 pl-6 space-y-2">
				<li>
					<a
						className="text-blue-700 underline visited:text-purple-900"
						target="_blank"
						href="https://remix.run/docs"
						rel="noreferrer"
					>
						Remix Docs
					</a>
				</li>
				<li>
					<a
						className="text-blue-700 underline visited:text-purple-900"
						target="_blank"
						href="https://developers.cloudflare.com/workers/"
						rel="noreferrer"
					>
						Cloudflare Workers Docs
					</a>
				</li>
			</ul>
			<p>{data.data}</p>
			<Button>Hello</Button>
		</div>
	);
}
