export interface ISoundcloudPlayer {
  bind(e, t, r): unknown;
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
  kill(): unknown;
  listenTo(t, r, n): unknown;
  listenToOnce(t, r, n): unknown;
  off(e, t, r): unknown;
  on(e, t, r): unknown;
  once(e, t, r): unknown;
  pause(): unknown;
  play(): unknown;
  seek(progress: number): Promise<unknown>;
  setVolume(): number;
  stopListening(e, t, r): unknown;
  trigger(e): unknown;
  unbind(e, t, r): unknown;
}
