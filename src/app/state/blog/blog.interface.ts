import { Observable } from 'rxjs';
import { BlogPost } from 'src/app/interfaces/blog/blog-post.interface';
import { IActionPayload } from 'src/app/utils/ngxs.util';

export interface IBlogStateModel {
  posts: BlogPost[];
  selectedPostId: number;
  selectedPost: BlogPost;
}

export type BlogPayload = IActionPayload<Partial<IBlogStateModel>>;

export interface IBlogService {
  posts$: Observable<BlogPost[]>;
  selectedPost$: Observable<BlogPost>;
}

export type SelectBlogPostPayload = IActionPayload<{ code: string }>;
