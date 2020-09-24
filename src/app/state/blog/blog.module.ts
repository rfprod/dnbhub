import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule, Provider } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgxsModule } from '@ngxs/store';

import { DnbhubBlogApiService } from './blog-api.service';
import { DnbhubBlogService } from './blog.service';
import { DnbhubBlogState } from './blog.store';

export const blogStoreModuleProviders: Provider[] = [DnbhubBlogService, DnbhubBlogApiService];

@NgModule({
  imports: [MatSidenavModule, OverlayModule, NgxsModule.forFeature([DnbhubBlogState])],
})
export class DnbhubBlogStoreModule {}
