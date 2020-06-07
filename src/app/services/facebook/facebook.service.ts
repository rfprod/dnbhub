import { Inject, Injectable } from '@angular/core';
import { WINDOW } from 'src/app/utils';

const rootId = 'fb-root';
const jssdkId = 'facebook-jssdk';
const windowSdkKey = 'FB';

/**
 * Facebook service.
 * Controls Facebook JavaScript SDK.
 */
@Injectable({
  providedIn: 'root',
})
export class DnbhubFacebookService {
  constructor(@Inject(WINDOW) private readonly window: Window) {
    console.warn('DnbhubFacebookService constructor');
    this.initFacebookJsSDK();
  }

  /**
   * Creates Facebook root div.
   * @return Facebook root div reference <div id="fb-root"></div>
   */
  private createFbRoot(): HTMLElement {
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
   * Initializes facebook javascript sdk.
   *
   * see:
   * - https://developers.facebook.com/docs/javascript/howto/angularjs
   * - https://blog.brunoscopelliti.com/facebook-authentication-in-your-angularjs-web-app/
   */
  private initFacebookJsSDK(): void {
    const doc: Document = this.window.document;
    const ref = this.createFbRoot();
    console.warn('ref', ref);
    // return if script is already included
    if (doc.getElementById(jssdkId)) {
      return;
    }
    const js: HTMLScriptElement = doc.createElement('script');
    js.id = jssdkId;
    js.async = true;
    js.src =
      'https://connect.facebook.net/en_US/sdk.js#status=1&xfbml=1&version=v3.0&appId=477209839373369&channelUrl=channel.html';

    ref.parentNode.insertBefore(js, ref);
  }

  /**
   * TODO removeFbJsSDK method is not used by the moment, it should be either public, or controlled by event emitter.
   * Removes facebook sdk, and optionally fb-root (not used for now, see ngOnDestroy hook).
   */
  public removeFbJsSDK(): void {
    const doc: Document = this.window.document;
    const ref: HTMLElement = doc.getElementById(rootId);
    const js: HTMLElement = doc.getElementById(jssdkId);
    // removed both script and fb-root
    if (js) {
      ref.parentNode.removeChild(js); // sdk script
      ref.parentNode.removeChild(ref); // fb-root
    }
  }

  /**
   * Renders facebook widget, without this widget won't initialize after user navigates to another view and then back to a view the widget is placed
   */
  public renderFacebookWidget(): void {
    if (Boolean(this.window[windowSdkKey])) {
      (this.window[windowSdkKey] as { XFBML: { parse: () => unknown } }).XFBML.parse();
    }
  }
}
