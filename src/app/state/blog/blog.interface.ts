import { Observable } from 'rxjs';
import { DnbhubBlogPost } from 'src/app/interfaces/blog/blog-post.interface';
import { IActionPayload } from 'src/app/utils/ngxs.util';

export interface IDnbhubBlogStateModel {
  posts: DnbhubBlogPost[];
  selectedPostId: number;
  selectedPost: DnbhubBlogPost;
}

export type TDnbhubBlogPayload = IActionPayload<Partial<IDnbhubBlogStateModel>>;

export interface IDnbhubBlogService {
  posts$: Observable<DnbhubBlogPost[]>;
  selectedPost$: Observable<DnbhubBlogPost>;
}

export type TDnbhubSelectBlogPostPayload = IActionPayload<{ code: string }>;
