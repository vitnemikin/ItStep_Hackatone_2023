export function prompt(message, callback) {
    process.stdout.write(message + " ");
    process.stdin.once("data", (data) => {
        data = data.toString().trim().toLowerCase();
        callback(data);
    });
}


// if (data.includes("exit")) {
//     process.stdin.pause();
//     app.stop();
//     setTimeout(process.exit, 1000);
// }