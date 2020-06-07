import { getActionCreator } from 'src/app/utils/ngxs.util';

import { TDnbhubAboutPayload } from './about.interface';

const createAction = getActionCreator('About');

export const setDnbhubAboutState = createAction<TDnbhubAboutPayload>('About: set state');
