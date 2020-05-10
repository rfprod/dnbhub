import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { httpProgressServiceProvider } from './http-progress.service';
import { HttpProgressState } from './http-progress.store';

export const httpProgressModuleProviders: Provider[] = [httpProgressServiceProvider];

@NgModule({
  declarations: [],
  imports: [NgxsModule.forFeature([HttpProgressState])],
  providers: [...httpProgressModuleProviders],
})
export class HttpProgressStoreModule {
  public static forRoot(): ModuleWithProviders<HttpProgressStoreModule> {
    return {
      ngModule: HttpProgressStoreModule,
      providers: [...httpProgressModuleProviders],
    };
  }
}
