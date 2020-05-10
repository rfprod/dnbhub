import { Observable } from 'rxjs';
import {
  SoundcloudMe,
  SoundcloudPlaylist,
  SoundcloudTracksLinkedPartitioning,
} from 'src/app/interfaces';
import { IActionPayload } from 'src/app/utils/ngxs.util';

export interface ISoundcloudStateModel {
  me: SoundcloudMe;
  myPlaylists: SoundcloudPlaylist[];
  tracks: SoundcloudTracksLinkedPartitioning;
  playlist: SoundcloudPlaylist;
}

export type SoundcloudPayload = IActionPayload<Partial<ISoundcloudStateModel>>;

export interface ISoundcloudService {
  me$: Observable<SoundcloudMe>;
  myPlaylists$: Observable<SoundcloudPlaylist[]>;
  tracks$: Observable<SoundcloudTracksLinkedPartitioning>;
  playlist$: Observable<SoundcloudPlaylist>;
}
