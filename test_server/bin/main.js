import {Application} from "./app.js";
import fs from "fs";

const config = JSON.parse(fs.readFileSync(new URL("../config.json", import.meta.url)));
const app = new Application(config);

process.stdin.on("data", (data) => {
    data = data.toString().trim().toLowerCase();
    if (data.includes("exit")) {
        process.stdin.pause();
        app.stop();
        setTimeout(process.exit, 1000);
    }
});


app.start();
console.log("Type 'exit' to stop server or press 'Ctrl+C' to kill it");
