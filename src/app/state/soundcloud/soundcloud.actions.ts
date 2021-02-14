import { getActionCreator } from 'src/app/utils/ngxs.util';

import { SOUNDCLOUD_STATE_TOKEN, TDnbhubSoundcloudPayload } from './soundcloud.interface';

const createAction = getActionCreator(SOUNDCLOUD_STATE_TOKEN.toString());

export const setDnbhubSoundcloudState = createAction<TDnbhubSoundcloudPayload>('set state');
