import { Directive, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

/**
 * Emits event when iframe content is loaded.
 */
@Directive({
  selector: '[appIframeContentLoaded]',
})
export class IframeContentLoadedDirective implements OnInit {
  private nativeElement: HTMLElement;

  constructor(private readonly el: ElementRef) {}

  @Input('contentloaded') public contentLoaded = true;

  @Output('loadedcallback') public loadedCallback: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();

  /**
   * Emits loaded event.
   */
  private emitLoadedEvent(): void {
    this.loadedCallback.emit(true);
  }

  public ngOnInit(): void {
    this.nativeElement = this.el.nativeElement;
    this.nativeElement.onload = () => {
      this.emitLoadedEvent();
    };
  }
}
