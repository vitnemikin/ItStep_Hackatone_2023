import {URLSearchParams} from "url";

export class GameServer {
    timeout = 30;
    poll = null;
    uid = null;
    constructor(config) {
        this.baseUrl = `http://${config.ip}:${config.port}/`;
    }

    register(player, callback) {
        let endpoint = this.baseUrl + "register";
        let params = new URLSearchParams();
        params.append("name", player.name);
        params.append("host", player.ip);
        params.append("port", player.port);
        let href = endpoint + "?" + params;
        
        fetch(href)
        .then(data => data.json())
        .then(this.#registered.bind(this))
        .then(callback);
        //TODO: сделать обработку ошибок http
    }

    refresh() {
        let endpoint = this.baseUrl + "refresh";
        let params = new URLSearchParams();
        params.append("uid", this.uid)
        let href = endpoint + "?" + params;
        fetch(href);
        //TODO: сделать обработку ошибок http
    }

    close() {
        clearInterval(this.poll);
    }

    #registered(data) {
        if (data.uid) {
            this.uid = data.uid;
            this.timeout = data.timeout - 1;
            this.poll = setInterval(this.refresh.bind(this), this.timeout * 1000);
            return this.uid;
        }
    }
}