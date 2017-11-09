const fs = require("fs");
const { join } = require("path");
const { execSync } = require("child_process");

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


function getServers(path = "servers/") {
    return getDirectories(path);
}

function addServer(dir, serverType) {
    // Create directory
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    // download lgsm script
    const downloadCommand = `cd ${dir}; wget -N --no-check-certificate https://gameservermanagers.com/dl/linuxgsm.sh && chmod +x linuxgsm.sh && bash linuxgsm.sh ${serverType}`;
    execSync(downloadCommand);

    runCommand(dir, "auto-install");
}

function removeServer() {
    if (fs.existsSync(dir)) {
        fs.rmdirSync(dir);
    }
}

function parseDetails(details) {
    return {}
}

function runCommand(dir, command) {
    // run auto-install
    const script = `cd ${dir}; ./${serverType} ${command}`;
    return execSync(script);
}

module.exports = {
    getServers,
    addServer,
    removeServer
}