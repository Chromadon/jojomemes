import {
	getAssetFromKV,
	NotFoundError,
	MethodNotAllowedError,
} from "@cloudflare/kv-asset-handler";

addEventListener("fetch", (event: FetchEvent) => {
	event.respondWith(handleEvent(event));
});

async function handleEvent(event: FetchEvent) {
	try {
		return await getAssetFromKV(event);
	} catch (e) {
		if (e instanceof NotFoundError) {
			const url = new URL(event.request.url);
			return new Response(`${url.pathname} not found`, {
				status: 404,
			});
		} else if (e instanceof MethodNotAllowedError) {
			const method = event.request.method;
			return new Response(`Method ${method} not allowed`, {
				status: 405,
			});
		} else {
			return new Response("An unexpected error occurred", {
				status: 500,
			});
		}
	}
}
