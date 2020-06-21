import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { DnbhubBlogApiService } from './blog-api.service';
import { IDnbhubBlogService } from './blog.interface';
import { blogActions, DnbhubBlogState } from './blog.store';

@Injectable({
  providedIn: 'root',
})
export class DnbhubBlogService implements IDnbhubBlogService {
  constructor(private readonly store: Store, private readonly api: DnbhubBlogApiService) {}

  public readonly posts$ = this.store.select(DnbhubBlogState.getPosts);

  public readonly selectedPost$ = this.store.select(DnbhubBlogState.getSelectedPost);

  public getPosts() {
    return this.api.getPosts().pipe(
      tap(posts => {
        void this.store.dispatch(new blogActions.setDnbhubBlogState({ posts }));
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
