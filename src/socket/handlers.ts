
import { WebSocketController } from "./socket";

export function registerHandlers(webSocketController: WebSocketController) {
    webSocketController.registerHandler("rcon-command", (data: any, connection: WebSocket) => {
        rcon.command(data).then((response: any) => {
            connection.send(JSON.stringify({
                type: "rcon-response",
                data: response
            }));
        });
    });
}