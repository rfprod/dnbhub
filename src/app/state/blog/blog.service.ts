import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';

import { IDnbhubBlogService } from './blog.interface';
import { blogActions, DnbhubBlogState } from './blog.store';
import { DnbhubBlogApiService } from './blog-api.service';

@Injectable({
  providedIn: 'root',
})
export class DnbhubBlogService implements IDnbhubBlogService {
  constructor(private readonly store: Store, private readonly api: DnbhubBlogApiService) {}

  public readonly posts$ = this.store.select(DnbhubBlogState.getPosts);

  public readonly selectedPost$ = this.store.select(DnbhubBlogState.getSelectedPost);

  public readonly getPosts$ = this.api.getPosts$;

  public selectBlogPost(code: string) {
    return this.store.dispatch(new blogActions.selectBlogPost({ code }));
  }

  public selectNextPost() {
    return this.store.dispatch(new blogActions.selectNextBlogPost(void 0));
  }

  public selectPreviousPost() {
    return this.store.dispatch(new blogActions.selectPreviousBlogPost(void 0));
  }
}
