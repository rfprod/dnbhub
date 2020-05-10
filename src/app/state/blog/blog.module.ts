import { OverlayModule } from '@angular/cdk/overlay';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgxsModule } from '@ngxs/store';

import { BlogApiService } from './blog-api.service';
import { BlogService } from './blog.service';
import { BlogState } from './blog.store';

export const blogStoreModuleProviders: Provider[] = [BlogService, BlogApiService];

@NgModule({
  imports: [MatSidenavModule, OverlayModule, NgxsModule.forFeature([BlogState])],
  providers: [...blogStoreModuleProviders],
})
export class BlogStoreModule {
  public static forRoot(): ModuleWithProviders<BlogStoreModule> {
    return {
      ngModule: BlogStoreModule,
      providers: [...blogStoreModuleProviders],
    };
  }
}
