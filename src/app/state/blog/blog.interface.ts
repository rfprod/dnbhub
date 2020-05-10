import { Observable } from 'rxjs';
import { IBlogPost } from 'src/app/interfaces/blog/blog-post.interface';
import { IActionPayload } from 'src/app/utils/ngxs.util';

export interface IBlogStateModel {
  posts: IBlogPost[];
  selectedPostId: number;
  selectedPost: IBlogPost;
}

export type BlogPayload = IActionPayload<Partial<IBlogStateModel>>;

export interface IBlogService {
  posts$: Observable<IBlogPost[]>;
  selectedPost$: Observable<IBlogPost>;
}

export type SelectBlogPostPayload = IActionPayload<{ code: string }>;
