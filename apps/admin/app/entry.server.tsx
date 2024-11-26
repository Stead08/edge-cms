import { isbot } from "isbot";
// @ts-ignore
import { renderToReadableStream } from "react-dom/server.browser";
import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";

const ABORT_DELAY = 5_000;

export default async function handleRequest(
	request: Request,
	status: number,
	headers: Headers,
	routerContext: EntryContext,
	_loadContext: AppLoadContext,
) {
	const userAgent = request.headers.get("user-agent");

	const stream = await renderToReadableStream(
		<ServerRouter
			context={routerContext}
			url={request.url}
			abortDelay={ABORT_DELAY}
		/>,
		{
			signal: request.signal,
			onError(error: Error) {
				// biome-ignore lint/style/noParameterAssign: It's ok
				status = 500;
			},
		},
	);

	if (userAgent && isbot(userAgent)) await stream.allReady;

	headers.set("Content-Type", "text/html; charset=utf-8");
	headers.set("Transfer-Encoding", "chunked");

	return new Response(stream, { status, headers });
}
