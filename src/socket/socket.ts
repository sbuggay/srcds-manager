import * as WebSocket from "ws";
import * as rcon from "../rcon";

interface IWebsocketHandlers {
    [key: string]: any
}

export class WebSocketController {

    webSocketServer: WebSocket.Server;
    handlers: IWebsocketHandlers = {};

    constructor(port = 8080) {
        this.webSocketServer = new WebSocket.Server({ port });

        this.webSocketServer.on("connection", (connection) => {
            // connected

            connection.on("message", (message) => {
                const data = JSON.parse(message.toString());

                console.log(data);

                // send to handler
                if (this.handlers[data.type]) {
                    this.handlers[data.type](data.data, connection);
                }
            });
            connection.on("close", function () {
                // disconnected
            });
        });
    }

    registerHandler(key: string, handler: Function) {
        this.handlers[key] = handler;
    }
}

