import { getActionCreator } from '../../utils/ngxs.util';
import { TDnbhubToasterPayload, TOASTER_STATE_TOKEN } from './toaster.interface';

const createAction = getActionCreator(TOASTER_STATE_TOKEN.toString());

const showToaster = createAction<TDnbhubToasterPayload>('show');
const hideToaster = createAction('hide');

export const toasterActions = {
  hideToaster,
  showToaster,
};
