import type { FastifyInstance, FastifyRequest } from "fastify";
import WebSocket from "ws";

function registerWebsocket(ws_server: FastifyInstance) {
	ws_server.get(
		"/api/:node/data",
		{ websocket: true },
		(socket, request: FastifyRequest<{ Params: { node: string } }>) => {
			const { node } = request.params;
			const host = `ws://${node}:17220/api/data`;
			
			const node_socket = (function() {
				try {
					return new WebSocket(host);
				} catch (error) {
					ws_server.log.warn(`[data] Failed to connect to ${host}: ${error}`);
					return;
				}
			})();

			if (!node_socket) return;
		
			const node_ready = new Promise(resolve => {
				node_socket?.addEventListener("open", resolve);
			});

			node_socket?.addEventListener("message", message => {
				socket.send(message.data);
			});

			socket.on("message", message => {
				void node_ready.then(() => {
					node_socket?.send(message);
				});
			});
		}
	);
}

export default registerWebsocket;
