const express = require("express");
const app = express();
const rcon = require("./rcon");
const socket = require("./socket");
const basicAuth = require("express-basic-auth");

const server = require("./server");

const port = 3000;

app.use(basicAuth({
    users: {
        "admin": "braves"
    },
    challenge: true,
}));

app.use(express.static("public"));

rcon.connect({
    address: "devan.space",
    password: "admin1c_kxGks"
}).then(() => {
    console.log("connected");
}, (e) => {
    console.log(`connection failed ${e}`);
});

server.getServers();

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});

app.listen(port, function () {
    socket.setupWebsocket();
    console.log(`server running on port ${port}`);
});