import * as WebSocket from "ws";
import * as rcon from "../rcon/rcon";

interface IWebsocketHandlers {
    [key: string]: (data: any) => Promise<any>;
}

export class WebSocketController {

    private webSocketServer: WebSocket.Server;
    private handlers: IWebsocketHandlers = {};

    constructor(port = 8080) {
        this.webSocketServer = new WebSocket.Server({ port });

        this.webSocketServer.on("connection", (connection) => {
            connection.on("message", (message) => {
                const json = JSON.parse(message.toString());

                // send to handler
                if (this.handlers[json.type]) {
                    this.handlers[json.type](json.data).then((result: any) => {
                        if (result) {
                            connection.send(JSON.stringify(
                                Object.assign({}, json, { data: result })
                            ));
                        }
                    }, (error: any) => {
                        connection.send(JSON.stringify(
                            Object.assign({}, json, { error: error })
                        ));
                    });
                }
            });
            connection.on("close", function () {
                // disconnected
            });

        });
    }

    registerHandler(key: string, handler: (data: any) => Promise<any>) {
        this.handlers[key] = handler;
    }

    removeHandler(key: string) {
        delete this.handlers[key];
    }

    clearHandlers() {
        this.handlers = {};
    }
}

