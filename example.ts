import { Client } from "./src/Client.js";
import { LocalStore } from "./src/Stores/LocalStore.js";

const client = new Client({
	authStrategies: new LocalStore("pbwjs_auth"),
});
client.on("connection:qr", console.log);
client.on("connection:closed", () => console.log("Connection closed"));
client.on("connection:connected", () => console.log("Connection connected"));
client.on("connection:connecting", () => console.log("Connection connecting"));
client.on("message:received", (msg) => {
	console.log(msg);
	if (msg.body === "ping")
		client.sendText(
			msg.id.from!,
			`pong @${msg.id.sender.split("@")[0]}`,
			msg.id._id!,
		);
});
