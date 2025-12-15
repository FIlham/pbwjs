import type { ClientEventsMap } from "../Types/Events.js";

export class EventEmitter<
	T extends Record<string, (...args: any[]) => void> = ClientEventsMap,
> {
	private listeners: Map<keyof T, Set<(...args: any[]) => void>>;

	constructor() {
		this.listeners = new Map();
	}

	/**
	 * Register an event listener for the specified event
	 * @param event - The event name
	 * @param callback - The callback function to execute when the event is emitted
	 */
	on<K extends keyof T>(event: K, callback: T[K]): this {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, new Set());
		}

		this.listeners.get(event)!.add(callback);
		return this;
	}

	/**
	 * Emit an event with optional arguments
	 * @param event - The event name
	 * @param args - Arguments to pass to the event listeners
	 */
	emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): boolean {
		const callbacks = this.listeners.get(event);

		if (!callbacks || callbacks.size === 0) {
			return false;
		}

		for (const callback of callbacks) {
			try {
				callback(...args);
			} catch (error) {
				console.error(
					`Error in event listener for "${String(event)}":`,
					error,
				);
			}
		}

		return true;
	}

	/**
	 * Remove a specific event listener
	 * @param event - The event name
	 * @param callback - The callback function to remove
	 */
	removeListener<K extends keyof T>(event: K, callback: T[K]): this {
		const callbacks = this.listeners.get(event);

		if (callbacks) {
			callbacks.delete(callback);

			if (callbacks.size === 0) {
				this.listeners.delete(event);
			}
		}

		return this;
	}

	/**
	 * Remove all listeners for a specific event, or all events if no event is specified
	 * @param event - Optional event name. If not provided, removes all listeners for all events
	 */
	removeAllListeners<K extends keyof T>(event?: K): this {
		if (event) {
			this.listeners.delete(event);
		} else {
			this.listeners.clear();
		}

		return this;
	}

	/**
	 * Get the number of listeners for a specific event
	 * @param event - The event name
	 */
	listenerCount<K extends keyof T>(event: K): number {
		const callbacks = this.listeners.get(event);
		return callbacks ? callbacks.size : 0;
	}

	/**
	 * Get all event names that have listeners
	 */
	eventNames(): (keyof T)[] {
		return Array.from(this.listeners.keys());
	}
}
