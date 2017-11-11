import * as fs from "fs";
import { join } from "path";
import { exec } from "child_process";

// Utility functions
function isDirectory(path) {
    return fs.lstatSync(path).isDirectory();
}

function validateServer(path) {
    return true;
}

function getDirectories(path) {
    return fs.readdirSync(path).map(name => join(path, name)).filter(isDirectory && validateServer);
}


export function getServers(path = "servers/") {
    return getDirectories(path);
}

export function addServer(dir, serverType) {
    // Create directory
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    // download lgsm script
    const downloadCommand = `cd ${dir};
    wget -N --no-check-certificate https://gameservermanagers.com/dl/linuxgsm.sh &&
    chmod +x linuxgsm.sh &&
    bash linuxgsm.sh csgoserver`;
    return new Promise((resolve, reject) => {
        exec(downloadCommand, () => {
            runCommand(dir, "auto-install").then(() => {
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

export function parseDetails(details) {
    return {}
}

export function runCommand(dir, command) {
    // run auto-install
    const script = `cd ${dir}; ./csgoserver ${command}`;

    return new Promise((resolve, reject) => {
        exec(script, () => {
            resolve(this.toString());
        });
    });
}
