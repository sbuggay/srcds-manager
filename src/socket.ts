import * as WebSocket from "ws";


import * as rcon from "./rcon";

const wss = new WebSocket.Server({ port: 8080 });

interface IWebsocketHandlers {
    [key: string]: Function
}

let handlers: IWebsocketHandlers;

export function registerHandler(key: string, handler: Function, connection: WebSocket) {
    handlers[key] = handler;
}

export function setupWebsocket() {
    wss.on("connection", function connection(connection) {
        connection.on("message", function (message) {
            const data = JSON.parse(message.toString());

            // send to handler
            if (handlers[data.type]) {
                handlers[data.type](data.data);
            }

            switch (data.type) {
                case "rcon-connect":
                    
                    break;

                case "rcon-disconnect":

                    break;
                case "rcon-command":
                    console.log(`sending command ${data.data}`)
                    rcon.command(data.data).then((response: any) => {
                        console.log(response);
                        connection.send(JSON.stringify({
                            type: "rcon-response",
                            data: response
                        }));
                    }, (error: Error) => {
                        console.log(error);
                    });
                    break;
            }
        });
        connection.on("close", function () {
            console.log("connection closed");
        });
    });
}