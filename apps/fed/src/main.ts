import * as Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyWebsocket from "@fastify/websocket";
import { join } from "path";

import { getNodes, initDataFile, writeNode, type NodeOptions } from "./nodes";
import registerWebsocket from "./data";

interface Collectors {
	collectors: string[];
}

const server = Fastify.fastify({
	logger: {
		level: "warn"
	}
});

initDataFile();

server.register(fastifyWebsocket);
server.register(ws_server => {
	registerWebsocket(ws_server);
});

server.register(fastifyStatic, {
	prefix: "/",
	root: join(process.cwd(), "dist/fed-web")
});

server.get("/api/nodes", (_, reply) => {
	reply.send(getNodes());
});

server.post("/api/register/:ip", {
	schema: {
		body: {
			additionalProperties: false,
			type: "object",
			properties: {
				name: {
					type: "string"
				}
			},
			required: ["name"]
		}
	}
}, (
	request: Fastify.FastifyRequest<{ Params: { ip: string } }>,
	reply
) => {
	const { ip } = request.params;

	writeNode(ip, request.body as NodeOptions);
	reply.send("");
});

server.get("/api/:node/collectors", async (
	request: Fastify.FastifyRequest<{ Params: { node: string } }>,
	reply
) => {
	const { node } = request.params;
	const url = `http://${node}:17220/api/collectors`;

	const api_request = await (async () => {
		try {
			return await fetch(url);
		} catch (error: unknown) {
			const err_str = JSON.stringify(error);
			server.log.warn(`[route] failed to query ${node} collectors: ${err_str}`);
			return;
		}
	})();

	if (!api_request) return;
	const collectors = await api_request.json() as Collectors;

	reply.send(collectors);
});

server.listen({
	host: "0.0.0.0",
	port: 17221
}, err => {
	if (err) {
		server.log.error(err);
		process.exit(1);
	} else {
		server.log.info("[ready] http://0.0.0.0:17221");
	}
});
