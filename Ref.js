export class Ref {
	#value;
	#handlers = new Set();

	constructor(value) {
		this.#value = value;
	}

	set(value) {
		if (this.get() === this.#value) return;
		this.#value = value;
		for (const h of this.#handlers)
			h(value);
	}

	get() {
		return this.#value;
	}

	react(handler) {
		handler(this.get());
		this.#handlers.add(handler);
		return () => this.#handlers.delete(handler);
	}
}