export class Control {
    listening = false;
    constructor(controls) {
        this.controls = controls;
        this.action = {};
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
            this.switch = false;
        }
        if (this.switch) return {select: "auto"};
        return {unit: unit,
                    action: {
                        type:  this.action.type,
                        angle: this.action.angle,
                        force: this.action.force
                    }
               }
    }

    startListenKeys() {
        if (this.listening) return;
        this.listening = true;
    }

    stopListenKeys() {
        if (!this.listening) return;
        this.listening = false;

    }
}