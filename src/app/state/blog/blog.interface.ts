import { Observable } from 'rxjs';
import { DnbhubBlogPost } from 'src/app/interfaces/blog/blog-post.interface';
import { IActionPayload } from 'src/app/utils/ngxs.util';

export interface IDnbhubBlogStateModel {
  posts: DnbhubBlogPost[];
  selectedPostId: number;
  selectedPost: DnbhubBlogPost | null;
}

export type TDnbhubBlogPayload = IActionPayload<Partial<IDnbhubBlogStateModel>>;

export interface IDnbhubBlogService {
  posts$: Observable<DnbhubBlogPost[]>;
  selectedPost$: Observable<DnbhubBlogPost | null>;
}

export type TDnbhubSelectBlogPostPayload = IActionPayload<{ code: string }>;
