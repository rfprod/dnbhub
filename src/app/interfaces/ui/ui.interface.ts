export interface IEventWithPath extends Event {
  path: HTMLElement[];
}

export interface IEventTargetWithPosition extends EventTarget {
  scrollTop: number;
}
