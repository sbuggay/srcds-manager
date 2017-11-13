window.WebSocket = window.WebSocket || window.MozWebSocket;

const connection = new WebSocket("ws://localhost:8080");

connection.onopen = function () {
    var command = document.getElementById("command");
    command.style.borderColor = "darkgreen";
};

connection.onerror = function (error) {
    // an error occurred when sending/receiving data
};

connection.onclose = function () {
    var command = document.getElementById("command");
    command.style.borderColor = "darkred";
}

//handlers
let handlers = {};

connection.onmessage = function (message) {
    var json = JSON.parse(message.data);
    const key = json.key;
    if (key) {
        if (handlers[key]) {
            if (json.error) {
                handlers[key].reject(json.error);
            } else {
                handlers[key].resolve(json.data);
            }
            delete handlers[key];
        }
    }
};

function send(message) {
    const key = uuid();
    message = Object.assign({}, { key }, message);
    connection.send(JSON.stringify(message));

    return new Promise((resolve, reject) => {
        handlers[key] = {
            resolve,
            reject
        };
    });
}

var app = new Vue({
    el: "#app",
    data: {
        webSocketConnected: false,
        rconConnected: false,
        command: "",
        log: "",
        address: "devan.space",
        password: "braves",
        servers: []
    },
    methods: {
        "onConnectSubmit": function (event) {
            console.log(event);
            console.log("test");
        },
        "onCommandSubmit": function (event) {
            send({
                type: "rcon-command",
                data: this.command
            }).then(data => {
                this.log += data;
            }, error => {
                console.error(data);
            });
            this.command = "";
        },
        "logScroll": function () {
            var log = document.getElementById("log");
            log.scrollTop = log.scrollHeight;
        }
    }
});

function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}