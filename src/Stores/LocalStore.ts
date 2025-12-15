import {
	useMultiFileAuthState,
	type AuthenticationState,
	type BaileysEventEmitter,
} from "baileys";
import { BaseStore } from "./BaseStore.js";
import { Chat } from "../Structures/Chat.js";
import fs from "fs/promises";
import { join } from "path";
import {
	DEFAULT_FILE_STORE,
	DEFAULT_STORE_CONTENT,
} from "../Types/Constant.js";

export class LocalStore extends BaseStore {
	constructor(sessionName: string) {
		super(sessionName);
	}
	public async initAuth(): Promise<{
		state: AuthenticationState;
		saveCreds: () => Promise<void>;
	}> {
		return useMultiFileAuthState(this.sessionName);
	}

	public async initStore(
		ev: BaileysEventEmitter,
	): Promise<{ chats: { [_: string]: Chat[] } }> {
		// If the file doesn't exist, create it
		if (!(await fs.access(DEFAULT_FILE_STORE).catch(() => false))) {
			await fs.writeFile(
				DEFAULT_FILE_STORE,
				JSON.stringify(DEFAULT_STORE_CONTENT),
			);
		}

		const store: typeof DEFAULT_STORE_CONTENT =
			JSON.parse(await fs.readFile(DEFAULT_FILE_STORE, "utf-8")) ||
			DEFAULT_STORE_CONTENT;

		setInterval(async () => {
			await fs.writeFile(DEFAULT_FILE_STORE, JSON.stringify(store));
		}, 1000);

		ev.on("chats.update", (chats) => {
			for (const chat of chats) {
				if (!chat || !chat.id) continue;
				if (!store.chats[chat.id]) store.chats[chat.id] = [];
				store.chats[chat.id]!.push(new Chat(chat));
			}
		});

		return { chats: store.chats };
	}
}
