import http from "http";
import url from "url";
import {PlayerDB} from "./db.js";
import {getInterfacesIp} from "./netinterfaces.js";

const log = console.log;

export class Application {
    config = {
        port: 8100,
        player_timeout: 30
    }
    constructor(config) {
        Object.assign(this.config, config);
        this.playerDb = new PlayerDB();
        this.server = http.createServer(this.#requestHandler.bind(this));
    }

    start() {
        let ifaces = getInterfacesIp();
        let ipAdss = Object.values(ifaces).map(x => x[0]).join(", ");
        log(`Starting server at ${ipAdss} port ${this.config.port}`);
        this.server.listen(this.config.port);
    }

    stop(callback) {
        log("Stopping server...");
        this.playerDb.stop();
        this.server.close(callback);
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
}