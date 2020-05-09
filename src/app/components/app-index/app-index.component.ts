import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { EventEmitterService } from 'src/app/services/event-emitter/event-emitter.service';
import { FacebookService } from 'src/app/services/facebook/facebook.service';
import { SoundcloudService } from 'src/app/services/soundcloud/soundcloud.service';
import { TwitterService } from 'src/app/services/twitter/twitter.service';
import { DnbhubStoreAction } from 'src/app/state/dnbhub-store.actions';
import { DnbhubStoreStateModel } from 'src/app/state/dnbhub-store.state';

@UntilDestroy()
@Component({
  selector: 'app-index',
  templateUrl: './app-index.component.html',
  host: {
    class: 'mat-body-1',
  },
})
export class AppIndexComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * @param media Media observer
   * @param emitter Event emitter service - components interaction
   * @param renderer Application renderer
   * @param facebookService Facebook API wrapper
   * @param twitterService Twitter API wrapper
   * @param soundcloudService Soundcloud API wrapper
   * @param ngXsStore NgXsStore
   * @param window Window reference
   */
  constructor(
    private readonly media: MediaObserver,
    private readonly emitter: EventEmitterService,
    private readonly renderer: Renderer2,
    private readonly facebookService: FacebookService,
    private readonly twitterService: TwitterService,
    private readonly soundcloudService: SoundcloudService,
    private readonly ngXsStore: Store,
    @Inject('Window') private readonly window: Window,
  ) {}

  /**
   * Content view child reference.
   */
  @ViewChild('content', { static: true }) private readonly content: ElementRef;

  /**
   * Binds to mat-sidenav-content scroll event.
   */
  private bindToContentScrollEvent(): void {
    this.renderer.listen(this.content.nativeElement.parentNode.parentNode, 'scroll', event => {
      // console.log('mat-sidenav-content scroll, event', event);
      const currentScrollTopValue: number = event.target.scrollTop;
      const previousScrollTopValue: number = (this.ngXsStore.snapshot()
        .dnbhubStore as DnbhubStoreStateModel).previousScrollTopValue;

      // check if should request more data from soundcloud
      const listEndDivider: ElementRef = new ElementRef(
        this.window.document.getElementById('list-end'),
      );
      // console.log('listEndDivider', listEndDivider);
      const offsetTop = 'offsetTop';
      const listEndOffsetTop: number = listEndDivider.nativeElement
        ? listEndDivider.nativeElement[offsetTop]
        : previousScrollTopValue;
      // console.log('listEndOffsetTop', listEndOffsetTop, 'currentScrollTopValue', currentScrollTopValue);
      if (
        previousScrollTopValue < currentScrollTopValue &&
        currentScrollTopValue >= listEndOffsetTop - (this.window.innerHeight + 1)
      ) {
        console.log('end reached, load more');
        this.emitter.emitEvent({ soundcloud: 'loadMoreTracks' });
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

    let previousMqAlias = '';
    this.media
      .asObservable()
      .pipe(untilDestroyed(this))
      .subscribe((event: MediaChange[]) => {
        console.log('flex-layout media change event', event);

        if (/(xs|sm)/.test(previousMqAlias) && /!(xs|sm)/.test(event[0].mqAlias)) {
          this.facebookService.renderFacebookWidget();
        }

        previousMqAlias = event[0].mqAlias;
      });
  }

  public ngAfterViewInit(): void {
    this.facebookService.renderFacebookWidget();
    this.twitterService.renderTwitterWidget();
  }

  public ngOnDestroy(): void {
    this.soundcloudService.resetServiceData();
  }
}
