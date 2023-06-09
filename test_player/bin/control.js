import keypress from "keypress";

export class Control {
    #listener = null;
    action = {unit:0, switch:0, type:"", angle:0, force:0};

    constructor(controls) {
        this.controls = controls;
        keypress(process.stdin);
    }

    help() {
        return `
        Управление в игре:
         - вперёд:.........${this.controls.up}
         - назад:..........${this.controls.down}
         - влево:..........${this.controls.left}
         - вправо:.........${this.controls.right}
         - выбор юнита:....${this.controls.switch_unit}
         - поймать:........${this.controls.catch}
         - бросок:.........${this.controls.throw}
        `;
    }

    getAction(unit) {
        if (unit !== this.action.unit) {
            this.action.unit = unit;
            this.action.switch = false;
        }
        if (this.action.switch) return {select: "auto"};
        return {unit: unit,
                    action: {
                        type:  this.action.type,
                        angle: this.action.angle,
                        force: this.action.force
                    }
               }
    }

    startListenKeys() {
        if (this.#listener) return;
        this.#listener = this.#keyListener.bind(this);
        process.stdin.setRawMode(true);
        process.stdin.on("keypress", this.#listener);
        process.stdin.resume();
        
    }

    stopListenKeys() {
        if (!this.#listener) return;
        process.stdin.setRawMode(false);
        process.stdin.off("keypress", this.#listener);
        process.stdin.pause();

    }

    #keyListener(char, key) {
        switch(key.name) {
            case this.controls.switch_unit:
                this.action.switch = true;
                break;

            case this.controls.catch:
                this.action.type = "catch";
                break;

            case this.controls.throw:
                this.action.type = "throw";
                this.action.force = 100;
                break;

            case this.controls.up:
                this.action.type = "run";
                this.action.force = 100;
                this.action.angle = 0;
                break;

            case this.controls.down:
                this.action.type = "run";
                this.action.force = 100;
                this.action.angle = 180;
                break;

            case this.controls.left:
                this.action.type = "run";
                this.action.force = 100;
                this.action.angle = 90;
                break;
            
            case this.controls.right:
                this.action.type = "run";
                this.action.force = 100;
                this.action.angle = 270;
                break;
    
            case "escape":
                this.stopListenKeys();
                break;
        }
    }
}