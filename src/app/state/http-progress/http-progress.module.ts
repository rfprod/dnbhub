import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { httpProgressServiceProvider } from './http-progress.service';
import { DnbhubHttpProgressState } from './http-progress.store';

export const httpProgressModuleProviders: Provider[] = [httpProgressServiceProvider];

@NgModule({
  declarations: [],
  imports: [NgxsModule.forFeature([DnbhubHttpProgressState])],
  providers: [...httpProgressModuleProviders],
})
export class DnbhubHttpProgressStoreModule {
  public static forRoot(): ModuleWithProviders<DnbhubHttpProgressStoreModule> {
    return {
      ngModule: DnbhubHttpProgressStoreModule,
      providers: [...httpProgressModuleProviders],
    };
  }
}
