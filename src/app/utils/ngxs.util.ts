export interface IActionPayload<T = void> {
  payload: T;
}

export const getActionCreator = (actionScope: string) => <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends IActionPayload<any> = { payload: void }
>(
  actionName: string,
) =>
  class {
    public static readonly type: string = `[${actionScope}]: ${actionName}`;
    constructor(public payload: T['payload']) {}
  };

export type EmptyPayload = IActionPayload<null>;
