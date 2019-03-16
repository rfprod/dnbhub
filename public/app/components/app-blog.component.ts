import { Component, OnInit, OnDestroy } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { EventEmitterService } from '../services/event-emitter.service';
import { FirebaseService } from '../services/firebase.service';
import { SoundcloudService } from '../services/soundcloud.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { CustomDeferredService } from '../services/custom-deferred.service';

@Component({
  selector: 'app-blog',
  templateUrl: '/app/views/app-blog.html',
  host: {
    class: 'mat-body-1'
  }
})
export class AppBlogComponent implements OnInit, OnDestroy {

  /**
   * @param emitter Event emitter service
   * @param firebaseService Firebase service
   * @param soundcloudService Soundcloud service
   * @param route Application router
   * @param route Application router activated route
   */
  constructor(
    private emitter: EventEmitterService,
    private firebaseService: FirebaseService,
    private soundcloudService: SoundcloudService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  /**
   * Release code.
   */
  private inputReleaseCode: any;

  /**
   * Blog posts array.
   */
  public blogPosts: any[] = [];

  /**
   * Selected blog post id.
   */
  public selectedBlogPostId: number = 0;

  /**
   * Selected blog post object.
   */
  public selectedBlogPost: any = {};

  /**
   * Resolves if blog post selector should be disabled.
   * @param direction navigation direction
   */
  public disableBlogPostSelector(direction: 'previous'|'next'): boolean {
    if (direction === 'previous') {
      return (this.selectedBlogPostId === this.blogPosts.length - 1) ? true : false;
    } else if (direction === 'next') {
      return (this.selectedBlogPostId === 0) ? true : false;
    }
  }

  /**
   * Returns playlist widget link.
   * @param playlistID playlist id
   */
  public widgetLink(playlistID: number): SafeResourceUrl {
    return (playlistID) ? this.soundcloudService.widgetLink.playlist(playlistID) : '#';
  }

  /**
   * Sets correct search param.
   * @param [blogPostCode] selected blog post code
   */
  private setSearchParam(blogPostCode?: string): string {
    const code: string = (blogPostCode) ? blogPostCode : (Object.keys(this.selectedBlogPost).length) ? this.selectedBlogPost.code : this.route.snapshot.queryParams.code;
    if (code !== this.route.snapshot.queryParams.code) {
      this.router.navigate(['/blog'], { queryParams: { code } });
    }
    return code;
  }

  /**
   * Updated blog posts data model.
   */
  private updateBlogPosts(): Promise<any> {
    const def = new CustomDeferredService<any>();
    // limit to last 50 records and show in reverse order by playlist number
    this.firebaseService.getDB('blog', true).limitToLast(50).once('value').then((snapshot) => {
      console.log('blog', snapshot.val());
      const response = snapshot.val();
      this.blogPosts = [];
      for (const key in response) {
        if (response[key]) {
          const item = response[key];
          this.blogPosts.unshift(item);
        }
      }
      console.log('blogPosts', this.blogPosts);
      def.resolve();
    }).catch((error: any) => {
      console.log('error', error);
      /*
      *	TODO show error
      */
      def.reject();
    });
    return def.promise;
  }

  /**
   * Selects blog post.
   */
  public selectBlogPost(): void {
    if (this.blogPosts.length > 0) {
      this.selectedBlogPost = this.blogPosts[this.selectedBlogPostId];
      console.log('this.selectedBlogPost', this.selectedBlogPost);
      this.setSearchParam();
    }
  }

  /**
   * Selects next blog post.
   */
  public nextBlogPost(): void {
    if (this.selectedBlogPostId > 0) {
      this.selectedBlogPostId--;
      this.selectBlogPost();
    } else {
      console.log('this is a last blog post');
    }
  }
  /**
   * Selects previous blog post.
   */
  public previousBlogPost(): void {
    if (this.selectedBlogPostId < this.blogPosts.length - 1) {
      this.selectedBlogPostId++;
      this.selectBlogPost();
    } else {
      console.log('this is a first blog post');
    }
  }

  public ngOnInit(): void {
    console.log('ngOnInit: AppBlogComponent initialized');
    this.inputReleaseCode = this.setSearchParam();
    this.updateBlogPosts()
      .then(() => this.selectBlogPost());
  }

  public ngOnDestroy(): void {
    console.log('ngOnDestroy: AppBlogComponent destroyed');
  }

}
