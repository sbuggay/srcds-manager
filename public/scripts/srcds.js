window.WebSocket = window.WebSocket || window.MozWebSocket;

const connection = new WebSocket("ws://localhost:8080");

connection.onopen = function () {
    // connection is opened and ready to use
    console.log("websocket connected");
};

connection.onerror = function (error) {
    // an error occurred when sending/receiving data
};

connection.onmessage = function (message) {
    var log = document.getElementById("log");
    var json = JSON.parse(message.data);
    log.value += json.data;
    console.log(json.data);
};

function setupInput() {
    var form = document.getElementById("rcon-form");
    var command = document.getElementById("rcon-command");
    form.addEventListener("submit", function (e) {
        connection.send(JSON.stringify({
            type: "rcon-command",
            data: command.value
        }));

        command.value = "";

        e.preventDefault();
        return false;
    });
}

setupInput();