import type { Message } from "../Structures/Message.js";

export type ClientEventsMap = {
	"connection:connected": () => void;
	"connection:connecting": () => void;
	"connection:closed": () => void;
	"connection:qr": (qr: string) => void;
	"message:received": (message: Message) => void;
};
