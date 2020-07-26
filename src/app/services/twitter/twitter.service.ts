import { Inject, Injectable } from '@angular/core';
import { WINDOW } from 'src/app/utils';

const rootId = 'twttr-root';
const jssdkId = 'twitter-wjs';
const windowSdkKey = 'twttr';

/**
 * Twitter service.
 * Controls Twitter JavaScript SDK.
 */
@Injectable({
  providedIn: 'root',
})
export class DnbhubTwitterService {
  constructor(@Inject(WINDOW) private readonly win: Window) {}

  /**
   * Creates Twitter root div.
   * @return Twitter root div reference <div id="twttr-root"></div>
   */
  private createTwitterRoot(): HTMLElement {
    const doc: Document = this.win.document;
    let ref: HTMLElement = doc.getElementById(rootId); // try getting it first
    if (!Boolean(ref)) {
      // create 'twttr-root' if it does not exist
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
  public initTwitterJsSDK(): void {
    const doc: Document = this.win.document;
    const ref = this.createTwitterRoot();
    // return if script is already included
    if (Boolean(doc.getElementById(jssdkId))) {
      return;
    }
    const js: HTMLScriptElement = doc.createElement('script');
    js.id = jssdkId;
    js.async = true;
    js.src = 'https://platform.twitter.com/widgets.js';

    ref.parentNode.insertBefore(js, ref);

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const t: { _e: number[]; ready(...args): number } = Boolean(this.win[windowSdkKey])
      ? this.win[windowSdkKey]
      : {};
    t._e = [];
    t.ready = f => t._e.push(f);

    this.win[windowSdkKey] = t;
  }

  /**
   * Removes twitter sdk.
   */
  public removeTwitterJsSDK(): void {
    const doc: Document = this.win.document;
    const ref: HTMLElement = doc.getElementById(rootId);
    const js: HTMLElement = doc.getElementById(jssdkId);
    // removed both script and twttr-root
    if (Boolean(js)) {
      ref.parentNode.removeChild(js); // sdk script
      ref.parentNode.removeChild(ref); // twttr-root
    }
  }

  /**
   * Renders twitter widget, without this widget won't initialize after user navigates to another
   * view and then back to a view the widget is placed.
   */
  public renderTwitterWidget(): void {
    if (Boolean(this.win[windowSdkKey])) {
      console.warn('this.win[twttr]', this.win[windowSdkKey]);
    }
  }
}
