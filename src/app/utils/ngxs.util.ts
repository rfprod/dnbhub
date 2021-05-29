import { RouterStateSnapshot } from '@angular/router';
import { ActionDef } from '@ngxs/store/src/actions/symbols';

/**
 * Action payload interface.
 */
export interface IActionPayload<T = unknown> {
  payload: T;
}

export class DnbhubStoreAction<T extends IActionPayload = { payload: void }> {
  public static readonly type: string;

  constructor(public payload: T['payload']) {}
}

export const getActionCreator =
  (actionScope: string) =>
  <T extends IActionPayload = { payload: void }>(actionName: string) =>
    class extends DnbhubStoreAction<T> {
      public static readonly type: string = `[${actionScope}]: ${actionName}`;

      constructor(public payload: T['payload']) {
        super(payload);
      }
    } as ActionDef<T['payload'], DnbhubStoreAction<T>>;

export type TEmptyPayload = IActionPayload<undefined>;

export interface INxgsRouterState {
  navigationId: number;
  state: RouterStateSnapshot;
  trigger: string;
}
