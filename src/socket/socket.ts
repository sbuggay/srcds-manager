import * as WebSocket from "ws";

const wss = new WebSocket.Server({ port: 8080 });

interface IWebsocketHandlers {
    [key: string]: any
}

let handlers: IWebsocketHandlers = {};

export function registerHandler(key: string, handler: Function) {
    handlers[key] = handler;
}

export function setupWebsocket() {
    wss.on("connection", function connection(connection) {
        connection.on("message", function (message) {
            const data = JSON.parse(message.toString());

            console.log(data);

            // send to handler
            if (handlers[data.type]) {
                handlers[data.type](data.data, connection);
            }
        });
        connection.on("close", function () {
            console.log("connection closed");
        });
    });
}