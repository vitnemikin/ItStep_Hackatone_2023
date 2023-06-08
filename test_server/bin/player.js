export class Player {
    #expire_time = null;
    #off_seconds = 30;
    constructor(name, host, port, timeout) {
        this.name = name;
        this.host = host;
        this.port = port;
        this.#off_seconds = timeout;
        this.#expire_time = new Date();
        this.#expire_time.setSeconds(this.#expire_time.getSeconds() + this.#off_seconds);
    }

    isOffline() {
        let past = new Date() - this.#expire_time;
        return (past > 0) ? true : false;
    }

    refresh() {
        this.#expire_time = new Date();
        this.#expire_time.setSeconds(this.#expire_time.getSeconds() + this.#off_seconds);
    }
}
