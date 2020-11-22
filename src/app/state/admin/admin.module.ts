import { NgModule, Provider } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { DnbhubAdminService } from './admin.service';
import { DnbhubAdminState } from './admin.store';
import { DnbhubAdminApiService } from './admin-api.service';

export const adminStoreModuleProviders: Provider[] = [DnbhubAdminService, DnbhubAdminApiService];

@NgModule({
  imports: [NgxsModule.forFeature([DnbhubAdminState])],
})
export class DnbhubAdminStoreModule {}
