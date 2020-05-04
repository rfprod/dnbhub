import { Directive, ElementRef, OnInit } from '@angular/core';

/**
 * Replaces image with app logo if its loading results in an error
 */
@Directive({
  selector: '[imageloaded]',
})
export class ImageLoadedDirective implements OnInit {
  private nativeElement: HTMLElement;

  constructor(private readonly el: ElementRef) {}

  /**
   * Image load event listener.
   * Removes event listener only.
   */
  private loadEventListener(event: any): void {
    // console.log('imageload, loadEventListener, event', event);
    const el: ElementRef = new ElementRef(event.path[0]);
    const nativeElement: HTMLElement = el.nativeElement;
    nativeElement.removeEventListener('load', this.loadEventListener);
  }

  /**
   * Image load error event listener.
   * Replaces errored image with default one, and removes event listener.
   */
  private errorEventListener(event: any): void {
    // console.log('imageload, errorEventListener, event', event);
    const el: ElementRef = new ElementRef(event.path[0]);
    const nativeElement: HTMLElement = el.nativeElement;
    nativeElement.setAttribute(
      'src',
      window.location.origin + '/assets/svg/no_image_placeholder.svg',
    );
    nativeElement.removeEventListener('load', this.loadEventListener);
  }

  /**
   * Lifecycle hook called after directive is initialized.
   */
  public ngOnInit(): void {
    this.nativeElement = this.el.nativeElement;
    this.nativeElement.addEventListener('load', this.loadEventListener);
    this.nativeElement.addEventListener('error', this.errorEventListener);
  }
}
