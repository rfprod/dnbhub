import { Inject, Injectable } from '@angular/core';

const rootId = 'twttr-root';
const jssdkId = 'twitter-wjs';
const windowSdkKey = 'twttr';

/**
 * Twitter service.
 * Controls Twitter JavaScript SDK.
 */
@Injectable()
export class TwitterService {
  constructor(@Inject('Window') private window: Window) {
    console.warn('TwitterService constructor');
    this.initTwitterJsSDK();
  }

  /**
   * Creates Twitter root div.
   * @return Twitter root div reference <div id="fb-root"></div>
   */
  private createTwitterRoot(): HTMLElement {
    const doc: Document = this.window.document;
    let ref: HTMLElement = doc.getElementById(rootId); // try getting it first
    if (!ref) {
      // create 'fb-root' if it does not exist
      ref = doc.createElement('div');
      ref.id = rootId;
      const firstScriptTag: HTMLScriptElement = doc.getElementsByTagName('script')[0];
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
    const doc: Document = this.window.document;
    const ref = this.createTwitterRoot();
    console.warn('ref', ref);
    // return if script is already included
    if (doc.getElementById(jssdkId)) {
      return;
    }
    const js: HTMLScriptElement = doc.createElement('script');
    js.id = jssdkId;
    js.async = true;
    js.src = 'https://platform.twitter.com/widgets.js';

    ref.parentNode.insertBefore(js, ref);

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const t: { _e: unknown[]; ready: Function } = Boolean(this.window[windowSdkKey])
      ? this.window[windowSdkKey]
      : {};
    t._e = [];
    t.ready = f => t._e.push(f);

    this.window[windowSdkKey] = t;
  }

  /**
   * TODO:client removeTwitterJsSDK method is not used by the moment, it should be either public, or controlled by event emitter.
   * Removes twitter sdk (not used for now, see ngOnDestroy hook).
   */
  public removeTwitterJsSDK(): void {
    const doc: Document = this.window.document;
    const ref: HTMLElement = doc.getElementById(rootId);
    const js: HTMLElement = doc.getElementById(jssdkId);
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
    if (Boolean(this.window[windowSdkKey])) {
      console.warn('this.window[twttr]', this.window[windowSdkKey]);
      // TODO:client this should be differrent from fb probably this.window[windowSdkKey].XFBML.parse();
    }
  }
}
