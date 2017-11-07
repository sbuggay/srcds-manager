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
    console.log(getDirectories(path));
}

function addServer(dir, serverType) {
    // Create directory
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    // download lgsm script
    const downloadCommand = `cd ${dir}; wget -N --no-check-certificate https://gameservermanagers.com/dl/linuxgsm.sh && chmod +x linuxgsm.sh && bash linuxgsm.sh ${serverType}`;
    execSync(downloadCommand);

    // run auto-install
    const installCommand = `cd ${dir}; ./${serverType} auto-install`;
    execSync(installCommand);
}

function removeServer() {
    if (fs.existsSync(dir)) {
        fs.rmdirSync(dir);
    }
}

module.exports = {
    getServers,
    addServer,
    removeServer
}