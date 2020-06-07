import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BlogPost } from 'src/app/interfaces/blog/blog-post.interface';
import { DnbhubFirebaseService } from 'src/app/services';
import { DnbhubHttpHandlersService } from 'src/app/services/http-handlers/http-handlers.service';
import { EPAGE_SIZE } from 'src/app/utils';

import { blogActions } from './blog.store';

/**
 * Blog API service.
 */
@Injectable({
  providedIn: 'root',
})
export class DnbhubBlogApiService implements OnDestroy {
  constructor(
    private readonly handlers: DnbhubHttpHandlersService,
    private readonly firebase: DnbhubFirebaseService,
    private readonly store: Store,
  ) {}

  public getPosts() {
    const promise = (this.firebase.getDB('blog', true) as firebase.database.Reference)
      .limitToLast(EPAGE_SIZE.MEDIUM)
      .once('value')
      .then(snapshot => {
        const response: BlogPost[] = snapshot.val();
        const blogPosts: BlogPost[] = [];
        for (const key in response) {
          if (response[key]) {
            const item = response[key];
            blogPosts.unshift(item);
          }
        }
        return blogPosts;
      });
    return this.handlers.pipeHttpRequest<BlogPost[]>(from(promise)).pipe(
      tap(posts => {
        this.store.dispatch(new blogActions.setDnbhubBlogState({ posts }));
      }),
    );
  }

  public ngOnDestroy() {
    (this.firebase.getDB('blog', true) as firebase.database.Reference).off();
  }
}
