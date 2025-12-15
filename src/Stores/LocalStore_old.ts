import { useMultiFileAuthState, type BaileysEventEmitter } from "baileys";
import fs from "fs";
import { Chat } from "../Structures/Chat.js";
import {
	DEFAULT_FILE_STORE,
	DEFAULT_STORE_CONTENT,
} from "../Types/Constant.js";

export const localAuthStore = useMultiFileAuthState;
export const localStore = async (ev: BaileysEventEmitter) => {
	// Make file first if it doesn't exist
	if (!fs.existsSync(DEFAULT_FILE_STORE)) {
		fs.writeFileSync(
			DEFAULT_FILE_STORE,
			JSON.stringify(DEFAULT_STORE_CONTENT, null, 2),
		);
	}
	const store: { chats: Chat[] } = JSON.parse(
		fs.readFileSync(DEFAULT_FILE_STORE, "utf8"),
	);

	ev.on("chats.update", (update) => {
		console.log(JSON.stringify({ chatUpdate: update }, null, 2));
		for (const chat of update) {
			if (!chat || !chat.messages) return;
			const chatObject = new Chat(chat);
			store.chats.push(chatObject);
			fs.writeFileSync(
				DEFAULT_FILE_STORE,
				JSON.stringify(store, null, 2),
			);
		}
	});
	ev.on("contacts.update", (update) =>
		console.log(JSON.stringify({ contactUpdate: update }, null, 2)),
	);
	ev.on("messages.update", (update) =>
		console.log(JSON.stringify({ messageUpdate: update }, null, 2)),
	);
};
