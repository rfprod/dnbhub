import { getActionCreator } from 'src/app/utils/ngxs.util';

import { AboutPayload } from './about.interface';

const createAction = getActionCreator('About');

export const setAboutState = createAction<AboutPayload>('About: set state');
