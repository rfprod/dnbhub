import { Component, OnInit, OnDestroy, ElementRef, Inject, ViewChild, Renderer2, HostBinding } from '@angular/core';

import { EventEmitterService } from 'src/app/services/event-emitter/event-emitter.service';
import { SoundcloudService } from 'src/app/services/soundcloud/soundcloud.service';
import { Store } from '@ngxs/store';
import { DnbhubStoreStateModel } from 'src/app/state/dnbhub-store.state';
import { DnbhubStoreAction } from 'src/app/state/dnbhub-store.actions';

/**
 * Application free downloads component.
 */
@Component({
  selector: 'app-freedownloads',
  templateUrl: './app-freedownloads.component.html',
  host: {
    class: 'mat-body-1'
  }
})
export class AppFreedownloadsComponent implements OnInit, OnDestroy {

  /**
   * @param emitter Event emitter service
   * @param renderer Application renderer
   * @param soundcloudService Soundcloud API wrapper
   * @param ngXsStore NgXsStore
   * @param window Window reference
   */
  constructor(
    private emitter: EventEmitterService,
    private renderer: Renderer2,
    private soundcloudService: SoundcloudService,
    private ngXsStore: Store,
    @Inject('Window') private window: Window
  ) {}

  @HostBinding('fxFlex') public fxFlex: string = '1 1 auto';
  @HostBinding('fxLayout') public fxLayout: string = 'row';
  @HostBinding('fxLayoutAlign') public fxLayoutAlign: string = 'start stretch';

  /**
   * Content view child reference.
   */
  @ViewChild('content', { static: true }) private content: ElementRef;

  /**
   * Renderer2 listener instance.
   */
  private rendererListener: any;
  /**
   * Binds to mat-sidenav-content scroll event.
   */
  private bindToContentScrollEvent(): void {
    // let previousScrollTopValue: number = 0;
    this.rendererListener = this.renderer.listen(this.content.nativeElement.parentNode.parentNode, 'scroll', (event) => {
      // console.log('mat-sidenav-content scroll, event', event);
      const currentScrollTopValue: number = event.target.scrollTop;
      const previousScrollTopValue: number = (this.ngXsStore.snapshot().dnbhubStore as DnbhubStoreStateModel).previousScrollTopValue;

      // check if should request more data from soundcloud
      const listEndDivider: ElementRef = new ElementRef(this.window.document.getElementById('list-end'));
      // console.log('listEndDivider', listEndDivider);
      const offsetTop: string = 'offsetTop';
      const listEndOffsetTop: number = listEndDivider.nativeElement[offsetTop];
      // console.log('listEndOffsetTop', listEndOffsetTop, 'currentScrollTopValue', currentScrollTopValue);
      if (previousScrollTopValue < currentScrollTopValue && currentScrollTopValue >= listEndOffsetTop - (this.window.innerHeight + 1)) {
        console.log('end reached, load more');
        this.emitter.emitEvent({ soundcloud: 'renderMoreTracks' });
        const sidenavContent: ElementRef = new ElementRef(this.window.document.getElementsByClassName('mat-sidenav-content')[0]);
        const scrollTop: string = 'scrollTop';
        // set scrollTop for sidenav content so that it remains the same after tracks loading
        sidenavContent.nativeElement[scrollTop] = currentScrollTopValue;
      }

      // update scroll top value
      this.ngXsStore.dispatch(new DnbhubStoreAction({
        scrollTopValue: currentScrollTopValue
      }));
    });
  }

  public ngOnInit(): void {
    console.log('ngOnInit: AppFreedownloadsComponent initialized');
    this.bindToContentScrollEvent();
  }

  public ngOnDestroy(): void {
    console.log('ngOnDestroy: AppFreedownloadsComponent destroyed');
    this.soundcloudService.resetServiceData();
  }
}