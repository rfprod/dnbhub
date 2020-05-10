import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { BlogService } from 'src/app/state/blog/blog.service';
import { BlogState } from 'src/app/state/blog/blog.store';

@Component({
  selector: 'app-blog',
  templateUrl: './app-blog.component.html',
  styleUrls: ['./app-blog.component.scss'],
  host: {
    class: 'mat-body-1',
  },
})
export class AppBlogComponent implements OnInit {
  @Select(BlogState.listStartReached)
  public readonly listStartReached$: Observable<boolean>;

  @Select(BlogState.listEndReached)
  public readonly listEndReached$: Observable<boolean>;

  public readonly posts$ = this.blog.posts$;

  public readonly selectedBlogPost$ = this.blog.selectedPost$.pipe(
    filter(post => !!post),
    tap(post => {
      const code = post.code;
      void this.router.navigate(['/blog'], { queryParams: { code } });
    }),
  );

  constructor(
    private readonly blog: BlogService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  /**
   * Selects next blog post.
   */
  public nextBlogPost(): void {
    this.blog.selectNextPost().subscribe();
  }

  /**
   * Selects previous blog post.
   */
  public previousBlogPost(): void {
    this.blog.selectPreviousPost().subscribe();
  }

  public ngOnInit(): void {
    this.blog
      .getPosts()
      .pipe(
        tap(posts => {
          let code = this.route.snapshot.queryParams.code;
          if (Boolean(code)) {
            void this.router.navigate(['/blog'], { queryParams: { code } });
            this.blog.selectBlogPost(code).subscribe();
          }
          code = posts[0].code;
          if (Boolean(code)) {
            void this.router.navigate(['/blog'], { queryParams: { code } });
            this.blog.selectBlogPost(code).subscribe();
          }
        }),
      )
      .subscribe();
  }
}
