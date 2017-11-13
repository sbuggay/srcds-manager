import { WebSocketController } from "./WebSocketController";

import * as rcon from "../rcon/rcon";

// All handlers must return a promise, resolve nothing if there is no response

function rconConnect(data: any) {
    // const { address, password } = data;
    // return rcon.connect({ address, password });
}

function rconDisconnect(data: any) {
    // return rcon.disconnect();
}

function rconCommand(data: any) {
    // return new Promise((resolve, reject) => {
    //     rcon.command(data).then((response: any) => {
    //         resolve(response);
    //     }, (error: any) => {
    //         reject(error);
    //     });
    // });
}

function getServers(data: any) {
    return new Promise((resolve, reject) => {
        resolve([1, 2, 3]);
    });
}

export function registerHandlers(webSocketController: WebSocketController) {
    // // rcon
    // webSocketController.registerHandler("rcon-connect", rconConnect);
    // webSocketController.registerHandler("rcon-command", rconCommand);

    // // servers
    // webSocketController.registerHandler("get-servers", getServers);
}