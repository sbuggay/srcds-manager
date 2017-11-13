import * as util from "util";
import * as events from "events";
import * as net from "net";
import * as dgram from "dgram";
import { Buffer } from "buffer";

export const PacketType = {
    COMMAND: 0x02,
    AUTH: 0x03,
    RESPONSE_VALUE: 0x00,
    RESPONSE_AUTH: 0x02
};

interface IRconOptions {
    tcp: boolean;
    challenge: boolean;
    id: number;
}

export default class Rcon extends events.EventEmitter {

    host: string;
    port: number;
    password: string;
    options: IRconOptions = {
        tcp: true,
        challenge: false,
        id: 0x0012D4A6
    }

    private tcpSocket: net.Socket;
    private udpSocket: dgram.Socket;
    private challengeToken: string;
    private hasAuthed: boolean;
    private outstandingData: Buffer | null;

    constructor(host: string, port: number, password: string, options: any = {}) {
        super();
        this.host = host;
        this.password = password;
        this.port = port;
        this.options = Object.assign({}, this.options, options);
    }

    connect() {
        if (this.options.tcp) {
            this.tcpSocket = net.createConnection(this.port, this.host);
            this.tcpSocket.on("data", (data) => this.tcpSocketOnData(data))
                .on("connect", () => this.socketOnConnect())
                .on("error", (error) => { this.emit("error", error) })
                .on("end", () => this.socketOnEnd());
            console.log(this.tcpSocket);
        }
        else {
            this.udpSocket = dgram.createSocket("udp4");
            this.udpSocket.on("message", (data) => this.udpSocketOnData(data))
                .on("listening", () => this.socketOnConnect())
                .on("error", (error) => { this.emit("error", error) })
                .on("close", () => this.socketOnEnd());
            this.udpSocket.bind(0);
        }
    }

    disconnect() {

    }

    send(data: string, cmd: number = PacketType.COMMAND, id: number = this.options.id) {
        let sendBuf;
        if (this.options.tcp) {
            const length = Buffer.byteLength(data);
            sendBuf = new Buffer(length + 14);
            sendBuf.writeInt32LE(length + 10, 0);
            sendBuf.writeInt32LE(id, 4);
            sendBuf.writeInt32LE(cmd, 8);
            sendBuf.write(data, 12);
            sendBuf.writeInt16LE(0, length + 12);
        }
        else {
            if (this.options.challenge && !this.challengeToken) {
                this.emit("error", new Error("Not authenticated"));
                return;
            }
            const str = `rcon ${this.challengeToken} ${this.password} ${data} \n`;
            sendBuf = new Buffer(4 + Buffer.byteLength(str));
            sendBuf.writeInt32LE(-1, 0);
            sendBuf.write(str, 4)
        }
        this.sendSocket(sendBuf);
    }

    private sendSocket(buffer: Buffer) {
        if (this.options.tcp) {
            this.tcpSocket.write(buffer.toString("binary"), "binary");
        }
        else {
            this.udpSocket.send(buffer, 0, buffer.length, this.port, this.host);
        }
    }

    private socketOnConnect() {
        this.emit("connect");

        console.log("connected");

        if (this.options.tcp) {
            this.send(this.password, PacketType.AUTH);
        }
        else if (this.options.challenge) {
            var str = "challenge rcon\n";
            var sendBuf = new Buffer(str.length + 4);
            sendBuf.writeInt32LE(-1, 0);
            sendBuf.write(str, 4);
            this.sendSocket(sendBuf);
        }
        else {
            var sendBuf = new Buffer(5);
            sendBuf.writeInt32LE(-1, 0);
            sendBuf.writeUInt8(0, 4);
            this.sendSocket(sendBuf);

            this.hasAuthed = true;
            this.emit("auth");
        }
    };

    private udpSocketOnData(data: Buffer) {
        if (data.readUInt32LE(0) == 0xffffffff) {
            const str = data.toString("utf-8", 4);
            const tokens = str.split(" ");
            if (tokens.length == 3 && tokens[0] == "challenge" && tokens[1] == "rcon") {
                this.challengeToken = tokens[2].substr(0, tokens[2].length - 1).trim();
                this.hasAuthed = true;
                this.emit("auth");
            } else {
                this.emit("response", str.substr(1, str.length - 2));
            }
        }
        else {
            this.emit("error", new Error("Received malformed packet"));
        }
    }

    private tcpSocketOnData(data: Buffer) {
        if (this.outstandingData != null) {
            data = Buffer.concat([this.outstandingData, data], this.outstandingData.length + data.length);
            this.outstandingData = null;
        }

        while (data.length) {
            const len = data.readInt32LE(0);
            if (!len) return;

            const id = data.readInt32LE(4);
            const type = data.readInt32LE(8);

            if (len >= 10 && data.length >= len + 4) {
                if (id == this.options.id) {
                    if (!this.hasAuthed && type == PacketType.RESPONSE_AUTH) {
                        this.hasAuthed = true;
                        this.emit("auth");
                    }
                    else if (type == PacketType.RESPONSE_VALUE) {
                        // Read just the body of the packet (truncate the last null byte)
                        // See https://developer.valvesoftware.com/wiki/Source_RCON_Protocol for details
                        let str = data.toString("utf8", 12, 12 + len - 10);

                        if (str.charAt(str.length - 1) === "\n") {
                            // Emit the response without the newline.
                            str = str.substring(0, str.length - 1);
                        }

                        this.emit("response", str);
                    }
                }
                else {
                    this.emit("error", new Error("Authentication failed"));
                }

                data = data.slice(12 + len - 8);
            }
            else {
                // Keep a reference to the chunk if it doesn"t represent a full packet
                this.outstandingData = data;
                break;
            }
        }
    };

    private socketOnEnd() {
        this.emit("end");
        this.hasAuthed = false;
    };
}