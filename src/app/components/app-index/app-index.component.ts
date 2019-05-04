import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, Inject, ViewChild, Renderer2 } from '@angular/core';

import { MediaChange, MediaObserver } from '@angular/flex-layout';

import { EventEmitterService } from 'src/app/services/event-emitter/event-emitter.service';

import { FacebookService } from 'src/app/services/facebook/facebook.service';
import { TwitterService } from 'src/app/services/twitter/twitter.service';
import { SoundcloudService } from 'src/app/services/soundcloud/soundcloud.service';

import { untilDestroyed } from 'ngx-take-until-destroy';

import { Store } from '@ngxs/store';
import { DnbhubStoreAction } from 'src/app/state/dnbhub-store.actions';
import { DnbhubStoreStateModel } from 'src/app/state/dnbhub-store.state';

@Component({
  selector: 'app-index',
  templateUrl: './app-index.component.html',
  host: {
    class: 'mat-body-1'
  }
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
    private media: MediaObserver,
    private emitter: EventEmitterService,
    private renderer: Renderer2,
    private facebookService: FacebookService,
    private twitterService: TwitterService,
    private soundcloudService: SoundcloudService,
    private ngXsStore: Store,
    @Inject('Window') private window: Window
  ) {
    // console.log('this.el.nativeElement:', this.el.nativeElement);
  }

  /**
   * Content view child reference.
   */
  @ViewChild('content') private content: ElementRef;

  /**
   * Renderer2 listener instance.
   */
  private rendererListener: any;

  /**
   * Binds to mat-sidenav-content scroll event.
   */
  private bindToContentScrollEvent(): void {
    this.rendererListener = this.renderer.listen(this.content.nativeElement.parentNode.parentNode, 'scroll', (event) => {
      // console.log('mat-sidenav-content scroll, event', event);
      const currentScrollTopValue: number = event.target.scrollTop;
      const previousScrollTopValue: number = (this.ngXsStore.snapshot().dnbhubStore as DnbhubStoreStateModel).previousScrollTopValue;

      // check if should request more data from soundcloud
      const listEndDivider: ElementRef = new ElementRef(this.window.document.getElementById('list-end'));
      // console.log('listEndDivider', listEndDivider);
      const offsetTop: string = 'offsetTop';
      const listEndOffsetTop: number = (listEndDivider.nativeElement) ? listEndDivider.nativeElement[offsetTop] : previousScrollTopValue;
      // console.log('listEndOffsetTop', listEndOffsetTop, 'currentScrollTopValue', currentScrollTopValue);
      if (previousScrollTopValue < currentScrollTopValue && currentScrollTopValue >= listEndOffsetTop - (this.window.innerHeight + 1)) {
        console.log('end reached, load more');
        this.emitter.emitEvent({ soundcloud: 'loadMoreTracks' });
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

  /**
   * Lifecycle hook called after component is initialized.
   */
  public ngOnInit(): void {
    console.log('ngOnInit: AppIndexComponent initialized');

    this.bindToContentScrollEvent();

    this.emitter.getEmitter().pipe(untilDestroyed(this)).subscribe((event: any) => {
      console.log('AppIndexComponent consuming event:', event);
    });

    let previousMqAlias: string = '';
    this.media.media$.pipe(untilDestroyed(this)).subscribe((event: MediaChange) => {
      console.log('flex-layout media change event', event);

      if (/(xs|sm)/.test(previousMqAlias) && /!(xs|sm)/.test(event.mqAlias)) {
        this.facebookService.renderFacebookWidget();
      }

      previousMqAlias = event.mqAlias;
    });
  }
  /**
   * Lifecycle hook called after component view is initialized.
   */
  public ngAfterViewInit(): void {
    console.log('ngAfterViewInit: AppIndexComponent view initialized');
    this.facebookService.renderFacebookWidget();
    this.twitterService.renderTwitterWidget();
  }
  /**
   * Lifecycle hook called after component is destroyed.
   */
  public ngOnDestroy(): void {
    console.log('ngOnDestroy: AppIndexComponent destroyed');
    this.soundcloudService.resetServiceData();
  }
}
