"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const websocket_1 = __importDefault(require("@fastify/websocket"));
const data_1 = require("./data");
const server = fastify_1.default.fastify({
    logger: {
        level: process.env.NODE_ENV === "production" ? "warn" : "info",
        transport: {
            target: "pino-pretty"
        }
    }
});
server.register(websocket_1.default);
server.register(ws_server => {
    ws_server.get("/api/data", { websocket: true }, socket => {
        socket.on("message", (message) => {
            const id = message.toString();
            void (0, data_1.getData)(id).then(data => {
                socket.send(`${id} ${data}`);
            });
        });
    });
});
server.get("/api/collectors", (_, reply) => {
    reply.send({
        collectors: (0, data_1.activeCollectors)()
    });
});
server.listen({
    host: "0.0.0.0",
    port: 17220
}, err => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
    else {
        server.log.info("[server] http://0.0.0.0:17220");
    }
});
//# sourceMappingURL=main.js.map