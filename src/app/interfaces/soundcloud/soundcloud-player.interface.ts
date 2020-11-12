export interface ISoundcloudPlayer {
  bind(e: unknown, t: unknown, r: unknown): unknown; // TODO: return type
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
  listenTo(t: unknown, r: unknown, n: unknown): unknown; // TODO: return type
  listenToOnce(t: unknown, r: unknown, n: unknown): unknown; // TODO: return type
  off(e: unknown, t: unknown, r: unknown): unknown; // TODO: return type
  on(e: unknown, t: unknown, r: unknown): unknown; // TODO: return type
  once(e: unknown, t: unknown, r: unknown): unknown; // TODO: return type
  pause(): Promise<undefined>;
  play(): Promise<undefined>;
  seek(progress: number): Promise<undefined>;
  setVolume(): number;
  stopListening(e: unknown, t: unknown, r: unknown): unknown;
  trigger(e: unknown): unknown; // TODO: return type
  unbind(e: unknown, t: unknown, r: unknown): unknown; // TODO: return type
}
