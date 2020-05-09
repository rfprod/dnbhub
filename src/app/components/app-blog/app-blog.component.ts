import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatabaseReference } from '@angular/fire/database/interfaces';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { IBlogPost } from 'src/app/interfaces/blog/blog-post.interface';
import { CustomDeferredService } from 'src/app/services/custom-deferred/custom-deferred.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { SoundcloudService } from 'src/app/services/soundcloud/soundcloud.service';
import { DnbhubStoreAction } from 'src/app/state/dnbhub-store.actions';
import { DnbhubStoreStateModel } from 'src/app/state/dnbhub-store.state';

@Component({
  selector: 'app-blog',
  templateUrl: './app-blog.component.html',
  host: {
    class: 'mat-body-1',
  },
})
export class AppBlogComponent implements OnInit, OnDestroy {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly soundcloudService: SoundcloudService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly store: Store,
  ) {}

  /**
   * Release code.
   */
  public inputReleaseCode: string;

  /**
   * Blog posts array.
   */
  public blogPosts: IBlogPost[] = [];

  /**
   * Selected blog post id.
   */
  public selectedBlogPostId = 0;

  /**
   * Selected blog post object.
   */
  public selectedBlogPost: IBlogPost = {
    code: null,
    links: null,
    playlistId: null,
    soundcloudUserId: null,
    description: null,
  };

  /**
   * Resolves if blog post selector should be disabled.
   * @param direction navigation direction
   */
  public disableBlogPostSelector(direction: 'previous' | 'next'): boolean {
    if (direction === 'previous') {
      return this.selectedBlogPostId === this.blogPosts.length - 1 ? true : false;
    } else if (direction === 'next') {
      return this.selectedBlogPostId === 0 ? true : false;
    }
  }

  /**
   * Returns playlist widget link.
   * @param playlistID playlist id
   */
  public widgetLink(playlistID: number): SafeResourceUrl {
    return Boolean(playlistID) ? this.soundcloudService.widgetLink.playlist(playlistID) : '#';
  }

  /**
   * Sets correct search param.
   * @param [blogPostCode] selected blog post code
   */
  private setSearchParam(blogPostCode?: string): string {
    const code: string = Boolean(blogPostCode)
      ? blogPostCode
      : Boolean(Object.keys(this.selectedBlogPost).length)
      ? this.selectedBlogPost.code
      : this.route.snapshot.queryParams.code;
    if (code !== this.route.snapshot.queryParams.code) {
      void this.router.navigate(['/blog'], { queryParams: { code } });
    }
    return code;
  }

  /**
   * Updated blog posts data model.
   */
  private updateBlogPosts(): Promise<any> {
    const def = new CustomDeferredService<any>();
    // limit to last 50 records and show in reverse order by playlist number
    (this.firebaseService.getDB('blog', true) as DatabaseReference)
      .limitToLast(50)
      .once('value')
      .then(snapshot => {
        console.log('blog', snapshot.val());
        const response = snapshot.val();
        const blogPosts: IBlogPost[] = [];
        for (const key in response) {
          if (response[key]) {
            const item = response[key];
            blogPosts.unshift(item);
          }
        }
        console.log('blogPosts', blogPosts);
        this.store.dispatch(new DnbhubStoreAction({ blogPosts }));
        def.resolve();
      })
      .catch((error: any) => {
        console.log('error', error);
        /*
         *	TODO show error
         */
        def.reject();
      });
    return def.promise;
  }

  /**
   * Subscribes to state change and takes action.
   */
  private stateSubscription(): void {
    this.store.subscribe((state: { dnbhubStore: DnbhubStoreStateModel }) => {
      this.blogPosts = state.dnbhubStore.blogPosts;
    });
  }

  /**
   * Selects blog post.
   */
  public selectBlogPost(): void {
    if (this.blogPosts.length > 0) {
      this.selectedBlogPost = this.blogPosts[this.selectedBlogPostId];
      this.setSearchParam();
    }
  }

  /**
   * Selects next blog post.
   */
  public nextBlogPost(): void {
    if (this.selectedBlogPostId > 0) {
      this.selectedBlogPostId -= 1;
      this.selectBlogPost();
    }
  }

  /**
   * Selects previous blog post.
   */
  public previousBlogPost(): void {
    if (this.selectedBlogPostId < this.blogPosts.length - 1) {
      this.selectedBlogPostId += 1;
      this.selectBlogPost();
    }
  }

  public ngOnInit(): void {
    this.inputReleaseCode = this.setSearchParam();
    this.stateSubscription();
    this.updateBlogPosts()
      .then(() => this.selectBlogPost())
      .catch(error => {
        console.error('updateBlogPosts', error);
      });
  }

  public ngOnDestroy(): void {
    const blogPosts: IBlogPost[] = [];
    this.store.dispatch(new DnbhubStoreAction({ blogPosts }));
  }
}
