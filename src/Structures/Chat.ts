import type { proto, WAMessageKey } from "baileys";
import { Message } from "./Message.js";

export class Chat {
	raw: proto.IConversation;
	constructor(
		raw: proto.IConversation,
		public id = raw.id,
		public message = new Message(raw.messages![0]!.message!),
		public unreadCount = raw.unreadCount,
	) {
		this.raw = raw;
	}
}
