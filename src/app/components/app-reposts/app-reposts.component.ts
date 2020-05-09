import {
  Component,
  ElementRef,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { EventEmitterService } from 'src/app/services/event-emitter/event-emitter.service';
import { SoundcloudService } from 'src/app/services/soundcloud/soundcloud.service';
import { DnbhubStoreAction } from 'src/app/state/dnbhub-store.actions';
import { DnbhubStoreStateModel } from 'src/app/state/dnbhub-store.state';

/**
 * Application free downloads component.
 */
@Component({
  selector: 'app-reposts',
  templateUrl: './app-reposts.component.html',
  host: {
    class: 'mat-body-1',
  },
})
export class AppRepostsComponent implements OnInit, OnDestroy {
  /**
   * @param emitter Event emitter service
   * @param renderer Application renderer
   * @param soundcloudService Soundcloud API wrapper
   * @param ngXsStore NgXsStore
   * @param window Window reference
   */
  constructor(
    private readonly emitter: EventEmitterService,
    private readonly renderer: Renderer2,
    private readonly soundcloudService: SoundcloudService,
    private readonly ngXsStore: Store,
    @Inject('Window') private readonly window: Window,
  ) {}

  @HostBinding('fxFlex') public fxFlex = '1 1 auto';
  @HostBinding('fxLayout') public fxLayout = 'row';
  @HostBinding('fxLayoutAlign') public fxLayoutAlign = 'start stretch';

  /**
   * Content view child reference.
   */
  @ViewChild('content', { static: true }) private readonly content: ElementRef;

  /**
   * Binds to mat-sidenav-content scroll event.
   */
  private bindToContentScrollEvent(): void {
    // let previousScrollTopValue: number = 0;
    this.renderer.listen(this.content.nativeElement.parentNode.parentNode, 'scroll', event => {
      // console.log('mat-sidenav-content scroll, event', event);
      const currentScrollTopValue: number = event.target.scrollTop;
      const previousScrollTopValue: number = (this.ngXsStore.snapshot()
        .dnbhubStore as DnbhubStoreStateModel).previousScrollTopValue;
      console.log('previousScrollTopValue', previousScrollTopValue);

      // check if should request more data from soundcloud
      const listEndDivider: ElementRef = new ElementRef(
        this.window.document.getElementById('list-end'),
      );
      // console.log('listEndDivider', listEndDivider);
      const offsetTop = 'offsetTop';
      const listEndOffsetTop: number = listEndDivider.nativeElement[offsetTop];
      // console.log('listEndOffsetTop', listEndOffsetTop, 'currentScrollTopValue', currentScrollTopValue);
      if (
        previousScrollTopValue < currentScrollTopValue &&
        currentScrollTopValue >= listEndOffsetTop - (this.window.innerHeight + 1)
      ) {
        console.log('end reached, load more');
        this.emitter.emitEvent({ soundcloud: 'renderMoreTracks' });
        const sidenavContent: ElementRef = new ElementRef(
          this.window.document.getElementsByClassName('mat-sidenav-content')[0],
        );
        const scrollTop = 'scrollTop';
        // set scrollTop for sidenav content so that it remains the same after tracks loading
        sidenavContent.nativeElement[scrollTop] = currentScrollTopValue;
      }

      // update scroll top value
      this.ngXsStore.dispatch(
        new DnbhubStoreAction({
          scrollTopValue: currentScrollTopValue,
        }),
      );
    });
  }

  public ngOnInit(): void {
    this.bindToContentScrollEvent();
  }

  public ngOnDestroy(): void {
    this.soundcloudService.resetServiceData();
  }
}
