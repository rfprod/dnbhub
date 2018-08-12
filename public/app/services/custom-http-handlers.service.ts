import { Injectable } from '@angular/core';

import { Observable, concat, throwError } from 'rxjs';

@Injectable()
export class CustomHttpHandlersService {

	/**
	 * Extracts object from response.
	 */
	public extractObject(res: object): any {
		return res || {};
	}

	/**
	 * Extracts array from response.
	 */
	public extractArray(res: any[]): any {
		return res || [];
	}

	/**
	 * Handles error on response.
	 */
	public handleError(error: any): Observable<any> {
		console.log('error', error);
		const errMsg = (error.message) ? error.message :
			error.status ? `${error.status} - ${error.statusText}` : 'Server error';
		console.log('errMsg', errMsg);
		return concat(throwError(errMsg));
	}

	/**
	 * Timeout value for all requests in milliseconds.
	 */
	private timeout: number = 10000;
	/**
	 * Public method to get request timeout value.
	 */
	public timeoutValue(): number {
		return this.timeout;
	}
}
