import {md5sum} from "./hash.js";
import {Player} from "./player.js";

export class PlayerDB {
    constructor() {
        this.db = new Map();
        this.cleaner = setInterval(this.#removeExpired.bind(this), 5000);
    }

    stop() {
        clearInterval(this.cleaner);
    }

    refreshPlayer(uid) {
        let player = this.db.get(uid);
        if (player) {
            player.refresh();
            return true;
        } else {
            return false;
        }
    }

    newPlayer(name, host, port, timeout) {
        let uid = md5sum(name);
        this.db.set(uid, new Player(name, host, port, timeout));
        console.log(`New player '${name}' registered from ${host}:${port}`);
        return uid;
    }

    getRandomPair() {
        if (this.db.size < 2) return [];
        let list = [];
        for (let x of this.db.values()) list.push(x);
        let first_index = Math.trunc(Math.random() * list.length);
        let secnd_index;
        do {
            secnd_index = Math.trunc(Math.random() * list.length);
        } while (first_index === secnd_index);
        
        return [list[first_index], list[secnd_index]];
    }

    #removeExpired() {
        this.db.forEach((x,i) => {
            if (x.isOffline()) {
                console.log(`Player '${x.name}' is offline so deleted`);
                this.db.delete(i);
            }
        });
    }
}