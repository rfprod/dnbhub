export interface ISoundcloudPlayer {
  bind(e, t, r): unknown; // TODO: return type
  currentTime(): number;
  getDuration(): number;
  getState(): 'paused' | 'playing' | string;
  getVolume(): number;
  hasErrored(): boolean;
  isActuallyPlaying(): boolean;
  isBuffering(): boolean;
  isDead(): boolean;
  isEnded(): boolean;
  isPlaying(): boolean;
  kill(): undefined;
  listenTo(t, r, n): unknown; // TODO: return type
  listenToOnce(t, r, n): unknown; // TODO: return type
  off(e, t, r): unknown; // TODO: return type
  on(e, t, r): unknown; // TODO: return type
  once(e, t, r): unknown; // TODO: return type
  pause(): Promise<undefined>;
  play(): Promise<undefined>;
  seek(progress: number): Promise<undefined>;
  setVolume(): number;
  stopListening(e, t, r): unknown;
  trigger(e): unknown; // TODO: return type
  unbind(e, t, r): unknown; // TODO: return type
}
