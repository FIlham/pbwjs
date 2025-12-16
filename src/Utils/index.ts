export class Utils {
	public static parseMentions(text: string): string[] {
		return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
			(v) => v[1] + "@s.whatsapp.net",
		);
	}
}

export * from "./Event.js";
