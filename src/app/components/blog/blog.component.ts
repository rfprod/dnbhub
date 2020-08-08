import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { concatMap, filter, tap } from 'rxjs/operators';
import { DnbhubBlogService } from 'src/app/state/blog/blog.service';
import { DnbhubBlogState } from 'src/app/state/blog/blog.store';

@Component({
  selector: 'dnbhub-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubBlogComponent {
  @Select(DnbhubBlogState.listStartReached)
  public readonly listStartReached$: Observable<boolean>;

  @Select(DnbhubBlogState.listEndReached)
  public readonly listEndReached$: Observable<boolean>;

  public readonly posts$ = this.blog.posts$.pipe(
    concatMap(storedPosts => {
      if (!Boolean(storedPosts.length)) {
        return this.blog.getPosts().pipe(
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
      const code = post.code;
      void this.router.navigate(['/blog'], { queryParams: { code } });
    }),
  );

  constructor(
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
}
