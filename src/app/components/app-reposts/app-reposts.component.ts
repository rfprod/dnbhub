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
import { IEventTargetWithPosition } from 'src/app/interfaces';
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
  constructor(
    private readonly emitter: EventEmitterService,
    private readonly renderer: Renderer2,
    private readonly soundcloudService: SoundcloudService,
    private readonly store: Store,
    @Inject('Window') private readonly window: Window,
  ) {}

  @HostBinding('fxFlex') public fxFlex = '1 1 auto';
  @HostBinding('fxLayout') public fxLayout = 'row';
  @HostBinding('fxLayoutAlign') public fxLayoutAlign = 'start stretch';

  /**
   * Content view child reference.
   */
  @ViewChild('content', { static: true }) private readonly content: ElementRef;

  private rendererScrollTopCallback(event: Event): void {
    const target = event.target as IEventTargetWithPosition;
    const currentScrollTopValue: number = target.scrollTop;
    const previousScrollTopValue: number = (this.store.snapshot()
      .dnbhubStore as DnbhubStoreStateModel).previousScrollTopValue;

    // check if should request more data from soundcloud
    const listEndDivider: ElementRef = new ElementRef(
      this.window.document.getElementById('list-end'),
    );

    const offsetTop = 'offsetTop';
    const listEndOffsetTop: number = (listEndDivider.nativeElement as HTMLElement)[offsetTop];
    if (
      previousScrollTopValue < currentScrollTopValue &&
      currentScrollTopValue >= listEndOffsetTop - (this.window.innerHeight + 1)
    ) {
      this.emitter.emitEvent({ soundcloud: 'renderMoreTracks' });
      const sidenavContent: ElementRef = new ElementRef(
        this.window.document.getElementsByClassName('mat-sidenav-content')[0],
      );
      const scrollTop = 'scrollTop';
      // set scrollTop for sidenav content so that it remains the same after tracks loading
      (sidenavContent.nativeElement as HTMLElement)[scrollTop] = currentScrollTopValue;
    }

    // update scroll top value
    this.store.dispatch(
      new DnbhubStoreAction({
        scrollTopValue: currentScrollTopValue,
      }),
    );
  }

  /**
   * Binds to mat-sidenav-content scroll event.
   */
  private bindToContentScrollEvent(): void {
    const element: HTMLElement = this.content.nativeElement;
    const host = element.parentNode.parentNode;
    this.renderer.listen(host, 'scroll', this.rendererScrollTopCallback.bind(this));
  }

  public ngOnInit(): void {
    this.bindToContentScrollEvent();
  }

  public ngOnDestroy(): void {
    this.soundcloudService.resetServiceData();
  }
}
