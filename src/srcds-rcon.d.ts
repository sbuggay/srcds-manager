declare module "srcds-rcon" {
    interface RCON {
        connect: () => Promise<any>;
        disconnect: () => Promise<void>;
        command: (text: string, timeout?: number) => Promise<any>;
    }
    
    var getRcon: (params: any) => RCON;

    export = getRcon;
}