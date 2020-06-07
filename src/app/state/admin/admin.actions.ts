import { getActionCreator } from 'src/app/utils/ngxs.util';

import { TDnbhubAdminPayload } from './admin.interface';

const createAction = getActionCreator('Admin');

export const setDnbhubAdminState = createAction<TDnbhubAdminPayload>('Admin: set state');
