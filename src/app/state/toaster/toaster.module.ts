import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { toasterServiceProvider } from './toaster.service';
import { DnbhubToasterState } from './toaster.store';

export const toasterModuleProviders: Provider[] = [toasterServiceProvider];

@NgModule({
  imports: [NgxsModule.forFeature([DnbhubToasterState])],
  providers: [...toasterModuleProviders],
})
export class DnbhubToasterStoreModule {
  public static forRoot(): ModuleWithProviders<DnbhubToasterStoreModule> {
    return {
      ngModule: DnbhubToasterStoreModule,
      providers: [...toasterModuleProviders],
    };
  }
}
