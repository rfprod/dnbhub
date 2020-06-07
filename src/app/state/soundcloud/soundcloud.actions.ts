import { getActionCreator } from 'src/app/utils/ngxs.util';

import { TDnbhubSoundcloudPayload } from './soundcloud.interface';

const createAction = getActionCreator('Soundcloud');

export const setDnbhubSoundcloudState = createAction<TDnbhubSoundcloudPayload>(
  'Soundcloud: set state',
);
