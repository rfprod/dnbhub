import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { BehaviorSubject, of } from 'rxjs';
import { concatMap, filter, first, tap } from 'rxjs/operators';

import { DnbhubBlogService } from '../../state/blog/blog.service';
import { DnbhubBlogState } from '../../state/blog/blog.store';

@Component({
  selector: 'dnbhub-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubBlogComponent implements AfterViewChecked {
  @ViewChild('virtualScrollContainer') public virtualScrollContainer?: ElementRef<HTMLDivElement>;

  private readonly playerHeightSubject = new BehaviorSubject<string>('150px');

  public readonly playerHeight$ = this.playerHeightSubject.asObservable();

  public readonly listStartReached$ = this.store.select(DnbhubBlogState.listStartReached);

  public readonly listEndReached$ = this.store.select(DnbhubBlogState.listEndReached);

  public readonly posts$ = this.blog.posts$.pipe(
    concatMap(storedPosts => {
      if (!Boolean(storedPosts.length)) {
        return this.blog.getPosts$.pipe(
          first(),
          tap(loadedPosts => {
            let code = this.route.snapshot.queryParams.code;
            if (Boolean(code)) {
              void this.router.navigate(['/blog'], { queryParams: { code } });
              void this.blog.selectBlogPost(code).subscribe();
            } else {
              code = loadedPosts[0].code;
              if (Boolean(code)) {
                void this.router.navigate(['/blog'], { queryParams: { code } });
                void this.blog.selectBlogPost(code).subscribe();
              }
            }
          }),
        );
      }
      return of(storedPosts);
    }),
  );

  public readonly selectedBlogPost$ = this.blog.selectedPost$.pipe(
    filter(post => Boolean(post)),
    tap(post => {
      const code = post?.code;
      void this.router.navigate(['/blog'], { queryParams: { code } });

      this.setPlayerHeight();
    }),
  );

  constructor(
    private readonly store: Store,
    private readonly blog: DnbhubBlogService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  /**
   * Selects next blog post.
   */
  public nextBlogPost(): void {
    void this.blog.selectNextPost().subscribe();
  }

  /**
   * Selects previous blog post.
   */
  public previousBlogPost(): void {
    void this.blog.selectPreviousPost().subscribe();
  }

  private setPlayerHeight() {
    const playerHeight =
      `${this.virtualScrollContainer?.nativeElement.clientHeight ?? 0}px` ??
      this.playerHeightSubject.value;
    this.playerHeightSubject.next(playerHeight);
  }

  public ngAfterViewChecked() {
    this.setPlayerHeight();
  }

  @HostListener('window:resize')
  public windowResizeHandler(): void {
    this.setPlayerHeight();
  }
}
