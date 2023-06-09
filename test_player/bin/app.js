import http from "http";
import url from "url";
import {getInterfacesIp} from "./netinterfaces.js";
import {GameServer} from "./gameserver.js";
import {Keyboard} from "./keyboard.js";
import {prompt} from "./prompt.js";

const log = console.log;

export class Application {
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
            up: "ArrowUp",
            down: "ArrowDown",
            left: "ArrowLeft",
            right: "ArrowRight",
            switch_unit: "Tab",
            catch: "KeyQ",
            throw: "KeyW"
        }
    }
    constructor(config) {
        Object.assign(this.config, config);
        this.gamePlayer = http.createServer(this.#requestHandler.bind(this));
        this.gameServer = new GameServer(this.config.server);
        this.keyboard = new Keyboard(this.config.controls);
    }

    start() {
        let ifaces = getInterfacesIp();
        this.config.self.ip = Object.values(ifaces).map(x => x[0])[0];
        prompt("Введите ваше имя игрока:", this.#nameHandler.bind(this));
    }

    stop(callback) {
        //log("Stopping server...");
        //this.playerDb.stop();
        //this.server.close(callback);
    }

    #nameHandler(playerName) {
        this.config.self.name = playerName;
        this.gameServer.register(this.config.self, this.#registeredHandler.bind(this));
    }

    #registeredHandler(uid) {
        log("Наш регистрационный ключ", uid);
        log(this.keyboard.help());
        this.#listen();
    }

    #requestHandler(req, res) {
        if (req.method?.toLowerCase() !== "get") return;
        const requested = url.parse(req.url, true);
        const params = requested.query;
        let output = {};
        switch(requested.pathname) {


            case "/match":
                let [user1, user2] = this.playerDb.getRandomPair();
                if (user1 && user2) {
                    output.player1 = {name: user1.name, address: user1.host, port: user1.port};
                    output.player2 = {name: user2.name, address: user2.host, port: user2.port};
                    res.statusCode = 200;
                } else {
                    res.statusCode = 503;
                }
                res.setHeader('Content-Type', 'application/json; charset=utf-8;');
                res.write(JSON.stringify(output));
                break;


            case "/register":
                if (params.name && params.host && params.port) {
                    let uid = this.playerDb.newPlayer(params.name, params.host, params.port, this.config.player_timeout);
                    output.uid = uid;
                    output.timeout = this.config.player_timeout;
                    res.statusCode = 200;
                } else {
                    res.statusCode = 400;
                }
                res.setHeader('Content-Type', 'application/json; charset=utf-8;');
                res.write(JSON.stringify(output));
                break;


            case "/refresh":
                if (params.uid && this.playerDb.refreshPlayer(params.uid)) {
                    res.statusCode = 200;
                } else {
                    res.statusCode = 401;
                }
                break;

            default:
                res.statusCode = 404;
                res.write("Not found");
        }
        res.end();
    }

    #listen() {
        this.gamePlayer.listen(this.config.self.port, () => {
            log("Ждём начала игры...");
        });
    }
}
