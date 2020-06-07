import { OverlayModule } from '@angular/cdk/overlay';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgxsModule } from '@ngxs/store';

import { DnbhubBlogApiService } from './blog-api.service';
import { DnbhubBlogService } from './blog.service';
import { DnbhubBlogState } from './blog.store';

export const blogStoreModuleProviders: Provider[] = [DnbhubBlogService, DnbhubBlogApiService];

@NgModule({
  imports: [MatSidenavModule, OverlayModule, NgxsModule.forFeature([DnbhubBlogState])],
  providers: [...blogStoreModuleProviders],
})
export class DnbhubBlogStoreModule {
  public static forRoot(): ModuleWithProviders<DnbhubBlogStoreModule> {
    return {
      ngModule: DnbhubBlogStoreModule,
      providers: [...blogStoreModuleProviders],
    };
  }
}
