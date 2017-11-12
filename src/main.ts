import * as express from "express";
const app = express();

import * as basicAuth from "express-basic-auth";

import * as rcon from "./rcon";
import { WebSocketController } from "./socket/socket";
import { registerHandlers } from "./socket/handlers";
import * as server from "./server";

const port = 3000;

// Set up auth
app.use(basicAuth({
    users: {
        "admin": "braves"
    },
    challenge: true,
}));

// Use static
app.use(express.static("public"));

rcon.connect({
    address: "devan.space",
    password: "admin1c_kxGks"
}).then(() => {
    console.log("connected");
}, (error: Error) => {
    console.log(`connection failed ${error}`);
});

app.listen(port, () => {
    const webSocketController = new WebSocketController();
    registerHandlers(webSocketController);
    console.log(`server running on port ${port}`);
});