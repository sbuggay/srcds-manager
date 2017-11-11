window.WebSocket = window.WebSocket || window.MozWebSocket;

const connection = new WebSocket("ws://localhost:8080");

connection.onopen = function () {
    // connection is opened and ready to use
    console.log("websocket connected");
    var command = document.getElementById("command");
    command.style.borderColor = "darkgreen";
};

connection.onerror = function (error) {
    // an error occurred when sending/receiving data
};

connection.onclose = function () {
    console.log("websocket disconnect");
    var command = document.getElementById("command");
    command.style.borderColor = "darkred";
}

//handlers

let handlers = {};

function registerHandler(key, handler) {
    handlers[key] = handler;
}

registerHandler("rcon-response", (data) => {
    app.log += data;
});

connection.onmessage = function (message) {
    var json = JSON.parse(message.data);
    if (handlers[json.type]) {
        handlers[json.type](json.data);
    }
};

var app = new Vue({
    el: "#app",
    data: {
        webSocketConnected: false,
        rconConnected: false,
        command: "",
        log: ""
    },
    methods: {
        "onSubmit": function (event) {
            connection.send(JSON.stringify({
                type: "rcon-command",
                data: this.command
            }));
            this.command = "";
        }
    }
})