import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, Inject, ViewChild, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';

import { EventEmitterService } from '../services/event-emitter.service';
import { CustomDeferredService } from '../services/custom-deferred.service';
import { FirebaseService } from '../services/firebase.service';
import { FacebookService } from '../services/facebook.service';
import { TwitterService } from '../services/twitter.service';
import { SoundcloudService } from '../services/soundcloud.service';

@Component({
  selector: 'app-index',
  templateUrl: '/app/views/app-index.html',
  host: {
    class: 'mat-body-1'
  }
})
export class AppIndexComponent implements OnInit, AfterViewInit, OnDestroy {

  /**
   * @param el Element reference
   * @param sanitizer DOM danitizer
   * @param media Observable media
   * @param emitter Event emitter service - components interaction
   * @param renderer Application renderer
   * @param firebaseService Service for making firebase requests
   * @param facebookService Facebook API wrapper
   * @param twitterService Twitter API wrapper
   * @param soundcloudService Soundcloud API wrapper
   * @param window Window reference
   */
  constructor(
    private el: ElementRef,
    private sanitizer: DomSanitizer,
    private media: ObservableMedia,
    private emitter: EventEmitterService,
    private renderer: Renderer2,
    private firebaseService: FirebaseService,
    private facebookService: FacebookService,
    private twitterService: TwitterService,
    private soundcloudService: SoundcloudService,
    @Inject('Window') private window: Window
  ) {
    // console.log('this.el.nativeElement:', this.el.nativeElement);
  }

  /**
   * Component subscriptions.
   */
  private subscriptions: any[] = [];

  /**
   * Content view child reference.
   */
  @ViewChild('content') private content: ElementRef;

  /**
   * Renderer2 listener instance.
   */
  private rendererListener: any;
  /**
   * Scroll top value.
   */
  private previousScrollTopValue: number = 0;
  /**
   * Binds to mat-sidenav-content scroll event.
   */
  private bindToContentScrollEvent(): void {
    // let previousScrollTopValue: number = 0;
    this.rendererListener = this.renderer.listen(this.content.nativeElement.parentNode.parentNode, 'scroll', (event) => {
      // console.log('mat-sidenav-content scroll, event', event);
      const currentScrollTopValue: number = event.target.scrollTop;

      // check if should request more data from soundcloud
      const listEndDivider: ElementRef = new ElementRef(this.window.document.getElementById('list-end'));
      // console.log('listEndDivider', listEndDivider);
      const offsetTop: string = 'offsetTop';
      const listEndOffsetTop: number = listEndDivider.nativeElement[offsetTop];
      // console.log('listEndOffsetTop', listEndOffsetTop, 'currentScrollTopValue', currentScrollTopValue);
      if (this.previousScrollTopValue < currentScrollTopValue && currentScrollTopValue >= listEndOffsetTop - (this.window.innerHeight + 1)) {
        console.log('end reached, load more');
        this.emitter.emitEvent({ soundcloud: 'loadMoreTracks' });
        const sidenavContent: ElementRef = new ElementRef(this.window.document.getElementsByClassName('mat-sidenav-content')[0]);
        const scrollTop: string = 'scrollTop';
        // set scrollTop for sidenav content so that it remains the same after tracks loading
        sidenavContent.nativeElement[scrollTop] = currentScrollTopValue;
      }

      this.previousScrollTopValue = currentScrollTopValue;
    });
  }

  /**
   * Lifecycle hook called after component is initialized.
   */
  public ngOnInit(): void {
    console.log('ngOnInit: AppIndexComponent initialized');

    this.bindToContentScrollEvent();

    let sub: any = this.emitter.getEmitter().subscribe((event: any) => {
      console.log('AppIndexComponent consuming event:', event);
    });
    this.subscriptions.push(sub);

    let previousMqAlias: string = '';
    sub = this.media.asObservable().subscribe((event: MediaChange) => {
      console.log('flex-layout media change event', event);

      if (/(xs|sm)/.test(previousMqAlias) && /!(xs|sm)/.test(event.mqAlias)) {
        // rerender facebook widget
        this.facebookService.renderFacebookWidget();
      }

      previousMqAlias = event.mqAlias;
    });
    this.subscriptions.push(sub);
  }
  /**
   * Lifecycle hook called after component view is initialized.
   */
  public ngAfterViewInit(): void {
    console.log('ngAfterViewInit: AppIndexComponent view initialized');
    // rerender facebook widget
    this.facebookService.renderFacebookWidget();
    this.twitterService.renderTwitterWidget();
  }
  /**
   * Lifecycle hook called after component is destroyed.
   */
  public ngOnDestroy(): void {
    console.log('ngOnDestroy: AppIndexComponent destroyed');
    if (this.subscriptions.length) {
      for (const sub of this.subscriptions) {
        sub.unsubscribe();
      }
    }
    // reset Soundcloud shared data
    this.soundcloudService.resetServiceData();
  }
}
