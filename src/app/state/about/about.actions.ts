import { getActionCreator } from '../../utils/ngxs.util';
import { ABOUT_STATE_TOKEN, TDnbhubAboutPayload } from './about.interface';

const createAction = getActionCreator(ABOUT_STATE_TOKEN.toString());

const setDnbhubAboutState = createAction<TDnbhubAboutPayload>('set state');

export const aboutActions = {
  setDnbhubAboutState,
};
