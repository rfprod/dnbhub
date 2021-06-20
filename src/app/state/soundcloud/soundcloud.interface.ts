import { StateToken } from '@ngxs/store';
import { Observable } from 'rxjs';

import {
  ISoundcloudMe,
  ISoundcloudPlaylist,
  ISoundcloudTracksLinkedPartitioning,
  linkedPartitioningDefaultValues,
} from '../../interfaces';
import { meDefaultValues } from '../../interfaces/soundcloud/soundcloud-me.config';
import { IActionPayload } from '../../utils/ngxs.util';

export interface IDnbhubSoundcloudStateModel {
  me: ISoundcloudMe;
  myPlaylists: ISoundcloudPlaylist[];
  spotlight: ISoundcloudTracksLinkedPartitioning;
  tracks: ISoundcloudTracksLinkedPartitioning;
  playlists: ISoundcloudPlaylist[];
}

export type TDnbhubSoundcloudPayload = IActionPayload<Partial<IDnbhubSoundcloudStateModel>>;

export interface IDnbhubSoundcloudService {
  me$: Observable<ISoundcloudMe>;
  myPlaylists$: Observable<ISoundcloudPlaylist[]>;
  spotlight$: Observable<ISoundcloudTracksLinkedPartitioning>;
  tracks$: Observable<ISoundcloudTracksLinkedPartitioning>;
  playlists$: Observable<ISoundcloudPlaylist[]>;
}

export const soundcloudStoreInitialState: IDnbhubSoundcloudStateModel = {
  me: { ...meDefaultValues },
  myPlaylists: [],
  spotlight: { ...linkedPartitioningDefaultValues },
  tracks: { ...linkedPartitioningDefaultValues },
  playlists: [],
};

export const SOUNDCLOUD_STATE_TOKEN = new StateToken<IDnbhubSoundcloudStateModel>('soundcloud');
