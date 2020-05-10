import { getActionCreator } from 'src/app/utils/ngxs.util';

import { SoundcloudPayload } from './soundcloud.interface';

const createAction = getActionCreator('Soundcloud');

export const setSoundcloudState = createAction<SoundcloudPayload>('Soundcloud: set state');
