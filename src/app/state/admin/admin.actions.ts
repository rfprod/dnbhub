import { getActionCreator } from 'src/app/utils/ngxs.util';

import { ADMIN_STATE_TOKEN, TDnbhubAdminPayload } from './admin.interface';

const createAction = getActionCreator(ADMIN_STATE_TOKEN.toString());

const setDnbhubAdminState = createAction<TDnbhubAdminPayload>('set state');

export const adminActions = {
  setDnbhubAdminState,
};
