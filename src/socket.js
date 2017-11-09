const WebSocket = require('ws');
const rcon = require("./rcon");

const wss = new WebSocket.Server({ port: 8080 });

function setupWebsocket() {
    wss.on("connection", function connection(connection) {
        connection.on("message", function (message) {
            const data = JSON.parse(message);

            switch (data.type) {
                case "rcon-connect":
                    
                    break;

                case "rcon-disconnect":

                    break;
                case "rcon-command":
                    console.log(`sending command ${data.data}`)
                    rcon.command(data.data).then((response) => {
                        console.log(response);
                        connection.send(JSON.stringify({
                            type: "rcon-response",
                            data: response
                        }));
                    }, (error) => {
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

module.exports = {
    setupWebsocket
};