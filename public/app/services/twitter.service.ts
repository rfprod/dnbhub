import { Injectable, Inject } from '@angular/core';

/**
 * Controls Twitter JavaScript SDK.
 */
@Injectable()
export class TwitterService {

	constructor(
		@Inject('Window') private window: Window
	) {
		console.log('TwitterService constructor');
		this.initTwitterJsSDK();
	}

	/**
	 * Creates Twitter root div.
	 * @return Twitter root div reference <div id="fb-root"></div>
	 */
	private createTwitterRoot(): any {
		const doc: Document = this.window.document;
		let ref: any = doc.getElementById('twttr-root'); // try getting it first
		if (!ref) {
			// create 'fb-root' if it does not exist
			ref = doc.createElement('div');
			ref.id = 'twttr-root';
			const firstScriptTag: any = doc.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(ref, firstScriptTag);
		}
		return ref;
	}

	/**
	 * Initializes twitter javascript sdk.
	 *
	 * see:
	 * - https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/set-up-twitter-for-websites
	 * - https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/javascript-api
	 */
	private initTwitterJsSDK(): void {
		const id: string = 'twitter-wjs';
		const doc: Document = this.window.document;
		const ref: any = this.createTwitterRoot();
		console.log('ref', ref);
		// return if script is already included
		if (doc.getElementById(id)) {
			return;
		}
		const js: any = doc.createElement('script');
		js.id = id;
		js.async = true;
		js.src = 'https://platform.twitter.com/widgets.js';

		ref.parentNode.insertBefore(js, ref);

		const twitterWinKey = 'twttr';
		const t = this.window[twitterWinKey] || {};
		t._e = [];
		t.ready = (f) => t._e.push(f);

		this.window[twitterWinKey] = t;
	}

	/**
	 * TODO:client removeTwitterJsSDK method is not used by the moment, it should be either public, or controlled by event emitter.
	 * Removes twitter sdk (not used for now, see ngOnDestroy hook).
	 */
	private removeTwitterJsSDK(): void {
		const id: string = 'twitter-wjs';
		const doc: Document = this.window.document;
		const ref: any = doc.getElementById('twttr-root');
		const js: any = doc.getElementById('twitter-wjs');
		// removed both script and twttr-root
		if (js) {
			ref.parentNode.removeChild(js); // sdk script
			ref.parentNode.removeChild(ref); // twttr-root
		}
	}

	/**
	 * Renders twitter widget, without this widget won't initialize after user navigates to another view and then back to a view the widget is placed
	 */
	public renderTwitterWidget(): void {
		const twitterWinKey = 'twttr';
		if (this.window[twitterWinKey]) {
			console.log('this.window[twttr]', this.window[twitterWinKey]);
			// TODO:client this should be differrent from fb probably this.window[twitterWinKey].XFBML.parse();
		}
	}
}
