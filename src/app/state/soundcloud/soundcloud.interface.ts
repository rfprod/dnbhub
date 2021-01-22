import { Observable } from 'rxjs';
import {
  ISoundcloudMe,
  ISoundcloudPlaylist,
  ISoundcloudTracksLinkedPartitioning,
  linkedPartitioningDefaultValues,
} from 'src/app/interfaces';
import { IActionPayload } from 'src/app/utils/ngxs.util';

import { meDefaultValues } from '../../interfaces/soundcloud/soundcloud-me.config';

export interface IDnbhubSoundcloudStateModel {
  me: ISoundcloudMe;
  myPlaylists: ISoundcloudPlaylist[];
  tracks: ISoundcloudTracksLinkedPartitioning;
  playlists: ISoundcloudPlaylist[];
}

export type TDnbhubSoundcloudPayload = IActionPayload<Partial<IDnbhubSoundcloudStateModel>>;

export interface IDnbhubSoundcloudService {
  me$: Observable<ISoundcloudMe>;
  myPlaylists$: Observable<ISoundcloudPlaylist[]>;
  tracks$: Observable<ISoundcloudTracksLinkedPartitioning>;
  playlists$: Observable<ISoundcloudPlaylist[]>;
}

export const soundcloudStoreInitialState: IDnbhubSoundcloudStateModel = {
  me: { ...meDefaultValues },
  myPlaylists: [],
  tracks: { ...linkedPartitioningDefaultValues },
  playlists: [],
};
