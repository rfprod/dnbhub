import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DnbhubBlogPost } from 'src/app/interfaces/blog/blog-post.interface';
import { queries } from 'src/app/state/firebase/firebase.queries';
import { DnbhubFirebaseService } from 'src/app/state/firebase/firebase.service';

import { blogActions } from './blog.actions';

/**
 * Blog API service.
 */
@Injectable({
  providedIn: 'root',
})
export class DnbhubBlogApiService {
  constructor(private readonly firebase: DnbhubFirebaseService, private readonly store: Store) {}

  private readonly limits$ = new BehaviorSubject<{ last: number }>({ last: 50 });

  public readonly getPosts$ = this.firebase
    .getListStream<DnbhubBlogPost>('blog', queries.limitToLast(this.limits$.value.last))
    .pipe(
      map(collection => {
        const posts: DnbhubBlogPost[] = [...collection.reverse()];
        void this.store.dispatch(new blogActions.setDnbhubBlogState({ posts }));
        return posts;
      }),
    );
}
