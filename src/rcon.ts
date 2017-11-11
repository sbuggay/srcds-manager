import * as Rcon from "srcds-rcon";
let rcon: any;

export function connect(options: any) {
    rcon = Rcon(options);

    return rcon.connect();
}

export function disconnect() {
    return rcon.disconnect();
}

export function command(command: string) {
    return rcon.command(command);
}
