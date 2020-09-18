import { RouterStateSnapshot } from '@angular/router';

export interface IActionPayload<T = void> {
  payload: T;
}

export const getActionCreator = (actionScope: string) => <
  T extends IActionPayload<Record<string, unknown> | undefined> = {
    payload: Record<string, unknown>;
  }
>(
  actionName: string,
) =>
  class {
    public static readonly type: string = `[${actionScope}]: ${actionName}`;

    constructor(public payload: T['payload']) {}
  };

export type TEmptyPayload = IActionPayload<undefined>;

export interface INxgsRouterState {
  navigationId: number;
  state: RouterStateSnapshot;
  trigger: string;
}
