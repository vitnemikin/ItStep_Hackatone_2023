export function prompt(message, callback) {
    process.stdout.write(message + " ");
    process.stdin.once("data", (data) => {
        data = data.toString().trim();
        callback(data);
    });
}

export function promptExit() {
    prompt("Type 'exit' to stop application or press 'Ctrl+C' to kill it", () => {
        if (data.toLowerCase().includes("exit")) {
            process.stdin.pause();
            app.stop();
            setTimeout(process.exit, 1000);
        }        
    });
}
