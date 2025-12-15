import { Boom } from "@hapi/boom";
import makeWASocket, {
	DisconnectReason,
	makeCacheableSignalKeyStore,
	type AnyMessageContent,
	type BaileysEventEmitter,
	type MiscMessageGenerationOptions,
	type WAMessage,
} from "baileys";
import qrTerminal from "qrcode-terminal";
import P from "pino";
import { Message } from "./Structures/Message.js";
import { type ClientOptions } from "./Types/Constant.js";
import type { ClientEventsMap } from "./Types/Events.js";
import { EventEmitter } from "./Utils/Event.js";
import type { BaseStore } from "./Stores/BaseStore.js";
import type { MessageContentType, MessageOptions } from "./Types/Message.js";
import { Utils } from "./Utils/index.js";

/**
 * Client class for Baileys wrapper
 */
export class Client extends EventEmitter<ClientEventsMap> {
	private socket?: ReturnType<typeof makeWASocket>;
	private store?: Awaited<ReturnType<BaseStore["initStore"]>>;
	private ev?: BaileysEventEmitter;
	public clientOptions: ClientOptions;
	constructor(options: ClientOptions) {
		super();
		this.clientOptions = options;
		this._initialize();
	}

	private async _initialize() {
		const { state, saveCreds } =
			await this.clientOptions.authStrategies.initAuth();
		this.socket = makeWASocket({
			auth: {
				creds: state.creds,
				keys: makeCacheableSignalKeyStore(state.keys),
			},
			logger: P({ level: "silent" }),
		});
		this.ev = this.socket.ev;
		this.store = await this.clientOptions.authStrategies.initStore(this.ev);

		this.ev.on("creds.update", saveCreds);

		this.ev.on("connection.update", (connection) => {
			if (connection.qr) {
				if (this.clientOptions.printQRInTerminal) {
					qrTerminal.generate(connection.qr, { small: true });
				}

				this.emit("connection:qr", connection.qr);
			}

			if (connection.connection === "close") {
				const errorCode = (connection.lastDisconnect?.error as Boom)
					.output.statusCode;
				if (
					errorCode === DisconnectReason.connectionReplaced ||
					errorCode === DisconnectReason.forbidden ||
					errorCode === DisconnectReason.loggedOut ||
					errorCode === DisconnectReason.multideviceMismatch
				) {
					process.exit();
				} else {
					this._initialize();
				}
				this.emit("connection:closed");
			} else if (connection.connection === "connecting")
				this.emit("connection:connecting");
			else if (connection.connection === "open")
				this.emit("connection:connected");
		});

		this.ev.on("messages.upsert", (upsert) => {
			if (upsert.type === "notify") {
				for (const waMessage of upsert.messages) {
					if (waMessage && waMessage.key.fromMe) return;
					const message = new Message(waMessage);
					this.emit("message:received", message);
				}
			}
		});
	}

	public async sendText(from: string, text: string, messageId?: string) {
		const mentions = [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
			(v) => v[1] + "@s.whatsapp.net",
		);
		const message = this.store?.chats[from]?.find(
			(x) => x.message.id._id === messageId,
		)?.message.raw as WAMessage;
		return this.socket?.sendMessage(
			from,
			{ text, mentions },
			{ quoted: message },
		);
	}
}
