import Fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";

import { activeCollectors, getData } from "./data";

const server = Fastify.fastify({
	logger: {
		level: process.env.NODE_ENV === "production" ? "warn" : "info",
		transport: {
			target: "pino-pretty"
		}
	}
});

server.register(fastifyWebsocket);
server.register(ws_server => {
	ws_server.get("/api/data", { websocket: true }, socket => {
		socket.on("message", (message: Buffer) => {
			const id = message.toString();

			void getData(id).then(data => {
				socket.send(`${id} ${data}`);
			});
		});
	});
});

server.get("/api/collectors", (_, reply) => {
	reply.send({
		collectors: activeCollectors()
	});
});

server.listen({
	host: "0.0.0.0",
	port: 17220
}, err => {
	if (err) {
		server.log.error(err);
		process.exit(1);
	} else {
		server.log.info("[server] http://0.0.0.0:17220");
	}
});
