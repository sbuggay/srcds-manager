import * as express from "express";
const app = express();

import * as basicAuth from "express-basic-auth";

import * as rcon from "./rcon";
import * as socket from "./socket";
import * as server from "./server";

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

server.runCommand("csgo-2", "details").then(value => {
    console.log(value);
});

app.listen(port, function () {
    socket.setupWebsocket();
    console.log(`server running on port ${port}`);
});