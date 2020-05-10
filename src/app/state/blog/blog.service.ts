import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { BlogApiService } from './blog-api.service';
import { IBlogService } from './blog.interface';
import { blogActions, BlogState } from './blog.store';

@Injectable({
  providedIn: 'root',
})
export class BlogService implements IBlogService {
  constructor(private readonly store: Store, private readonly api: BlogApiService) {}

  public readonly posts$ = this.store.select(BlogState.getPosts);

  public readonly selectedPost$ = this.store.select(BlogState.getSelectedPost);

  public getPosts() {
    return this.api.getPosts().pipe(
      tap(posts => {
        this.store.dispatch(new blogActions.setBlogState({ posts }));
      }),
    );
  }

  public selectBlogPost(code: string) {
    return this.store.dispatch(new blogActions.selectBlogPost({ code }));
  }

  public selectNextPost() {
    return this.store.dispatch(new blogActions.selectNextBlogPost(null));
  }

  public selectPreviousPost() {
    return this.store.dispatch(new blogActions.selectPreviousBlogPost(null));
  }
}
