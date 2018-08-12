import { Injectable } from '@angular/core';

@Injectable()
export class CustomDeferredService<T> {

	constructor() {
		this.promise = new Promise<T>((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}

	public promise: Promise<T>;

	public resolve: (value?: T | PromiseLike<T>) => void;

	public reject: (reason?: any) => void;

}
