import {Application} from "./app.js";
import fs from "fs";

const config = JSON.parse(fs.readFileSync(new URL("../config.json", import.meta.url)));
const app = new Application(config);

app.start();
