import { getContentType, type proto, type WAMessage } from "baileys";

export class Message {
	raw: WAMessage | proto.IWebMessageInfo;
	constructor(
		raw: WAMessage | proto.IWebMessageInfo,
		public id = {
			_id: raw.key?.id,
			sender:
				(raw.key as any).remoteJidAlt ||
				(raw.key as any).participantAlt,
			fromMe: raw.key?.fromMe,
			from: raw.key?.remoteJid,
		},
		public type = getContentType(raw.message!),
		public name = raw.pushName,
		public body = raw.message?.conversation ||
			raw.message?.imageMessage?.caption ||
			raw.message?.videoMessage?.caption ||
			raw.message?.extendedTextMessage?.text,
		public mentions = raw.message?.extendedTextMessage?.contextInfo
			?.mentionedJid || [],
		public quoted = raw.message?.extendedTextMessage?.contextInfo?.hasOwnProperty(
			"quotedMessage",
		)
			? raw.message.extendedTextMessage.contextInfo
			: null,
	) {
		this.raw = raw;
	}
}
