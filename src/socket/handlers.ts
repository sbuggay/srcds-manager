import * as rcon from "../rcon";
import { registerHandler } from "./socket";

registerHandler("rcon-command", (data: any, connection: WebSocket) => {
    rcon.command(data).then((response: any) => {
        connection.send(JSON.stringify({
            type: "rcon-response",
            data: response
        }));
    });
});
