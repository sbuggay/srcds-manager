window.WebSocket = window.WebSocket || window.MozWebSocket;

const connection = new WebSocket("ws://localhost:8080");

connection.onopen = function () {
    var command = document.getElementById("command");
    command.style.borderColor = "darkgreen";
    connection.send(JSON.stringify({ type: "get-servers" }));
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

// function registerHandler(key, handler) {
//     handlers[key] = handler;
// }

// registerHandler("rcon-response", (data) => {
//     app.log += data;
// });

// registerHandler("get-servers", (data) => {
//     console.log(data);
// });

connection.onmessage = function (message) {
    var json = JSON.parse(message.data);
    const key = json.key;
    console.log(json);
    if (key) {
        if (handlers[key]) {
            handlers[key].resolve(json.data);
        }
        console.error('Unknown key!!!');
    } else {
        console.error('No key!');
    }
};

function send(message) {
    const key = uuid();
    message = Object.assign({}, { key }, message);
    console.log(message);
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
        servers: []
    },
    methods: {
        "onSubmit": function (event) {
            send({
                type: "rcon-command",
                data: this.command
            }).then(data => {
                this.log += data;
            });;
            this.command = "";  
        },
        "logScroll": function () {
            var log = document.getElementById("log");
            log.scrollTop = log.scrollHeight;
        }
    }
});

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}