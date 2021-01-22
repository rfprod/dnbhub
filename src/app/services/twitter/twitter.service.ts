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
  private createTwitterRoot() {
    const doc = this.win.document;
    let ref = doc.getElementById(rootId); // try getting it first
    if (ref === null) {
      // create 'twttr-root' if it does not exist
      ref = doc.createElement('div');
      ref.id = rootId;
      const firstScriptTag = doc.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(ref, firstScriptTag);
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
    const doc = this.win.document;
    const ref = this.createTwitterRoot();
    // return if script is already included
    if (doc.getElementById(jssdkId) !== null) {
      return;
    }
    const js = doc.createElement('script');
    js.id = jssdkId;
    js.async = true;
    js.src = 'https://platform.twitter.com/widgets.js';

    ref?.parentNode?.insertBefore(js, ref);

    const t: { _e: number[]; ready(...args: unknown[]): number } = Boolean(this.win[windowSdkKey])
      ? this.win[windowSdkKey]
      : {};
    t._e = [];
    t.ready = (f: number) => t._e.push(f);

    this.win[windowSdkKey] = t;
  }

  /**
   * Removes twitter sdk.
   */
  public removeTwitterJsSDK(): void {
    const doc = this.win.document;
    const ref = doc.getElementById(rootId);
    const js = doc.getElementById(jssdkId);
    // removed both script and twttr-root
    if (js !== null && ref !== null) {
      ref.parentNode?.removeChild(js); // sdk script
      ref.parentNode?.removeChild(ref); // twttr-root
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
