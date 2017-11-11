import * as fs from "fs";
import { join } from "path";
import { exec } from "child_process";

type IServer = "csserver" | "cssserver" | "csgoserver";

// Utility functions
function isDirectory(path: string) {
    return fs.lstatSync(path).isDirectory();
}

function validateServer(path: string) {
    return true;
}

function getDirectories(path: string) {
    return fs.readdirSync(path).map(name => join(path, name)).filter(isDirectory && validateServer);
}

export function getServers(path = "servers/") {
    return getDirectories(path);
}

export function addServer(path: string, serverType: IServer) {
    // Create directory
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }

    // download lgsm script
    const downloadCommand = `cd ${path};
    wget -N --no-check-certificate https://gameservermanagers.com/dl/linuxgsm.sh &&
    chmod +x linuxgsm.sh &&
    bash linuxgsm.sh csgoserver`;
    return new Promise((resolve, reject) => {
        exec(downloadCommand, () => {
            runCommand(path, "auto-install").then(() => {
                resolve();
            })
        });
    });
}

export function removeServer(dir: string) {
    if (fs.existsSync(dir)) {
        fs.rmdirSync(dir);
    }
}

export function parseDetails(details: string) {
    return {}
}

export function runCommand(path: string, command: string) {
    // run auto-install
    const script = `cd ${path}; ./csgoserver ${command}`;

    return new Promise((resolve, reject) => {
        exec(script, () => {
            resolve(this.toString());
        });
    });
}
