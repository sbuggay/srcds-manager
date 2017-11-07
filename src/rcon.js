let Rcon = require("srcds-rcon");
let rcon;

function connect(options) {
    rcon = Rcon(options);

    return rcon.connect();
}

function disconnect() {
    return rcon.disconnect
}

function command(command) {
    return rcon.command(command);
}

module.exports = {
    connect,
    disconnect,
    command
}