import { getActionCreator } from 'src/app/utils/ngxs.util';

import { AdminPayload } from './admin.interface';

const createAction = getActionCreator('Admin');

export const setAdminState = createAction<AdminPayload>('Admin: set state');
