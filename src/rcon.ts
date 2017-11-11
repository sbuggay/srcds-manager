import * as Rcon from "srcds-rcon";
let rcon;

export function connect(options) {
    rcon = Rcon(options);

    return rcon.connect();
}

export function disconnect() {
    return rcon.disconnect
}

export function command(command) {
    return rcon.command(command);
}
