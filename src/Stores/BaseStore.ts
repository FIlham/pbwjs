import type {
	AuthenticationCreds,
	AuthenticationState,
	BaileysEventEmitter,
	SignalDataSet,
	SignalDataTypeMap,
	useMultiFileAuthState,
} from "baileys";
import type { Chat } from "../Structures/Chat.js";

export abstract class BaseStore {
	public sessionName: string;
	abstract initAuth(): Promise<{
		state: AuthenticationState;
		saveCreds: () => Promise<void>;
	}>;
	abstract initStore(ev: BaileysEventEmitter): Promise<{
		chats: { [_: string]: Chat[] };
	}>;
	constructor(sessionName: string) {
		this.sessionName = sessionName;
	}
}
