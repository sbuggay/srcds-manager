
import { WebSocketController } from "./socket";

import * as rcon from "../rcon";

// All handlers must return a promise, resolve nothing if there is no response

function rconCommand(data: any) {
    return new Promise((resolve, reject) => {
        rcon.command(data).then((response: any) => {
            resolve(response);
        }, (error: any) => {
            reject(error);
        });
    });

}

function getServers(data: any) {
    return new Promise((resolve, reject) => {
        resolve([1, 2, 3]);
    });
}

export function registerHandlers(webSocketController: WebSocketController) {
    webSocketController.registerHandler("rcon-command", rconCommand);
    webSocketController.registerHandler("get-servers", getServers);
}