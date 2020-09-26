import { NgModule, Provider } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { DnbhubAdminApiService } from './admin-api.service';
import { DnbhubAdminService } from './admin.service';
import { DnbhubAdminState } from './admin.store';

export const adminStoreModuleProviders: Provider[] = [DnbhubAdminService, DnbhubAdminApiService];

@NgModule({
  imports: [NgxsModule.forFeature([DnbhubAdminState])],
})
export class DnbhubAdminStoreModule {}
