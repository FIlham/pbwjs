import type { BaseStore } from "../Stores/BaseStore.js";
import { Chat } from "../Structures/Chat.js";

export type ClientOptions = {
	authStrategies: BaseStore;
	printQRInTerminal?: boolean;
};

export const DEFAULT_FILE_STORE = "pbwjs_store.json";
export const DEFAULT_STORE_CONTENT: {
	chats: { [_: string]: Chat[] };
} = {
	chats: {},
};
