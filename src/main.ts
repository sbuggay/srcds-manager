import * as express from "express";
const app = express();

import * as basicAuth from "express-basic-auth";

import Rcon from "./rcon/rcon";
import { WebSocketController } from "./socket/WebSocketController";
import { registerHandlers } from "./socket/handlers";

const port = 3000;

// Set up auth
app.use(basicAuth({
    users: {
        "admin": "braves"
    },
    challenge: true,
}));

const rcon = new Rcon("devan.space", 27015, "admin1c_kxGks");

rcon.on("auth", () => {
    console.log("authed");
    rcon.send("status");
});
rcon.on("response", (response) => {
    console.log(response);
});
rcon.on("end", () => {
    console.log("end");
});
rcon.connect();

// Use static
app.use(express.static("public"));

process.on("unhandledRejection", (reason, p) => {
    console.error("Unhandled Rejection at: Promise", p, "reason:", reason);
});

app.listen(port, () => {
    const webSocketController = new WebSocketController();
    registerHandlers(webSocketController);
    console.log(`server running on port ${port}`);
});