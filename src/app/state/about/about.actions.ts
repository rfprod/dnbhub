import { getActionCreator } from 'src/app/utils/ngxs.util';

import { ABOUT_STATE_TOKEN, TDnbhubAboutPayload } from './about.interface';

const createAction = getActionCreator(ABOUT_STATE_TOKEN.toString());

export const setDnbhubAboutState = createAction<TDnbhubAboutPayload>('set state');
