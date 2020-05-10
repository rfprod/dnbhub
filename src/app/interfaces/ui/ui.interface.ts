export interface IEventWithPath extends Event {
  path: HTMLElement[];
}

export interface IEventWithPosition extends Event {
  offsetX: number;
  offsetY: number;
}

export interface IEventTargetWithPosition extends EventTarget {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  clientWidth: number;
}
