import { getActionCreator } from '../../utils/ngxs.util';
import { SOUNDCLOUD_STATE_TOKEN, TDnbhubSoundcloudPayload } from './soundcloud.interface';

const createAction = getActionCreator(SOUNDCLOUD_STATE_TOKEN.toString());

const setDnbhubSoundcloudState = createAction<TDnbhubSoundcloudPayload>('set state');

export const soundcloudActions = {
  setDnbhubSoundcloudState,
};
