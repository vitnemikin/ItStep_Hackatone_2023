import http from "http";
import url from "url";
import {getInterfacesIp} from "./netinterfaces.js";
import {GameServer} from "./gameserver.js";
import {Control} from "./control.js";
import {prompt, promptExit} from "./prompt.js";

const log = console.log;

export class Application {
    // default config
    config = {
        server: {
            port: 8100,
            ip: "192.168.0.1"
        },
        self: {
            port: 8200,
            ports_pool_size: 20
        },
        controls: {
            up: "up",
            down: "down",
            left: "left",
            right: "right",
            switch_unit: "tab",
            catch: "q",
            throw: "w"
        }
    }
    constructor(config) {
        Object.assign(this.config, config);
        this.gamePlayer = http.createServer(this.#requestHandler.bind(this));
        this.gameServer = new GameServer(this.config.server);
        this.gameControl = new Control(this.config.controls);
    }

    start() {
        let ifaces = getInterfacesIp();
        this.config.self.ip = Object.values(ifaces).map(x => x[0])[0];
        prompt("Введите ваше имя игрока:", this.#nameHandler.bind(this));
    }

    stop() {
        this.gameControl.stopListenKeys();
        this.gameServer.close();
        this.gamePlayer.close();
        promptExit();
    }

    #nameHandler(playerName) {
        this.config.self.name = playerName;
        this.gameServer.register(this.config.self, this.#registeredHandler.bind(this));
    }

    #registeredHandler(uid) {
        log("Наш регистрационный ключ", uid);
        log(this.gameControl.help());
        this.#listen();
    }

    #requestHandler(req, res) {
        if (req.method?.toLowerCase() !== "get") return;
        const requested = url.parse(req.url, true);
        const params = requested.query;
        let output = {};
        switch(requested.pathname) {

            case "/ready":
                log("Приготовься!");
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json; charset=utf-8;');
                res.write(JSON.stringify(output));
                break;

            case "/action":
                this.gameControl.startListenKeys();
                if (params.unit) {
                    output = this.gameControl.getAction(params.unit);
                    res.statusCode = 200;
                } else {
                    res.statusCode = 400;
                }
                res.setHeader('Content-Type', 'application/json; charset=utf-8;');
                res.write(JSON.stringify(output));
                break

            case "/over":
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json; charset=utf-8;');
                res.write(JSON.stringify(output));
                log("Игра окончена");
                setTimeout(() => this.stop(), 10);
                break;
                
            default:
                res.statusCode = 404;
                res.write("No such path");
        }
        res.end();
    }


    #listen() {
        let currentPort = this.config.self.port;
        let listening = false;

        this.gamePlayer.on("error", (err) => {
            if (err.code == 'EADDRINUSE') {
                this.gamePlayer.close();
                currentPort++;
                if (currentPort === this.config.self.port + this.config.self.ports_pool_size) {
                    currentPort = this.config.self.port;
                }

                this.gamePlayer.listen(currentPort, () => {
                    if (!listening) log("Ждём начала игры...");
                    listening = true;
                });
            } else throw err;
        });

        this.gamePlayer.listen(currentPort, () => {
            if (!listening) log("Ждём начала игры...");
            listening = true;
        });
    }
}
