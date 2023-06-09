export class Keyboard {
    constructor(controls) {
        this.controls = controls;
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
}