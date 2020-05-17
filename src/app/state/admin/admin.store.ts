import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';

import { setAdminState } from './admin.actions';
import { AdminPayload, IAdminStateModel } from './admin.interface';

export const blogActions = {
  setAdminState,
};

export const ADMIN_STATE_TOKEN = new StateToken<IAdminStateModel>('admin');

@State<IAdminStateModel>({
  name: ADMIN_STATE_TOKEN,
  defaults: {
    emailSubmissions: [],
    emailMessages: [],
    brands: [],
    users: [],
    blogEntriesIDs: [],
  },
})
@Injectable()
export class AdminState {
  @Selector()
  public static getState(state: IAdminStateModel) {
    return state;
  }

  @Selector()
  public static getEmailSubmissions(state: IAdminStateModel) {
    return state.emailSubmissions;
  }

  @Selector()
  public static getEmailMessages(state: IAdminStateModel) {
    return state.emailMessages;
  }

  @Selector()
  public static getBrands(state: IAdminStateModel) {
    return state.brands;
  }

  @Selector()
  public static getUsers(state: IAdminStateModel) {
    return state.users;
  }

  @Selector()
  public static getBlogEntriesIDs(state: IAdminStateModel) {
    return state.blogEntriesIDs;
  }

  @Action(setAdminState)
  public setAdminState(ctx: StateContext<IAdminStateModel>, { payload }: AdminPayload) {
    return ctx.patchState(payload);
  }
}
