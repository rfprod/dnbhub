import { Observable } from 'rxjs';
import {
  SoundcloudMe,
  SoundcloudPlaylist,
  SoundcloudTracksLinkedPartitioning,
} from 'src/app/interfaces';
import { IActionPayload } from 'src/app/utils/ngxs.util';

export interface IDnbhubSoundcloudStateModel {
  me: SoundcloudMe;
  myPlaylists: SoundcloudPlaylist[];
  tracks: SoundcloudTracksLinkedPartitioning;
  playlists: SoundcloudPlaylist[];
}

export type TDnbhubSoundcloudPayload = IActionPayload<Partial<IDnbhubSoundcloudStateModel>>;

export interface IDnbhubSoundcloudService {
  me$: Observable<SoundcloudMe>;
  myPlaylists$: Observable<SoundcloudPlaylist[]>;
  tracks$: Observable<SoundcloudTracksLinkedPartitioning>;
  playlists$: Observable<SoundcloudPlaylist[]>;
}
