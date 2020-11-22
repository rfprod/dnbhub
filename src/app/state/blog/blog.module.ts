import { NgModule, Provider } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { DnbhubBlogService } from './blog.service';
import { DnbhubBlogState } from './blog.store';
import { DnbhubBlogApiService } from './blog-api.service';

export const blogStoreModuleProviders: Provider[] = [DnbhubBlogService, DnbhubBlogApiService];

@NgModule({
  imports: [NgxsModule.forFeature([DnbhubBlogState])],
})
export class DnbhubBlogStoreModule {}
