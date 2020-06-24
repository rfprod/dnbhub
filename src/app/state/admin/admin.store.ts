import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';

import { setDnbhubAdminState } from './admin.actions';
import { IDnbhubAdminStateModel, TDnbhubAdminPayload } from './admin.interface';

export const blogActions = {
  setDnbhubAdminState,
};

export const ADMIN_STATE_TOKEN = new StateToken<IDnbhubAdminStateModel>('admin');

@State<IDnbhubAdminStateModel>({
  name: ADMIN_STATE_TOKEN,
  defaults: {
    emails: [],
    brands: [],
    users: [],
    blogEntriesIDs: [],
    selectedBrand: null,
    selectedSubmission: null,
  },
})
@Injectable({
  providedIn: 'root',
})
export class DnbhubAdminState {
  @Selector()
  public static getState(state: IDnbhubAdminStateModel) {
    return state;
  }

  @Selector()
  public static getEmails(state: IDnbhubAdminStateModel) {
    return state.emails;
  }

  @Selector()
  public static getBrands(state: IDnbhubAdminStateModel) {
    return state.brands;
  }

  @Selector()
  public static getUsers(state: IDnbhubAdminStateModel) {
    return state.users;
  }

  @Selector()
  public static getBlogEntriesIDs(state: IDnbhubAdminStateModel) {
    return state.blogEntriesIDs;
  }

  @Selector()
  public static getSelectedBrand(state: IDnbhubAdminStateModel) {
    return state.selectedBrand;
  }

  @Selector()
  public static getSelectedSubmission(state: IDnbhubAdminStateModel) {
    return state.selectedSubmission;
  }

  @Action(setDnbhubAdminState)
  public setDnbhubAdminState(
    ctx: StateContext<IDnbhubAdminStateModel>,
    { payload }: TDnbhubAdminPayload,
  ) {
    return ctx.patchState(payload);
  }
}