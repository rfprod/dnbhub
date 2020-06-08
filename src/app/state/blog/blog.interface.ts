import { Observable } from 'rxjs';
import { BlogPost } from 'src/app/interfaces/blog/blog-post.interface';
import { IActionPayload } from 'src/app/utils/ngxs.util';

export interface IDnbhubBlogStateModel {
  posts: BlogPost[];
  selectedPostId: number;
  selectedPost: BlogPost;
}

export type TDnbhubBlogPayload = IActionPayload<Partial<IDnbhubBlogStateModel>>;

export interface IDnbhubBlogService {
  posts$: Observable<BlogPost[]>;
  selectedPost$: Observable<BlogPost>;
}

export type TDnbhubSelectBlogPostPayload = IActionPayload<{ code: string }>;
